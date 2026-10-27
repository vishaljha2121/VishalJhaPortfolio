"""Resolve tool paths inside this extracted bundle. Does not install anything."""
from pathlib import Path
import shutil

root = Path(__file__).resolve().parent
paths = {}
for marker, name in (("@GLOW@", "glow"), ("@YAZI@", "yazi")):
    path = shutil.which(name)
    if path is None or any(c.isspace() or c in "\\\"'`$" for c in path):
        raise SystemExit("Install " + name + " on PATH at a path without whitespace or shell metacharacters.")
    paths[marker] = path
for source, target in (("kitty/kitty.conf.in", "kitty/kitty.conf"), ("yazi/yazi.toml.in", "yazi/yazi.toml")):
    content = (root / source).read_text()
    for marker, path in paths.items():
        content = content.replace(marker, path)
    destination = root / target
    if destination.exists():
        raise SystemExit(str(destination) + " already exists; review it instead of overwriting.")
    destination.write_text(content)
    print("Prepared", destination.relative_to(root))
