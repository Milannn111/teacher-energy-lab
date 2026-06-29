const MAX_SCORE = 100;

const needs = [
  {
    id: "basic",
    title: "Basic Energy",
    theory: "Physiological Needs",
    hints: "salary, rest, workload, teaching resources"
  },
  {
    id: "safety",
    title: "Safety Energy",
    theory: "Safety Needs",
    hints: "stability, clear policy, safe environment"
  },
  {
    id: "connection",
    title: "Connection Energy",
    theory: "Love & Belonging Needs",
    hints: "teamwork, PLC, collaboration, positive culture"
  },
  {
    id: "recognition",
    title: "Recognition Energy",
    theory: "Esteem Needs",
    hints: "respect, achievement, awards, leadership roles"
  },
  {
    id: "growth",
    title: "Growth Energy",
    theory: "Self-Actualization Needs",
    hints: "creativity, innovation, research, professional growth"
  }
];

const levelOneCases = [
  {
    level: 1,
    title: "The exhausted science teacher",
    text: "A science teacher has been covering extra classes for three weeks. She says the lab materials are running out, and she no longer has time to eat lunch calmly.",
    answers: ["basic"],
    why: "The strongest signal is a physiological need. Motivation is difficult to sustain when rest, workload, and basic resources are not protected.",
    move: "Review workload, protect break time, and provide the teaching materials needed for daily work."
  },
  {
    level: 1,
    title: "The teacher who waits for clear rules",
    text: "A teacher wants to improve, but the evaluation rubric keeps changing. He asks leaders for the same clarification after every meeting.",
    answers: ["safety"],
    why: "The strongest signal is a safety need. Unclear expectations create uncertainty and reduce teachers' willingness to invest effort.",
    move: "Clarify the policy, publish stable criteria, and explain how decisions will be made."
  },
  {
    level: 1,
    title: "The new teacher outside the team",
    text: "A new teacher rarely joins grade-level planning and has not built close relationships with colleagues. She says she is unsure where she belongs.",
    answers: ["connection"],
    why: "The strongest signal is a love and belonging need. Social connection and collaboration help teachers feel part of the school community.",
    move: "Use PLC routines, peer mentoring, and team planning to build belonging."
  },
  {
    level: 1,
    title: "The invisible contributor",
    text: "A teacher supports student clubs and helps younger colleagues prepare lessons, but these contributions are rarely acknowledged in public.",
    answers: ["recognition"],
    why: "The strongest signal is an esteem need. The teacher wants professional contribution, effort, and achievement to be seen.",
    move: "Recognize the contribution publicly and offer meaningful leadership opportunities."
  },
  {
    level: 1,
    title: "The innovator with no platform",
    text: "A confident teacher wants to lead a project-based learning study and mentor colleagues, but she has no platform or authority to try it.",
    answers: ["growth"],
    why: "The strongest signal is self-actualization. The teacher is ready to create, innovate, and realize professional potential.",
    move: "Provide professional development, research time, mentoring roles, and support for innovation."
  }
];

const levelTwoCases = [
  {
    level: 2,
    title: "A talented teacher is close to burnout",
    text: "A high-performing teacher is praised informally, but she is also overloaded with extra tasks and has no protected time to recover.",
    answers: ["basic", "recognition"],
    why: "This case combines physiological and esteem needs. Recognition matters, but it cannot replace reasonable workload and recovery time.",
    move: "Reduce unnecessary workload while making her contribution visible through meaningful recognition."
  },
  {
    level: 2,
    title: "A new policy creates anxiety and silence",
    text: "After a sudden curriculum policy change, teachers are unsure what will be evaluated. In meetings, they avoid speaking because they do not know whether their ideas are welcome.",
    answers: ["safety", "connection"],
    why: "This case combines safety and belonging. Teachers need clear expectations and a trusting team climate before they will participate openly.",
    move: "Clarify the policy and create structured team dialogue where teachers can ask questions safely."
  },
  {
    level: 2,
    title: "A strong teacher wants more than awards",
    text: "A senior teacher receives annual awards, but she says the recognition feels repetitive. She wants to design a school-wide mentoring project for younger teachers.",
    answers: ["recognition", "growth"],
    why: "This case combines esteem and self-actualization. Past achievement should be respected, while the teacher also needs a pathway to grow and lead.",
    move: "Acknowledge her expertise and authorize her to lead a mentoring or innovation project."
  },
  {
    level: 2,
    title: "A novice teacher has resources but little confidence",
    text: "A novice teacher has classroom materials, but she feels alone after difficult lessons. She is afraid to ask questions because she thinks others may judge her.",
    answers: ["connection", "safety"],
    why: "This case combines belonging and safety. The teacher needs supportive relationships and psychological security to learn from challenges.",
    move: "Pair her with a mentor, normalize help-seeking, and create nonjudgmental lesson reflection routines."
  },
  {
    level: 2,
    title: "An innovative team is stuck in unclear conditions",
    text: "A group of teachers wants to pilot interdisciplinary learning, but no one knows whether the schedule, assessment rules, or leadership support will stay stable.",
    answers: ["growth", "safety"],
    why: "This case combines self-actualization and safety. Innovation needs creative space, but it also needs stable conditions and clear boundaries.",
    move: "Give the team pilot authority, define assessment expectations, and protect time for experimentation."
  }
];

