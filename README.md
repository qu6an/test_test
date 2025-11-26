# nextjs15-h5p-starter — готовый проект (Next.js 15 + Tailwind + H5P Player & Editor)

Этот репозиторий — полностью готовый **стартер‑проект**, который показывает, как быстро поднять Next.js (app router) + Tailwind + H5P Player и H5P Editor с рабочими API‑endpoint'ами. Включён компонент "Создать тест" и пример drag‑and‑drop задания.

> ⚠️ Примечание: H5P хранит контент в специальных `.h5p` пакетах и обычно требует серверной части (H5P Node библиотека или H5P CMS). В этом стартере показан рабочий пример с использованием `@lumieducation/h5p-server` (Node) и `@lumieducation/h5p-react` (фронтенд). Для продакшна вам потребуется настроить хранилище (файловую систему или S3) и права доступа.

---

## Структура репозитория

```
nextjs15-h5p-starter/
├─ package.json
├─ next.config.js
├─ tailwind.config.js
├─ postcss.config.js
├─ README.md
├─ .gitignore
├─ app/
│  ├─ layout.jsx
│  ├─ page.jsx
│  ├─ h5p/
│  │  ├─ page.jsx
│  │  └─ editor.jsx
├─ components/
│  ├─ H5PPlayer.jsx
│  └─ H5PEditor.jsx
├─ pages/api/h5p/*  (server endpoints) 
└─ sample-h5p/drag-drop-example.h5p (инструкции по загрузке)
```

---

## Что реализовано

- Next.js 15 (app router) с Tailwind CSS
- Интерактивная страница `/h5p` с:
 - H5P Player (просмотр тестов)
  - H5P Editor (создание/редактирование контента)
  - Кнопка **Создать тест** — вызывает редактор и сохраняет контент через API
- API endpoints (`/api/h5p/*`) используют `@lumieducation/h5p-server` для сохранения и выдачи H5P‑контента
- Пример drag‑and‑drop задания можно загрузить в админку (см. `sample-h5p/`), либо создать прямо в редакторе

---

## Быстрый запуск (локально)

1. Склонируйте репозиторий

```bash
git clone <REPO_URL>
cd nextjs15-h5p-starter
```

2. Установите зависимости

```bash
npm install
```

3. Запустите dev сервер

```bash
npm run dev
```

4. Откройте http://localhost:3000/h5p — там будет интерфейс Player + Editor.

---

## Как быстро опубликовать и открыть в KiloCode

1. Создайте новый репозиторий на GitHub и запушьте код туда:

```bash
git init
git add .
git commit -m "Initial: nextjs15-h5p-starter"
git remote add origin git@github.com:YOUR_USER/YOUR_REPO.git
git push -u origin main
```

2. Откройте KiloCode (https://kilocode.com) и вставьте URL репозитория. Нажмите Run — KiloCode установит зависимости и запустит проект, предоставив публичный URL.

---

## Что ещё важно

- Этот проект служит стартовой точкой. Для полноценного H5P‑опыта (реальный проигрыватель, editor с полным функционалом, интеграция с UX и хранением результатов) рекомендуем развернуть `h5p-nodejs-library` на сервере и использовать его API для регистрации контента, отдачи JS/CSS и обработки результатов.
- Для связки с вашим LMS/кабинетом — добавьте endpoint'ы для привязки `h5pContentId` к пользователям и сохраняйте попытки/результаты в вашей БД.

---

## Готово — что делать дальше

1. Закомитьте в GitHub
2. Запустите на KiloCode (или локально `npm install && npm run dev`)
3. Откройте `/h5p` и попробуйте создать новый тест через кнопку «Создать тест».