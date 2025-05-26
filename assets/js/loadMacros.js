async function loadMacros() {
  const macroList = document.getElementById("macroList");
  const searchInput = document.getElementById("search");
  const filter = document.getElementById("creatorFilter");

  // Replace this with dynamic logic if needed
  const macroIds = ["abc123"];
  const macros = [];

  for (let id of macroIds) {
    const res = await fetch(`Main/macro-config/${id}.json`);
    const data = await res.json();
    macros.push(data);

    const card = document.createElement("div");
    card.className = "macro-card";
    card.setAttribute("data-name", data.name.toLowerCase());
    card.setAttribute("data-creator", data.creator.toLowerCase());
    card.innerHTML = `
      <img src="${data.thumbnail}" width="200">
      <h3>${data.name}</h3>
      <p>by ${data.creator}</p>
      <a href="macros.html?id=${data.id}">View ➜</a>
    `;
    macroList.appendChild(card);
  }

  // Fill dropdown
  const creators = [...new Set(macros.map(m => m.creator))];
  for (let creator of creators) {
    const opt = document.createElement("option");
    opt.value = creator.toLowerCase();
    opt.textContent = creator;
    filter.appendChild(opt);
  }

  // Filtering
  function applyFilters() {
    const searchVal = searchInput.value.toLowerCase();
    const filterVal = filter.value.toLowerCase();

    document.querySelectorAll(".macro-card").forEach(card => {
      const name = card.dataset.name;
      const creator = card.dataset.creator;

      const matchSearch = name.includes(searchVal);
      const matchFilter = !filterVal || creator === filterVal;

      card.style.display = matchSearch && matchFilter ? "" : "none";
    });
  }

  searchInput.addEventListener("input", applyFilters);
  filter.addEventListener("change", applyFilters);
}
loadMacros();
