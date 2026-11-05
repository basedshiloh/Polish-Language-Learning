"""Żubek's hand-drawn vector master, pose art, manifest and offline review pages.

Standard library only. Character contours are shared; gestures and props are
deliberate per-pose paths. Run from any directory. No application code is edited.
"""
from pathlib import Path
import json
import xml.etree.ElementTree as ET

HERE = Path(__file__).resolve().parent
ROOT = HERE.parents[1]
OUT = ROOT / "public/mascot"
INK, WHITE, RED, SUN = "#1E2132", "#FFFFFF", "#D91F3B", "#FFC21A"
BLUE, GREEN, PINK = "#2F5BEA", "#15803D", "#D6338A"
PIVOTS = {
    "shadow": [200, 454], "body": [200, 330], "head": [201, 270],
    "eye-l": [160, 170], "eye-r": [240, 170],
    "lid-l": [160, 170], "lid-r": [240, 170], "mouth": [200, 246],
    "arm-l": [139, 263], "arm-r": [269, 276],
    "leg-l": [160, 359], "leg-r": [248, 357],
    "accessory": [203, 308], "prop": [200, 335],
}
POSES = {
    "hello": ("Żubek waves hello.", ["home hero", "about", "first visit"]),
    "speak": ("Żubek speaks with sound arcs.", ["pronunciation", "speak buttons"]),
    "teach": ("Żubek points to a lesson board.", ["lessons", "grammar tables", "tip cards"]),
    "read": ("Żubek holds an open book.", ["blog", "grammar reference"]),
    "think": ("Żubek rests a hoof by the chin.", ["quiz question", "did you know"]),
    "celebrate": ("Żubek jumps with confetti.", ["correct answer", "lesson complete"]),
    "oops": ("Żubek gives an encouraging shrug.", ["wrong answer", "try again"]),
    "confused": ("Żubek wonders beside a question mark.", ["404", "no search results"]),
    "sleep": ("Żubek dozes with folded arms.", ["empty state", "no progress yet"]),
    "cards": ("Żubek holds vocabulary cards.", ["vocabulary", "flashcards"]),
    "trophy": ("Żubek holds a star trophy.", ["progress", "streaks"]),
    "travel": ("Żubek carries a small suitcase.", ["travel phrases", "culture posts"]),
}


def path(d, fill="none", **attrs):
    extra = "".join(f' {k.replace("_", "-")}="{v}"' for k, v in attrs.items())
    return f'<path d="{d}" fill="{fill}"{extra}/>'


def ellipse(x, y, rx, ry, fill, **attrs):
    extra = "".join(f' {k.replace("_", "-")}="{v}"' for k, v in attrs.items())
    return f'<ellipse cx="{x}" cy="{y}" rx="{rx}" ry="{ry}" fill="{fill}"{extra}/>'


def part(prefix, name, drawing, pivots, **attrs):
    x, y = pivots[name]
    extra = "".join(f' {k.replace("_", "-")}="{v}"' for k, v in attrs.items())
    return f'<g id="{prefix}-{name}" data-part="{name}" data-pivot="{x} {y}"{extra}>\n{drawing}\n</g>'


def variant(prefix, name, state, drawing, visible):
    visibility = "visible" if visible else "hidden"
    return f'<g id="{prefix}-{name}-{state}" data-state="{state}" visibility="{visibility}">{drawing}</g>'


