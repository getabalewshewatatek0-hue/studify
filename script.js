let studyPlan = [];
let currentIndex = 0;
let timer;
let timeLeft = 0;
let isPaused = false;

// ADD SUBJECT
function addSubject() {
  let div = document.createElement("div");
  div.classList.add("subject");

  div.innerHTML = `
    <input placeholder="Subject name" class="name">
    <div class="difficulty-buttons">
  <button onclick="setDifficulty(this, 1)">Easy</button>
  <button onclick="setDifficulty(this, 2)">Medium</button>
  <button onclick="setDifficulty(this, 3)">Hard</button>
</div>
<input type="hidden" class="weight" value="1">
    <button onclick="this.parentElement.remove()">✖</button>
  `;

  document.getElementById("subjects").appendChild(div);
}

// GENERATE PLAN
function generatePlan() {
  let totalTime = parseInt(document.getElementById("totalTime").value);
let subjectDivs = document.querySelectorAll(".subject");

// ❌ IF INVALID → SHAKE BUTTON
if (!totalTime || subjectDivs.length === 0) {

  let btn = document.getElementById("generateBtn");

  btn.classList.add("shake");

  setTimeout(() => {
    btn.classList.remove("shake");
  }, 300);

  return;
}
  totalTime = parseInt(document.getElementById("totalTime").value);
  subjectDivs = document.querySelectorAll(".subject");

  if (!totalTime || subjectDivs.length === 0) {
    return;
  }

  studyPlan = [];
  let totalWeight = 0;
  let subjects = [];

  subjectDivs.forEach(div => {
    let name = div.querySelector(".name").value || "Subject";
    let weight = parseInt(div.querySelector(".weight").value);

    subjects.push({ name, weight });
    totalWeight += weight;
  });

  subjects.forEach(s => {
    let time = Math.round((s.weight / totalWeight) * totalTime);

    studyPlan.push({
      name: s.name,
      time: time * 60
    });
  });

  // 👇 SHOW PLAN (THIS IS NEW)
  let resultDiv = document.getElementById("result");
  resultDiv.innerHTML = "<h3>Your Study Plan 📋</h3>";

  studyPlan.forEach(s => {
    let minutes = Math.floor(s.time / 60);

    resultDiv.innerHTML += `
      <div style="background:#1e293b;padding:10px;margin-top:10px;border-radius:10px;">
        <strong>${s.name}</strong><br>
        ⏱ ${minutes} minutes
      </div>
    `;
  });
}

  studyPlan = [];
  let totalWeight = 0;
  let subjects = [];

  subjectDivs.forEach(div => {
    let name = div.querySelector(".name").value || "Subject";
    let weight = parseInt(div.querySelector(".weight").value);

    subjects.push({ name, weight });
    totalWeight += weight;
  });

  subjects.forEach(s => {
    let time = Math.round((s.weight / totalWeight) * totalTime);
    studyPlan.push({ name: s.name, time: time * 60 });
  });

  document.getElementById("result").innerText = "Plan ready!";


// START
function startStudy() {

  if (studyPlan.length === 0) {

    let btn = document.getElementById("startBtn");

    // 🔥 shake effect
    btn.classList.add("shake");

    setTimeout(() => {
      btn.classList.remove("shake");
    }, 300);

    return;
  }

  document.getElementById("setupScreen").style.display = "none";
  document.getElementById("focusScreen").style.display = "block";

  currentIndex = 0;
  runTimer();
}

// TIMER
function runTimer() {
  if (currentIndex >= studyPlan.length) {
    finishSession();
    return;
  }

  let current = studyPlan[currentIndex];
  timeLeft = current.time;

  clearInterval(timer);

  timer = setInterval(() => {
    if (isPaused) return;

    let min = Math.floor(timeLeft / 60);
    let sec = timeLeft % 60;

    document.getElementById("focusTitle").innerText = current.name;
    document.getElementById("focusTimer").innerText =
      `${min}:${sec.toString().padStart(2, "0")}`;

    let progress = ((current.time - timeLeft) / current.time) * 100;
    document.getElementById("progressFill").style.width = progress + "%";

    timeLeft--;

    if (timeLeft < 0) {
      playAlarm();
      vibrateAlert();

      currentIndex++;
      runTimer();
    }
  }, 1000);
}

// CONTROLS
function pauseStudy() {
  isPaused = true;
}

function resumeStudy() {
  isPaused = false;
}

function skipSubject() {
  currentIndex++;
  runTimer();
}

// FINISH
function finishSession() {
  clearInterval(timer);

  document.getElementById("focusScreen").style.display = "none";
  document.getElementById("endScreen").innerHTML = `
  <h2>🎉 Session Completed!</h2>
  <p>Great job staying focused 💪</p>
  <button onclick="restart()">Restart</button>
`;

document.getElementById("endScreen").style.display = "flex";
  launchConfetti();

}

// RESTART
function restart() {
  location.reload();
}

// 🔔 SOUND (reliable)
function playAlarm() {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.frequency.value = 800;
    gain.gain.value = 0.3;

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    setTimeout(() => {
      osc.stop();
      ctx.close();
    }, 300);
  } catch {}
}

// 📳 VIBRATION
function vibrateAlert() {
  if (navigator.vibrate) {
    navigator.vibrate([300, 150, 300]);
  }
}

// 🎉 CONFETTI
function launchConfetti() {
  const canvas = document.getElementById("confettiCanvas");
  const ctx = canvas.getContext("2d");

  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  let pieces = [];

  for (let i = 0; i < 100; i++) {
    pieces.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height - canvas.height,
      size: Math.random() * 6 + 4,
      speed: Math.random() * 3 + 2,
      color: `hsl(${Math.random() * 360},100%,50%)`
    });
  }

  let animationId;

  function update() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    pieces.forEach(p => {
      p.y += p.speed;
      ctx.fillStyle = p.color;
      ctx.fillRect(p.x, p.y, p.size, p.size);
    });

    animationId = requestAnimationFrame(update);
  }

  update();

  setTimeout(() => {
    cancelAnimationFrame(animationId);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  }, 4000);
}

// start with one subject
addSubject();
function launchConfetti() {
  for (let i = 0; i < 80; i++) {
    let confetti = document.createElement("div");
    confetti.className = "confetti";

    confetti.style.left = Math.random() * 100 + "vw";
    confetti.style.backgroundColor = 
      ["#22c55e", "#3b82f6", "#facc15", "#ef4444"][Math.floor(Math.random() * 4)];

    confetti.style.animationDuration = (Math.random() * 2 + 2) + "s";

    document.body.appendChild(confetti);

    setTimeout(() => {
      confetti.remove();
    }, 4000);
  }
}
function setDifficulty(btn, value) {
  let parent = btn.parentElement.parentElement;

  // remove active from all buttons
  parent.querySelectorAll("button").forEach(b => b.classList.remove("active"));

  // activate clicked
  btn.classList.add("active");

  // set value
  parent.querySelector(".weight").value = value;
}
