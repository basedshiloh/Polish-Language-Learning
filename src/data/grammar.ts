import { GrammarTopic } from '@/lib/types';

export const grammarTopics: GrammarTopic[] = [
  // ─────────────────────────────────────────────────────────
  // 1. NOUN GENDER
  // ─────────────────────────────────────────────────────────
  {
    id: 'noun-gender',
    title: 'Noun Gender',
    polishTitle: 'Rodzaj rzeczownika',
    description: 'Every Polish noun is masculine, feminine, or neuter. The gender decides adjective and verb endings — master this first.',
    category: 'nouns',
    icon: 'layers',
    order: 1,
    sections: [
      {
        type: 'text',
        text: 'In Polish, every noun has one of three grammatical genders. You usually tell the gender from the noun\'s ending. This matters because adjectives, pronouns, and past-tense verbs must "agree" with the gender of the noun.',
      },
      {
        type: 'table',
        title: 'The Three Genders',
        table: {
          headers: ['Gender', 'Usual ending', 'Examples'],
          columnColors: ['blue', 'pink', 'green'],
          rows: [
            ['Masculine (rodzaj męski)', 'a consonant', 'student, dom, kot,\ntelefon, samochód'],
            ['Feminine (rodzaj żeński)', '-a', 'kobieta, kawa,\nksiążka, mama'],
            ['Neuter (rodzaj nijaki)', '-o, -e, -ę, -um', 'okno, dziecko, morze,\nimię, muzeum'],
          ],
          footnote: 'The "default" rule: consonant → masculine, -a → feminine, -o/-e → neuter.',
        },
      },
      {
        type: 'table',
        title: 'Important Exceptions',
        table: {
          caption: 'Some nouns break the default rule. These are common ones from class:',
          headers: ['Looks like…', 'But is actually…', 'Examples'],
          rows: [
            ['ends in -a', 'MASCULINE (male people/roles)', 'tata, mężczyzna, kolega,\ndentysta, artysta, poeta, kierowca'],
            ['ends in -i', 'FEMININE', 'pani, gospodyni'],
            ['ends in a consonant', 'FEMININE', 'noc, kolej, twarz, sól'],
            ['ends in -ść', 'FEMININE', 'miłość, radość, złość'],
            ['ends in -um', 'NEUTER (never changes form)', 'muzeum, liceum, gimnazjum'],
          ],
        },
      },
      {
        type: 'note',
        noteType: 'tip',
        note: 'A male person is always masculine, even if the word ends in -a. "Tata" (dad) and "mężczyzna" (man) are masculine: ten tata, ten mężczyzna.',
      },
      {
        type: 'examples',
        title: 'Gender agreement in action',
        examples: [
          { polish: 'dobry student', english: 'a good student (m)', note: 'masculine adj. -y' },
          { polish: 'dobra kawa', english: 'good coffee (f)', note: 'feminine adj. -a' },
          { polish: 'dobre dziecko', english: 'a good child (n)', note: 'neuter adj. -e' },
        ],
      },
      {
        type: 'note',
        noteType: 'info',
        note: 'A few nouns only exist in the plural: drzwi (door), okulary (glasses), spodnie (trousers), dżinsy (jeans), skrzypce (violin). They always take plural verbs: "To są drzwi."',
      },
    ],
  },

  // ─────────────────────────────────────────────────────────
  // 2. CASES OVERVIEW
  // ─────────────────────────────────────────────────────────
  {
    id: 'cases-overview',
    title: 'The Cases — Overview',
    polishTitle: 'Przypadki',
    description: 'Polish nouns change their endings depending on their role in the sentence. Here are the four cases from your A0 course and when to use each.',
    category: 'cases',
    icon: 'grid',
    order: 2,
    sections: [
      {
        type: 'text',
        text: 'A "case" is a set of endings a noun takes depending on its job in the sentence. English barely uses cases (I vs. me), but Polish uses them constantly. Your course focused on four. Each case answers specific questions.',
      },
      {
        type: 'table',
        title: 'The Four Cases You Learned',
        table: {
          headers: ['Case (Polish)', 'Answers', 'Main uses'],
          columnColors: ['purple', null, null],
          highlightFirstCol: true,
          rows: [
            ['Mianownik\n(Nominative)', 'Kto? Co?\n(Who? What?)', 'The subject — the basic dictionary form.\n"To jest student."'],
            ['Biernik\n(Accusative)', 'Kogo? Co?\n(Whom? What?)', 'Direct object of mieć, lubić, znać, kochać.\n"Mam kawę." "Lubię muzykę."'],
            ['Narzędnik\n(Instrumental)', 'Kim? Czym?\n(With whom/what?)', 'After być (I am a…), "z" = with, professions,\ntransport. "Jestem studentem."'],
            ['Dopełniacz\n(Genitive)', 'Kogo? Czego?\n(Of whom/what?)', 'Negation (nie ma), possession, "z/do" = from/to,\nquantities. "Nie mam czasu."'],
          ],
        },
      },
      {
        type: 'note',
        noteType: 'tip',
        note: 'A reliable trick: the VERB tells you which case to use.\n• być → Narzędnik (Jestem nauczycielem)\n• mieć / lubić → Biernik (Mam brata)\n• nie ma / nie mam → Dopełniacz (Nie ma chleba)\n• interesować się → Narzędnik (Interesuję się sportem)',
      },
      {
        type: 'examples',
        title: 'Same noun, four cases',
        examples: [
          { polish: 'To jest kawa.', english: 'This is coffee.', note: 'Nominative' },
          { polish: 'Lubię kawę.', english: 'I like coffee.', note: 'Accusative' },
          { polish: 'Interesuję się kawą.', english: 'I\'m into coffee.', note: 'Instrumental' },
          { polish: 'Nie ma kawy.', english: 'There is no coffee.', note: 'Genitive' },
        ],
      },
    ],
  },

  // ─────────────────────────────────────────────────────────
  // 3. ACCUSATIVE (BIERNIK)
  // ─────────────────────────────────────────────────────────
  {
    id: 'accusative',
    title: 'Accusative Case',
    polishTitle: 'Biernik',
    description: 'The case of the direct object. Used after mieć, lubić, znać, kochać, proszę, and "mam na sobie".',
    category: 'cases',
    icon: 'target',
    order: 3,
    sections: [
      {
        type: 'text',
        text: 'The Accusative (Biernik) marks the direct object — the thing being had, liked, known, or wanted. It answers Kogo? Co? (Whom? What?). The endings depend on gender, and crucially on whether a masculine noun is animate (alive) or inanimate.',
      },
      {
        type: 'table',
        title: 'Accusative Endings — Singular',
        table: {
          headers: ['Gender', 'Change', 'Nominative → Accusative'],
          columnColors: ['blue', null, null],
          highlightFirstCol: true,
          rows: [
            ['Masculine\nANIMATE', 'add -a', 'brat → brata\nkot → kota, pies → psa'],
            ['Masculine\nINANIMATE', 'NO change', 'telefon → telefon\nsamochód → samochód'],
            ['Feminine', '-a → -ę', 'kawa → kawę\nksiążka → książkę'],
            ['Neuter', 'NO change', 'okno → okno\ndziecko → dziecko'],
          ],
          footnote: '"Animate" = people and animals. "Inanimate" = objects.',
        },
      },
      {
        type: 'table',
        title: 'Adjectives in the Accusative',
        table: {
          headers: ['With a…', 'Adjective ending', 'Example'],
          rows: [
            ['Masculine animate noun', '-ego', 'Mam dobrego nauczyciela.'],
            ['Masculine inanimate noun', 'no change (-y/-i)', 'Mam nowy telefon.'],
            ['Feminine noun', '-ą', 'Mam dużą czarną torbę.'],
            ['Neuter noun', 'no change (-e)', 'Mam małe mieszkanie.'],
          ],
        },
      },
      {
        type: 'examples',
        title: 'Examples',
        examples: [
          { polish: 'Mam starszego brata.', english: 'I have an older brother.', note: 'masc. animate' },
          { polish: 'Lubię polską muzykę.', english: 'I like Polish music.', note: 'feminine' },
          { polish: 'Kocham moją żonę.', english: 'I love my wife.', note: 'feminine' },
          { polish: 'Czytam Dostojewskiego.', english: 'I\'m reading Dostoevsky.', note: 'masc. animate' },
          { polish: 'Poproszę kawę i wodę.', english: 'I\'d like a coffee and water.', note: 'after proszę' },
        ],
      },
      {
        type: 'note',
        noteType: 'warning',
        note: 'The masculine animate vs. inanimate split is the #1 thing to remember. "Mam kota" (I have a cat → animate, -a) but "Mam samochód" (I have a car → inanimate, no change).',
      },
    ],
  },

  // ─────────────────────────────────────────────────────────
  // 4. INSTRUMENTAL (NARZĘDNIK)
  // ─────────────────────────────────────────────────────────
  {
    id: 'instrumental',
    title: 'Instrumental Case',
    polishTitle: 'Narzędnik',
    description: 'Used to say what you ARE (jestem studentem), what you go BY, and after "z" meaning "with".',
    category: 'cases',
    icon: 'wrench',
    order: 4,
    sections: [
      {
        type: 'text',
        text: 'The Instrumental (Narzędnik) answers Kim? Czym? (As whom? With what?). It\'s used after być to state identity/profession, after "z" meaning "with", with interesować się (to be interested in), and for means of transport.',
      },
      {
        type: 'table',
        title: 'Instrumental Endings',
        table: {
          headers: ['Gender / Number', 'Ending', 'Example'],
          columnColors: ['blue', null, null],
          highlightFirstCol: true,
          rows: [
            ['Masculine + Neuter', '-em', 'student → studentem\nokno → oknem'],
            ['…after k / g', '-iem', 'Polak → Polakiem\nBelg → Belgiem'],
            ['Feminine', '-ą', 'kobieta → kobietą\naktorka → aktorką'],
            ['Plural (all genders)', '-ami', 'studenci → studentami\nkobiety → kobietami'],
          ],
          footnote: 'Irregular plurals: dzieci → dziećmi, ludzie → ludźmi.',
        },
      },
      {
        type: 'table',
        title: 'Adjectives in the Instrumental',
        table: {
          headers: ['Gender', 'Adjective ending', 'Example'],
          rows: [
            ['Masculine / Neuter', '-ym / -im', 'Jestem dobrym studentem.'],
            ['Feminine', '-ą', 'Ona jest mądrą kobietą.'],
            ['Plural', '-ymi / -imi', 'Oni są dobrymi studentami.'],
          ],
        },
      },
      {
        type: 'examples',
        title: 'The four main uses',
        examples: [
          { polish: 'Jestem nauczycielem.', english: 'I am a teacher.', note: 'być + profession' },
          { polish: 'Interesuję się sportem.', english: 'I\'m interested in sport.', note: 'interesować się' },
          { polish: 'Spotykam się z przyjaciółmi.', english: 'I meet with friends.', note: '"z" = with' },
          { polish: 'Jadę autobusem.', english: 'I go by bus.', note: 'means of transport' },
          { polish: 'Kroję chleb nożem.', english: 'I cut bread with a knife.', note: 'tool / instrument' },
        ],
      },
      {
        type: 'note',
        noteType: 'tip',
        note: 'To say your profession or nationality, use być + Instrumental:\n"Jestem Polką." (I\'m Polish — female)\n"Jestem Amerykaninem." (I\'m American — male)\n"On jest informatykiem." (He\'s an IT specialist.)',
      },
    ],
  },

  // ─────────────────────────────────────────────────────────
  // 5. GENITIVE (DOPEŁNIACZ)
  // ─────────────────────────────────────────────────────────
  {
    id: 'genitive',
    title: 'Genitive Case',
    polishTitle: 'Dopełniacz',
    description: 'The case of negation and possession. Used after "nie ma", "z/do", quantities, and to show "of".',
    category: 'cases',
    icon: 'minus-circle',
    order: 5,
    sections: [
      {
        type: 'text',
        text: 'The Genitive (Dopełniacz) answers Kogo? Czego? (Of whom? Of what?). Its biggest job is NEGATION: when you negate "to have" or "there is", the object flips to Genitive. It\'s also used for possession (whose?), "from/to" places, and quantities.',
      },
      {
        type: 'table',
        title: 'Genitive Endings — Singular',
        table: {
          headers: ['Gender', 'Ending', 'Example'],
          columnColors: ['blue', null, null],
          highlightFirstCol: true,
          rows: [
            ['Masculine\nANIMATE', '-a', 'brat → brata\nkot → kota'],
            ['Masculine\nINANIMATE', '-a or -u', 'chleb → chleba\nrower → roweru, sok → soku'],
            ['Feminine', '-y / -i', 'kawa → kawy\nPolska → Polski, restauracja → restauracji'],
            ['Neuter', '-a', 'piwo → piwa\nkino → kina'],
          ],
          footnote: 'Masculine inanimate -a vs -u is unpredictable — learn it per word.',
        },
      },
      {
        type: 'table',
        title: 'Negation flips Accusative → Genitive',
        table: {
          headers: ['Positive (Accusative)', 'Negative (Genitive)'],
          rows: [
            ['Mam rower.', 'Nie mam roweru.'],
            ['Mam czas.', 'Nie mam czasu.'],
            ['Jest chleb.', 'Nie ma chleba.'],
            ['Lubię kawę.', 'Nie lubię kawy.'],
          ],
        },
      },
      {
        type: 'examples',
        title: 'Other uses',
        examples: [
          { polish: 'To jest rower Marka.', english: "This is Marek's bike.", note: 'possession' },
          { polish: 'Idę do kina.', english: 'I\'m going to the cinema.', note: '"do" = to' },
          { polish: 'Jestem z Polski.', english: 'I am from Poland.', note: '"z" = from' },
          { polish: 'Tu jest dużo ludzi.', english: 'There are a lot of people here.', note: 'quantity' },
          { polish: 'Poproszę kawałek ciasta.', english: 'A piece of cake, please.', note: 'portion' },
        ],
      },
      {
        type: 'note',
        noteType: 'tip',
        note: 'Adjectives in the Genitive: masculine/neuter take -ego, feminine takes -ej.\n"Nie lubię czarnej kawy." (I don\'t like black coffee.)\n"Nie mam dobrego słownika." (I don\'t have a good dictionary.)',
      },
    ],
  },

  // ─────────────────────────────────────────────────────────
  // 6. BYĆ
  // ─────────────────────────────────────────────────────────
  {
    id: 'byc',
    title: 'The Verb "Być" (To Be)',
    polishTitle: 'Czasownik być',
    description: 'The most important verb in Polish. Irregular — memorize this table.',
    category: 'verbs',
    icon: 'equal',
    order: 6,
    sections: [
      {
        type: 'table',
        title: 'Być — Present Tense',
        table: {
          headers: ['Person', 'Form', 'English'],
          highlightFirstCol: true,
          rows: [
            ['ja', 'jestem', 'I am'],
            ['ty', 'jesteś', 'you are (informal)'],
            ['on / ona / ono', 'jest', 'he / she / it is'],
            ['my', 'jesteśmy', 'we are'],
            ['wy', 'jesteście', 'you are (plural)'],
            ['oni / one', 'są', 'they are'],
          ],
          footnote: 'The two most-used forms: jest (he/she/it is) and są (they are).',
        },
      },
      {
        type: 'note',
        noteType: 'tip',
        note: 'Polish drops the pronoun most of the time, because the verb ending already tells you who. "Jestem zmęczony" is more natural than "Ja jestem zmęczony." Add "ja" only for emphasis.',
      },
      {
        type: 'note',
        noteType: 'warning',
        note: 'After być, a noun goes into the INSTRUMENTAL case, not the dictionary form:\n"Jestem student" ✗  →  "Jestem studentem" ✓',
      },
      {
        type: 'examples',
        examples: [
          { polish: 'Jestem z Polski.', english: 'I am from Poland.' },
          { polish: 'Ona jest nauczycielką.', english: 'She is a teacher.' },
          { polish: 'Jesteśmy zmęczeni.', english: 'We are tired.' },
          { polish: 'Oni są moimi przyjaciółmi.', english: 'They are my friends.' },
        ],
      },
    ],
  },

  // ─────────────────────────────────────────────────────────
  // 7. THREE CONJUGATIONS
  // ─────────────────────────────────────────────────────────
  {
    id: 'three-conjugations',
    title: 'The Three Conjugations',
    polishTitle: 'Koniugacje',
    description: 'Most Polish verbs follow one of three ending-patterns. See them side by side.',
    category: 'verbs',
    icon: 'table',
    order: 7,
    sections: [
      {
        type: 'text',
        text: 'Regular Polish verbs fall into three conjugation groups based on their endings. The trick: look at the "I" and "you" forms — they reveal the whole pattern.',
      },
      {
        type: 'table',
        title: 'Side-by-Side Comparison',
        table: {
          headers: ['Person', 'I  (-m, -sz)\nczytać — to read', 'II  (-ę, -isz)\nrobić — to do', 'III  (-ę, -esz)\npisać — to write'],
          columnColors: [null, 'blue', 'green', 'amber'],
          highlightFirstCol: true,
          rows: [
            ['ja', 'czytam', 'robię', 'piszę'],
            ['ty', 'czytasz', 'robisz', 'piszesz'],
            ['on / ona', 'czyta', 'robi', 'pisze'],
            ['my', 'czytamy', 'robimy', 'piszemy'],
            ['wy', 'czytacie', 'robicie', 'piszecie'],
            ['oni / one', 'czytają', 'robią', 'piszą'],
          ],
        },
      },
      {
        type: 'table',
        title: 'Group III special case: -ować verbs',
        table: {
          caption: 'Verbs ending in -ować swap -ować for -uj- before the endings:',
          headers: ['Person', 'gotować — to cook', 'pracować — to work'],
          highlightFirstCol: true,
          rows: [
            ['ja', 'gotuję', 'pracuję'],
            ['ty', 'gotujesz', 'pracujesz'],
            ['on / ona', 'gotuje', 'pracuje'],
            ['my', 'gotujemy', 'pracujemy'],
            ['wy', 'gotujecie', 'pracujecie'],
            ['oni / one', 'gotują', 'pracują'],
          ],
          footnote: 'Also: kupować, malować, studiować, podróżować, interesować się.',
        },
      },
      {
        type: 'note',
        noteType: 'tip',
        note: 'Quick ID:\n• "I" form ends in -am / -em → Group I (czytam, mam)\n• "I" form ends in -ę AND "you" ends in -isz/-ysz → Group II (robię/robisz)\n• "I" form ends in -ę AND "you" ends in -esz → Group III (piszę/piszesz)',
      },
    ],
  },

  // ─────────────────────────────────────────────────────────
  // 8. ZNAĆ / WIEDZIEĆ / UMIEĆ
  // ─────────────────────────────────────────────────────────
  {
    id: 'znac-wiedziec-umiec',
    title: 'znać vs wiedzieć vs umieć',
    polishTitle: 'Trzy czasowniki „wiedzy”',
    description: 'Three verbs all translated as "to know" in English — but each is used differently. This trips up every learner.',
    category: 'verbs',
    icon: 'brain',
    order: 8,
    sections: [
      {
        type: 'text',
        text: 'English uses "to know" for everything. Polish splits it into three verbs that are NOT interchangeable. The rule of thumb: znać a thing/person, wiedzieć a fact, umieć a skill.',
      },
      {
        type: 'comparison',
        comparison: [
          {
            title: 'ZNAĆ',
            subtitle: 'to know / be familiar with',
            color: 'blue',
            structure: 'znać + Biernik (a noun)',
            usage: 'Use for people, places, and things you are familiar with. Always followed by a direct object.',
            examples: [
              { polish: 'Znam Michała.', english: 'I know Michał.' },
              { polish: 'Znam język polski.', english: 'I know the Polish language.' },
              { polish: 'Czy znasz ten film?', english: 'Do you know this film?' },
            ],
          },
          {
            title: 'WIEDZIEĆ',
            subtitle: 'to know (a fact)',
            color: 'green',
            structure: 'wiedzieć + że / gdzie / kiedy…',
            usage: 'Use for knowing information. Followed by a clause: that, where, when, how much, at what time.',
            examples: [
              { polish: 'Wiem, gdzie on mieszka.', english: 'I know where he lives.' },
              { polish: 'Nie wiem.', english: "I don't know." },
              { polish: 'Wiesz, która godzina?', english: 'Do you know what time it is?' },
            ],
          },
          {
            title: 'UMIEĆ',
            subtitle: 'to know how / can',
            color: 'amber',
            structure: 'umieć + bezokolicznik (infinitive)',
            usage: 'Use for learned skills and abilities. Followed by another verb in the infinitive.',
            examples: [
              { polish: 'Umiem pływać.', english: 'I can swim.' },
              { polish: 'Umiem mówić po polsku.', english: 'I can speak Polish.' },
              { polish: 'Czy umiesz gotować?', english: 'Can you cook?' },
            ],
          },
        ],
      },
      {
        type: 'table',
        title: 'Conjugations',
        table: {
          headers: ['Person', 'znać', 'wiedzieć', 'umieć'],
          columnColors: [null, 'blue', 'green', 'amber'],
          highlightFirstCol: true,
          rows: [
            ['ja', 'znam', 'wiem', 'umiem'],
            ['ty', 'znasz', 'wiesz', 'umiesz'],
            ['on / ona', 'zna', 'wie', 'umie'],
            ['my', 'znamy', 'wiemy', 'umiemy'],
            ['wy', 'znacie', 'wiecie', 'umiecie'],
            ['oni / one', 'znają', 'wiedzą', 'umieją'],
          ],
        },
      },
      {
        type: 'note',
        noteType: 'tip',
        note: 'Compare the same idea:\n• "Znam Michała." — I know Michał (the person).\n• "Wiem, że Michał mieszka w Krakowie." — I know that Michał lives in Kraków (a fact).\n• "Umiem mówić po polsku." — I can speak Polish (a skill).',
      },
    ],
  },

  // ─────────────────────────────────────────────────────────
  // 9. TELLING TIME
  // ─────────────────────────────────────────────────────────
  {
    id: 'telling-time',
    title: 'Telling the Time',
    polishTitle: 'Która godzina?',
    description: 'Full hours, "past", "to", and the half-hour trick — with pronunciation for every form.',
    category: 'practical',
    icon: 'clock',
    order: 9,
    sections: [
      {
        type: 'text',
        text: 'To ask the time: "Która godzina?" (What time is it?). To ask at what time: "O której godzinie?". Because "godzina" (hour) is feminine, the hours use FEMININE ordinal numbers (pierwsza, druga…).',
      },
      {
        type: 'table',
        title: 'Full Hours — with pronunciation',
        table: {
          headers: ['Time', 'Polish', 'Pronunciation'],
          highlightFirstCol: true,
          rows: [
            ['1:00', '(jest) pierwsza', 'PYERV-shah'],
            ['2:00', 'druga', 'DROO-gah'],
            ['3:00', 'trzecia', 'TSHEH-chah'],
            ['4:00', 'czwarta', 'CHFAR-tah'],
            ['5:00', 'piąta', 'PYON-tah'],
            ['6:00', 'szósta', 'SHOOS-tah'],
            ['7:00', 'siódma', 'SHOOD-mah'],
            ['8:00', 'ósma', 'OOS-mah'],
            ['9:00', 'dziewiąta', 'jeh-VYON-tah'],
            ['10:00', 'dziesiąta', 'jeh-SHON-tah'],
            ['11:00', 'jedenasta', 'yeh-deh-NAS-tah'],
            ['12:00', 'dwunasta', 'dvoo-NAS-tah'],
          ],
          footnote: 'For 24-hour time, keep counting: 13:00 trzynasta, 14:00 czternasta … 20:00 dwudziesta.',
        },
      },
      {
        type: 'table',
        title: 'Past, To & Half',
        table: {
          headers: ['Clock', 'Polish', 'Literally'],
          rows: [
            ['1:10', 'dziesięć po pierwszej', 'ten past first'],
            ['4:20', 'dwadzieścia po czwartej', 'twenty past fourth'],
            ['5:15', 'piętnaście po piątej / kwadrans po piątej', 'a quarter past fifth'],
            ['7:30', 'wpół do ósmej', 'half to eighth'],
            ['3:55', 'za pięć czwarta', 'in five — fourth'],
            ['1:45', 'za kwadrans druga', 'in a quarter — second'],
          ],
          footnote: 'kwadrans = quarter hour (15 min). "za" + minutes = "to" the next hour.',
        },
      },
      {
        type: 'note',
        noteType: 'warning',
        note: 'The half-hour counts FORWARD to the next hour. "Wpół do ósmej" = half to eight = 7:30, NOT 8:30. This catches everyone out at first!',
      },
      {
        type: 'examples',
        title: 'At what time? (use "o" + hour)',
        examples: [
          { polish: 'O której godzinie wstajesz?', english: 'At what time do you get up?' },
          { polish: 'Wstaję o siódmej.', english: 'I get up at seven.', note: 'o + -ej' },
          { polish: 'Spotkajmy się o wpół do trzeciej.', english: "Let's meet at 2:30." },
          { polish: 'Lekcja jest od dziewiątej do trzynastej.', english: 'The lesson is from 9 to 13.', note: 'od…do…' },
        ],
      },
    ],
  },

  // ─────────────────────────────────────────────────────────
  // 10. NUMBERS REFERENCE
  // ─────────────────────────────────────────────────────────
  {
    id: 'numbers-reference',
    title: 'Numbers Reference',
    polishTitle: 'Liczebniki',
    description: 'A complete chart from 1 to 1000, plus the tricky "lat vs lata" rule for age and counting.',
    category: 'numbers',
    icon: 'calculator',
    order: 10,
    sections: [
      {
        type: 'table',
        title: '1 – 20',
        table: {
          headers: ['#', 'Polish', '#', 'Polish'],
          rows: [
            ['1', 'jeden', '11', 'jedenaście'],
            ['2', 'dwa', '12', 'dwanaście'],
            ['3', 'trzy', '13', 'trzynaście'],
            ['4', 'cztery', '14', 'czternaście'],
            ['5', 'pięć', '15', 'piętnaście'],
            ['6', 'sześć', '16', 'szesnaście'],
            ['7', 'siedem', '17', 'siedemnaście'],
            ['8', 'osiem', '18', 'osiemnaście'],
            ['9', 'dziewięć', '19', 'dziewiętnaście'],
            ['10', 'dziesięć', '20', 'dwadzieścia'],
          ],
        },
      },
      {
        type: 'table',
        title: 'Tens & Hundreds',
        table: {
          headers: ['#', 'Polish', '#', 'Polish'],
          rows: [
            ['30', 'trzydzieści', '100', 'sto'],
            ['40', 'czterdzieści', '200', 'dwieście'],
            ['50', 'pięćdziesiąt', '300', 'trzysta'],
            ['60', 'sześćdziesiąt', '400', 'czterysta'],
            ['70', 'siedemdziesiąt', '500', 'pięćset'],
            ['80', 'osiemdziesiąt', '600', 'sześćset'],
            ['90', 'dziewięćdziesiąt', '1000', 'tysiąc'],
          ],
        },
      },
      {
        type: 'note',
        noteType: 'warning',
        note: 'Age & counting use special forms of "year":\n• 1 → rok: "Mam 1 rok."\n• 2, 3, 4 (and 22-24, 32-34…) → lata: "Mam 22 lata."\n• 5–21 (and 25–31…) → lat: "Mam 20 lat."\nThe same 2-3-4 vs 5+ rule applies to złote/złotych and grosze/groszy for money.',
      },
      {
        type: 'examples',
        title: 'In use',
        examples: [
          { polish: 'Mam dwadzieścia lat.', english: 'I am 20 years old.' },
          { polish: 'Ona ma dwadzieścia dwa lata.', english: 'She is 22 years old.' },
          { polish: 'To kosztuje pięć złotych.', english: 'It costs 5 zloty.' },
          { polish: 'Kawa kosztuje dwanaście złotych i czterdzieści groszy.', english: 'The coffee costs 12.40 zł.' },
        ],
      },
    ],
  },

  // ─────────────────────────────────────────────────────────
  // 11. POLISH CITIES
  // ─────────────────────────────────────────────────────────
  {
    id: 'polish-cities',
    title: 'Polish Cities & Regions',
    polishTitle: 'Polskie miasta',
    description: 'How to say "I am FROM…" and "I LIVE IN…" for real Polish cities — two different case forms.',
    category: 'practical',
    icon: 'map-pin',
    order: 11,
    sections: [
      {
        type: 'text',
        text: 'Two everyday questions need two different case forms of a city name:\n• "Skąd jesteś?" → Jestem z + Genitive (from)\n• "Gdzie mieszkasz?" → Mieszkam w + Locative (in)\nThe city ending changes for each. Here are the major Polish cities.',
      },
      {
        type: 'table',
        title: 'Cities: from / live in',
        table: {
          headers: ['City', 'Jestem z… (from)', 'Mieszkam w… (live in)'],
          columnColors: ['purple', 'amber', 'green'],
          highlightFirstCol: true,
          rows: [
            ['Warszawa', 'z Warszawy', 'w Warszawie'],
            ['Kraków', 'z Krakowa', 'w Krakowie'],
            ['Poznań', 'z Poznania', 'w Poznaniu'],
            ['Wrocław', 'z Wrocławia', 'we Wrocławiu'],
            ['Gdańsk', 'z Gdańska', 'w Gdańsku'],
            ['Łódź', 'z Łodzi', 'w Łodzi'],
            ['Szczecin', 'ze Szczecina', 'w Szczecinie'],
            ['Lublin', 'z Lublina', 'w Lublinie'],
            ['Katowice', 'z Katowic', 'w Katowicach'],
            ['Toruń', 'z Torunia', 'w Toruniu'],
            ['Bydgoszcz', 'z Bydgoszczy', 'w Bydgoszczy'],
            ['Zakopane', 'z Zakopanego', 'w Zakopanem'],
          ],
        },
      },
      {
        type: 'note',
        noteType: 'tip',
        note: 'Spelling helpers:\n• Use "ze" instead of "z" before tricky consonant clusters: ze Szczecina, ze Stanów Zjednoczonych.\n• Use "we" instead of "w" before w-/f- clusters: we Wrocławiu, we Francji.',
      },
      {
        type: 'table',
        title: 'Countries — Jestem z… (from)',
        table: {
          headers: ['Country', 'From…', 'Country', 'From…'],
          rows: [
            ['Polska', 'z Polski', 'Niemcy', 'z Niemiec'],
            ['Indonezja', 'z Indonezji', 'Anglia', 'z Anglii'],
            ['USA', 'ze Stanów Zjednoczonych', 'Francja', 'z Francji'],
            ['Chiny', 'z Chin', 'Japonia', 'z Japonii'],
            ['Włochy', 'z Włoch', 'Hiszpania', 'z Hiszpanii'],
            ['Wietnam', 'z Wietnamu', 'Kolumbia', 'z Kolumbii'],
          ],
        },
      },
      {
        type: 'examples',
        examples: [
          { polish: 'Jestem z Poznania, ale mieszkam w Warszawie.', english: 'I\'m from Poznań but I live in Warsaw.' },
          { polish: 'Ona jest z Krakowa.', english: 'She is from Kraków.' },
          { polish: 'Mieszkam i pracuję we Wrocławiu.', english: 'I live and work in Wrocław.' },
        ],
      },
    ],
  },

  // ─────────────────────────────────────────────────────────
  // 12. PRONOUNS
  // ─────────────────────────────────────────────────────────
  {
    id: 'pronouns',
    title: 'Pronouns Across Cases',
    polishTitle: 'Zaimki',
    description: 'Personal and possessive pronouns and how they change form in each case.',
    category: 'practical',
    icon: 'users',
    order: 12,
    sections: [
      {
        type: 'table',
        title: 'Personal Pronouns by Case',
        table: {
          caption: 'How "I, you, he, she…" change depending on the case:',
          headers: ['Case', 'ja', 'ty', 'on', 'ona', 'my', 'wy', 'oni/one'],
          highlightFirstCol: true,
          rows: [
            ['Nominative (subject)', 'ja', 'ty', 'on', 'ona', 'my', 'wy', 'oni'],
            ['Accusative (Kogo?)', 'mnie', 'cię', 'go', 'ją', 'nas', 'was', 'ich'],
            ['Instrumental (z kim?)', 'mną', 'tobą', 'nim', 'nią', 'nami', 'wami', 'nimi'],
            ['Genitive (Kogo?)', 'mnie', 'ciebie', 'go', 'jej', 'nas', 'was', 'ich'],
          ],
        },
      },
      {
        type: 'examples',
        title: 'Personal pronouns in action',
        examples: [
          { polish: 'Kocham cię.', english: 'I love you.', note: 'Accusative' },
          { polish: 'Lubię go.', english: 'I like him.', note: 'Accusative' },
          { polish: 'Spotykam się z nią.', english: 'I meet (up) with her.', note: 'Instrumental' },
          { polish: 'Nie ma ich tutaj.', english: 'They are not here.', note: 'Genitive' },
        ],
      },
      {
        type: 'table',
        title: 'Possessive Pronouns (Nominative)',
        table: {
          headers: ['Owner', 'Masculine', 'Feminine', 'Neuter'],
          columnColors: [null, 'blue', 'pink', 'green'],
          highlightFirstCol: true,
          rows: [
            ['my (mój)', 'mój', 'moja', 'moje'],
            ['your (twój)', 'twój', 'twoja', 'twoje'],
            ['his', 'jego', 'jego', 'jego'],
            ['her', 'jej', 'jej', 'jej'],
            ['our (nasz)', 'nasz', 'nasza', 'nasze'],
            ['your pl. (wasz)', 'wasz', 'wasza', 'wasze'],
            ['their', 'ich', 'ich', 'ich'],
          ],
          footnote: 'jego, jej, ich never change form. mój/twój/nasz/wasz agree with the noun\'s gender.',
        },
      },
      {
        type: 'examples',
        examples: [
          { polish: 'Mój tata ma na imię Piotr.', english: "My dad's name is Piotr.", note: 'masculine' },
          { polish: 'Moja mama jest lekarką.', english: 'My mum is a doctor.', note: 'feminine' },
          { polish: 'To jest jego dziecko.', english: 'This is his child.', note: 'jego invariable' },
        ],
      },
    ],
  },

  // ─────────────────────────────────────────────────────────
  // 13. SHOPPING & MONEY
  // ─────────────────────────────────────────────────────────
  {
    id: 'shopping-money',
    title: 'Shopping & Money',
    polishTitle: 'Zakupy i pieniądze',
    description: 'Phrases for shops, asking prices, paying, sizes, and trying things on — with full example dialogues.',
    category: 'practical',
    icon: 'shopping-bag',
    order: 13,
    sections: [
      {
        type: 'table',
        title: 'Essential Shopping Phrases',
        table: {
          headers: ['Polish', 'English'],
          rows: [
            ['Ile to kosztuje?', 'How much does it cost?'],
            ['Ile płacę?', 'How much do I pay?'],
            ['Poproszę…', "I'd like… / …please"],
            ['Szukam…', "I'm looking for…"],
            ['Czy macie…?', 'Do you have…?'],
            ['Jaki rozmiar?', 'What size?'],
            ['Czy mogę przymierzyć?', 'Can I try it on?'],
            ['Czy mogę zapłacić kartą?', 'Can I pay by card?'],
            ['Kartą czy gotówką?', 'Card or cash?'],
            ['To jest za drogie.', "It's too expensive."],
            ['Biorę to.', "I'll take it."],
            ['Coś jeszcze?', 'Anything else?'],
          ],
        },
      },
      {
        type: 'table',
        title: 'Where to shop — idę do + Genitive',
        table: {
          headers: ['Shop (Polish)', 'English', 'Go there: idę do…'],
          rows: [
            ['sklep spożywczy', 'grocery store', 'do sklepu'],
            ['piekarnia', 'bakery', 'do piekarni'],
            ['apteka', 'pharmacy', 'do apteki'],
            ['księgarnia', 'bookshop', 'do księgarni'],
            ['kawiarnia', 'café', 'do kawiarni'],
            ['cukiernia', 'cake shop', 'do cukierni'],
            ['kwiaciarnia', 'florist', 'do kwiaciarni'],
            ['sklep odzieżowy', 'clothing store', 'do sklepu odzieżowego'],
          ],
          footnote: 'Pattern: po + thing (Accusative) idę do + shop (Genitive). "Po chleb idę do piekarni."',
        },
      },
      {
        type: 'table',
        title: 'Money: złote vs złotych',
        table: {
          headers: ['Amount', 'Form', 'Example'],
          rows: [
            ['1', 'złoty', 'jeden złoty'],
            ['2, 3, 4', 'złote', 'trzy złote'],
            ['5 and up', 'złotych', 'dwadzieścia złotych'],
          ],
          footnote: 'Grosze work the same: 2 grosze, 5 groszy. (1 złoty = 100 groszy)',
        },
      },
      {
        type: 'examples',
        title: 'Dialogue: buying trousers',
        examples: [
          { polish: '— Dzień dobry, w czym mogę pomóc?', english: 'Hello, how can I help?' },
          { polish: '— Szukam czarnych spodni.', english: "I'm looking for black trousers." },
          { polish: '— Jaki rozmiar?', english: 'What size?' },
          { polish: '— Rozmiar czterdzieści. Czy mogę przymierzyć?', english: 'Size 40. Can I try them on?' },
          { polish: '— Tak, proszę. … Biorę. Ile płacę?', english: "Yes, please. … I'll take them. How much?" },
          { polish: '— Sto złotych. Kartą czy gotówką?', english: '100 zloty. Card or cash?' },
          { polish: '— Kartą, proszę.', english: 'By card, please.' },
        ],
      },
      {
        type: 'examples',
        title: 'Clothing: "Co masz na sobie?" (What are you wearing?)',
        examples: [
          { polish: 'Mam na sobie białą koszulę i czarne spodnie.', english: 'I\'m wearing a white shirt and black trousers.', note: 'mam na sobie + Accusative' },
          { polish: 'Zwykle noszę dżinsy i sweter.', english: 'I usually wear jeans and a sweater.', note: 'nosić = to wear regularly' },
          { polish: 'Ona ma na sobie żółtą kurtkę.', english: 'She is wearing a yellow jacket.' },
        ],
      },
    ],
  },

  // ─────────────────────────────────────────────────────────
  // 14. FREQUENCY ADVERBS
  // ─────────────────────────────────────────────────────────
  {
    id: 'frequency-adverbs',
    title: 'Frequency Adverbs',
    polishTitle: 'Przysłówki częstotliwości',
    description: 'How often do you do something? See zawsze, zwykle, często, rzadko, nigdy on a visual scale from always to never.',
    category: 'practical',
    icon: 'gauge',
    order: 14,
    sections: [
      {
        type: 'text',
        text: 'Frequency adverbs answer the question "Jak często?" (How often?). They run on a scale from zawsze (always, 100%) down to nigdy (never, 0%). Picture them on a meter:',
      },
      {
        type: 'frequency',
        title: 'The Frequency Scale',
        frequency: [
          { polish: 'zawsze', english: 'always', pronunciation: 'ZAHF-sheh', percent: 100 },
          { polish: 'zwykle / zazwyczaj', english: 'usually', pronunciation: 'ZVIK-leh', percent: 85 },
          { polish: 'często', english: 'often', pronunciation: 'CHEN-stoh', percent: 70 },
          { polish: 'czasami / czasem', english: 'sometimes', pronunciation: 'chah-SAH-mee', percent: 45 },
          { polish: 'rzadko', english: 'rarely', pronunciation: 'ZHAHT-koh', percent: 20 },
          { polish: 'nigdy', english: 'never', pronunciation: 'NEEG-dih', percent: 0 },
        ],
      },
      {
        type: 'note',
        noteType: 'tip',
        note: 'Word order: the frequency adverb usually goes BEFORE the verb.\n"Zwykle jem śniadanie o ósmej." (I usually eat breakfast at eight.)\n"Często słucham muzyki." (I often listen to music.)',
      },
      {
        type: 'note',
        noteType: 'warning',
        note: 'nigdy needs a DOUBLE negative — it always pairs with "nie" on the verb:\n"Nigdy nie gram na gitarze." (I never play the guitar.)\nNOT "Nigdy gram…" ✗',
      },
      {
        type: 'examples',
        title: 'In full sentences',
        examples: [
          { polish: 'Zawsze w weekendy śpię długo.', english: 'I always sleep in on weekends.', note: '100%' },
          { polish: 'Zwykle wstaję o siódmej.', english: 'I usually get up at seven.', note: '~85%' },
          { polish: 'Często czytam książki.', english: 'I often read books.', note: '~70%' },
          { polish: 'Czasami chodzę do restauracji.', english: 'I sometimes go to a restaurant.', note: '~45%' },
          { polish: 'Rzadko jeżdżę taksówką.', english: 'I rarely take a taxi.', note: '~20%' },
          { polish: 'Nigdy nie chodzę do kina.', english: 'I never go to the cinema.', note: '0%' },
        ],
      },
      {
        type: 'table',
        title: 'Saying exactly how often',
        table: {
          caption: 'For precise frequency, use these expressions:',
          headers: ['Polish', 'English'],
          rows: [
            ['codziennie', 'every day'],
            ['raz w tygodniu', 'once a week'],
            ['dwa razy w tygodniu', 'twice a week'],
            ['raz na miesiąc', 'once a month'],
            ['raz w roku', 'once a year'],
            ['od czasu do czasu', 'from time to time'],
          ],
        },
      },
      {
        type: 'note',
        noteType: 'info',
        note: 'Ask a friend: "Jak często…?" — "Jak często grasz w gry?" (How often do you play games?) Answer with any adverb above: "Codziennie!" or "Rzadko."',
      },
    ],
  },

  // ─────────────────────────────────────────────────────────
  // 15. COMMON QUESTIONS & HOW TO ANSWER THEM
  // ─────────────────────────────────────────────────────────
  {
    id: 'questions-answers',
    title: 'Common Questions & How to Answer',
    polishTitle: 'Pytania i odpowiedzi',
    description: 'The questions you will hear every day — and exactly how to answer them with the correct case and form.',
    category: 'practical',
    icon: 'message-circle',
    order: 15,
    sections: [
      {
        type: 'text',
        text: 'Polish questions tell you which case to use in the answer. Each question word (Kim? Jaki? Skąd? Czym?) points at a specific case. Here are all the common ones from class, with full example answers.',
      },

      // KIM JESTEŚ?
      {
        type: 'table',
        title: 'Kim jesteś? — Who are you? / What do you do?',
        table: {
          caption: 'Asks about identity, profession, or nationality. Answer uses być + INSTRUMENTAL case.',
          headers: ['Question', 'Answer', 'What changed?'],
          columnColors: ['purple', null, null],
          rows: [
            ['Kim jesteś?', 'Jestem studentem. (m)\nJestem studentką. (f)', 'student → studentem\nstudentka → studentką'],
            ['Kim jesteś z zawodu?', 'Jestem nauczycielem. (m)\nJestem nauczycielką. (f)', 'nauczyciel → nauczycielem\nnauczycielka → nauczycielką'],
            ['Kim Pan jest?', 'Jestem lekarzem.\nJestem informatykiem.', 'lekarz → lekarzem\ninformatyk → informatykiem'],
            ['Kim Pani jest?', 'Jestem lekarką.\nJestem emerytką.', 'lekarka → lekarką\nemerytka → emerytką'],
            ['Kim on jest?', 'On jest biznesmenem.\nOn jest politykiem.', 'biznesmen → biznesmenem\npolityk → politykiem'],
            ['Kim ona jest?', 'Ona jest aktorką.\nOna jest dziennikarką.', 'aktorka → aktorką\ndziennikarka → dziennikarką'],
          ],
          footnote: 'Rule: masculine/neuter → -em (after k,g → -iem), feminine → -ą.',
        },
      },
      {
        type: 'note',
        noteType: 'tip',
        note: 'Nationality works the same way:\n"Kim jesteś?" — "Jestem Polakiem / Polką." (I am Polish m/f)\n"Jestem Amerykaninem / Amerykanką."\n"Jestem Indonezyjczykiem / Indonezyjką."',
      },

      // JAKI ON JEST? JAKA ONA JEST?
      {
        type: 'table',
        title: 'Jaki on jest? / Jaka ona jest? — What is he/she like?',
        table: {
          caption: 'Asks about appearance or personality. Answer uses adjectives that agree in gender (Nominative case).',
          headers: ['Question', 'Example answers'],
          columnColors: ['purple', null],
          rows: [
            ['Jaki on jest?\n(What is he like?)', 'On jest wysoki i przystojny.\nOn jest młody, inteligentny i wesoły.\nOn jest niski i szczupły.'],
            ['Jaka ona jest?\n(What is she like?)', 'Ona jest wysoka i piękna.\nOna jest młoda, inteligentna i wesoła.\nOna jest niska i szczupła.'],
            ['Jakie ono jest?\n(What is it like?)', 'Ono jest małe i wesołe.\nDziecko jest młode i zdrowe.'],
            ['Jaki Pan jest?\n(What are you like? — formal m)', 'Jestem wysoki i uprzejmy.\nJestem ambitny i pracowity.'],
            ['Jaka Pani jest?\n(What are you like? — formal f)', 'Jestem wysoka i uprzejma.\nJestem ambitna i pracowita.'],
          ],
        },
      },
      {
        type: 'table',
        title: 'Adjective endings for gender',
        table: {
          headers: ['Masculine (-y/-i)', 'Feminine (-a)', 'Neuter (-e)'],
          columnColors: ['blue', 'pink', 'green'],
          rows: [
            ['wysoki', 'wysoka', 'wysokie'],
            ['młody', 'młoda', 'młode'],
            ['wesoły', 'wesoła', 'wesołe'],
            ['przystojny', 'przystojna', 'przystojne'],
            ['inteligentny', 'inteligentna', 'inteligentne'],
            ['szczupły', 'szczupła', 'szczupłe'],
            ['gruby', 'gruba', 'grube'],
            ['stary', 'stara', 'stare'],
            ['smutny', 'smutna', 'smutne'],
            ['brudny', 'brudna', 'brudne'],
          ],
          footnote: 'Pattern: masculine -y → feminine -a → neuter -e. After k, g: masculine -i (wysoki, drogi).',
        },
      },

      // SKĄD JESTEŚ?
      {
        type: 'table',
        title: 'Skąd jesteś? — Where are you from?',
        table: {
          caption: 'Answer uses "Jestem z" + GENITIVE case of the country/city.',
          headers: ['Question', 'Example answers'],
          columnColors: ['purple', null],
          rows: [
            ['Skąd jesteś?', 'Jestem z Polski. / z Indonezji. / z Ameryki.\nJestem ze Stanów Zjednoczonych.'],
            ['Skąd Pan/Pani jest?', 'Jestem z Chin. / z Wietnamu. / z Kolumbii.\nJestem z Krakowa. / z Poznania.'],
          ],
        },
      },

      // GDZIE MIESZKASZ?
      {
        type: 'table',
        title: 'Gdzie mieszkasz? — Where do you live?',
        table: {
          caption: 'Answer uses "Mieszkam w" + LOCATIVE case of the city.',
          headers: ['Question', 'Example answers'],
          columnColors: ['purple', null],
          rows: [
            ['Gdzie mieszkasz?', 'Mieszkam w Warszawie. / w Poznaniu.\nMieszkam we Wrocławiu. / w Gdańsku.'],
            ['Gdzie Pan/Pani mieszka?', 'Mieszkam w Krakowie. / w Polsce.\nMieszkam w Łodzi. / w Toruniu.'],
          ],
        },
      },

      // CZYM SIĘ INTERESUJESZ?
      {
        type: 'table',
        title: 'Czym się interesujesz? — What are you interested in?',
        table: {
          caption: 'Answer uses "Interesuję się" + INSTRUMENTAL case.',
          headers: ['Question', 'Example answers'],
          columnColors: ['purple', null],
          rows: [
            ['Czym się interesujesz?', 'Interesuję się sportem. (sport → sportem)\nInteresuję się muzyką klasyczną. (muzyka → muzyką)\nInteresuję się fotografią. (fotografia → fotografią)'],
            ['Czym się Pan/Pani\ninteresuje?', 'Interesuję się polityką europejską.\nInteresuję się malarstwem. (malarstwo → malarstwem)\nInteresuję się produkcją muzyczną.'],
          ],
        },
      },

      // CO LUBISZ ROBIĆ?
      {
        type: 'table',
        title: 'Co lubisz robić? — What do you like to do?',
        table: {
          caption: 'Answer uses "Lubię" + INFINITIVE verb.',
          headers: ['Question', 'Example answers'],
          columnColors: ['purple', null],
          rows: [
            ['Co lubisz robić?', 'Lubię czytać książki.\nLubię słuchać muzyki.\nLubię podróżować i gotować.'],
            ['Co lubisz robić\nw wolnym czasie?', 'Lubię grać w gry komputerowe.\nLubię chodzić na spacery.\nLubię spotykać się z przyjaciółmi.'],
          ],
        },
      },

      // ILE MASZ LAT?
      {
        type: 'table',
        title: 'Ile masz lat? — How old are you?',
        table: {
          caption: 'Answer uses "Mam" + number + rok/lata/lat.',
          headers: ['Question', 'Example answers', 'Which form?'],
          columnColors: ['purple', null, null],
          rows: [
            ['Ile masz lat?', 'Mam dwadzieścia lat.', '5–21 → lat'],
            ['Ile ma Pan/Pani lat?', 'Mam trzydzieści dwa lata.', '2, 3, 4 (22, 23, 24…) → lata'],
            ['Ile on/ona ma lat?', 'On ma jeden rok.\nOna ma sześćdziesiąt pięć lat.', '1 → rok\n5+ → lat'],
          ],
        },
      },

      // KTÓRA GODZINA?
      {
        type: 'table',
        title: 'Która godzina? — What time is it?',
        table: {
          caption: 'Answer uses "Jest" + feminine ordinal number. See the Telling Time grammar page for full details.',
          headers: ['Question', 'Example answers'],
          columnColors: ['purple', null],
          rows: [
            ['Która godzina?', 'Jest trzecia. (3:00)\nJest wpół do piątej. (4:30)\nJest piętnaście po ósmej. (8:15)'],
            ['O której godzinie?', 'O siódmej. (at 7:00)\nO wpół do dziesiątej. (at 9:30)\nO dwudziestej. (at 20:00)'],
          ],
        },
      },

      // CO MASZ NA SOBIE?
      {
        type: 'table',
        title: 'Co masz na sobie? — What are you wearing?',
        table: {
          caption: 'Answer uses "Mam na sobie" + ACCUSATIVE case.',
          headers: ['Question', 'Example answers'],
          columnColors: ['purple', null],
          rows: [
            ['Co masz na sobie?', 'Mam na sobie białą koszulę i czarne spodnie.\nMam na sobie niebieską kurtkę i szare buty.\nMam na sobie czerwony sweter i dżinsy.'],
            ['Co on/ona ma na sobie?', 'On ma na sobie czarny garnitur.\nOna ma na sobie żółtą sukienkę i brązowe kozaki.'],
          ],
        },
      },

      // CO JESZ / PIJESZ?
      {
        type: 'table',
        title: 'Co jesz? Co pijesz? — What do you eat/drink?',
        table: {
          caption: 'Answer uses jeść/pić + ACCUSATIVE case.',
          headers: ['Question', 'Example answers'],
          columnColors: ['purple', null],
          rows: [
            ['Co zwykle jesz\nna śniadanie?', 'Na śniadanie zwykle jem bułkę z masłem i serem.\nZwykle jem jajka i chleb.'],
            ['Co zwykle jesz na obiad?', 'Na obiad zwykle jem zupę pomidorową i kurczaka z ryżem.'],
            ['Co pijesz?', 'Piję kawę z mlekiem.\nPiję wodę mineralną.\nPiję sok pomarańczowy.'],
          ],
        },
      },

      {
        type: 'note',
        noteType: 'info',
        note: 'Summary of which case each question triggers:\n• Kim? → Instrumental (jestem studentem)\n• Jaki/Jaka? → Nominative (on jest wysoki)\n• Skąd? → Genitive (z Polski)\n• Gdzie? → Locative (w Warszawie)\n• Czym? → Instrumental (sportem)\n• Co? Kogo? → Accusative (lubię muzykę)\n• Ile? → Genitive (dwadzieścia lat)',
      },
    ],
  },
];