def arm(pose, side):
    if side == "l":
        if pose in {"hello", "celebrate"}:
            skin = "M143 277Q119 299 99 277L70 237 50 201Q44 185 57 179L78 169Q91 165 99 178L104 204 126 233 149 248Z"
            hoof = "M50 201Q44 185 57 179L78 169Q91 165 99 178L104 204 76 221Z"
        elif pose in {"speak", "oops", "confused"}:
            skin = "M144 264Q121 248 103 273L79 265 66 246Q56 238 48 249L45 271 63 289 99 307Q124 316 151 286Z"
            hoof = "M79 265 66 246Q56 238 48 249L45 271 63 289 86 294Z"
        elif pose == "think":
            skin = "M142 264Q117 267 117 295 119 324 149 324L188 295 200 276 181 261 165 279 148 290 151 278Z"
            hoof = "M165 279 181 261 200 276 188 295 175 304 155 291Z"
        elif pose == "sleep":
            skin = "M142 264Q115 267 116 292 116 313 141 324L212 344 228 326 208 309 153 294 154 278Z"
            hoof = "M208 309 228 326 212 344 185 336 188 314Z"
        elif pose in {"read", "cards", "trophy"}:
            skin = "M144 264Q117 268 113 294L111 323Q116 346 138 342L169 330 166 308 142 312 151 281Z"
            hoof = "M142 312 166 308 169 330 138 342Q124 342 122 327Z"
        else:
            skin = "M139 260Q101 271 99 317L105 353Q128 365 141 346L135 315 154 291Z"
            hoof = "M101 326 136 322 141 346Q128 365 105 353Z"
    else:
        if pose == "celebrate":
            skin = "M262 280Q285 301 309 278L339 235 359 195Q365 180 352 174L332 166Q320 162 313 176L307 202 284 234 257 252Z"
            hoof = "M339 235 359 195Q365 180 352 174L332 166Q320 162 313 176L307 202 329 220Z"
        elif pose == "teach":
            skin = "M265 261Q281 257 294 275L316 283 337 277Q350 276 351 287L346 302 314 307 285 302 260 285Z"
            hoof = "M316 283 337 277Q350 276 351 287L346 302 314 307 308 292Z"
        elif pose in {"oops", "confused"}:
            skin = "M265 265Q283 249 299 273L325 264 337 246Q347 237 355 249L358 271 340 290 305 307Q280 316 257 289Z"
            hoof = "M325 264 337 246Q347 237 355 249L358 271 340 290 316 294Z"
        elif pose == "sleep":
            skin = "M267 264Q290 270 288 295 285 315 261 326L192 344 175 327 195 309 254 294 252 279Z"
            hoof = "M195 309 175 327 192 344 220 337 216 315Z"
        elif pose in {"read", "cards", "trophy"}:
            skin = "M264 264Q289 269 295 294L298 322Q293 344 270 341L239 329 243 307 269 311 256 281Z"
            hoof = "M269 311 243 307 239 329 270 341Q284 342 287 326Z"
        elif pose == "travel":
            skin = "M266 262Q293 265 302 292L314 317 337 320 341 339 320 351 297 339 280 308 258 290Z"
            hoof = "M314 317 337 320 341 339 320 351 305 342 305 323Z"
        else:
            skin = "M269 260Q310 273 313 321L307 355Q285 368 273 348L277 317 256 297Z"
            hoof = "M279 327 311 331 307 354Q285 368 273 348Z"
    return path(skin, SUN) + path(hoof, INK)


def legs(pose, side):
    if pose == "celebrate":
        if side == "l":
            return path("M141 352 183 358 178 387 148 398 139 420 100 415 111 383 140 373Z", SUN) + path("M110 397 147 402 139 426 96 418Z", INK)
        return path("M226 353 268 352 264 378 294 394 304 418 266 427 250 402 219 388Z", SUN) + path("M264 406 299 399 312 425 272 435Z", INK)
    if side == "l":
        return path("M139 353 183 356 177 430H128Z", SUN) + path("M130 407H180L177 444H126Z", INK)
    return path("M225 353 270 348 281 430H232Z", SUN) + path("M229 407H278L284 444H233Z", INK)


