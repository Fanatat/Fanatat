# Валерий · Автоматизация и ИИ-агенты

Создаю и сопровождаю системы, которые сокращают ручную работу: от отбора вакансий до производства видео. Веду полный цикл — постановка задачи, разработка с ИИ-агентами, проверка, запуск и эксплуатация.

[Портфолио vanatat.ru](https://vanatat.ru/) · [Демо проектов](#проекты) · [Telegram @fanatat](https://t.me/fanatat)

Ищу удалённую работу, в том числе в иностранных компаниях; подходят проектная работа и частичная занятость.

## Проекты

### Линда: ИИ-отбор вакансий
**До человека доходит меньше 3 % вакансий, системой пользуются три человека.**
Каждые 15 минут собирает вакансии с hh.ru и Хабр Карьеры, две модели по очереди отсеивают и оценивают их по профилю, отклик уходит только после подтверждения. Если площадка меняет вёрстку, ИИ сам чинит парсер в песочнице, правка принимается только после тестов.
Python · SQLite · Telegram · LLM · 134 автотеста

### Контент-завод: короткие ролики через Telegram-бота
**Из темы — готовый ролик: сценарий, материалы, голос, субтитры, монтаж, проверка фактов.**
Каждый ролик идёт дальше только после одобрения в Telegram. Работает с сентября 2026 года.
Python · ffmpeg · Telegram Bot API · синтез речи · [описание и демо](https://vanatat.ru/projects/content-factory/)

### Браузерные игры: полный цикл до площадки
**Четыре игры опубликованы в каталоге ВК — в них можно сыграть прямо сейчас.**
SDK площадок (VK Bridge, Yandex Games SDK), реклама, покупки, облачные сохранения, лидерборды, прохождение модерации, свой бэкенд.
JavaScript · Three.js · Docker · PostgreSQL

| Игра | Играть | ВК |
|---|---|---|
| Словоход (филворд) | [открыть](https://play.vanatat.ru/slovokhod/) | [vk.com/app54674073](https://vk.com/app54674073) |
| Кот и японские кроссворды | [открыть](https://play.vanatat.ru/catnonogram/) | [vk.com/app54676906](https://vk.com/app54676906) |
| Сортировка: Цвет и Форма | [открыть](https://play.vanatat.ru/color-sort/) | [vk.com/app54683949](https://vk.com/app54683949) |
| Две крепости | [открыть](https://play.vanatat.ru/lane-battle/) | [vk.com/app54759696](https://vk.com/app54759696) |

### Ещё
- [Штаб из восьми ИИ-агентов](https://vanatat.ru/projects/staff/) и мониторинг сервисов с внешним сторожем.
- [Telegram-боты](https://vanatat.ru/projects/channel-autopilot/): публикации и рассылки по расписанию, один работает больше 500 дней без падений.
- n8n-сценарии и база знаний (RAG на Qdrant); сайт-портфолио на Next.js с CI ([lending2](https://github.com/Fanatat/lending2)).

## Стек

Python · TypeScript / Next.js · JavaScript / Three.js · Claude Code и LLM (Claude, Gemini) · Telegram Bot API · n8n · Qdrant · Playwright · Linux, systemd, cron · Docker · PostgreSQL · SQLite

## Как я работаю

Код пишут ИИ-агенты (Claude Code), а я отвечаю за результат: формулирую задачу и критерий готовности, принимаю работу тестами и живым запуском, выпускаю и сопровождаю — расписания, резервные копии, мониторинг. Числа считает программа, модель только формулирует вывод; важные действия подтверждает человек.

Большинство систем — рабочие, с данными и ключами, поэтому код закрыт. Архитектуру покажу на созвоне.

## English

I build and run AI-agent automation that removes manual work: a job-matching pipeline with self-healing parsers, a short-video pipeline, Telegram bots, monitoring, and browser games (four live on VK). I own the full cycle — task definition, development with coding agents (Claude Code), verification, release and operations. Open to remote work, including international teams; project-based or part-time is fine.

[Portfolio](https://vanatat.ru/en/) · [Telegram @fanatat](https://t.me/fanatat)