const screens = {
  start: document.querySelector("#startScreen"),
  play: document.querySelector("#playScreen"),
  result: document.querySelector("#resultScreen")
};

const startButton = document.querySelector("#startButton");
const restartButton = document.querySelector("#restartButton");
const nextButton = document.querySelector("#nextButton");
const resetRoundButton = document.querySelector("#resetRoundButton");
const submitButton = document.querySelector("#submitButton");
const scoreText = document.querySelector("#scoreText");
const levelText = document.querySelector("#levelText");
const roundText = document.querySelector("#roundText");
const caseTitle = document.querySelector("#caseTitle");
const caseText = document.querySelector("#caseText");
const allocationTitle = document.querySelector("#allocationTitle");
const allocationHint = document.querySelector("#allocationHint");
const allocators = document.querySelector("#allocators");
const resourcesLeft = document.querySelector("#resourcesLeft");
const feedback = document.querySelector("#feedback");
const resultBadge = document.querySelector("#resultBadge");
const allocationText = document.querySelector("#allocationText");
const bestMatchText = document.querySelector("#bestMatchText");
const feedbackText = document.querySelector("#feedbackText");
const actionText = document.querySelector("#actionText");
const energyFill = document.querySelector("#energyFill");
const resultTitle = document.querySelector("#resultTitle");
const resultText = document.querySelector("#resultText");

let currentCase = 0;
let score = 0;
let allocation = {};
let submitted = false;
let activeCases = [];

function shuffle(items) {
  return [...items]
    .map((item) => ({ item, sort: Math.random() }))
    .sort((a, b) => a.sort - b.sort)
    .map(({ item }) => item);
}

function buildGameCases() {
  return [...shuffle(levelOneCases), ...shuffle(levelTwoCases)];
}

function showScreen(name) {
  Object.values(screens).forEach((screen) => screen.classList.remove("is-active"));
  screens[name].classList.add("is-active");
}

function getCurrentItem() {
  return activeCases[currentCase];
}

function getResourceLimit(item = getCurrentItem()) {
  return item.level === 1 ? 1 : 2;
}

function getAllocatedTotal() {
  return Object.values(allocation).reduce((total, value) => total + value, 0);
}

function getSelectedNeedIds() {
  return Object.entries(allocation)
    .filter(([, value]) => value > 0)
    .map(([needId]) => needId);
}

function getNeedLabel(needId) {
  const need = needs.find((item) => item.id === needId);
  return need ? `${need.title} (${need.theory})` : needId;
}

function updateScore() {
  scoreText.textContent = `${score} / ${MAX_SCORE}`;
  energyFill.style.width = `${(score / MAX_SCORE) * 100}%`;
}

function updateResourceState() {
  const item = getCurrentItem();
  const limit = getResourceLimit(item);
  const left = limit - getAllocatedTotal();
  resourcesLeft.textContent = left;
  submitButton.disabled = submitted || left !== 0;

  document.querySelectorAll(".allocator-card").forEach((card) => {
    const needId = card.dataset.need;
    const value = allocation[needId] || 0;
    const minusButton = card.querySelector(".minus-button");
    const plusButton = card.querySelector(".plus-button");
    const resourceSlots = card.querySelectorAll(".resource-dot");

    card.querySelector(".resource-count").textContent = value;
    minusButton.disabled = submitted || value === 0;
    plusButton.disabled = submitted || left === 0 || value >= 1;
    resourceSlots.forEach((slot, index) => {
      slot.classList.toggle("is-filled", index < value);
    });
  });
}

function resetAllocation() {
  allocation = Object.fromEntries(needs.map((need) => [need.id, 0]));
  updateResourceState();
}

