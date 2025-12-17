document.addEventListener("DOMContentLoaded", () => {
  const statuses = document.querySelectorAll(".status");

  statuses.forEach(status => {
    const quiz = status.dataset.clue; // z.B. quiz1
    const solved = localStorage.getItem(quiz + "Solved");

    if (solved === "true") {
      status.textContent = "Status: ✓ Solved";
      status.classList.add("solved");
    } else {
      status.textContent = "Status: 🔒 Locked";
      status.classList.add("locked");
    }
  });
});

function resetGame() {
  localStorage.clear();
}

