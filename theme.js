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
}