function renderAllocators() {
  const limit = getResourceLimit();
  allocators.innerHTML = "";

  needs.forEach((need) => {
    const card = document.createElement("article");
    card.className = "allocator-card";
    card.dataset.need = need.id;
    card.innerHTML = `
      <div class="allocator-heading">
        <div>
          <h3>${need.title}</h3>
          <p>${need.theory}</p>
        </div>
        <strong class="resource-count">0</strong>
      </div>
      <p class="allocator-hints">${need.hints}</p>
      <div class="resource-dots" aria-label="${need.title} resource slots">
        ${Array.from({ length: limit }, () => '<span class="resource-dot"></span>').join("")}
      </div>
      <div class="stepper">
        <button class="minus-button" type="button" aria-label="Remove resource from ${need.title}">-</button>
        <button class="plus-button" type="button" aria-label="Add resource to ${need.title}">+</button>
      </div>
    `;

    card.querySelector(".minus-button").addEventListener("click", () => changeAllocation(need.id, -1));
    card.querySelector(".plus-button").addEventListener("click", () => changeAllocation(need.id, 1));
    allocators.appendChild(card);
  });
}

function changeAllocation(needId, change) {
  if (submitted) return;

  const limit = getResourceLimit();
  const current = allocation[needId] || 0;
  const total = getAllocatedTotal();
  const next = current + change;

  if (next < 0 || next > 1) return;
  if (change > 0 && total >= limit) return;

  allocation[needId] = next;
  updateResourceState();
}

function renderCase() {
  const item = getCurrentItem();
  const limit = getResourceLimit(item);
  submitted = false;
  levelText.textContent = item.level === 1
    ? "Level 1: Identify the Main Need"
    : "Level 2: Balance Multiple Needs";
  roundText.textContent = `Question ${currentCase + 1} of ${activeCases.length}`;
  caseTitle.textContent = item.title;
  caseText.textContent = item.text;
  allocationTitle.textContent = `Allocate ${limit} Leadership ${limit === 1 ? "Resource" : "Resources"}`;
  allocationHint.textContent = item.level === 1
    ? "Choose the teacher's strongest unmet need."
    : "Choose two different needs. A complex situation usually requires balanced leadership support.";
  feedback.hidden = true;
  nextButton.textContent = currentCase === activeCases.length - 1 ? "View Report" : "Next Case";
  renderAllocators();
  resetAllocation();
}

function formatAllocation() {
  const selected = getSelectedNeedIds();
  if (!selected.length) return "No resources allocated.";
  return selected.map(getNeedLabel).join(" + ");
}

function evaluateRound() {
  const item = getCurrentItem();
  const limit = getResourceLimit(item);
  if (submitted || getAllocatedTotal() !== limit) return;
  submitted = true;

  const selected = getSelectedNeedIds();
  const correctCount = selected.filter((needId) => item.answers.includes(needId)).length;
  const roundScore = item.level === 1
    ? (correctCount === 1 ? 10 : 0)
    : correctCount * 5;
  const badge = correctCount === item.answers.length
    ? "Full Match"
    : correctCount > 0
      ? "Partial Match"
      : "Miss";

  score += roundScore;
  resultBadge.textContent = `${badge} +${roundScore}`;
  resultBadge.dataset.result = badge.toLowerCase().replace(" ", "-");
  allocationText.textContent = formatAllocation();
  bestMatchText.textContent = item.answers.map(getNeedLabel).join(" + ");
  feedbackText.textContent = item.why;
  actionText.textContent = item.move;
  feedback.hidden = false;
  updateScore();
  updateResourceState();
}

function showResult() {
  showScreen("result");
  updateScore();

  if (score >= 90) {
    resultTitle.textContent = "Strategic Motivation Leader";
    resultText.textContent = "Your team identified both simple and complex teacher needs with strong accuracy. This is the core leadership lesson: support becomes powerful when it matches the need behind the behavior.";
  } else if (score >= 70) {
    resultTitle.textContent = "Supportive School Leader";
    resultText.textContent = "Your team restored a strong level of teacher motivation. Review the partial matches to discuss how different needs can appear together in real school situations.";
  } else {
    resultTitle.textContent = "Needs Analyst in Training";
    resultText.textContent = "Your team found some signals but missed several core needs. Use the five levels as a diagnostic ladder: basic needs, safety, belonging, esteem, and self-actualization.";
  }
}

function startGame() {
  activeCases = buildGameCases();
  currentCase = 0;
  score = 0;
  updateScore();
  renderCase();
  showScreen("play");
}

startButton.addEventListener("click", startGame);

resetRoundButton.addEventListener("click", () => {
  if (!submitted) resetAllocation();
});

submitButton.addEventListener("click", evaluateRound);

nextButton.addEventListener("click", () => {
  if (currentCase === activeCases.length - 1) {
    showResult();
    return;
  }
  currentCase += 1;
  renderCase();
});

restartButton.addEventListener("click", startGame);

updateScore();
