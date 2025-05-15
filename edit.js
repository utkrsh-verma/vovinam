let editingIndex = -1;

document.addEventListener("DOMContentLoaded", () => {
  loadParticipants();
  document.getElementById("saveBtn").addEventListener("click", saveEdit);
  document.getElementById("cancelBtn").addEventListener("click", closeModal);
});

function loadParticipants() {
  const participants = JSON.parse(localStorage.getItem("participants")) || [];
  const tbody = document.getElementById("participantsTableBody");
  tbody.innerHTML = "";

  participants.forEach((p, index) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${index + 1}</td>
      <td>${p.name}</td>
      <td>${p.dob}</td>
      <td>${p.gender}</td>
      <td>${p.weight}</td>
      <td>
        <button class="edit" data-index="${index}">Edit</button>
        <button class="delete" data-index="${index}">Delete</button>
      </td>
    `;
    tbody.appendChild(row);
  });

  document.querySelectorAll(".edit").forEach(btn => {
    btn.addEventListener("click", (e) => {
      openEditModal(e.target.getAttribute("data-index"));
    });
  });

  document.querySelectorAll(".delete").forEach(btn => {
    btn.addEventListener("click", (e) => {
      deleteParticipant(e.target.getAttribute("data-index"));
    });
  });
}

function openEditModal(index) {
  const participants = JSON.parse(localStorage.getItem("participants")) || [];
  const p = participants[index];
  document.getElementById("editName").value = p.name;
  document.getElementById("editDob").value = p.dob;
  document.getElementById("editGender").value = p.gender;
  document.getElementById("editWeight").value = p.weight;
  editingIndex = index;
  document.getElementById("editModal").style.display = "flex";
}

function saveEdit() {
  if (editingIndex === -1) return;

  const participants = JSON.parse(localStorage.getItem("participants")) || [];

  participants[editingIndex] = {
    name: document.getElementById("editName").value.trim(),
    dob: document.getElementById("editDob").value,
    gender: document.getElementById("editGender").value,
    weight: parseFloat(document.getElementById("editWeight").value),
  };

  localStorage.setItem("participants", JSON.stringify(participants));
  closeModal();
  loadParticipants();
}

function closeModal() {
  document.getElementById("editModal").style.display = "none";
  editingIndex = -1;
}

function deleteParticipant(index) {
  let participants = JSON.parse(localStorage.getItem("participants")) || [];
  if (confirm("Are you sure you want to delete this participant?")) {
    participants.splice(index, 1);
    localStorage.setItem("participants", JSON.stringify(participants));
    loadParticipants();
  }
}
