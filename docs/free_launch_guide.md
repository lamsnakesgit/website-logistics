# Инструкция: Бесплатный запуск (Vercel + Google Sheets + Telegram)

Если вы хотите запустить сайт **бесплатно** (без оплаты Тильды) и получать заявки в Telegram и Google Таблицы, используйте этот метод.

## 1. Хостинг (Бесплатно)
* **GitHub Pages**: Идеально для статических файлов.
* **Vercel**: Еще проще. Просто перетащите папку с сайтом в их [Dashboard](https://vercel.com/import/general).

---

## 2. Бэкенд для форм (Google Apps Script — Бесплатно)
Мы будем использовать скрипт внутри Google Таблицы как "сервер", который принимает данные и пересылает их в Telegram.

### Шаг A: Подготовка таблицы
1. Создайте новую Google Таблицу.
2. В меню выберите: **Расширения -> Apps Script**.
3. Удалите весь код и вставьте следующий:

```javascript
// НАСТРОЙКИ
const TELEGRAM_TOKEN = 'ВАШ_ТОКЕН_БОТА';
const CHAT_ID = 'ВАШ_CHAT_ID';
const SHEET_NAME = 'Sheet1';

function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAME);
    
    // Запись в таблицу
    sheet.appendRow([new Date(), data.name, data.phone, data.route]);
    
    // Отправка в Telegram
    const message = `🚀 Новая заявка!\n\nИмя: ${data.name}\nТелефон: ${data.phone}\nМаршрут: ${data.route}`;
    UrlFetchApp.fetch(`https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendMessage`, {
      method: 'post',
      contentType: 'application/json',
      payload: JSON.stringify({ chat_id: CHAT_ID, text: message })
    });
    
    return ContentService.createTextOutput(JSON.stringify({status: 'success'})).setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({status: 'error', message: err.toString()})).setMimeType(ContentService.MimeType.JSON);
  }
}
```

4. Нажмите **Начать развертывание (Deploy) -> Новое развертывание**.
5. Тип: **Веб-приложение**.
6. Кто имеет доступ: **Все (Anyone)** — это важно.
7. Скопируйте полученный **URL веб-приложения**.

---

## 3. Обновление кода сайта
Я уже обновил ваш `index.html`, добавив логику отправки на этот URL. Вам нужно только вставить ваш URL в скрипт в конце файла.

---

## 4. Почему это круто?
* **$0 за хостинг**: Vercel/GitHub бесплатны навсегда для таких проектов.
* **$0 за CRM**: Google Таблицы — это ваша база данных.
* **Мгновенно**: Заявки прилетают в Telegram за 1 секунду.
* **Никаких лимитов**: В отличие от бесплатных тарифов Formspree, здесь нет ограничений на количество заявок.
