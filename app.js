let allMuscles = [];
let currentMuscle = null;
let currentTab = 'about';

async function init() {
  try {
    const res = await fetch('data/muscles.json'); 
    if (!res.ok) throw new Error('Ошибка загрузки JSON');
    allMuscles = await res.json();
    attachMuscleHandlers();
    attachViewToggle();
  } catch (err) {
    document.getElementById('info-panel').innerHTML = '<p style="color:red">Ошибка данных.</p>';
  }
}

function attachViewToggle() {
  const buttons = document.querySelectorAll('.view-toggle .toggle-btn');
  const frontSvg = document.getElementById('front-view');
  const backSvg = document.getElementById('back-view');
  buttons.forEach(btn => {
    btn.addEventListener('click', () => {
      buttons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      frontSvg.classList.toggle('hidden', btn.dataset.view !== 'front');
      backSvg.classList.toggle('hidden', btn.dataset.view !== 'back');
    });
  });
}

function attachMuscleHandlers() {
  document.querySelectorAll('.muscle').forEach(el => {
    el.addEventListener('click', () => {
      let baseId = el.id;
      if (baseId === 'quads2') baseId = 'quads';
      if (baseId === 'biceps2') baseId = 'biceps';
      if (baseId === 'triceps2') baseId = 'triceps';
      if (baseId === 'shoulders2' || baseId === 'shoulders_back' || baseId === 'shoulders_back2') baseId = 'shoulders';
      if (baseId === 'forearms2') baseId = 'forearms';
      if (baseId === 'glutes2') baseId = 'glutes';
      if (baseId === 'hamstrings2') baseId = 'hamstrings';
      if (baseId.includes('calves')) baseId = 'calves';

      currentMuscle = allMuscles.find(m => m.id === baseId);
      currentTab = 'about';
      showSkeleton();
      setTimeout(() => { renderPanel(); }, 500); 
    });
  });
}

function showSkeleton() {
  document.getElementById('info-panel').innerHTML = `
    <div class="skeleton title"></div><div class="skeleton text" style="width: 40%;"></div>
    <div class="skeleton text" style="margin-top:20px"></div><div class="skeleton text"></div><div class="skeleton image" style="margin-top:20px"></div>
  `;
}

function renderPanel() {
  const panel = document.getElementById('info-panel');
  if (!currentMuscle) return;
  const m = currentMuscle;
  panel.innerHTML = `
    <h2>${m.name}</h2>
    <p style="color: var(--text-muted); font-style: italic; margin-bottom: 16px;">${m.latin}</p>
    <div class="tabs">
      <button class="tab-btn ${currentTab === 'about' ? 'active' : ''}" data-tab="about">За что отвечает</button>
      <button class="tab-btn ${currentTab === 'function' ? 'active' : ''}" data-tab="function">Функция</button>
      <button class="tab-btn ${currentTab === 'training' ? 'active' : ''}" data-tab="training">Как тренировать</button>
    </div>
    <div style="margin-top: 16px;">${renderTabContent()}</div>
  `;
  panel.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => { currentTab = btn.dataset.tab; renderPanel(); });
  });
}

function renderTabContent() {
  const m = currentMuscle;
  if (currentTab === 'about') {
    const featuresList = m.features ? m.features.map(f => `<li>${f}</li>`).join('') : '';
    return `<p style="margin-bottom: 20px;">${m.about}</p>${featuresList ? `<h3 style="margin-bottom: 12px; font-size: 16px;">Особенности:</h3><ul class="styled-list">${featuresList}</ul>` : ''}`;
  }
  if (currentTab === 'function') {
    const sportsTags = m.sports ? m.sports.map(s => `<span class="sport-tag">${s}</span>`).join('') : '';
    return `<p style="margin-bottom: 20px;">${m.muscle_function}</p>${sportsTags ? `<h3 style="margin-bottom: 12px; font-size: 16px;">Спорт:</h3><div class="sport-tags-container">${sportsTags}</div>` : ''}${m.fact ? `<div class="fact-box"><strong>💡 Факт:</strong><br>${m.fact}</div>` : ''}`;
  }
  if (currentTab === 'training') {
    if (!m.trainingPhotos) return '<p>Нет медиа</p>';
    return `<div class="photo-grid">${m.trainingPhotos.map(p => `
      <div class="photo-card">
        <iframe src="${p.video}" allow="autoplay; encrypted-media; fullscreen; picture-in-picture;" frameborder="0" allowfullscreen></iframe>
        <div class="caption">${p.caption}</div>
      </div>`).join('')}</div>`;
  }
  return '';
}

