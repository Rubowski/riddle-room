const modal = document.getElementById("modal");
const closeModal = document.getElementById("closeModal");
const roomTitle = document.getElementById("roomTitle");
const riddleText = document.getElementById("riddleText");
const choicesDiv = document.getElementById("choices");
const message = document.getElementById("message");
const winOverlay = document.getElementById("winOverlay");
const restartButton = document.getElementById("restartButton");
const bgMusic = document.getElementById("bgMusic");
const toggleButton = document.getElementById("toggleMusic");
const volumeSlider = document.getElementById("volumeSlider");
const titleScreen = document.getElementById("titleScreen");
const gameContainer = document.querySelector(".game-container");
const startGameBtn = document.getElementById("startGameBtn");
const items = {
    1: { name: "Ancient Key", icon: "🔑" },
    2: { name: "Crystal Ball", icon: "🔮" },
    3: { name: "Magic Scroll", icon: "📜" },
    4: { name: "Silver Feather", icon: "🪶" }
  };
  
const collectedItems = {
    1: false,
    2: false,
    3: false,
    4: false,
};

let timeElapsed = 0;
let timerInterval;
let musicOn = true;

startGameBtn.addEventListener("click", () => {
    titleScreen.style.display = "none";
    gameContainer.style.display = "flex";
    startTimer();
});

function startTimer() {
  timerInterval = setInterval(() => {
    timeElapsed++;
    document.getElementById("timeElapsed").textContent = timeElapsed;
  }, 1000);
}

function stopTimer() {
  clearInterval(timerInterval);
}

function resetTimer() {
  timeElapsed = 0;
  startTimer();
}

toggleButton.addEventListener("click", () => {
  musicOn = !musicOn;
  if (musicOn) {
    bgMusic.play();
    toggleButton.textContent = "🔈 Music: On";
  } else {
    bgMusic.pause();
    toggleButton.textContent = "🔇 Music: Off";
  }
});

function startMusic() {
  bgMusic.volume = volumeSlider.value / 100;
  bgMusic.play().catch(() => {
    toggleButton.textContent = "▶️ Click to enable music";
  });
}

startMusic();

volumeSlider.addEventListener("input", () => {
  const volume = volumeSlider.value / 100;
  bgMusic.volume = volume;
});

const riddles = {
  1: {
    question: "What has to be broken before you can use it?",
    choices: ["Egg", "Clock", "Bottle"],
    answer: "Egg",
  },
  2: {
    question: "What goes up but never comes down?",
    choices: ["Balloon", "Age", "Rocket"],
    answer: "Age",
  },
  3: {
    question: "What has hands but can't clap?",
    choices: ["Monkey", "Clock", "Robot"],
    answer: "Clock",
  },
  4: {
    question: "What can you catch but not throw?",
    choices: ["Cold", "Ball", "Frisbee"],
    answer: "Cold",
  },
};

// Open modal with riddle
document.querySelectorAll(".room").forEach(room => {
  room.addEventListener("click", () => {
    const roomNum = room.dataset.room;
    const riddle = riddles[roomNum];

    roomTitle.textContent = `Room ${roomNum}`;
    riddleText.textContent = riddle.question;
    choicesDiv.innerHTML = "";

    riddle.choices.forEach(choice => {
      const btn = document.createElement("button");
      btn.textContent = choice;
      btn.addEventListener("click", () => checkAnswer(choice, riddle.answer, roomNum));
      choicesDiv.appendChild(btn);
    });

    modal.classList.remove("hidden");
  });
});

// Close modal
closeModal.addEventListener("click", () => {
  modal.classList.add("hidden");
  message.textContent = "";
});

// Define dependencies as an object
const dependencies = {
    2: [1],  // Room 2 requires item from Room 1
    4: [3],  // Room 4 requires item from Room 3
  };
  
  // Check if dependencies for a room are met
  function dependenciesMet(roomNum) {
    if (!dependencies[roomNum]) return true; // no dependencies
    return dependencies[roomNum].every(depRoom => collectedItems[depRoom]);
  }

  // Check answer
  function checkAnswer(selected, correct, roomNum) {
    message.textContent = ""; // clear previous message
    if (selected === correct) {
      playSound("soundCorrect");
      if (collectedItems[roomNum]) {
        alert(`You already collected the item from Room ${roomNum}.`);
      } else if (!dependenciesMet(roomNum)) {
        alert(`You must collect the required items from other rooms first!`);
      } else {
        alert(`Correct! You found the item in Room ${roomNum}.`);
        collectedItems[roomNum] = true;
        updateInventory(roomNum);
        checkWinCondition();
      }
      modal.classList.add("hidden");
    } else {
        playSound("soundWrong");
        alert("Wrong answer. Try again.");
    }
  }
  
  
  function updateInventory(roomNum) {
    const slot = document.querySelector(`.slot[data-slot="${roomNum}"]`);
    const item = items[roomNum];
    if (slot && item) {
        slot.innerHTML = `
        <div style="font-size: 28px;">${item.icon}</div>
        <div style="font-size: 12px; margin-top: 4px;">${item.name}</div>
      `;
      slot.style.backgroundColor = "#e1f5e1";
      slot.style.border = "2px solid #2a7a2a";
    }
  }
  
function checkWinCondition() {
  const allCollected = Object.values(collectedItems).every(Boolean);
  if (allCollected) {
    winOverlay.classList.remove("hidden");
    playSound("soundWin");
    setTimeout(() => {}, 200);
    stopTimer();
  }
  
}

restartButton.addEventListener("click", () => {
  // Reset collected items
  for (const key in collectedItems) {
    collectedItems[key] = false;
  }
  
  // Clear inventory UI
  document.querySelectorAll(".slot").forEach(slot => {
    slot.textContent = "";
    slot.style.border = "1px solid #333";
    slot.style.backgroundColor = "#f9f9f9";
  });
  
  // Hide win overlay and modal/message
  winOverlay.classList.add("hidden");
  modal.classList.add("hidden");
  message.textContent = "";

  stopTimer();
  resetTimer();
});
  
  function playSound(id) {
    const sound = document.getElementById(id);
    if (sound) {
      sound.currentTime = 0; // rewind
      sound.play();
    }
  }