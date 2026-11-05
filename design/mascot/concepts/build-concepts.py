"""Hand-drawn Phase 1 SVG studies and an offline comparison page. No packages."""
from pathlib import Path

HERE = Path(__file__).resolve().parent
INK = "#1E2132"
WHITE = "#FFFFFF"
RED = "#D91F3B"
SUN = "#FFC21A"
PINK = "#D6338A"


def part(prefix, name, drawing, pivot=None):
    pivot = f' data-pivot="{pivot}"' if pivot else ""
    return f'<g id="{prefix}-{name}" data-part="{name}"{pivot}>\n{drawing}\n</g>'


def eyes(prefix, state, left, right, radius=7):
    drawing = []
    for side, (x, y) in zip(["l", "r"], [left, right]):
        if state == "happy":
            shape = f'<path d="M{x-9} {y+3}Q{x} {y-12} {x+9} {y+3}" fill="none"/>'
        else:
            shape = f'<ellipse cx="{x}" cy="{y}" rx="{radius}" ry="{radius+3}" fill="{INK}" stroke="none"/>'
            if state == "oops":
                # A raised, inquisitive brow; no tears, crossed eyes or frown.
                lift = 5 if side == "l" else 0
                shape += f'<path d="M{x-10} {y-20-lift}Q{x} {y-26-lift} {x+10} {y-20-lift}" fill="none"/>'
        drawing.append(part(prefix, f"eye-{side}", shape))
    return "\n".join(drawing)


def stork(state="hello"):
    p = f"a-{state}"
    legs = part(p, "leg-l", f'<path d="M171 365H187V428H201Q209 428 209 444H159Q159 428 171 428Z" fill="{RED}"/>', "179 365")
    legs += part(p, "leg-r", f'<path d="M227 366H243L238 400 262 423H277Q285 423 285 434H251L219 405Z" fill="{RED}"/>', "235 366")
    body = part(p, "body", f'<path d="M180 257C125 261 117 307 128 347 137 383 173 396 212 392 263 388 284 351 267 309L244 271Z" fill="{WHITE}"/>')
    folded = part(p, "wing-r", f'<path d="M246 290C284 293 300 329 282 357L265 373C233 357 223 325 246 290Z" fill="{WHITE}"/><path d="M272 330 289 335 284 354 266 371 249 357Z" fill="{INK}"/>', "245 292")
    waving = part(p, "wing-l", f'<path d="M151 291C119 293 94 277 79 252L58 214Q52 201 63 196 72 193 79 207L88 222 77 189Q74 177 84 175 94 174 98 188L109 216 108 193Q109 183 118 184 129 185 128 202L133 233 163 268Q172 282 151 291Z" fill="{WHITE}"/><path d="M58 214Q52 201 63 196 72 193 79 207L88 222 77 189Q74 177 84 175 94 174 98 188L109 216 108 193Q109 183 118 184 129 185 128 202L130 217 96 243 80 251Z" fill="{INK}"/>', "151 277")
    face = f'<path d="M179 111 175 93 197 107C230 96 261 117 265 151L264 194C262 220 238 232 229 252L230 281C210 298 181 286 177 268L185 224C156 214 145 191 148 165 150 140 159 122 179 111Z" fill="{WHITE}"/>'
    face += eyes(p, state, (194, 166), (235, 166))
    if state == "talking":
        face += part(p, "beak-top", f'<path d="M260 178 356 195 261 206Z" fill="{RED}"/>', "260 196")
        face += part(p, "beak-bottom", f'<path d="M260 205 329 237 260 226Z" fill="{RED}"/>', "260 206")
        face += f'<path d="M266 208 297 215 268 218Z" fill="{INK}" stroke="none"/>'
    else:
        face += part(p, "beak-top", f'<path d="M260 179 357 205 260 210Z" fill="{RED}"/>', "260 203")
        face += part(p, "beak-bottom", f'<path d="M260 210 347 207 263 226Z" fill="{RED}"/>', "260 210")
    head = part(p, "head", face, "210 274")
    scarf = part(p, "accessory", f'<path d="M178 252Q204 264 230 251L238 272Q207 287 174 274Z" fill="{RED}"/><path d="M211 276 238 267 257 299 238 296 231 309Z" fill="{RED}"/><path d="M190 259 199 261 195 278 185 276Z" fill="{SUN}" stroke="none"/><path d="M218 260 226 257 232 274 223 278Z" fill="{SUN}" stroke="none"/>')
    return legs + body + folded + waving + head + scarf


