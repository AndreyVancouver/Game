# GameSearch — лендинг-каталог игр Valve

Статический сайт (HTML/CSS/JS) для ДЗ №1: каталог игр от Valve с описаниями, навигацией, формой заявки в Google Таблицу и SEO/GEO-разметкой.

## Что реализовано
- **Навигация:** фиксированное меню, якорные переходы между блоками, мобильное меню, понятные кнопки CTA.
- **Кнопки:** все кнопки/ссылки кликабельны (навигация, CTA, ссылки на Steam, отправка формы).
- **Форма заявки:** поля имени, email, темы и сообщения; валидация; отправка в Google Таблицу через Google Apps Script.
- **SEO/GEO:** `title`, `meta description`, keywords, canonical, Open Graph, JSON-LD (`WebSite`, `ItemList`), семантическая разметка и FAQ-блок с явными ответами для поисковиков и ИИ.
- **Каталог:** список игр Valve (Half-Life 2, Portal 2, Counter-Strike 2, Dota 2, Team Fortress 2, Left 4 Dead 2) с описаниями.

## 1) Подключение формы к Google Таблице
1. Создайте Google Таблицу (например, `GameSearch Заявки`).
2. В таблице откройте **Расширения → Apps Script**.
3. Замените содержимое редактора на код ниже и сохраните:

```javascript
function doPost(e) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheets()[0];
  var data = {};
  try {
    data = JSON.parse(e.postData.contents);
  } catch (err) {
    data = e.parameter || {};
  }

  if (sheet.getLastRow() === 0) {
    sheet.appendRow(['Дата', 'Имя', 'Email', 'Интерес', 'Сообщение', 'Страница']);
  }

  sheet.appendRow([
    data.submittedAt || new Date(),
    data.name || '',
    data.email || '',
    data.interest || '',
    data.message || '',
    data.page || ''
  ]);

  return ContentService
    .createTextOutput(JSON.stringify({ ok: true }))
    .setMimeType(ContentService.MimeType.JSON);
}
```

4. Нажмите **Начать развёртывание → Новое развёртывание**.
5. Тип: **Веб-приложение**.
   - Выполнять как: **Я**
   - У кого есть доступ: **Все**
6. Скопируйте URL веб-приложения и вставьте его в `script.js` в константу:
   `const GOOGLE_SCRIPT_URL = '...';`
7. При первом развёртывании выдайте Apps Script разрешение на доступ к таблице.

> После изменения скрипта создавайте новое развёртывание (или обновляйте версию), чтобы URL получил актуальный код.

## 2) Публикация на GitHub Pages (ссылка в интернете)
1. Создайте репозиторий на GitHub, например `gamesearch`.
2. Загрузите в репозиторий файлы: `index.html`, `styles.css`, `script.js`, `README.md`.
3. Откройте **Settings → Pages**.
4. В **Build and deployment** выберите:
   - Source: **Deploy from a branch**
   - Branch: **main** / папка **/ (root)**
5. Сохраните. Через 1–2 минуты сайт будет доступен по ссылке:
   `https://<ваш-username>.github.io/gamesearch/`
6. Замените `USERNAME` в `index.html` (canonical/og:url/JSON-LD) на ваш GitHub username.

## 3) Локальный просмотр
Откройте `index.html` в браузере двойным кликом. Для корректной работы относительных путей этого достаточно (сборка не требуется).

## Структура
- `index.html` — разметка, контент, SEO/GEO
- `styles.css` — стили и адаптивность
- `script.js` — меню и отправка формы
- `README.md` — инструкция по подключению таблицы и деплою
