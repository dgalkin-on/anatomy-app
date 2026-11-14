const themeBtn = document.getElementById('theme-toggle');
if (themeBtn) {
  const currentTheme = localStorage.getItem('theme');
  if (currentTheme === 'dark') {
    document.body.classList.add('dark-theme');
    themeBtn.textContent = '☀️ Светлая тема';
  }
  themeBtn.addEventListener('click', () => {
    document.body.classList.toggle('dark-theme');
    if (document.body.classList.contains('dark-theme')) {
      localStorage.setItem('theme', 'dark');
      themeBtn.textContent = '☀️ Светлая тема';
    } else {
      localStorage.setItem('theme', 'light');
      themeBtn.textContent = '🌙 Тёмная тема';
    }
  });
  // --- ЛОГИКА БУРГЕР-МЕНЮ ---
const burgerBtn = document.getElementById('burger-btn');
const navMenu = document.querySelector('.main-nav');

if (burgerBtn && navMenu) {
  burgerBtn.addEventListener('click', () => {
    navMenu.classList.toggle('open'); // Включаем/выключаем класс
    burgerBtn.classList.toggle('active'); // Анимация крестика
  });

  // Закрываем меню, если кликнули по ссылке
  navMenu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      navMenu.classList.remove('open');
      burgerBtn.classList.remove('active');
    });
  });
}
}