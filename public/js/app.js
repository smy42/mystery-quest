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

// Smart back: geht auf die vorherige Seite zurück (History), sonst nutzt es den href als Fallback
function enableSmartBack() {
  const backSelectors = [
    "a.back-arrow",
    "a.scan-back"
  ];

  backSelectors.forEach(sel => {
    document.querySelectorAll(sel).forEach(a => {
      a.addEventListener("click", (e) => {
        if (window.history.length > 1) {
          e.preventDefault();
          window.history.back();
        }
      });
    });
  });

  document.querySelectorAll("button.scan-cancel").forEach(btn => {
    btn.addEventListener("click", (e) => {
      if (window.history.length > 1) {
        e.preventDefault();
        window.history.back();
      } else {
        window.location.href = "./overview.html";
      }
    });
  });
}

document.addEventListener("DOMContentLoaded", enableSmartBack);


/* =====================
   OVERVIEW STATUS
===================== */

document.addEventListener("DOMContentLoaded", () => {
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

  if (!scanBtn || !finalBtn || !restartBtn) return;

  const allSolved = allCluesSolved();
  const caseSolved = localStorage.getItem("caseSolved") === "true";

  if (!allSolved && !caseSolved) {
    scanBtn.style.display = "block";
  }

  if (allSolved && !caseSolved) {
    scanBtn.style.display = "none";
    finalBtn.style.display = "block";
  }

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
      window.location.href = "./overview.html";
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
  const raw = document.getElementById("morseAnswer").value || "";
  const input = raw.trim().toUpperCase();
  const normalized = input.replace(/\s+/g, ""); // "AFTER 9" -> "AFTER9"
  const feedback = document.getElementById("feedback");

  // akzeptiere mehrere Varianten
  const accepted = new Set([
    "AFTER9",
    "AFTERNINE",
    "AFTERNINEPM",
    "AFTER9PM"
  ]);

  if (accepted.has(normalized)) {
    localStorage.setItem("quiz4", "solved");
    feedback.style.fontFamily = "'Special Elite', monospace";
    feedback.textContent = "Correct! A new clue has been unlocked.";
    feedback.style.color = "#3cff6f";

    setTimeout(() => {
      window.location.href = "./overview.html";
    }, 1200);
  } else {
    feedback.style.fontFamily = "'Special Elite', monospace";
    feedback.textContent = "Incorrect. Decode the tones and try again (hint: it includes a time).";
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
   RESET 
===================== */

function resetGame() {
  localStorage.clear();
  window.location.href = "./index.html";
}

/* =====================
   MarkerScan 
===================== */

window.addEventListener("load", () => {
  if (!document.body.classList.contains("scan-page")) return;

  const markerToQuizNumber = {
    1: 1,  // m1 -> quiz1
    2: 2,  // m2 -> quiz2
    3: 3,  // m3 -> quiz3
    4: 4,  // m4 -> quiz4
    5: 5   // m5 -> quiz5
  };

  const quizNumberToPage = {
    1: "quiz1.html",
    2: "quiz2.html",
    3: "quiz3.html",
    4: "quiz4.html",
    5: "quiz5.html"
  };

  let locked = false;

  document.querySelectorAll("a-marker.m").forEach(marker => {
    marker.addEventListener("markerFound", () => {
      if (locked) return;
      locked = true;

      const markerId = Number(marker.dataset.id);
      const quizNr = markerToQuizNumber[markerId];

      if (!quizNr) {
        window.location.href = "./overview.html";
        return;
      }

      if (quizNr > 1) {
        const prevSolved = localStorage.getItem(`quiz${quizNr - 1}`) === "solved";
        if (!prevSolved) {
          window.location.href = `./locked.html?need=${quizNr - 1}&tried=${quizNr}`;
          return;
        }
      }

      setTimeout(() => {
        window.location.href = `./${quizNumberToPage[quizNr]}`;
      }, 150);
    });
  });
});

/* =====================
   LOCKED PAGE
===================== */

window.addEventListener("load", () => {
  if (!document.body.classList.contains("locked-page")) return;

  const params = new URLSearchParams(window.location.search);
  const need = params.get("need");
  const tried = params.get("tried");

  if (need && tried) {
    const text = document.getElementById("lockedText");
    if (text) {
      text.innerHTML = `
        This clue is not available yet.<br>
        Solve clue ${need} before scanning clue ${tried}.
      `;
    }
  }
});

/* =====================
   OVERVIEW BACK LINK
===================== */

window.addEventListener("load", () => {
  if (!document.body.classList.contains("overview")) return;

  const back = document.getElementById("backLink");
  if (!back) return;

  const from = new URLSearchParams(window.location.search).get("from");

  switch (from) {
    case "briefing":
      back.href = "./briefing.html";
      break;

    case "instructions":
      back.href = "./instructions.html";
      break;

    case "index":
    default:
      back.href = "./index.html";
      break;
  }
});

window.addEventListener("load", () => {
  if (!document.body.classList.contains("instructions-page")) return;

  const back = document.getElementById("backLink");
  if (!back) return;

  const from = new URLSearchParams(window.location.search).get("from");

  switch (from) {
    case "briefing":
      back.href = "./briefing.html";
      break;
    case "overview":
      back.href = "./overview.html?from=briefing";
      break;
    case "index":
    default:
      back.href = "./index.html";
      break;
  }
});