def props(pose):
    """Props use only geometry. No lettering, speech balloons or outside art."""
    if pose == "speak":
        return path("M335 169Q349 182 335 195 M349 156Q375 182 349 208"), [335, 182]
    if pose == "teach":
        return (path("M331 369V414M312 414H351") +
                path("M292 269H378Q386 269 386 279V366Q386 376 376 376H294Q284 376 284 366V279Q284 269 292 269Z", WHITE) +
                path("M302 312H339V320H302Z M302 335H365V343H302Z", RED, stroke="none") +
                ellipse(362, 316, 7, 7, SUN)), [316, 288]
    if pose == "read":
        return (path("M200 317Q153 296 105 308V377Q156 367 200 391Z", WHITE) +
                path("M200 317Q247 296 295 308V377Q245 367 200 391Z", WHITE) +
                path("M200 320V391 M125 329Q157 326 179 336 M125 350Q157 347 179 357 M221 336Q248 326 276 329 M221 357Q248 347 276 350")), [200, 344]
    if pose == "celebrate":
        return (path("M42 102 53 82 67 94 56 114Z", RED) +
                path("M184 65 198 55 208 70 194 80Z", BLUE) +
                path("M348 90 358 69 372 81 363 101Z", GREEN) +
                path("M344 284 355 279 363 295 351 302Z", PINK) +
                path("M45 328 62 320 70 335 52 343Z", BLUE)), [200, 180]
    if pose == "confused":
        return path("M333 87Q334 65 354 65 378 65 378 87 378 103 359 110L354 119") + ellipse(354, 141, 5, 5, INK, stroke="none"), [354, 102]
    if pose == "sleep":
        return (path("M360 74C328 74 316 109 335 130 348 144 368 139 378 125 351 127 340 98 360 74Z", BLUE) +
                path("M318 166 323 156 328 166 338 171 328 176 323 186 318 176 308 171Z", SUN)), [350, 108]
    if pose == "cards":
        return (path("M137 306 204 289Q213 287 216 297L236 369 156 390 132 319Q129 308 137 306Z", WHITE) +
                path("M194 308 267 322Q278 324 276 336L262 398 180 382 187 318Q188 306 194 308Z", WHITE) +
                path("M164 326 180 307 196 322 180 341Z", RED) +
                ellipse(231, 345, 12, 12, BLUE) + path("M210 372 247 380")), [201, 342]
    if pose == "trophy":
        return (path("M169 296H145V313Q145 343 176 343 M248 296H272V313Q272 343 242 343", WHITE) +
                path("M169 284H248V320Q248 351 210 357 169 351 169 320Z", SUN) +
                path("M201 356H218V380H236V395H181V380H201Z", SUN) +
                path("M208 298 214 310 228 312 218 322 220 336 208 329 196 336 198 322 188 312 202 310Z", WHITE)), [209, 328]
    if pose == "travel":
        return (path("M306 335V316Q306 308 315 308H335Q344 308 344 316V335", WHITE) +
                path("M288 334H370Q379 334 379 344V412Q379 422 369 422H289Q279 422 279 412V344Q279 334 288 334Z", RED) +
                path("M283 402H375V412Q375 418 368 418H289Q283 418 283 412Z", "#A3142B", stroke="none") +
                path("M297 337V419M359 337V419") +
                path("M327 358 344 375 327 393 310 375Z", SUN)), [325, 316]
    return "", [200, 335]


