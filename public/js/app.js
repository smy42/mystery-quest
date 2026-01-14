/* =====================
   GAME CONFIG
===================== */

const gameConfig = {
  quizzes: {
    quiz1: {
      id: "quiz1",
      title: "Hotel Room",
      description: "The victim was found in the hotel room with no signs of forced entry.",
      page: "quiz1.html",
      next: "quiz2"
    },
    quiz2: {
      id: "quiz2",
      title: "Keycard Log",
      description: "Electronic door access logs show unusual activity during the night.",
      page: "quiz2.html",
      next: "quiz3"
    },
    quiz3: {
      id: "quiz3",
      title: "Mini Bar Receipt",
      description: "The minibar system recorded consumption that does not match the booking.",
      page: "quiz3.html",
      next: "quiz4"
    },
    quiz4: {
      id: "quiz4",
      title: "Voicemail Recording (Morse Code)",
      description: "A voicemail containing a sequence of audio signals was found on the victim’s phone.",
      page: "quiz4.html",
      next: "quiz5",
      special: "morse"
    },
    quiz5: {
      id: "quiz5",
      title: "Guest Registry",
      description: "Guest check-in data reveals inconsistencies in one suspect’s statement.",
      page: "quiz5.html",
      next: "final"
    }
  },

  final: {
    page: "suspect.html",
    murderer: "C"
  }
};

/* =====================
   OVERVIEW STATUS
===================== */

document.addEventListener("DOMContentLoaded", () => {

  // Status anzeigen
  document.querySelectorAll(".status").forEach(status => {
    const quiz = status.dataset.clue;
    const solved = localStorage.getItem(quiz);

    if (solved === "solved") {
      status.style.fontFamily = "'Special Elite', monospace";
      status.textContent = "✓ Solved";
      status.classList.add("solved");
    } else {
      status.style.fontFamily = "'Special Elite', monospace";
      status.textContent = "🔒 Locked";
      status.classList.add("locked");
    }
  });

  const scanBtn = document.getElementById("scanButton");
  const finalBtn = document.getElementById("finalButton");
  const restartBtn = document.getElementById("restartButton");

  const allSolved = allCluesSolved();
  const caseSolved = localStorage.getItem("caseSolved") === "true";

  // 🟢 Spiel läuft
  if (!allSolved && !caseSolved) {
    scanBtn.style.display = "block";
  }

  // 🔓 Alle Clues solved → Täter wählen
  if (allSolved && !caseSolved) {
    scanBtn.style.display = "none";
    finalBtn.style.display = "block";
  }

  // 🏁 Case solved → Neustart
  if (caseSolved) {
    scanBtn.style.display = "none";
    finalBtn.style.display = "none";
    restartBtn.style.display = "block";
  }
});


/* =====================
   QUIZ HANDLING
===================== */

function checkQuiz(quizKey, isCorrect) {
  const feedback = document.getElementById("feedback");

  if (isCorrect) {
  localStorage.setItem(quizKey, "solved");

  feedback.style.fontFamily = "'Special Elite', monospace";
  feedback.textContent = "Correct! A new clue has been unlocked.";
  feedback.style.color = "#3cff6f";

  setTimeout(() => {
    window.location.href = "overview.html";
  }, 1200);
} else {
  feedback.style.fontFamily = "'Special Elite', monospace";
  feedback.textContent = "Incorrect. Try again.";
  feedback.style.color = "#ff4d4d";
}

}

/* =====================
   MORSE QUIZ
===================== */

function checkMorse() {
  const input = document.getElementById("morseAnswer").value.trim().toUpperCase();
  const feedback = document.getElementById("feedback");

  if (input === "HOTEL") {
    localStorage.setItem("quiz4", "solved");
    feedback.style.fontFamily = "'Special Elite', monospace";
    feedback.textContent = "Correct! A new clue has been unlocked.";
    feedback.style.color = "#3cff6f";

    setTimeout(() => {
      window.location.href = "overview.html";
    }, 1200);
  } else {
    feedback.style.fontFamily = "'Special Elite', monospace";
    feedback.textContent = "Incorrect. Listen carefully and try again.";
    feedback.style.color = "#ff4d4d";
  }
}

/* =====================
   FINAL LOGIC
===================== */

function allCluesSolved() {
  return Object.keys(gameConfig.quizzes)
    .every(q => localStorage.getItem(q) === "solved");
}

/* =====================
   SUSPECT CHECK
===================== */

function checkSuspect() {
  const selected = document.querySelector('input[name="suspect"]:checked');

  if (!selected) {
    alert("Please select a suspect.");
    return;
  }

  if (selected.value === gameConfig.final.murderer) {
    localStorage.setItem("caseSolved", "true");
    window.location.href = "case-solved.html";
  } else {
    alert("That suspect is not correct. Review the clues and try again.");
  }
}

/* =====================
   RESET (OPTIONAL)
===================== */

function resetGame() {
  localStorage.clear();
  window.location.href = "overview.html";
}
