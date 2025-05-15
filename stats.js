document.addEventListener("DOMContentLoaded", () => {
  const statsContainer = document.getElementById("statsContainer");
  const participants = JSON.parse(localStorage.getItem("participants")) || [];

  const weightCategories = [
    { range: "25-30", min: 25, max: 30 },
    { range: "30-35", min: 30, max: 35 },
    { range: "35-40", min: 35, max: 40 },
    { range: "40-45", min: 40, max: 45 },
    { range: "45-50", min: 45, max: 50 },
  ];

  function getAge(dobStr) {
    const dob = new Date(dobStr);
    const today = new Date();
    let age = today.getFullYear() - dob.getFullYear();
    const m = today.getMonth() - dob.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) age--;
    return age;
  }

  const categorized = {};

  participants.forEach(p => {
    const age = getAge(p.dob);
    let category = "";
    if (age < 8) category = "Mini Sub Junior";
    else if (age < 14) category = "Sub Junior";
    else if (age < 18) category = "Junior";
    else if (age <= 35) category = "Senior";
    else category = "Above Senior";

    if (!categorized[category]) categorized[category] = {};

    for (const weightGroup of weightCategories) {
      if (p.weight >= weightGroup.min && p.weight < weightGroup.max) {
        const key = weightGroup.range;
        if (!categorized[category][key]) categorized[category][key] = 0;
        categorized[category][key]++;
        break;
      }
    }
  });

  for (const category in categorized) {
    const section = document.createElement("div");
    section.className = "category-section";

    const title = document.createElement("h2");
    title.className = "category-title";
    title.textContent = category;
    section.appendChild(title);

    const table = document.createElement("table");
    const thead = document.createElement("thead");
    const headRow = document.createElement("tr");
    headRow.innerHTML = `<th>Weight Category</th><th>Participants</th>`;
    thead.appendChild(headRow);
    table.appendChild(thead);

    const tbody = document.createElement("tbody");
    for (const weight in categorized[category]) {
      const tr = document.createElement("tr");
      tr.innerHTML = `<td>${weight}</td><td>${categorized[category][weight]}</td>`;
      tbody.appendChild(tr);
    }

    table.appendChild(tbody);
    section.appendChild(table);
    statsContainer.appendChild(section);
  }
});
