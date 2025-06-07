const owner = "slu-csci-5030";  
const repo = "dads";            

async function loadIssues() {
  const open = await fetch(`https://api.github.com/repos/${owner}/${repo}/issues?state=open&per_page=1`);
  const closed = await fetch(`https://api.github.com/repos/${owner}/${repo}/issues?state=closed&per_page=1`);
  
  const openCount = open.headers.get('Link')?.match(/&page=(\d+)>/)?.[1] || (await open.json()).length;
  const closedCount = closed.headers.get('Link')?.match(/&page=(\d+)>/)?.[1] || (await closed.json()).length;
  
  document.getElementById("issues").innerHTML = `
    <h2>GitHub Issues</h2>
    <p>Open Issues: ${openCount}</p>
    <p>Closed Issues: ${closedCount}</p>
  `;
}

function setupBurndown() {
  const ctx = document.getElementById("burndownChart").getContext("2d");
  new Chart(ctx, {
    type: "line",
    data: {
      labels: ["Mon", "Tue", "Wed", "Thu", "Fri"],
      datasets: [{
        label: "Tasks Remaining",
        data: [10, 8, 6, 3, 0], // Example data
        borderColor: "blue",
        fill: false
      }]
    },
    options: {
      scales: {
        y: { beginAtZero: true }
      }
    }
  });
}

function setMood(mood) {
  localStorage.setItem("teamMood", mood);
  document.getElementById("currentMood").textContent = `Current Mood: ${mood}`;
}

function loadMood() {
  const mood = localStorage.getItem("teamMood");
  if (mood) document.getElementById("currentMood").textContent = `Current Mood: ${mood}`;
}

function saveIdeas() {
  const ideas = document.getElementById("ideasBox").value;
  localStorage.setItem("teamIdeas", ideas);
  alert("Ideas saved!");
}

function loadIdeas() {
  const ideas = localStorage.getItem("teamIdeas");
  if (ideas) document.getElementById("ideasBox").value = ideas;
}

async function init() {
  await loadIssues();
  setupBurndown();
  loadMood();
  loadIdeas();
}

init();
