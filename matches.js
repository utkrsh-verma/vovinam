function calculateAge(dobStr) {
  const dob = new Date(dobStr);
  const today = new Date();
  let age = today.getFullYear() - dob.getFullYear();
  const m = today.getMonth() - dob.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) age--;
  return age;
}

function getCategory(age) {
  if (age < 8) return "Mini Sub Junior";
  if (age >= 14 && age < 18) return "Junior";
  if (age >= 18 && age <= 35) return "Senior";
  return "Other";
}

const weightCategories = [
  { min: 25, max: 30, label: "25 to 30 kg" },
  { min: 30, max: 35, label: "30 to 35 kg" },
  { min: 35, max: 40, label: "35 to 40 kg" },
  { min: 40, max: 45, label: "40 to 45 kg" },
  { min: 45, max: 50, label: "45 to 50 kg" },
];

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

function groupParticipants(participants) {
  const grouped = {};

  for (const p of participants) {
    const age = calculateAge(p.dob);
    const category = getCategory(age);

    let weightLabel = null;
    for (const w of weightCategories) {
      if (p.weight >= w.min && p.weight < w.max) {
        weightLabel = w.label;
        break;
      }
    }

    if (category !== "Other" && weightLabel) {
      const key = `${category} - ${weightLabel}`;
      if (!grouped[key]) grouped[key] = [];
      grouped[key].push(p.name);
    }
  }

  return grouped;
}

function generateFixtures() {
  const participants = JSON.parse(localStorage.getItem("participants")) || [];
  const groups = groupParticipants(participants);
  const container = document.getElementById("fixturesContainer");
  container.innerHTML = "";

  for (const [group, names] of Object.entries(groups)) {
    if (names.length < 2) continue;

    const groupDiv = document.createElement("div");
    groupDiv.className = "match-group";
    const heading = document.createElement("h2");
    heading.textContent = `${group} (${names.length} participants)`;
    groupDiv.appendChild(heading);

    shuffleArray(names);
    for (let i = 0; i < names.length - 1; i += 2) {
      const match = document.createElement("div");
      match.className = "match";
      match.textContent = `${names[i]} vs ${names[i + 1]}`;
      groupDiv.appendChild(match);
    }

    // Handle odd participant
    if (names.length % 2 !== 0) {
      const bye = document.createElement("div");
      bye.className = "match";
      bye.textContent = `${names[names.length - 1]} gets a bye`;
      groupDiv.appendChild(bye);
    }

    container.appendChild(groupDiv);
  }

  if (container.innerHTML === "") {
    container.innerHTML = "<p>No valid groups or not enough participants for fights.</p>";
  }
}

document.getElementById("generateBtn").addEventListener("click", generateFixtures);
