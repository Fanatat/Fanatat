# Исходники анимаций профиля

Обложка и схемы проектов нарисованы кодом: каждая сцена — HTML-страница с canvas, кадры снимает
Chromium через Playwright, GIF собирает ffmpeg. Сторонние генераторы изображений не используются.

| Сцена | Исходник | Результат |
|---|---|---|
| Обложка, цикл 12 с, 20 fps | `cover.html` | `../cover.gif`, `../cover.png` |
| Схема Линды, 9 с, 15 fps | `demo-linda.html` | `../demo-linda.gif`, `../demo-linda.png` |
| Схема контент-завода, 10 с, 15 fps | `demo-content-factory.html` | `../demo-content-factory.gif`, `../demo-content-factory.png` |

Общие цвета, узлы, линии и импульсы — `common.js`. Шрифты Inter и JetBrains Mono лежат в `fonts/`
(лицензия SIL OFL, тексты рядом), поэтому кириллица одинакова на любой машине.

## Как пересобрать

Из корня репозитория:

```bash
python3 -m pip install playwright && python3 -m playwright install chromium   # один раз; нужен и ffmpeg
python3 assets/src/render.py all            # все сцены
python3 assets/src/render.py cover          # только обложка
python3 assets/src/render.py cover --frame 7.8 --work /tmp/frames   # один кадр для проверки
```

Статичный PNG — кадр в момент `SCENE.still` (обложка — 10,2 с, когда весь путь пройден и мониторинг работает).
Первый и последний кадры цикла совпадают: к концу все подсветки плавно гаснут.

## Как менять

- Текст, узлы и тайминги — в начале каждого HTML (`N`, `P`, `ON`, `FADE`).
- Размер GIF регулирует `--colors` (по умолчанию 128) и `fps` в `window.SCENE`. Сейчас обложка ~0,5 МБ,
  каждая схема ~0,5 МБ.
- Схемы проектов подписаны «Схема работы»: это не запись интерфейса. Интерфейс обоих продуктов — Telegram
  с личными переписками, поэтому данные в схемах тестовые.
