// Подсветка
const menuLinks = document.querySelectorAll('.nav a, .nav button');
const sections = {
  "Библиотека": document.getElementById('librarySection'),
  "Полка желаний": document.getElementById('wishlistSection'),
  "Друзья": document.getElementById('friendsSection'),
  "Личный кабинет": document.getElementById('feedbackSection')
};

let activeSection = null;

menuLinks.forEach(link => {
  link.addEventListener('click', (e) => {
    e.preventDefault();
    const name = link.textContent.trim();

    // Сброс предыдущей подсветки
    if (activeSection) 
    {
      activeSection.style.backgroundColor = '';
      activeSection.style.boxShadow = '';
    }

    if (sections[name]) {
      sections[name].style.transition = 'background-color 0.3s ease';
      sections[name].style.backgroundColor = 'rgba(213, 170, 116, 0.3)';
      sections[name].style.boxShadow = ' 0 0 25px rgba(213, 170, 116, 0.5)';
      activeSection = sections[name];
      activeSection.scrollIntoView({behavior: 'smooth'});
    }
  });
});

document.addEventListener('click', (e) => {
  if (activeSection) {
    if (!activeSection.contains(e.target) && !e.target.closest('.nav')) {
      activeSection.style.backgroundColor = '';
      activeSection.style.boxShadow = '';
      activeSection = null;
    }
  }
});

// Таблица
const table = document.querySelector('.stats-table');
let activeCol = null;

table.addEventListener('click', (e) => {
  const th = e.target.closest('th');
  if (!th) return;
  const colIndex = parseInt(th.dataset.col);

  if (activeCol === colIndex) {
    resetColumn(table, activeCol);
    activeCol = null;
    return;
  }

  if (activeCol !== null) resetColumn(table, activeCol);

  table.querySelectorAll('tbody tr').forEach(tr => {
    const cell = tr.children[colIndex];
    cell.style.transition = 'background-color 0.3s ease';
    cell.style.backgroundColor = 'rgba(160, 120, 70, 0.2)';

  });

  activeCol = colIndex;
});

document.addEventListener('click', (e) => {
  if (!e.target.closest('.stats-table') && activeCol !== null) {
    resetColumn(table, activeCol);
    activeCol = null;
  }
});

function resetColumn(table, colIndex) {
  table.querySelectorAll('tbody tr').forEach(tr => {
    tr.children[colIndex].style.backgroundColor = '';
  });
}

// Aside
document.querySelectorAll('aside.info-box').forEach(aside => {
  aside.addEventListener('click', () => {
    alert(aside.dataset.popup);
  });
});

// Форма
const supportForm = document.getElementById('supportForm');

if (supportForm) {
  const fields = supportForm.querySelectorAll('input[type="text"], input[type="email"], textarea');

  // Кнопка сброса
  supportForm.addEventListener('reset', (e) => {
    e.preventDefault();
    const confirmReset = confirm('Вы уверены, что хотите очистить форму?');

    if (confirmReset) {
      fields.forEach(f => {
        f.value = '';
        f.style.transition = 'background-color 0.5s ease';
        f.style.backgroundColor = 'rgba(255, 100, 100, 0.3)';
      });
    } else {
      fields.forEach(f => {
        f.style.transition = 'background-color 0.5s ease';
        f.style.backgroundColor = 'rgba(100, 255, 100, 0.3)';
      });
    }

    setTimeout(() => {
      fields.forEach(f => f.style.backgroundColor = '');
    }, 1000);
  });

  // Кнопка отправки
  supportForm.addEventListener('submit', (e) => {
    e.preventDefault();
    fields.forEach(f => {
      f.style.transition = 'background-color 0.5s ease';
      f.style.backgroundColor = 'rgba(100, 150, 255, 0.3)';
    });
    setTimeout(() => {
      alert('Данные отправлены!');
      fields.forEach(f => f.style.backgroundColor = '');
    }, 1000);
  });
}
