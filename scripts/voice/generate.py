#!/usr/bin/env python3
"""Pre-record every Polish line the site speaks with ElevenLabs (voice: Joanna).

Reads the `polish:` strings from src/data/lessons.ts and src/data/grammar.ts plus
the home-page `pl:` phrases, cleans them exactly like speakableText() in
src/lib/speech.ts, and writes one MP3 per unique line to
public/audio/pl/<fnv1a-32 hex>.mp3. Lone letters and sound pairs (ą, sz, "rz ż")
are skipped: TTS cannot say a sound on its own, so the browser voice keeps those.
src/data/voice-manifest.json lists the recorded hashes; speakPolish() plays a
file when its hash is listed and falls back to browser speech otherwise.

Only missing files are generated, so re-running after new lessons costs only the
new lines. `--verify` runs each new clip back through Polish speech-to-text and
re-records a clip once if words are missing.

Usage:
  python3 scripts/voice/generate.py --key-file <file containing sk_...> [--verify] [--dry-run]
  (or set ELEVENLABS_API_KEY)
"""
import argparse, concurrent.futures as cf, json, os, re, sys, time, unicodedata, urllib.request, uuid

VOICE_ID = 'H3IcxEgdFxIEJAqMc0Bc'  # Joanna: pure, clear, native Polish (chosen 2026-11-07)
MODEL = 'eleven_multilingual_v2'
FORMAT = 'mp3_44100_64'
SETTINGS = {'stability': 0.55, 'similarity_boost': 0.8, 'style': 0.0, 'use_speaker_boost': True}
OUT_DIR = 'public/audio/pl'
MANIFEST = 'src/data/voice-manifest.json'
# Sounds, not words: TTS can't pronounce these alone (all 3 test voices failed "ą").
SOUNDS = set('aąbcćdeęfghijklłmnńoóprsśtuwyzźż') | {'ch', 'cz', 'dz', 'dź', 'dż', 'rz', 'sz'}


def strings(path, key):
    t = open(path, encoding='utf-8').read()
    for m in re.finditer(key + r"""\s*:\s*(?:'((?:[^'\\]|\\.)*)'|"((?:[^"\\]|\\.)*)")""", t):
        s = m.group(1) if m.group(1) is not None else m.group(2)
        yield s.replace("\\'", "'").replace('\\"', '"').replace('\\n', ' ')


def clean(s):
    """Mirror of speakableText() in src/lib/speech.ts. Keep the two in sync."""
    s = re.sub(r'\(.*?\)', '', s)
    s = re.sub(r'\[.*?\]', '', s)
    s = re.sub(r'^\s*\d{1,2}:\d{2}\s*[—–-]?\s*', '', s)
    s = re.sub(r'\s*/\s*', ', ', s)
    s = re.sub(r'[→…]', '', s)
    s = re.sub(r'^[\s,]+|[\s,]+$', '', s)
    return unicodedata.normalize('NFC', re.sub(r'\s+', ' ', s).strip())


def fnv1a(s):
    """32-bit FNV-1a over code points; must match voiceKey() in src/lib/speech.ts."""
    h = 0x811C9DC5
    for ch in s:
        h ^= ord(ch)
        h = (h * 0x01000193) & 0xFFFFFFFF
    return f'{h:08x}'


def is_sound(s):
    return all(tok.lower() in SOUNDS for tok in re.split(r'[\s,]+', s) if tok)


def lines():
    raw = [*strings('src/data/lessons.ts', 'polish'), *strings('src/data/grammar.ts', 'polish'), *strings('src/app/page.tsx', 'pl')]
    out = {}
    for s in raw:
        c = clean(s)
        if c and not is_sound(c):
            out.setdefault(fnv1a(c), c)
    return out