def head(prefix, pose, pivots, eyes, mouth):
    drawing = path("M139 135Q108 149 88 128L77 114Q111 101 142 114Z", SUN)
    drawing += path("M260 135Q291 149 313 126L324 112Q287 100 258 115Z", SUN)
    drawing += path("M139 126C105 127 94 101 105 70Q84 81 85 104C85 131 106 151 139 152Z", WHITE)
    drawing += path("M260 126C294 126 306 101 295 70Q316 81 315 104C315 131 294 151 260 152Z", WHITE)
    drawing += path("M142 114 155 94 177 103 199 88 221 103 245 96 258 115C284 128 294 151 291 185L301 204 285 218 288 240 269 244 255 264 236 260 215 282H183L163 261 144 265 130 244 112 241 115 221 101 205 111 188C104 151 116 128 142 114Z", SUN)
    for side, x in [("l", 160), ("r", 240)]:
        open_eye = ellipse(x, 170, 8, 11, INK, stroke="none")
        happy_eye = path(f"M{x-10} 173Q{x} 155 {x+10} 173")
        content = variant(prefix, f"eye-{side}", "open", open_eye, eyes == "open")
        content += variant(prefix, f"eye-{side}", "happy", happy_eye, eyes == "happy")
        drawing += part(prefix, f"eye-{side}", content, pivots)
        drawing += part(prefix, f"lid-{side}", path(f"M{x-10} 170Q{x} 181 {x+10} 170"), pivots,
                        visibility="visible" if eyes == "closed" else "hidden")
    if pose in {"oops", "confused", "think"}:
        drawing += path("M148 148Q160 136 174 144 M227 146Q241 139 252 148")
    drawing += path("M158 204Q199 190 241 204C266 213 270 244 250 258 231 269 170 269 149 257 128 245 132 215 158 204Z", INK)
    drawing += ellipse(170, 224, 6, 4, WHITE, stroke="none") + ellipse(230, 224, 6, 4, WHITE, stroke="none")
    states = {
        "closed": path("M183 240Q200 253 217 240L215 246Q200 260 185 246Z", WHITE, stroke="none"),
        "open-s": ellipse(200, 246, 10, 8, WHITE, stroke="none"),
        "open-l": ellipse(200, 245, 17, 14, WHITE, stroke="none"),
    }
    drawing += part(prefix, "mouth", "\n".join(variant(prefix, "mouth", state, art, mouth == state) for state, art in states.items()), pivots)
    return part(prefix, "head", drawing, pivots)


def rig(pose, prefix=None, eyes=None, mouth="closed", shadow=True):
    prefix = prefix or f"zubek-{pose}"
    eyes = eyes or {"celebrate": "happy", "sleep": "closed"}.get(pose, "open")
    prop, prop_pivot = props(pose)
    pivots = {**PIVOTS, "prop": prop_pivot}
    shadow_svg = part(prefix, "shadow", ellipse(201, 454, 83, 5, INK, stroke="none", opacity="0.12"), pivots,
                      visibility="visible" if shadow else "hidden")
    body = part(prefix, "leg-l", legs(pose, "l"), pivots) + part(prefix, "leg-r", legs(pose, "r"), pivots)
    body += part(prefix, "body", path("M135 245C111 271 112 320 124 353 133 381 164 393 207 391 249 393 280 375 285 346 292 308 282 268 261 248Z", SUN), pivots)
    body += head(prefix, pose, pivots, eyes, mouth)
    body += part(prefix, "accessory", path("M161 285Q200 303 242 283L246 303Q202 326 157 305Z", RED) + path("M203 292 218 308 203 324 188 308Z", WHITE), pivots)
    body += part(prefix, "prop", prop, pivots)
    body += part(prefix, "arm-l", arm(pose, "l"), pivots) + part(prefix, "arm-r", arm(pose, "r"), pivots)
    body = f'<g id="{prefix}-stance" data-rig="stance">\n{body}\n</g>'
    body = f'<g id="{prefix}-character" data-rig="character" data-pivot="200 448">\n{body}\n</g>'
    alt = POSES.get(pose, ("Żubek front view.", []))[0]
    return (f'<svg xmlns="http://www.w3.org/2000/svg" id="{prefix}" viewBox="0 0 400 480" role="img" aria-label="{alt}" data-ground="448" data-default-eyes="{eyes}" data-default-mouth="{mouth}" fill="none" stroke="{INK}" stroke-width="8" stroke-linecap="round" stroke-linejoin="round">\n{shadow_svg}\n{body}\n</svg>\n', pivots)


