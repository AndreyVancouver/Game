(function () {
  // ===== Навигация (мобильное меню) =====
  const toggle = document.querySelector('.nav-toggle');
  const nav = document.getElementById('main-nav');

  if (toggle && nav) {
    toggle.addEventListener('click', function () {
      const open = nav.classList.toggle('open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
      toggle.setAttribute('aria-label', open ? 'Закрыть меню' : 'Открыть меню');
    });

    nav.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        nav.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
        toggle.setAttribute('aria-label', 'Открыть меню');
      });
    });
  }

  // ===== Форма заявки -> Google Таблица (Apps Script Web App) =====
  // 1) Создайте Google Таблицу и Apps Script (см. README.md).
  // 2) Разверните скрипт как веб-приложение и вставьте URL ниже.
  const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbz-N5qfaCW68gtx4FPuYPPDZlv8l1i_A155AGfXutitWvQHO8CskRXq2L_B7tZBgPWZFg/exec';

  const form = document.getElementById('request-form');
  const statusEl = document.getElementById('form-status');
  const submitBtn = document.getElementById('submit-btn');

  function setStatus(message, type) {
    if (!statusEl) return;
    statusEl.textContent = message;
    statusEl.className = 'form-status' + (type ? ' ' + type : '');
  }

  if (form) {
    form.addEventListener('submit', async function (e) {
      e.preventDefault();

      const name = form.name.value.trim();
      const email = form.email.value.trim();
      const interest = form.interest.value.trim();
      const message = form.message.value.trim();

      if (!name || !email || !message) {
        setStatus('Пожалуйста, заполните имя, email и сообщение.', 'error');
        return;
      }
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        setStatus('Укажите корректный email.', 'error');
        return;
      }

      if (!GOOGLE_SCRIPT_URL || GOOGLE_SCRIPT_URL.indexOf('PASTE_YOUR') === 0) {
        setStatus('Форма пока не подключена: добавьте URL Google Apps Script в script.js (см. README.md).', 'error');
        return;
      }

      submitBtn.disabled = true;
      submitBtn.textContent = 'Отправка...';
      setStatus('Отправляем заявку...', '');

      const payload = {
        name: name,
        email: email,
        interest: interest,
        message: message,
        submittedAt: new Date().toISOString(),
        page: window.location.href
      };

      try {
        // mode: 'no-cors' позволяет отправить данные в Apps Script с простого статического сайта.
        // Ответ будет непрозрачным, поэтому считаем отправку успешной при отсутствии сетевой ошибки.
        await fetch(GOOGLE_SCRIPT_URL, {
          method: 'POST',
          mode: 'no-cors',
          headers: { 'Content-Type': 'text/plain;charset=utf-8' },
          body: JSON.stringify(payload)
        });

        form.reset();
        setStatus('Заявка отправлена! Данные сохранены в Google Таблицу.', 'success');
      } catch (err) {
        setStatus('Не удалось отправить заявку. Проверьте подключение и URL веб-приложения.', 'error');
      } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Отправить заявку';
      }
    });
  }
})();