class Api:
    def __init__(self, key):
        self.key = key

    def _req(self, path, data, headers, timeout=120):
        req = urllib.request.Request('https://api.elevenlabs.io' + path, data=data, method='POST', headers={'xi-api-key': self.key, **headers})
        for attempt in range(4):
            try:
                return urllib.request.urlopen(req, timeout=timeout).read()
            except urllib.error.HTTPError as e:
                if e.code in (429, 500, 502, 503) and attempt < 3:
                    time.sleep(2 * (attempt + 1))
                    continue
                raise RuntimeError(f'{e.code} {e.read().decode()[:200]}')

    def tts(self, text):
        body = json.dumps({'text': text, 'model_id': MODEL, 'voice_settings': SETTINGS}).encode()
        return self._req(f'/v1/text-to-speech/{VOICE_ID}?output_format={FORMAT}', body, {'Content-Type': 'application/json', 'Accept': 'audio/mpeg'})

    def stt(self, audio):
        b = uuid.uuid4().hex
        body = b''.join(f'--{b}\r\nContent-Disposition: form-data; name="{k}"\r\n\r\n{v}\r\n'.encode()
                        for k, v in (('model_id', 'scribe_v1'), ('language_code', 'pol'), ('tag_audio_events', 'false')))
        body += f'--{b}\r\nContent-Disposition: form-data; name="file"; filename="a.mp3"\r\nContent-Type: audio/mpeg\r\n\r\n'.encode() + audio + f'\r\n--{b}--\r\n'.encode()
        return json.loads(self._req('/v1/speech-to-text', body, {'Content-Type': f'multipart/form-data; boundary={b}'})).get('text', '')


def words(s):
    return re.sub(r'[^\wąćęłńóśźż ]', ' ', s.lower()).split()


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('--key-file')
    ap.add_argument('--verify', action='store_true')
    ap.add_argument('--dry-run', action='store_true')
    ap.add_argument('--workers', type=int, default=3)
    a = ap.parse_args()

    todo = lines()
    os.makedirs(OUT_DIR, exist_ok=True)
    missing = {h: t for h, t in todo.items() if not os.path.exists(f'{OUT_DIR}/{h}.mp3')}
    print(f'{len(todo)} lines to voice, {len(missing)} missing, {sum(len(t) for t in missing.values())} characters to generate')
    if a.dry_run:
        return

    key = os.environ.get('ELEVENLABS_API_KEY')
    if not key and a.key_file:
        key = re.search(r'sk_[A-Za-z0-9]+', open(os.path.expanduser(a.key_file)).read()).group(0)
    if not key:
        sys.exit('No API key: set ELEVENLABS_API_KEY or pass --key-file')
    api = Api(key)
    report = []

    def one(item):
        h, text = item
        audio = api.tts(text)
        note = ''
        if a.verify:
            heard = api.stt(audio)
            miss = [w for w in words(text) if w not in words(heard)]
            if miss:  # one re-take, keep whichever is better
                audio2 = api.tts(text)
                heard2 = api.stt(audio2)
                miss2 = [w for w in words(text) if w not in words(heard2)]
                if len(miss2) < len(miss):
                    audio, heard, miss = audio2, heard2, miss2
                note = f'missing {miss} | heard: {heard}' if miss else 'fixed on re-take'
        with open(f'{OUT_DIR}/{h}.mp3', 'wb') as f:
            f.write(audio)
        return h, text, note

    done = 0
    with cf.ThreadPoolExecutor(a.workers) as ex:
        for h, text, note in ex.map(one, missing.items()):
            done += 1
            if note:
                report.append({'file': h, 'text': text, 'note': note})
            if done % 50 == 0:
                print(f'  {done}/{len(missing)}', flush=True)

    # Drop recordings whose line no longer exists (text edited or cleaning changed).
    for f in os.listdir(OUT_DIR):
        if f.endswith('.mp3') and f[:-4] not in todo:
            os.remove(f'{OUT_DIR}/{f}')
            print('  removed stale', f)
    present = sorted(h for h in todo if os.path.exists(f'{OUT_DIR}/{h}.mp3'))
    json.dump({'voice': 'Joanna', 'voiceId': VOICE_ID, 'model': MODEL, 'format': FORMAT, 'files': present},
              open(MANIFEST, 'w'), indent=0)
    print(f'done: {len(present)} recorded lines in {MANIFEST}')
    for r in report:
        print('  CHECK', r)


if __name__ == '__main__':
    main()
