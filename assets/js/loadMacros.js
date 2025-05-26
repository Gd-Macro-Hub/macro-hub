async function loadMacros() {
  const macroList = document.getElementById("macroList");
  const searchInput = document.getElementById("search");

  // Change this to your GitHub repo username and repo name:
  const githubUsername = "Gd-Macro-Hub";
  const githubRepo = "macro-hub";

  // Fetch list of macro-config JSON files from GitHub API
  const apiUrl = `https://api.github.com/repos/${githubUsername}/${githubRepo}/contents/Main/macro-config`;

  try {
    const response = await fetch(apiUrl);
    if (!response.ok) throw new Error("Failed to fetch macro configs");
    const files = await response.json();

    const jsonFiles = files.filter((file) => file.name.endsWith(".json"));

    for (const file of jsonFiles) {
      const res = await fetch(file.download_url);
      if (!res.ok) continue;
      const data = await res.json();

      // Create card element
      const card = document.createElement("div");
      card.className = "macro-card";
      card.setAttribute("data-name", data.name.toLowerCase());
      card.setAttribute("data-id", data.id.toLowerCase());
      card.innerHTML = `
        <img src="${data.thumbnail}" alt="Thumbnail" width="200" style="border-radius: 12px;" />
        <h3>${data.name}</h3>
        <p><strong>Creator:</strong> ${data.creator}</p>
        <p><strong>ID:</strong> ${data.id}</p>
        <a href="macros.html?id=${data.id}">View ➜</a>
      `;
      macroList.appendChild(card);
    }
  } catch (err) {
    macroList.innerHTML = `<p>Error loading macros: ${err.message}</p>`;
  }

  // Search filter
  searchInput.addEventListener("input", () => {
    const value = searchInput.value.toLowerCase();
    document.querySelectorAll(".macro-card").forEach((card) => {
      const name = card.getAttribute("data-name");
      const id = card.getAttribute("data-id");
      card.style.display = name.includes(value) || id.includes(value) ? "" : "none";
    });
  });
}

loadMacros();