// Калькулятор ИМТ
document.getElementById('calc-bmi').addEventListener('click', () => {
  const w = parseFloat(document.getElementById('weight').value);
  const h = parseFloat(document.getElementById('height').value);
  const res = document.getElementById('bmi-result');
  const scaleWrapper = document.getElementById('bmi-scale-wrapper');
  const marker = document.getElementById('bmi-marker');

  if (!w || !h) { res.innerHTML = '<span style="color:red">Введите данные</span>'; scaleWrapper.style.display = 'none'; return; }

  const bmi = (w / ((h/100) * (h/100))).toFixed(1);
  let cat = ''; let color = '';
  if (bmi < 18.5) { cat = 'Недостаточный вес'; color = '#fbbf24'; }
  else if (bmi < 25) { cat = 'Норма'; color = '#10b981'; }
  else if (bmi < 30) { cat = 'Избыточный вес'; color = '#f97316'; }
  else { cat = 'Ожирение'; color = '#ef4444'; }

  res.innerHTML = `Ваш ИМТ: <span style="color:${color}">${bmi}</span> (${cat})`;
  scaleWrapper.style.display = 'block';
  
  let minBmi = 15, maxBmi = 40;
  let clampedBmi = Math.max(minBmi, Math.min(maxBmi, bmi));
  let percent = ((clampedBmi - minBmi) / (maxBmi - minBmi)) * 100;
  marker.style.left = percent + '%';
});

// ИИ
document.getElementById('ask-ai-btn').addEventListener('click', () => {
  const q = document.getElementById('ai-question').value.trim();
  const msg = document.getElementById('ai-msg');
  if (q) {
    navigator.clipboard.writeText(q).then(() => {
      msg.style.display = 'block';
      setTimeout(() => {
        window.open('https://giga.chat', '_blank'); // Замени на ссылку агента!
        msg.style.display = 'none';
      }, 1500);
    });
  } else { alert('Напишите вопрос!'); }
});

// Случайное упражнение
const randomExBtn = document.getElementById('random-ex-btn');
if (randomExBtn) {
  randomExBtn.addEventListener('click', () => {
    const randomMuscle = allMuscles[Math.floor(Math.random() * allMuscles.length)];
    document.getElementById('main-content').scrollIntoView({ behavior: 'smooth' });
    const muscleElement = document.getElementById(randomMuscle.id);
    if (muscleElement) muscleElement.dispatchEvent(new Event('click'));
  });
}

// Вода
let waterCups = parseInt(localStorage.getItem('waterCups')) || 0;
const waterResult = document.getElementById('water-result');
const waterGlass = document.getElementById('water-glass');

function updateWater() {
  if (waterResult) {
    waterResult.textContent = `${waterCups} / 8 стаканов`;
    if (waterCups >= 8) waterResult.innerHTML = `<span style="color: #10b981;">Норма выполнена! 💪</span>`;
  }
}

if (waterGlass) {
  waterGlass.addEventListener('click', () => {
    if (waterCups < 12) {
      waterCups++; localStorage.setItem('waterCups', waterCups); updateWater();
      waterGlass.style.transform = 'scale(1.1)';
      setTimeout(() => waterGlass.style.transform = 'scale(1)', 200);
    }
  });
}

const resetWaterBtn = document.getElementById('reset-water');
if (resetWaterBtn) {
  resetWaterBtn.addEventListener('click', () => {
    waterCups = 0; localStorage.setItem('waterCups', waterCups); updateWater();
  });
}
updateWater();

// Таймер
let timerInterval;
let timeLeft = 0;
const timerDisplay = document.getElementById('timer-display');
const startTimerBtn = document.getElementById('start-timer');
const customInput = document.getElementById('custom-timer-input');
const timerUnit = document.getElementById('timer-unit');

function updateTimerDisplay() {
  const m = Math.floor(timeLeft / 60);
  const s = timeLeft % 60;
  if(timerDisplay) timerDisplay.textContent = `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
}

if (startTimerBtn) {
  startTimerBtn.addEventListener('click', () => {
    if (timerInterval) {
      clearInterval(timerInterval); timerInterval = null;
      startTimerBtn.textContent = 'Продолжить'; startTimerBtn.classList.remove('active');
      return;
    }
    if (timeLeft > 0 && startTimerBtn.textContent === 'Продолжить') {
      startTimerBtn.textContent = 'Пауза'; startTimerBtn.classList.add('active'); startTimer(); return;
    }
    const inputValue = parseInt(customInput.value);
    const unit = timerUnit.value;
    if (!inputValue || inputValue <= 0) { alert('Введите число больше нуля!'); return; }
    timeLeft = unit === 'min' ? inputValue * 60 : inputValue;
    if (timeLeft > 5999) timeLeft = 5999; 
    updateTimerDisplay();
    startTimerBtn.textContent = 'Пауза'; startTimerBtn.classList.add('active'); startTimer();
  });
}

function startTimer() {
  timerInterval = setInterval(() => {
    timeLeft--; updateTimerDisplay();
    if (timeLeft <= 0) {
      clearInterval(timerInterval); timerInterval = null;
      timerDisplay.textContent = "Отдых окончен!";
      startTimerBtn.textContent = 'Сброс'; startTimerBtn.classList.remove('active');
      try { new Audio('https://actions.google.com/sounds/v1/alarms/beep_short.ogg').play(); } catch(e) {}
    }
  }, 1000);
}

init();