async function loadMacros() {
  const macroList = document.getElementById("macroList");
  const searchInput = document.getElementById("search");

  const macroIds = ["abc123"]; // Add new IDs here
  const macros = [];

  for (let id of macroIds) {
    const res = await fetch(`Main/macro-config/${id}.json`);
    const data = await res.json();
    macros.push(data);

    const card = document.createElement("div");
    card.className = "macro-card";
    card.setAttribute("data-name", data.name.toLowerCase());
    card.setAttribute("data-id", data.id.toLowerCase());
    card.innerHTML = `
      <img src="${data.thumbnail}" width="200">
      <h3>${data.name}</h3>
      <p><strong>Creator:</strong> ${data.creator}</p>
      <p><strong>ID:</strong> ${data.id}</p>
      <a href="macros.html?id=${data.id}">View ➜</a>
    `;
    macroList.appendChild(card);
  }

  searchInput.addEventListener("input", () => {
    const value = searchInput.value.toLowerCase();
    document.querySelectorAll(".macro-card").forEach(card => {
      const name = card.dataset.name;
      const id = card.dataset.id;
      card.style.display = (name.includes(value) || id.includes(value)) ? "" : "none";
    });
  });
}

loadMacros();