# A compact monoline annotation alphabet. Labels are paths, never SVG text or
# foreignObject. Coordinates occupy a 5×7 grid, with a 7-unit advance.
GLYPHS = {
    "A": "M0 7 2.5 0 5 7M1 4.5H4", "B": "M0 7V0H3L5 1V2L3 3.5H0M3 3.5 5 5V6L3 7H0",
    "C": "M5 0H1L0 1V6L1 7H5", "D": "M0 0V7H3L5 5V2L3 0Z",
    "E": "M5 0H0V7H5M0 3.5H4", "F": "M0 7V0H5M0 3.5H4",
    "G": "M5 1 4 0H1L0 1V6L1 7H5V4H3", "H": "M0 0V7M5 0V7M0 3.5H5",
    "I": "M0 0H5M2.5 0V7M0 7H5", "J": "M0 0H5V6L4 7H1L0 6",
    "K": "M0 0V7M5 0 0 3.5 5 7", "L": "M0 0V7H5",
    "M": "M0 7V0L2.5 3.5 5 0V7", "N": "M0 7V0L5 7V0",
    "O": "M1 0H4L5 1V6L4 7H1L0 6V1Z", "P": "M0 7V0H4L5 1V3L4 4H0",
    "Q": "M1 0H4L5 1V6L4 7H1L0 6V1ZM3 5 6 8", "R": "M0 7V0H4L5 1V3L4 4H0M2 4 5 7",
    "S": "M5 0H1L0 1V3L5 4V6L4 7H0", "T": "M0 0H5M2.5 0V7",
    "U": "M0 0V6L1 7H4L5 6V0", "V": "M0 0 2.5 7 5 0",
    "W": "M0 0 1 7 2.5 4 4 7 5 0", "X": "M0 0 5 7M5 0 0 7",
    "Y": "M0 0 2.5 3.5 5 0M2.5 3.5V7", "Z": "M0 0H5L0 7H5",
    "0": "M1 0H4L5 1V6L4 7H1L0 6V1ZM1 6 4 1", "1": "M1 1 3 0V7M0 7H5",
    "2": "M0 1 1 0H4L5 1V3L0 7H5", "3": "M0 0H4L5 1V2L3 3.5 5 5V6L4 7H0M2 3.5H3",
    "4": "M4 7V0L0 5H5", "5": "M5 0H0V3H4L5 4V6L4 7H0",
    "6": "M5 0H1L0 1V6L1 7H4L5 6V4L4 3H0", "7": "M0 0H5L1 7",
    "8": "M1 0H4L5 1V2L4 3.5 5 5V6L4 7H1L0 6V5L1 3.5 0 2V1ZM1 3.5H4",
    "9": "M5 4H1L0 3V1L1 0H4L5 1V6L4 7H0", "-": "M0 3.5H5",
    "/": "M0 7 5 0", ":": "M2.5 2V2.2M2.5 5V5.2", ".": "M2.5 7V7.2",
}


def label(text, x, y, scale=2):
    shapes = []
    for i, letter in enumerate(text.upper()):
        if letter == " ":
            continue
        shapes.append(path(GLYPHS[letter], transform=f"translate({i*7} 0)"))
    return f'<g aria-label="{text}" transform="translate({x} {y}) scale({scale})" stroke="{INK}" stroke-width="0.8" fill="none" stroke-linecap="round" stroke-linejoin="round">{"".join(shapes)}</g>'


