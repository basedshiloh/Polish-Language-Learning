"""Validate the production SVG handoff contract, not application behavior."""
from pathlib import Path
from html.parser import HTMLParser
import json
import xml.etree.ElementTree as ET

ROOT = Path(__file__).resolve().parents[2]
NS = {"s": "http://www.w3.org/2000/svg"}
EXPECTED = {"hello", "speak", "teach", "read", "think", "celebrate", "oops", "confused", "sleep", "cards", "trophy", "travel"}
PARTS = {"shadow", "body", "head", "eye-l", "eye-r", "lid-l", "lid-r", "mouth", "arm-l", "arm-r", "leg-l", "leg-r", "accessory", "prop"}
PALETTE = {"#D91F3B", "#A3142B", "#1E2132", "#FFFFFF", "#FFC21A", "#15803D", "#2F5BEA", "#D6338A", "#F2711C", "#7C4DDB", "#0E9E9A", "none"}


def main():
    manifest = json.loads((ROOT / "src/data/mascot.json").read_text())
    assert set(manifest["poses"]) == EXPECTED
    assert manifest["viewBox"] == "0 0 400 480" and manifest["groundLine"] == 448
    assert manifest["landingAnchor"] == [200, 448] and manifest["outlineWidth"] == 8
    ids = set()
    core_pivots = None
    sizes = []
    for pose, entry in manifest["poses"].items():
        file = ROOT / "public" / entry["file"].lstrip("/")
        sizes.append(file.stat().st_size)
        assert file.stat().st_size <= 15000, file
        root = ET.parse(file).getroot()
        assert root.attrib["viewBox"] == manifest["viewBox"]
        assert root.attrib["data-ground"] == "448"
        assert root.attrib["role"] == "img" and root.attrib["aria-label"] == entry["alt"]
        assert root.attrib["stroke"] == "#1E2132" and root.attrib["stroke-width"] == "8"
        for node in root.iter():
            assert node.tag.split("}")[-1] in {"svg", "g", "path", "ellipse", "circle", "rect"}, (pose, node.tag)
            assert not any(k in node.attrib for k in ["href", "style", "filter", "clip-path", "mask"])
            if "id" in node.attrib:
                id_ = node.attrib["id"]
                assert id_ not in ids, id_
                assert id_ == f"zubek-{pose}" or id_.startswith(f"zubek-{pose}-")
                ids.add(id_)
            for attr in ["fill", "stroke"]:
                if attr in node.attrib:
                    assert node.attrib[attr] in PALETTE, (pose, attr)
            if "stroke" in node.attrib:
                assert node.attrib["stroke"] in {"#1E2132", "none"}
            assert node.attrib.get("stroke-width", "8") == "8"
        parts = {n.attrib["data-part"]: n for n in root.iter() if "data-part" in n.attrib}
        assert len([n for n in root.iter() if "data-part" in n.attrib]) == len(PARTS)
        assert set(parts) == set(entry["parts"]) == set(entry["pivots"]) == PARTS
        for name, node in parts.items():
            assert [float(v) for v in node.attrib["data-pivot"].split()] == entry["pivots"][name]
        pivots = {k: v for k, v in entry["pivots"].items() if k != "prop"}
        if core_pivots is None:
            core_pivots = pivots
        assert core_pivots == pivots, pose
        head_nodes = set(parts["head"].iter())
        assert all(parts[name] in head_nodes for name in ["eye-l", "eye-r", "lid-l", "lid-r", "mouth"])
        motion = root.find('.//s:g[@data-rig="character"]', NS)
        assert motion is not None and motion.attrib["data-pivot"] == "200 448"
        assert parts["shadow"] not in set(motion.iter())
        assert all(parts[n] in set(motion.iter()) for n in PARTS - {"shadow"})
        stance = root.find('.//s:g[@data-rig="stance"]', NS)
        assert entry["stanceOffset"] == [0, 0]
        assert "transform" not in stance.attrib
        mouth_states = {n.attrib["data-state"]: n for n in parts["mouth"]}
        assert set(mouth_states) == {"closed", "open-s", "open-l"}
        assert [s for s, n in mouth_states.items() if n.attrib["visibility"] == "visible"] == ["closed"]
        assert root.attrib["data-default-mouth"] == entry["defaultMouth"] == "closed"
        expected_eyes = {"celebrate": "happy", "sleep": "closed"}.get(pose, "open")
        assert root.attrib["data-default-eyes"] == entry["defaultEyes"] == expected_eyes
        for side in ["l", "r"]:
            states = {n.attrib["data-state"]: n for n in parts[f"eye-{side}"]}
            assert set(states) == {"open", "happy"}
            for state, node in states.items():
                assert (node.attrib["visibility"] == "visible") == (state == expected_eyes)
            assert (parts[f"lid-{side}"].attrib["visibility"] == "visible") == (expected_eyes == "closed")
    for name in ["model-sheet.svg", "expressions.svg"]:
        root = ET.parse(ROOT / "design/mascot" / name).getroot()
        assert root.attrib["role"] == "img" and root.attrib["aria-label"]
        for node in root.iter():
            assert node.tag.split("}")[-1] not in {"text", "image", "filter", "linearGradient", "radialGradient", "foreignObject"}
            if "id" in node.attrib:
                assert node.attrib["id"] not in ids
                ids.add(node.attrib["id"])
    for filename in ["poses.html", "rig-demo.html"]:
        file = ROOT / "design/mascot" / filename
        parser = LocalReferences(file.parent)
        parser.feed(file.read_text())
        assert not parser.missing, parser.missing
        assert not parser.remote, parser.remote
    print(f"12 puppets: {min(sizes)}–{max(sizes)} bytes each; all 14 parts and stable core pivots verified.")
    print(f"{len(ids)} unique IDs across poses and sheets; eye/mouth defaults, hierarchy, palette and local resources verified.")


class LocalReferences(HTMLParser):
    def __init__(self, directory):
        super().__init__()
        self.directory, self.missing, self.remote = directory, [], []

    def handle_starttag(self, tag, attrs):
        for name, value in attrs:
            if name in {"src", "href"}:
                if value.startswith(("https:", "http:")):
                    self.remote.append(value)
                elif not value.startswith("#") and not (self.directory / value).exists():
                    self.missing.append(value)


if __name__ == "__main__":
    main()
