// @section: page-interactions
const scenarios = {
  code: {
    title: "Code Review Bot",
    text: `> Input: Pull request with 18 changed files\n> Context: coding standards + past bugs + security checklist\n> AI action: explain risk, suggest fixes, create test cases\n\nResult:\n✓ Finds hidden edge cases\n✓ Drafts review comments\n✓ Generates unit-test ideas\n✓ Saves senior developer review time`
  },
  logs: {
    title: "Incident Analyzer",
    text: `> Input: 2,000 deployment logs + alert timeline\n> Context: service map + recent releases + runbook\n> AI action: summarize incident, detect root-cause pattern, draft rollback notes\n\nResult:\n✓ 10-minute incident summary\n✓ Faster root-cause hypothesis\n✓ Cleaner handoff to engineering\n✓ Better postmortem documentation`
  },
  device: {
    title: "Device Health AI",
    text: `> Input: sensor values + firmware events + error codes\n> Context: normal operating range + maintenance history\n> AI action: classify anomaly, predict failure risk, generate technician note\n\nResult:\n✓ Early warning signals\n✓ Reduced manual diagnosis\n✓ Smarter field support\n✓ AI layer around embedded systems`
  }
};

const terminalTitle = document.querySelector("#terminalTitle");
const terminalText = document.querySelector("#terminalText");
const scenarioButtons = document.querySelectorAll(".scenario");
const pipeSteps = document.querySelectorAll(".pipe-step");
const roleCards = document.querySelectorAll(".role-card");
const roleOutput = document.querySelector("#roleOutput");
const routeButtons = document.querySelectorAll(".route-button");
const routeStatus = document.querySelector("#routeStatus");
const queryCircle = document.querySelector(".query-circle");
const masterCircle = document.querySelector(".master-agent-circle");
const pathQuery = document.querySelector("#path-query");
const pathPython = document.querySelector("#path-python");
const pathDevops = document.querySelector("#path-devops");
const pathEmbedded = document.querySelector("#path-embedded");
const pathDeveloper = document.querySelector("#path-developer");
const pathMisroute = document.querySelector("#path-misroute");
const subPython = document.querySelector(".sub-python");
const subDevops = document.querySelector(".sub-devops");
const subEmbedded = document.querySelector(".sub-embedded");
const subDeveloper = document.querySelector(".sub-developer");
const misrouteBubble = document.querySelector(".misroute-bubble");

function typeScenario(key) {
  const scenario = scenarios[key] || scenarios.code;
  terminalTitle.textContent = scenario.title;
  terminalText.textContent = "";
  pipeSteps.forEach((step) => step.classList.remove("active"));

  let i = 0;
  const text = scenario.text;
  const interval = window.setInterval(() => {
    terminalText.textContent += text.charAt(i);
    i += 1;
    const progressIndex = Math.min(pipeSteps.length - 1, Math.floor((i / text.length) * pipeSteps.length));
    pipeSteps.forEach((step, index) => step.classList.toggle("active", index <= progressIndex));
    if (i >= text.length) window.clearInterval(interval);
  }, 10);
}

scenarioButtons.forEach((button) => {
  button.addEventListener("click", () => {
    scenarioButtons.forEach((item) => item.classList.remove("active"));
    button.classList.add("active");
    typeScenario(button.dataset.scenario);
  });
});

roleCards.forEach((card) => {
  card.addEventListener("click", () => {
    roleCards.forEach((item) => item.classList.remove("active"));
    card.classList.add("active");
    roleOutput.querySelector("strong").textContent = card.dataset.role;
    roleOutput.querySelector("p").textContent = card.dataset.output;
    const tags = card.dataset.tags ? card.dataset.tags.split(",") : [];
    roleOutput.querySelector("#roleTags").innerHTML = tags
      .map((tag) => `<span>${tag.trim()}</span>`)
      .join("");
  });
});

function resetRouteVisualization() {
  [pathPython, pathDevops, pathEmbedded, pathDeveloper, pathMisroute].forEach(p => p && p.classList.remove('active'));
  subPython.classList.remove("route-highlight");
  subDevops.classList.remove("route-highlight");
  subEmbedded.classList.remove("route-highlight");
  subDeveloper.classList.remove("route-highlight");
  misrouteBubble.classList.remove("route-active");
  routeStatus.textContent = "Master Agent routes the query to the right specialist.";
  routeButtons.forEach((btn) => btn.classList.remove("active"));
}

function highlightRoute(route) {
  resetRouteVisualization();
  switch (route) {
    case "python":
      pathPython && pathPython.classList.add('active');
      subPython.classList.add("route-highlight");
      routeStatus.textContent = "Master Agent routes the Python question to the Python subagent for code and automation.";
      break;
    case "devops":
      pathDevops && pathDevops.classList.add('active');
      subDevops.classList.add("route-highlight");
      routeStatus.textContent = "Master Agent routes the deployment incident to the DevOps subagent for logs and rollback guidance.";
      break;
    case "embedded":
      pathEmbedded && pathEmbedded.classList.add('active');
      subEmbedded.classList.add("route-highlight");
      routeStatus.textContent = "Master Agent routes the device query to the Embedded subagent for telemetry and sensor context.";
      break;
    case "developer":
      pathDeveloper && pathDeveloper.classList.add('active');
      subDeveloper.classList.add("route-highlight");
      routeStatus.textContent = "Master Agent routes the integration request to the Developer subagent for delivery and UI integration.";
      break;
    case "misroute":
      pathDevops && pathDevops.classList.add('active');
      subDevops.classList.add("route-highlight");
      pathMisroute && pathMisroute.classList.add('active');
      misrouteBubble.classList.add("route-active");
      routeStatus.textContent = "Master Agent first misroutes the query, then detects the mismatch and reroutes to the correct role.";
      break;
    default:
      break;
  }
}

routeButtons.forEach((button) => {
  button.addEventListener("click", () => {
    routeButtons.forEach((item) => item.classList.remove("active"));
    button.classList.add("active");
    highlightRoute(button.dataset.route);
  });
});

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) entry.target.classList.add("in-view");
  });
}, { threshold: 0.16 });

document.querySelectorAll(".reveal").forEach((item, index) => {
  item.style.transitionDelay = `${Math.min(index * 35, 260)}ms`;
  observer.observe(item);
});

typeScenario("code");
