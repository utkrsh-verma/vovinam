// Weight categories definition
const weightCategories = [
  { min: 25, max: 30, label: "25 to 30 kg" },
  { min: 30, max: 35, label: "30 to 35 kg" },
  { min: 35, max: 40, label: "35 to 40 kg" },
  { min: 40, max: 45, label: "40 to 45 kg" },
  { min: 45, max: 50, label: "45 to 50 kg" },
];

// Calculate age from DOB string (yyyy-mm-dd)
function calculateAge(dobStr) {
  const dob = new Date(dobStr);
  const today = new Date();
  let age = today.getFullYear() - dob.getFullYear();
  const m = today.getMonth() - dob.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) {
    age--;
  }
  return age;
}

// Categorize participant by age
function getCategory(age) {
  if (age < 8) return "Mini Sub Junior";
  if (age >= 14 && age < 18) return "Junior";
  if (age >= 18 && age <= 35) return "Senior";
  return "Other";
}

// Count participants per category and weight group
function countParticipants(participants) {
  const stats = {
    "Mini Sub Junior": {},
    Junior: {},
    Senior: {},
    Other: {},
  };

  // Initialize counts to zero for each weight category per main category
  for (const cat of Object.keys(stats)) {
    for (const wCat of weightCategories) {
      stats[cat][wCat.label] = 0;
    }
  }

  for (const p of participants) {
    const age = calculateAge(p.dob);
    const cat = getCategory(age);

    // Find weight category label
    let wCatLabel = null;
    for (const wCat of weightCategories) {
      if (p.weight >= wCat.min && p.weight < wCat.max) {
        wCatLabel = wCat.label;
        break;
      }
    }

    if (wCatLabel && stats[cat]) {
      stats[cat][wCatLabel]++;
    }
  }

  return stats;
}

function renderStats(stats) {
  const container = document.getElementById("statsContainer");
  container.innerHTML = "";

  for (const [category, weights] of Object.entries(stats)) {
    // Only show categories with participants
    const totalInCategory = Object.values(weights).reduce((a, b) => a + b, 0);
    if (totalInCategory === 0) continue;

    const catSection = document.createElement("div");
    catSection.classList.add("category-section");

    const catHeading = document.createElement("h2");
    catHeading.textContent = category + " Category";
    catSection.appendChild(catHeading);

    for (const [weightLabel, count] of Object.entries(weights)) {
      if (count === 0) continue; // skip empty weight groups

      const weightGroup = document.createElement("div");
      weightGroup.classList.add("weight-group");
      weightGroup.textContent = weightLabel;

      const countSpan = document.createElement("span");
      countSpan.classList.add("count");
      countSpan.textContent = `(${count} participant${count > 1 ? "s" : ""})`;

      weightGroup.appendChild(countSpan);
      catSection.appendChild(weightGroup);
    }

    container.appendChild(catSection);
  }

  // Show message if no data found
  if (container.innerHTML.trim() === "") {
    container.textContent = "No participant data available.";
  }
}

window.onload = () => {
  const participants = JSON.parse(localStorage.getItem("participants")) || [];
  const stats = countParticipants(participants);
  renderStats(stats);
};
