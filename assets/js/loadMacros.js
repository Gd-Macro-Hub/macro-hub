document.addEventListener('DOMContentLoaded', () => {
  const macroList = document.getElementById('macroList');
  const loading = document.getElementById('loading');
  const searchInput = document.getElementById('search');
  const sortSelect = document.getElementById('sortSelect');
  const themeToggle = document.getElementById('themeToggle');

  let macros = [];

  // Show loading spinner
  loading.style.display = 'block';

  // Fetch list of JSON files in macro-config directory
  fetch('Main/macro-config/index.json')
    .then(response => response.json())
    .then(files => {
      const fetchPromises = files.map(file =>
        fetch(`Main/macro-config/${file}`).then(res => res.json())
      );
      return Promise.all(fetchPromises);
    })
    .then(data => {
      macros = data;
      displayMacros(macros);
      loading.style.display = 'none';
    })
    .catch(error => {
      console.error('Error loading macros:', error);
      loading.textContent = '❌ Failed to load macros.';
    });

  // Display macros
  function displayMacros(macros) {
    macroList.innerHTML = '';
    macros.forEach(macro => {
      const card = document.createElement('div');
      card.className = 'card';
      card.style.cursor = 'pointer';

      const img = document.createElement('img');
      img.src = macro.thumbnail;
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

      // Make the card clickable
      card.addEventListener('click', () => {
        window.location.href = `macros.html?id=${macro.id}`;
      });

      macroList.appendChild(card);
    });
  }

  // Search functionality
  searchInput.addEventListener('input', () => {
    const query = searchInput.value.toLowerCase();
    const filtered = macros.filter(macro =>
      macro.name.toLowerCase().includes(query) ||
      macro.id.toLowerCase().includes(query)
    );
    displayMacros(filtered);
  });

  // Sort functionality
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

  // Theme toggle
  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      document.body.classList.toggle('dark');
    });
  }
});