def bison(state="hello"):
    p = f"b-{state}"
    legs = part(p, "leg-l", f'<path d="M139 353 183 356 177 430H128Z" fill="{SUN}"/><path d="M130 407H180L177 444H126Z" fill="{INK}"/>', "160 359")
    legs += part(p, "leg-r", f'<path d="M225 353 270 348 281 430H232Z" fill="{SUN}"/><path d="M229 407H278L284 444H233Z" fill="{INK}"/>', "248 357")
    body = part(p, "body", f'<path d="M135 245C111 271 112 320 124 353 133 381 164 393 207 391 249 393 280 375 285 346 292 308 282 268 261 248Z" fill="{SUN}"/>')
    arm_r = part(p, "arm-r", f'<path d="M269 260Q310 273 313 321L307 355Q285 368 273 348L277 317 256 297Z" fill="{SUN}"/><path d="M279 327 311 331 307 354Q285 368 273 348Z" fill="{INK}"/>', "269 276")
    arm_l = part(p, "arm-l", f'<path d="M143 277Q119 299 99 277L70 237 50 201Q44 185 57 179L78 169Q91 165 99 178L104 204 126 233 149 248Z" fill="{SUN}"/><path d="M50 201Q44 185 57 179L78 169Q91 165 99 178L104 204 76 221Z" fill="{INK}"/>', "139 263")
    head = f'<path d="M139 135Q108 149 88 128L77 114Q111 101 142 114Z" fill="{SUN}"/><path d="M260 135Q291 149 313 126L324 112Q287 100 258 115Z" fill="{SUN}"/>'
    head += f'<path d="M139 126C105 127 94 101 105 70Q84 81 85 104C85 131 106 151 139 152Z" fill="{WHITE}"/><path d="M260 126C294 126 306 101 295 70Q316 81 315 104C315 131 294 151 260 152Z" fill="{WHITE}"/>'
    head += f'<path d="M142 114 155 94 177 103 199 88 221 103 245 96 258 115C284 128 294 151 291 185L301 204 285 218 288 240 269 244 255 264 236 260 215 282H183L163 261 144 265 130 244 112 241 115 221 101 205 111 188C104 151 116 128 142 114Z" fill="{SUN}"/>'
    head += eyes(p, state, (160, 170), (240, 170), 8)
    head += f'<path d="M158 204Q199 190 241 204C266 213 270 244 250 258 231 269 170 269 149 257 128 245 132 215 158 204Z" fill="{INK}"/>'
    head += f'<ellipse cx="170" cy="224" rx="6" ry="4" fill="{WHITE}" stroke="none"/><ellipse cx="230" cy="224" rx="6" ry="4" fill="{WHITE}" stroke="none"/>'
    if state == "talking":
        mouth = f'<ellipse cx="200" cy="246" rx="12" ry="10" fill="{WHITE}" stroke="none"/>'
    else:
        mouth = f'<path d="M183 240Q200 253 217 240L215 246Q200 260 185 246Z" fill="{WHITE}" stroke="none"/>'
    head += part(p, "mouth", mouth)
    head = part(p, "head", head, "201 270")
    # A single papercut diamond clasp, rather than a flag or folk costume.
    accessory = part(p, "accessory", f'<path d="M161 285Q200 303 242 283L246 303Q202 326 157 305Z" fill="{RED}"/><path d="M203 292 218 308 203 324 188 308Z" fill="{WHITE}"/>')
    return legs + body + arm_r + arm_l + head + accessory


