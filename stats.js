// Define age categories with labels and range inclusive
const ageCategories = [
  { label: "Mini Sub Junior", min: 0, max: 7 },
  { label: "Sub Junior", min: 8, max: 13 },
  { label: "Junior", min: 14, max: 17 },
  { label: "Senior", min: 18, max: 35 },
  { label: "Veteran", min: 36, max: 100 }
];

// Weight categories ranges and labels
const weightCategories = [
  { label: "25 to 30 kg", min: 25, max: 30 },
  { label: "30 to 35 kg", min: 30, max: 35 },
  { label: "35 to 40 kg", min: 35, max: 40 },
  { label: "40 to 45 kg", min: 40, max: 45 },
  { label: "45 to 50 kg", min: 45, max: 50 }
];

// Helper function: get age category by age
function getAgeCategory(age) {
  return ageCategories.find(cat => age >= cat.min && age <= cat.max);
}

// Helper function: get weight category by weight
function getWeightCategory(weight) {
  return weightCategories.find(cat => weight >= cat.min && weight < cat.max);
}

// Main function to load and show stats
function showStats() {
  const statsContainer = document.getElementById("statsContainer");

  // Load participants from localStorage (assuming they are saved with key 'participants')
  let participants = JSON.parse(localStorage.getItem("participants")) || [];

  if (participants.length === 0) {
    statsContainer.innerHTML = "<p>No participants data found.</p>";
    return;
  }

  // Organize data: ageCategory -> weightCategory -> count
  const statsData = {};

  participants.forEach(p => {
    const age = parseInt(p.age);
    const weight = parseFloat(p.weight);

    const ageCat = getAgeCategory(age);
    const weightCat = getWeightCategory(weight);

    if (!ageCat || !weightCat) return; // skip invalid data

    if (!statsData[ageCat.label]) {
      statsData[ageCat.label] = {};
    }

    if (!statsData[ageCat.label][weightCat.label]) {
      statsData[ageCat.label][weightCat.label] = 0;
    }

    statsData[ageCat.label][weightCat.label]++;
  });

  // Now render the stats into HTML
  statsContainer.innerHTML = ""; // Clear existing content

  for (const [ageCat, weights] of Object.entries(statsData)) {
    const catDiv = document.createElement("div");
    catDiv.classList.add("category");

    const catTitle = document.createElement("h2");
    catTitle.textContent = ageCat;
    catDiv.appendChild(catTitle);

    for (const [weightCat, count] of Object.entries(weights)) {
      const weightDiv = document.createElement("div");
      weightDiv.classList.add("weight-category");
      weightDiv.textContent = `${weightCat} — ${count} participant${count > 1 ? "s" : ""}`;
      catDiv.appendChild(weightDiv);
    }

    statsContainer.appendChild(catDiv);
  }
}

// Run when page loads
window.onload = showStats;