def sheets():
    model, _ = rig("model", shadow=True)
    model = model.replace('viewBox="0 0 400 480"', 'x="300" y="130" width="400" height="480" viewBox="0 0 400 480"', 1)
    annotations = label("ZUBEK", 36, 30, 4) + ellipse(46, 19, 2, 2, INK, stroke="none")
    annotations += label("FRONT VIEW / 8 UNIT CONTOURS", 36, 80)
    annotations += '<rect x="300" y="130" width="400" height="480" stroke="#1E2132" stroke-width="2" stroke-dasharray="6 8"/>'
    annotations += path("M260 578H740M270 200V578M260 200H280M260 578H280", stroke=INK, stroke_width="2")
    annotations += label("378", 214, 380) + label("GROUND 448", 714, 581)
    callouts = [
        ("HEAD", 38, 170, 420, 254), ("EYE-L", 38, 232, 460, 300),
        ("LID-L", 38, 274, 460, 304), ("ARM-L", 38, 354, 439, 393),
        ("BODY", 38, 432, 450, 465), ("LEG-L", 38, 551, 460, 545),
        ("SHADOW", 38, 639, 501, 584),
        ("EYE-R", 768, 232, 540, 300), ("LID-R", 768, 274, 540, 304),
        ("MOUTH", 768, 324, 500, 376), ("ACCESSORY", 768, 396, 503, 438),
        ("ARM-R", 768, 465, 569, 406), ("LEG-R", 768, 551, 548, 545),
        ("PROP", 768, 639, 500, 465),
    ]
    for text, x, y, tx, ty in callouts:
        annotations += label(text, x, y)
        edge = x + len(text)*14 + 10 if x < 300 else x - 12
        elbow = 287 if x < 300 else 713
        annotations += path(f"M{edge} {y+7}H{elbow}L{tx} {ty}", stroke=INK, stroke_width="2")
        annotations += ellipse(tx, ty, 3, 3, RED, stroke="none")
    annotations += label("VIEWBOX 400 X 480 / FIXED ANCHOR 200 448", 36, 697)
    annotations += label("LIDS AND UNUSED PROP ARE HIDDEN IN THE REST RIG", 36, 731, 1.65)
    (HERE / "model-sheet.svg").write_text(f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 770" role="img" aria-label="Żubek front model, proportions, parts and ground line" fill="none">{model}{annotations}</svg>\n')
    cells = []
    for i, (name, pose, eye_state, mouth_state) in enumerate([
        ("NEUTRAL", "hello", "open", "closed"), ("HAPPY", "celebrate", "happy", "closed"),
        ("OPEN-S", "speak", "open", "open-s"), ("OPEN-L", "speak", "open", "open-l"),
        ("KIND OOPS", "oops", "open", "closed"), ("DOZING", "sleep", "closed", "closed"),
    ]):
        art = (f'<svg x="{(i%3)*400}" y="{(i//3)*310+35}" width="400" height="265" viewBox="70 56 260 230" '
               f'fill="none" stroke="{INK}" stroke-width="8" stroke-linecap="round" stroke-linejoin="round">' +
               head(f"zubek-expression-{i}", pose, PIVOTS, eye_state, mouth_state) + '</svg>')
        cells.append(art + label(name, (i%3)*400+30, (i//3)*310+13))
    (HERE / "expressions.svg").write_text('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 620" role="img" aria-label="Żubek neutral, happy, small and large talking, kind oops, and dozing expressions" fill="none">'+"\n".join(cells)+'</svg>\n')


PAGE_STYLE = """
@font-face{font-family:Fredoka;src:url('../logo-concepts/fonts/fredoka-latin.woff2') format('woff2');font-weight:300 700;font-display:swap}
@font-face{font-family:Nunito;src:url('../logo-concepts/fonts/nunito-latin.woff2') format('woff2');font-weight:200 1000;font-display:swap}
*{box-sizing:border-box}body{margin:0;background:#F6F7FA;color:#1E2132;font-family:Nunito,sans-serif}main{max-width:1500px;margin:auto;padding:32px 24px 60px}h1,h2,h3{font-family:Fredoka,sans-serif;font-weight:600}h1{font-size:38px;line-height:1.15;margin:0 0 16px}h2{font-size:24px;margin:0}h3{font-size:17px;margin:0}p{line-height:1.6}header{max-width:900px;margin-bottom:28px}.grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:20px}.pose-card,.panel{background:#FFFFFF;border:2px solid #1E2132;border-bottom-width:4px;border-radius:20px;overflow:hidden}.pose-heading{padding:20px}.pose-heading p{font-size:14px;margin-bottom:0}.sample{padding:18px 12px;border-top:2px solid #1E2132}.paper{background:#FFFFFF}.canvas{background:#F6F7FA}.crimson{background:#D91F3B;color:#FFFFFF}.sample img{display:block}.hero-size{margin:12px auto;text-align:center;width:320px}.hero-size img{width:320px;height:384px}.mini-sizes{display:flex;align-items:end;justify-content:space-around;height:228px;gap:6px}.size{text-align:center;font-size:12px;font-weight:800}.size img{margin:0 auto 8px}.stage{display:flex;align-items:center;justify-content:center;min-height:500px;border:2px solid #1E2132;border-radius:20px}.stage>svg{display:block;width:320px;height:384px;overflow:visible}.controls{display:flex;flex-wrap:wrap;gap:10px;margin:18px 0}button,select{font:800 14px Nunito,sans-serif;color:#1E2132;border:2px solid #1E2132;border-bottom-width:4px;border-radius:12px;padding:10px 14px;background:#FFFFFF}button{cursor:pointer}button:active{transform:translateY(2px);border-bottom-width:2px}button:disabled,select:disabled{opacity:.5;cursor:default}button:focus-visible,select:focus-visible{outline:3px solid #2F5BEA;outline-offset:3px}.panel{padding:24px}.demo-grid{display:grid;grid-template-columns:1fr 1fr;gap:24px}code{font-size:13px;overflow-wrap:anywhere}.contract{font-size:14px}.contract li{margin:10px 0;line-height:1.5}.status{min-height:48px}.note{font-size:13px}a{color:#A3142B}.anchor-dot{display:none}.show-pivots .anchor-dot{display:inline}.no-motion{font-weight:800}@media(max-width:1150px){.grid{grid-template-columns:repeat(2,minmax(0,1fr))}}@media(max-width:780px){.grid,.demo-grid{grid-template-columns:1fr}main{padding:24px 12px}.pose-card{max-width:480px;width:100%;margin:auto}.panel{padding:18px}.stage{min-height:450px}}@media(prefers-reduced-motion:reduce){button:active{transform:none}}
"""


def html_start(title):
    return f'<!doctype html>\n<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>{title}</title><style>{PAGE_STYLE}</style></head><body><main>\n'


def pages(artworks):
    rows = [html_start("Żubek — all twelve poses"), '<header><h1>One study buddy, twelve moments.</h1><p>Żubek’s shared vector rig: fixed 400 × 480 canvas, y=448 ground reference, 8-unit ink contours. All widths below are native display sizes, with identical art on white, canvas and crimson.</p><p><a href="rig-demo.html">Try the animation rig</a> · <a href="model-sheet.svg">Model sheet</a> · <a href="expressions.svg">Expressions</a></p></header><div class="grid">']
    for pose, (alt, placements) in POSES.items():
        rows.append(f'<article class="pose-card" id="pose-{pose}"><div class="pose-heading"><h2>{pose.title()}</h2><p>{", ".join(placements)}</p></div>')
        for theme, title in [("paper", "White"), ("canvas", "Canvas #F6F7FA"), ("crimson", "Crimson #D91F3B")]:
            rows.append(f'<section class="sample {theme}"><h3>{title}</h3><div class="size hero-size"><img src="../../public/mascot/zubek-{pose}.svg" alt="{alt}" width="320" height="384">320px</div><div class="mini-sizes">')
            for size in [48, 96, 160]:
                rows.append(f'<div class="size"><img src="../../public/mascot/zubek-{pose}.svg" alt="" width="{size}" height="{round(size*1.2)}">{size}px</div>')
            rows.append('</div></section>')
        rows.append('</article>')
    rows.append('</div><p class="note">The celebration pose is intentionally airborne; its landing anchor and canvas match every other pose. Sleep defaults to closed lids and celebration to happy eyes. All other poses start with open eyes; every mouth starts closed.</p></main></body></html>')
    (HERE / "poses.html").write_text("\n".join(rows))
    demo = [html_start("Żubek — offline animation rig"), '<header><h1>Try Żubek’s puppet rig.</h1><p>Plain Web Animations API, local SVG and fonts. No packages, network requests, GSAP or site integration. The buttons exercise the declared part pivots and expression states.</p><p><a href="poses.html">All twelve poses</a> · <a href="model-sheet.svg">Part names and proportions</a></p></header><div class="demo-grid"><section class="panel"><label for="pose">Pose </label><select id="pose">']
    demo.extend(f'<option value="{pose}">{pose.title()}</option>' for pose in POSES)
    demo.append('''</select><div class="controls" aria-label="Preview background"><button type="button" data-background="paper">White</button><button type="button" data-background="canvas">Canvas</button><button type="button" data-background="crimson">Crimson</button></div><div id="stage" class="stage canvas"></div><p id="status" class="status" role="status" aria-live="polite">Ready.</p><div class="controls" aria-label="Rig actions"><button type="button" data-action="blink">Blink</button><button type="button" data-action="talk">Talk</button><button type="button" data-action="wave">Wave</button><button type="button" data-action="tilt">Tilt head</button><button type="button" data-action="hop">Hop</button><button type="button" data-action="happy">Happy eyes</button><button type="button" data-action="reset">Reset</button></div><p class="note">Reduced motion is respected. With that setting enabled, expression swaps remain available; wave, tilt and hop stay still. There is no automatic or repeating idle motion.</p></section><section class="panel contract"><h2>Rig contract</h2><ul><li>Each rotating part declares <code>data-pivot="x y"</code> in SVG user units. Core pivots are identical across all poses.</li><li><code>data-rig="character"</code> contains the complete puppet; the shadow is its sibling. Hop this wrapper, keeping the shadow on the ground.</li><li><code>data-part="head"</code> owns both eyes, both lids, and the mouth. Tilt it to move the whole face together.</li><li>Eyes expose <code>data-state="open|happy"</code>; lids have their own groups. Change visibility, without scaling to zero.</li><li>The mouth exposes exactly one visible <code>closed</code>, <code>open-s</code> or <code>open-l</code> group at a time. Timing here is illustrative, not audio lip-sync.</li><li>The prop pivot follows the item’s grip or board anchor. The manifest records its per-pose value.</li></ul><h3>Current part pivots</h3><pre id="pivots"></pre><p class="note">Reset restores this pose’s own defaults. This is an art/rig demonstration; Claude will add product animation and audio timing later.</p></section></div>''')
    for pose, artwork in artworks.items():
        demo.append(f'<template id="template-{pose}">{artwork}</template>')
    demo.append('<script>\n'+(HERE / "rig-demo.js").read_text()+'\n</script></main></body></html>')
    (HERE / "rig-demo.html").write_text("\n".join(demo))


def main():
    OUT.mkdir(parents=True, exist_ok=True)
    manifest = {
        "schemaVersion": 1, "id": "zubek", "name": "Żubek", "pronunciation": "ZHOO-bek",
        "character": "A patient, friendly bison calf", "viewBox": "0 0 400 480",
        "groundLine": 448, "landingAnchor": [200, 448], "outlineWidth": 8,
        "sideConvention": "l and r refer to the viewer's left and right",
        "motionSelector": '[data-rig="character"]', "shadowOutsideMotion": True,
        "eyeStates": ["open", "happy", "closed"], "mouthStates": ["closed", "open-s", "open-l"],
        "palette": [INK, WHITE, RED, "#A3142B", SUN, BLUE, GREEN, PINK], "poses": {},
    }
    artworks = {}
    for pose, (alt, placements) in POSES.items():
        artwork, pivots = rig(pose)
        target = OUT / f"zubek-{pose}.svg"
        target.write_text(artwork)
        root = ET.fromstring(artwork)
        names = [node.attrib["data-part"] for node in root.iter() if "data-part" in node.attrib]
        manifest["poses"][pose] = {
            "file": f"/mascot/{target.name}", "alt": alt, "parts": names, "pivots": pivots,
            "defaultEyes": root.attrib["data-default-eyes"], "defaultMouth": "closed",
            "stanceOffset": [0, 0],
            "suggestedPlacements": placements,
        }
        artworks[pose] = artwork
        assert target.stat().st_size <= 15000, target
    (ROOT / "src/data/mascot.json").write_text(json.dumps(manifest, ensure_ascii=False, indent=2)+"\n")
    sheets()
    pages(artworks)
    print("Generated twelve Żubek puppets, a manifest, two SVG sheets and two offline HTML pages.")


if __name__ == "__main__":
    main()