def rosette(state="hello"):
    p = f"c-{state}"
    legs = part(p, "leg-l", f'<path d="M166 353H186L182 416H160Z" fill="{WHITE}"/><path d="M160 410 183 416 179 444H133Q129 420 145 415Z" fill="{RED}"/>', "176 356")
    legs += part(p, "leg-r", f'<path d="M224 352H245L252 415 230 420Z" fill="{WHITE}"/><path d="M228 417 250 409 269 416Q285 420 281 444H234Z" fill="{RED}"/>', "234 356")
    body = part(p, "body", f'<path d="M163 293H239L258 342 239 378H164L144 342Z" fill="{INK}"/><path d="M159 332H244L249 346H153Z" fill="{SUN}"/><path d="M193 323 209 337 193 352 178 337Z" fill="{WHITE}"/>')
    arm_r = part(p, "arm-r", f'<path d="M240 305 269 307 291 347 279 375 262 366 271 345 248 330Z" fill="{WHITE}"/>', "248 314")
    arm_r += f'<path d="M269 356 285 361" fill="none"/>'
    arm_l = part(p, "arm-l", f'<path d="M160 312 140 331 98 296 76 239 96 226 115 279Z" fill="{WHITE}"/><path d="M76 239 59 219 54 191Q54 181 63 181L73 204 77 176Q80 165 88 172L92 200 101 187Q109 181 114 189L101 220 96 238Z" fill="{WHITE}"/><path d="M99 282 110 274" fill="none"/>', "153 317")
    # Eight broad cut-paper lobes. No stem, leaves, flowerpot or tulip crown.
    face = f'<path d="M168 107Q166 75 192 65L210 89Q237 61 261 84L259 114Q298 110 310 141L291 164Q323 183 310 215L280 222Q291 257 261 273L235 259Q219 295 188 282L179 253Q145 273 126 246L135 219Q98 212 99 183L124 166Q99 138 121 116L151 123Z" fill="{RED}"/>'
    face += f'<path d="M192 80 204 104 187 120 174 103Z M273 119 286 142 268 158 255 140Z M286 217 265 239 245 226 256 207Z M182 263 164 242 180 223 197 236Z M114 184 138 174 153 193 136 209Z" fill="{PINK}" stroke="none"/>'
    face += f'<path d="M171 125Q200 110 230 127L263 160Q279 190 262 220L230 248Q200 263 170 246L142 218Q126 187 143 158Z" fill="{SUN}"/>'
    face += eyes(p, state, (175, 179), (223, 179), 7)
    if state == "talking":
        mouth = f'<ellipse cx="200" cy="211" rx="12" ry="16" fill="{INK}"/>'
    else:
        mouth = '<path d="M183 208Q200 227 217 208" fill="none"/>'
    face += part(p, "mouth", mouth)
    head = part(p, "head", face, "201 296")
    return legs + body + arm_r + arm_l + head


CONCEPTS = [
    dict(key="a", name="Bociek", pronunciation="BOH-chek", subtitle="The white stork", draw=stork,
         idea="A long-necked stork with ink wing tips, crimson beak and stepping legs. A tiny crimson-and-sun scarf gives the white silhouette a warm folk detail.",
         fit="The strongest fit: recognisably a stork at small sizes, naturally in PolishPal’s palette, with an expressive beak for pronunciation.",
         motion="The two beak halves hinge separately; wings rotate at the shoulders, the head tilts at the neck, and the long legs can fold into a hop.",
         crop="105 75 280 225"),
    dict(key="b", name="Żubek", pronunciation="ZHOO-bek", subtitle="The bison calf", draw=bison,
         idea="A sun-yellow bison calf with a papercut mane, white hooked horns and broad ink hooves. Żubek is a proposed nickname inspired by żubr.",
         fit="A grounded, patient study buddy. The square muzzle and horn span make a different silhouette from the bird; small facial details soften at 48px.",
         motion="Hoof-ended arms wave; the mane and head tilt as a unit. A separate mouth opens within the muzzle, and broad feet make squash-and-hop motion easy.",
         crop="55 55 290 245"),
    dict(key="c", name="Iskra", pronunciation="EES-krah", subtitle="The walking wycinanka", draw=rosette,
         idea="An eight-lobed paper rosette with a sunny face and folded-paper limbs. A walking folk cutout, with no stem, leaves or tulip silhouette.",
         fit="The most graphic option, connected to the site’s decorative papercuts. Its scalloped outline survives small sizes; its Polish association is more abstract.",
         motion="Paper arms wave at their folds, the rosette head tilts over its small body, and the central eyes and mouth animate independently.",
         crop="80 50 250 255"),
]


