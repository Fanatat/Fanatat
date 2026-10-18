<p align="right"><a href="README.md">Русский</a></p>

<img src="assets/cover.gif" width="100%" alt="Valery — automation, AI agents, working products. Diagram: task → planning → two agents → verification → launch → monitoring">

I build and run automation powered by AI agents — from job matching to short-video production. I own the whole cycle: defining the task, developing with coding agents, verification, launch and operations.

**[Portfolio](https://vanatat.ru/en/) · [Telegram @fanatat](https://t.me/fanatat)**

Open to remote roles, project work and part-time engagements.

## Projects

### Linda — job matching

People spend time only on vacancies that actually fit them. Every 15 minutes Linda collects new postings from hh.ru and Habr Career; profile rules and two models filter them and score each from 0 to 100. An application goes out only after a human confirms it.

Running since September 2026. As of October 18: about 12,000 vacancies collected, fewer than 3% of them shown to a person, 77 applications sent after confirmation. When a job board changes its markup, an AI agent repairs the parser in a sandbox, and the fix is accepted only if the tests pass.

<img src="assets/demo-linda.gif" width="100%" alt="How Linda works: new vacancy → scoring (profile rules, model pre-screen, score 82) → Telegram card with Apply, Letter and Not for me buttons">

<sub>Workflow diagram on a test vacancy; the card follows the bot's real format (labels are in Russian).</sub>

Python · SQLite · Telegram Bot API · Claude and Gemini · Playwright

### Content Factory — short videos

A topic turns into a finished vertical video: script, fact-check, footage, synthetic or recorded voice-over, subtitles and editing. Every video moves on only after it is approved in Telegram.

Running since September 24, 2026. As of October 16: 27 game-lore videos and 28 football videos approved. Publishing is still manual or done with a button that asks for confirmation.

<img src="assets/demo-content-factory.gif" width="100%" alt="How the Content Factory works: topic → materials (script, fact-check, footage, voice, subtitles, editing) → vertical video preview → approval in Telegram with the Yes button">

<sub>Workflow diagram; the topic is an example, real video frames are not shown.</sub>

Python · ffmpeg · Whisper · GPU speech synthesis · Telegram Bot API

### Automation and knowledge base — n8n, RAG, integrations

Routine reports and checks run on a schedule and arrive in Telegram. Since October 2026, 10 n8n workflows run on my own server: a weekly report on VK games, a morning server health summary, an error watchdog, statistics imports and website leads.

In reports, code computes the numbers and the model writes the conclusion, checked against those numbers. A Qdrant knowledge base answers questions from my own documents in n8n chat and a Telegram bot; it launched in October 2026, and answer quality is checked by a workflow with control questions.

n8n · Docker · Qdrant · LLM APIs · Telegram

## Browser games

Game development experience: nine games in three months across several engines. Four browser games are live in the VK catalog, with ads, in-app purchases, cloud saves and leaderboards. The games are in Russian.

- **Slovokhod** (word search) — [play](https://play.vanatat.ru/slovokhod/) · [VK](https://vk.com/app54674073)
- **Cat & Nonograms** — [play](https://play.vanatat.ru/catnonogram/) · [VK](https://vk.com/app54676906)
- **Sort: Color & Shape** — [play](https://play.vanatat.ru/color-sort/) · [VK](https://vk.com/app54683949)
- **Two Fortresses** (lane battler) — [play](https://play.vanatat.ru/lane-battle/) · [VK](https://vk.com/app54759696)

## Stack

- **Agents and models:** Claude Code, Claude, Gemini, RAG on Qdrant
- **Automation:** Python, n8n, Telegram Bot API, Playwright
- **Operations:** Linux, systemd, cron, Docker, PostgreSQL, SQLite, backups
- **Products:** TypeScript / Next.js, JavaScript / Three.js, ffmpeg

## How I work

I develop with AI coding agents. I define tasks and acceptance criteria, verify results with tests and live runs, and take responsibility for release and operations: schedules, backups, monitoring. In my systems, important actions are confirmed by a human.

Most of these systems handle personal data and keys, so the code is private; I'm happy to walk through the architecture on a call.

## Contact

Telegram [@fanatat](https://t.me/fanatat) · portfolio [vanatat.ru/en](https://vanatat.ru/en/)
