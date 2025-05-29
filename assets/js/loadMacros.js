document.addEventListener('DOMContentLoaded', () => {
  const macroList = document.getElementById('macroList');
  const loading = document.getElementById('loadingSpinner');
  const searchInput = document.getElementById('search');
  const sortSelect = document.getElementById('sortSelect');
  const themeToggle = document.getElementById('themeToggle');

  let macros = [];

  if (loading) loading.style.display = 'block';

  fetch('Main/macro-config/index.json')
    .then(response => response.json())
    .then(files => {
      const macroPromises = files.map(file =>
        fetch(`Main/macro-config/${file}`).then(res => res.json())
      );
      return Promise.all(macroPromises);
    })
    .then(data => {
      macros = data;
      displayMacros(macros);
      if (loading) loading.style.display = 'none';
    })
    .catch(error => {
      console.error('Error loading macros:', error);
      if (loading) loading.textContent = '❌ Failed to load macros.';
    });

  function displayMacros(macrosToShow) {
    macroList.innerHTML = '';

    macrosToShow.forEach(macro => {
      const card = document.createElement('div');
      card.className = 'card';
      card.style.cursor = 'pointer';

      const img = document.createElement('img');
      img.src = `https://gd-macro-hub.github.io/macro-hub/${macro.thumbnail}`;
      img.alt = macro.name;
      img.loading = 'lazy';

      const title = document.createElement('h3');
      title.textContent = macro.name;

      const id = document.createElement('p');
      id.textContent = `ID: ${macro.id}`;

      const creator = document.createElement('p');
      creator.textContent = `Creator: ${macro.creator}`;

      card.appendChild(img);
      card.appendChild(title);
      card.appendChild(id);
      card.appendChild(creator);

      card.addEventListener('click', () => {
        window.location.href = `macros.html?id=${encodeURIComponent(macro.id)}`;
      });

      macroList.appendChild(card);
    });

    if (macrosToShow.length === 0) {
      macroList.innerHTML = '<p>No macros found.</p>';
    }
  }

  if (searchInput) {
    searchInput.addEventListener('input', () => {
      const query = searchInput.value.toLowerCase();
      const filtered = macros.filter(m =>
        m.name.toLowerCase().includes(query) || m.id.toLowerCase().includes(query)
      );
      displayMacros(filtered);
    });
  }

  if (sortSelect) {
    sortSelect.addEventListener('change', () => {
      const sorted = [...macros];
      if (sortSelect.value === 'newest') {
        sorted.sort((a, b) => new Date(b.date) - new Date(a.date));
      } else {
        sorted.sort((a, b) => new Date(a.date) - new Date(b.date));
      }
      displayMacros(sorted);
    });
  }

  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      document.body.classList.toggle('dark');
    });
  }
});
