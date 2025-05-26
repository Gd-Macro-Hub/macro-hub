async function loadMacros() {
  const configList = ["abc123"]; // Add more IDs here as needed

  const dropdown = document.getElementById("macroDropdown");
  const featured = document.getElementById("featured");

  for (let id of configList) {
    const response = await fetch(`Main/macro-config/${id}.json`);
    const data = await response.json();

    const option = document.createElement("option");
    option.value = data.id;
    option.textContent = data.name;
    dropdown.appendChild(option);

    // Add to featured
    if (Math.random() < 0.5) {
      featured.innerHTML += `
        <div class="card">
          <img src="${data.thumbnail}" style="width:200px">
          <h2>${data.name}</h2>
          <p>by ${data.creator}</p>
        </div>
      `;
    }
  }

  dropdown.onchange = () => {
    window.location.href = `macros.html?id=${dropdown.value}`;
  };
}

loadMacros();
