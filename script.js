let participants = JSON.parse(localStorage.getItem('participants')) || [];

document.getElementById('playerForm').addEventListener('submit', function (e) {
  e.preventDefault();

  const name = document.getElementById('name').value;
  const dob = document.getElementById('dob').value;
  const gender = document.getElementById('gender').value;
  const weight = parseFloat(document.getElementById('weight').value);

  participants.push({ name, dob, gender, weight });
  localStorage.setItem('participants', JSON.stringify(participants));

  this.reset();
  alert('Participant added!');
});

document.getElementById('generateFixtures').addEventListener('click', function () {
  generateMatches();
});

function getAge(dob) {
  const birthDate = new Date(dob);
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const m = today.getMonth() - birthDate.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age;
}

function categorize(p) {
  const age = getAge(p.dob);
  if (age < 8) return 'Mini Sub Junior';
  if (age < 14) return 'Sub Junior';
  if (age < 18) return 'Junior';
  if (age <= 35) return 'Senior';
  return 'Adult';
}

function weightClass(weight) {
  if (weight < 45) return '<45 kg';
  if (weight <= 50) return '45-50 kg';
  if (weight <= 55) return '50-55 kg';
  if (weight <= 60) return '55-60 kg';
  return '>60 kg';
}

function generateMatches() {
  const grouped = {};
  participants.forEach(p => {
    const category = categorize(p);
    const wc = weightClass(p.weight);
    const key = `${category}-${p.gender}-${wc}`;
    if (!grouped[key]) grouped[key] = [];
    grouped[key].push(p);
  });

  const container = document.getElementById('matchesContainer');
  container.innerHTML = '';
  for (const key in grouped) {
    const div = document.createElement('div');
    div.className = 'category';
    const title = document.createElement('h3');
    title.innerText = `${key} (${grouped[key].length} participants)`;
    div.appendChild(title);
    const ul = document.createElement('ul');
    const shuffled = grouped[key].sort(() => Math.random() - 0.5);
    for (let i = 0; i < shuffled.length; i += 2) {
      const li = document.createElement('li');
      if (shuffled[i + 1]) {
        li.innerText = `${shuffled[i].name} vs ${shuffled[i + 1].name}`;
      } else {
        li.innerText = `${shuffled[i].name} (no opponent)`;
      }
      ul.appendChild(li);
    }
    div.appendChild(ul);
    container.appendChild(div);
  }
}
