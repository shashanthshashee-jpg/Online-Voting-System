// Candidate list
const candidates = ["Rahul", "Priya", "Arjun", "Sneha"];

let chart;

// Start app when page loads
document.addEventListener("DOMContentLoaded", init);

function init() {
    initializeVotes();
    renderResults();

    document
        .getElementById("voteForm")
        .addEventListener("submit", submitVote);

    document
        .getElementById("themeToggle")
        .addEventListener("click", toggleTheme);
}

// Initialize vote storage
function initializeVotes() {

    if (!localStorage.getItem("votes")) {

        let votes = {};

        candidates.forEach(c => votes[c] = 0);

        localStorage.setItem("votes", JSON.stringify(votes));
    }

    if (!localStorage.getItem("voters")) {
        localStorage.setItem("voters", JSON.stringify([]));
    }
}

// Handle vote submission
function submitVote(event) {

    event.preventDefault();

    const name = document.getElementById("voterName").value.trim();

    const selected = document.querySelector('input[name="candidate"]:checked');

    if (!name || !selected) {
        showMessage("Please enter name and select candidate", "red");
        return;
    }

    let voters = JSON.parse(localStorage.getItem("voters"));

    // Check duplicate voter
    if (voters.includes(name)) {
        showMessage("Voter already recorded", "orange");
        return;
    }

    // Save voter name
    voters.push(name);
    localStorage.setItem("voters", JSON.stringify(voters));

    // Add vote
    addVote(selected.value);

    showMessage("Vote recorded successfully", "green");

    renderResults();

    clearForm();
}

// Add vote to candidate
function addVote(candidate) {

    let votes = getVotes();

    votes[candidate]++;

    saveVotes(votes);
}

// Get votes from storage
function getVotes() {
    return JSON.parse(localStorage.getItem("votes"));
}

// Save votes
function saveVotes(votes) {
    localStorage.setItem("votes", JSON.stringify(votes));
}

// Calculate total votes
function totalVotes(votes) {

    return Object.values(votes).reduce((a, b) => a + b, 0);
}

// Render vote results
function renderResults() {

    const results = document.getElementById("results");

    results.innerHTML = "";

    let votes = getVotes();

    let total = totalVotes(votes);

    for (let c in votes) {

        let percent = total ? ((votes[c] / total) * 100).toFixed(1) : 0;

        results.innerHTML += `
        <div>
        <strong>${c}</strong> - ${votes[c]} votes (${percent}%)

        <div class="progress">
        <div class="bar" style="width:${percent}%"></div>
        </div>

        </div>
        `;
    }

    renderChart(votes);
}

// Render chart using Chart.js
function renderChart(votes) {

    const ctx = document.getElementById("voteChart");

    if (chart) chart.destroy();

    chart = new Chart(ctx, {
        type: "pie",
        data: {
            labels: Object.keys(votes),
            datasets: [{
                data: Object.values(votes),
                backgroundColor: [
                    "#4CAF50",
                    "#2196F3",
                    "#FFC107",
                    "#E91E63"
                ]
            }]
        }
    });
}

// Show message
function showMessage(text, color) {

    const msg = document.getElementById("message");

    msg.textContent = text;

    msg.style.color = color;
}

// Clear form after vote
function clearForm() {

    document.getElementById("voteForm").reset();
}

// Toggle dark/light theme
function toggleTheme() {

    document.body.classList.toggle("dark");
}

// Reset all votes
function resetVotes() {

    localStorage.removeItem("votes");

    localStorage.removeItem("voters");

    initializeVotes();

    renderResults();

    showMessage("All votes reset", "blue");
}
