document.addEventListener('DOMContentLoaded', () => {
  const macroList = document.getElementById('macroList');
  const loading = document.getElementById('loadingSpinner'); // fixed id here
  const searchInput = document.getElementById('search');
  const sortSelect = document.getElementById('sortSelect');
  const themeToggle = document.getElementById('themeToggle');

  let macros = [];

  // Show loading spinner if it exists
  if (loading) {
    loading.style.display = 'block';
  }

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

      console.log("Loaded macros:", macros.map(m => m.id)); // Debug: list all loaded macro IDs

      displayMacros(macros);

      if (loading) {
        loading.style.display = 'none';
      }
    })
    .catch(error => {
      console.error('Error loading macros:', error);
      if (loading) {
        loading.textContent = '❌ Failed to load macros.';
      }
    });

  // Display macros
  function displayMacros(macrosToShow) {
    macroList.innerHTML = '';
    macrosToShow.forEach(macro => {
      console.log("Displaying macro:", macro.id); // Debug: confirm IDs when displaying

      const card = document.createElement('div');
      card.className = 'card';
      card.style.cursor = 'pointer';

      // Use thumbnail as-is if relative path works, else prefix as needed
      // If your thumbnails are stored like "Main/thumbnails/thumb1.png" you might need:
      // img.src = `Main/${macro.thumbnail}`;
      // But if your JSON has full relative path, just use macro.thumbnail

      const img = document.createElement('img');
      img.src = macro.thumbnail.startsWith('http') || macro.thumbnail.startsWith('/')
        ? macro.thumbnail
        : `Main/${macro.thumbnail}`;
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

      // Make the card clickable - opens the correct macro detail page
      card.addEventListener('click', () => {
        window.location.href = `macros.html?id=${encodeURIComponent(macro.id)}`;
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
