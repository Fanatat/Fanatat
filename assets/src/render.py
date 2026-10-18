#!/usr/bin/env python3
"""Сборка анимаций профиля: HTML-сцена (canvas) → кадры PNG → GIF и статичный PNG.

    python3 assets/src/render.py cover            # обложка → assets/cover.gif + assets/cover.png
    python3 assets/src/render.py all              # все сцены
    python3 assets/src/render.py cover --frame 7.8  # один кадр для проверки → кадр в каталоге сборки

Нужны Python 3 с пакетом playwright (Chromium: `python3 -m playwright install chromium`) и ffmpeg.
Сцена задаёт window.SCENE = {w, h, duration, fps, still} и window.renderAt(t), см. common.js.
Кадры пишутся во временный каталог (--work, по умолчанию системный temp) и удаляются после сборки.
"""
from __future__ import annotations

import argparse
import shutil
import subprocess
import tempfile
from pathlib import Path

from playwright.sync_api import sync_playwright

SRC = Path(__file__).resolve().parent
OUT = SRC.parent
SCENES = {
    "cover": "cover",
    "linda": "demo-linda",
    "factory": "demo-content-factory",
}


def render(name: str, work: Path, frame: float | None = None, colors: int = 128) -> None:
    out_name = SCENES[name]
    frames = work / out_name
    shutil.rmtree(frames, ignore_errors=True)
    frames.mkdir(parents=True)
    with sync_playwright() as p:
        browser = p.chromium.launch()
        page = browser.new_page(device_scale_factor=1)
        page.goto((SRC / f"{out_name}.html").as_uri())
        page.wait_for_function("window.ready !== undefined")
        page.evaluate("window.ready")
        scene = page.evaluate("window.SCENE")
        page.set_viewport_size({"width": scene["w"], "height": scene["h"]})
        canvas = page.locator("#c")

        def shot(t: float, path: Path) -> None:
            page.evaluate(f"window.renderAt({t})")
            canvas.screenshot(path=str(path))

        if frame is not None:
            path = work / f"{out_name}_{frame:.2f}.png"
            shot(frame, path)
            print(path)
            browser.close()
            return
        fps, dur = scene["fps"], scene["duration"]
        count = round(fps * dur)
        for i in range(count):
            shot(i / fps, frames / f"f{i:04d}.png")
        shot(scene["still"], OUT / f"{out_name}.png")
        browser.close()

    gif = OUT / f"{out_name}.gif"
    palette = (f"split[a][b];[a]palettegen=max_colors={colors}:stats_mode=full:reserve_transparent=0[p];"
               "[b][p]paletteuse=dither=none:diff_mode=rectangle")
    subprocess.run(["ffmpeg", "-v", "error", "-y", "-framerate", str(fps), "-i", str(frames / "f%04d.png"),
                    "-filter_complex", palette, "-loop", "0", str(gif)], check=True)
    shutil.rmtree(frames, ignore_errors=True)
    print(f"{gif.relative_to(OUT.parent)}: {gif.stat().st_size / 1024:.0f} KB, {count} кадров, {fps} fps")


def main() -> None:
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("scene", choices=[*SCENES, "all"])
    ap.add_argument("--frame", type=float, help="снять один кадр в момент t (с)")
    ap.add_argument("--colors", type=int, default=128, help="цветов в палитре GIF")
    ap.add_argument("--work", type=Path, help="каталог для кадров (по умолчанию временный)")
    args = ap.parse_args()
    work = args.work or Path(tempfile.mkdtemp(prefix="profile-frames-"))
    for name in (SCENES if args.scene == "all" else [args.scene]):
        render(name, work, args.frame, args.colors)


if __name__ == "__main__":
    main()