def document(drawing, label, viewbox="0 0 400 480"):
    return f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="{viewbox}" role="img" aria-label="{label}" fill="none" stroke="{INK}" stroke-width="8" stroke-linecap="round" stroke-linejoin="round">
{drawing}
</svg>
'''


def generate():
    for c in CONCEPTS:
        (HERE / f'concept-{c["key"]}.svg').write_text(document(c["draw"](), f'{c["name"]} waving hello'))
        expressions = []
        for i, state in enumerate(["happy", "talking", "oops"]):
            expressions.append(f'<svg x="{i*300}" y="0" width="300" height="300" viewBox="{c["crop"]}" overflow="hidden">\n{c["draw"](state)}\n</svg>')
        (HERE / f'concept-{c["key"]}-expressions.svg').write_text(document("\n".join(expressions), f'{c["name"]}: happy, talking, and encouraging oops', "0 0 900 300"))
    html = [HTML_START]
    for c in CONCEPTS:
        k = c["key"]
        html.append(f'''<article id="concept-{k}" class="concept">
<div class="intro"><h2>{k.upper()}. {c["name"]}</h2><p class="pronunciation">{c["pronunciation"]} · {c["subtitle"]}</p>
<p>{c["idea"]}</p><p>{c["fit"]}</p><p>{c["motion"]}</p>{'<p class="recommendation">Recommended direction</p>' if k == 'a' else ''}</div>
<div class="pairing"><div class="wordmark"><img src="../../../public/logo.svg" alt="" width="36" height="36"><span>Polish<span class="crimson-text">Pal</span></span><img class="buddy" src="concept-{k}.svg" alt="{c['name']} waving" width="60" height="72"></div><p class="note">With the existing logo and live Fredoka wordmark</p></div>
<section class="expressions"><h3>Three ways to respond</h3><img src="concept-{k}-expressions.svg" alt="{c['name']}: happy, talking, oops" width="480" height="160"><div class="expression-labels"><span>Happy</span><span>Talking</span><span>Oops · try again</span></div></section>''')
        for theme, label in [("paper", "White"), ("canvas", "Canvas #F6F7FA"), ("crimson", "Crimson #D91F3B")]:
            html.append(f'<section class="sample {theme}"><h3>{label}</h3><figure class="large"><img src="concept-{k}.svg" alt="{c["name"]} at 320 pixels wide" width="320" height="384"><figcaption>320px</figcaption></figure><div class="sizes">')
            for size in [48, 96, 160]:
                html.append(f'<figure><img src="concept-{k}.svg" alt="{c["name"]} at {size} pixels wide" width="{size}" height="{size*1.2:g}"><figcaption>{size}px</figcaption></figure>')
            html.append('</div></section>')
        html.append(f'''<section class="tip"><h3>In a blog tip card</h3><div class="tip-card"><img src="concept-{k}.svg" alt="" width="96" height="115.2"><div><h4>A little practice helps.</h4><p>Try saying it slowly. You can take your time.</p><span class="tip-chip">A note from {c['name']}</span></div></div></section></article>''')
    html.append('''</div><footer><p><strong>My pick: Bociek.</strong> The stork brings the clearest silhouette, the closest natural palette match, and a useful hinged beak for Polish pronunciation. Żubek is the warmest grounded alternative; Iskra is the boldest papercut direction.</p><p>All artwork is SVG with the same 8-unit ink outline. Sizes refer to SVG width; each portrait uses a 400 × 480 canvas and a shared y=448 ground reference. Transparent art is shown unchanged on each background. These are concept studies, not the final 12-pose rig.</p><p>Names are proposed brand names. Pronunciations are friendly English approximations, not phonetic transcriptions.</p></footer></main></body></html>''')
    (HERE / "index.html").write_text("\n".join(html))


HTML_START = '''<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>PolishPal mascot concepts</title>
<style>
@font-face{font-family:Fredoka;src:url('../../logo-concepts/fonts/fredoka-latin.woff2') format('woff2');font-weight:300 700;font-display:swap}
@font-face{font-family:Nunito;src:url('../../logo-concepts/fonts/nunito-latin.woff2') format('woff2');font-weight:200 1000;font-display:swap}
*{box-sizing:border-box}body{margin:0;background:#F6F7FA;color:#1E2132;font-family:Nunito,sans-serif}main{max-width:1800px;margin:auto;padding:44px 32px 60px}h1,h2,h3,h4{font-family:Fredoka,sans-serif;font-weight:600}h1{font-size:46px;line-height:1.1;margin:0 0 16px}header{max-width:940px;margin-bottom:32px}header p,footer p{font-size:17px;line-height:1.65;margin:10px 0}.grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:20px}.concept{background:#FFFFFF;border:2px solid #1E2132;border-bottom-width:4px;border-radius:24px;overflow:hidden}.intro{padding:24px;min-height:425px}h2{font-size:32px;margin:0 0 4px}.pronunciation{font-size:15px;font-weight:800}.intro p{font-size:14px;line-height:1.55;margin:12px 0}.recommendation{display:inline-block;border:2px solid #1E2132;border-bottom-width:4px;border-radius:12px;background:#FFC21A;padding:7px 12px;font-weight:800}.pairing{border-block:2px solid #F6F7FA;padding:12px 24px}.wordmark{display:flex;align-items:center;gap:10px;font:600 22px Fredoka,sans-serif}.wordmark .buddy{margin-left:auto}.crimson-text{color:#D91F3B}.note{font-size:12px;margin:0 0 10px}.expressions{padding:24px 16px;border-bottom:2px solid #F6F7FA}.expressions>img{display:block;width:100%;height:auto}.expression-labels{display:grid;grid-template-columns:repeat(3,1fr);text-align:center;font-size:12px;font-weight:800}.sample{padding:22px 24px;border-top:2px solid #1E2132}.sample h3,.tip h3,.expressions h3{font-size:17px;margin:0 0 12px}.paper{background:#FFFFFF}.canvas{background:#F6F7FA}.crimson{background:#D91F3B;color:#FFFFFF}figure{margin:0;text-align:center}figure img{display:block;margin:0 auto}.large{margin:0 auto 10px}.sizes{display:flex;align-items:end;justify-content:space-between;gap:10px;height:225px}figcaption{font-size:12px;font-weight:800;margin-top:8px}.tip{padding:24px;border-top:2px solid #1E2132}.tip-card{display:flex;align-items:center;gap:14px;background:#F6F7FA;border:2px solid #1E2132;border-bottom-width:4px;border-radius:20px;padding:14px}.tip-card>img{flex-shrink:0}h4{font-size:21px;margin:0 0 8px}.tip-card p{font-size:14px;line-height:1.5;margin:0 0 12px}.tip-chip{font-size:11px;font-weight:800}footer{max-width:1100px;margin-top:30px}img{max-width:100%}@media(max-width:1350px){.grid{grid-template-columns:1fr}.concept{max-width:560px;margin:0 auto;width:100%}.intro{min-height:0}h1{font-size:36px}}@media(max-width:480px){main{padding:28px 12px}.sample{padding:20px 10px}.sizes{gap:2px}.tip{padding:18px 12px}.tip-card{gap:8px;padding:10px}.tip-card>img{width:76px;height:auto}.intro{padding:20px}}
</style></head><body><main><header><h1>Meet your Polish study buddy.</h1><p>Three original vector directions for PolishPal: a stork, a bison calf, and a walking folk papercut. Each greets you, celebrates a small win, and makes room to try again.</p><p><strong>Recommended: A. Bociek.</strong> A warm stork with a beak made for talking. Pick a character before we build its twelve poses and full animation rig.</p></header><div class="grid">'''


if __name__ == "__main__":
    generate()
