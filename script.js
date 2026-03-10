const candidates=["Rahul","Priya","Arjun","Sneha"]

let chart

document.addEventListener("DOMContentLoaded",init)

function init(){

initializeVotes()

renderResults()

document
.getElementById("voteForm")
.addEventListener("submit",submitVote)

document
.getElementById("themeToggle")
.addEventListener("click",toggleTheme)

}

function initializeVotes(){

if(!localStorage.getItem("votes")){

let votes={}

candidates.forEach(c=>votes[c]=0)

localStorage.setItem("votes",JSON.stringify(votes))

}

}

function submitVote(e){

e.preventDefault()

const name=document.getElementById("voterName").value

const selected=document.querySelector('input[name="candidate"]:checked')

if(!name || !selected){

showMessage("Please enter name and select candidate","red")
return

}

let votes=getVotes()

votes[selected.value]++

saveVotes(votes)

showMessage("Vote recorded successfully","green")

renderResults()

}

function getVotes(){

return JSON.parse(localStorage.getItem("votes"))

}

function saveVotes(votes){

localStorage.setItem("votes",JSON.stringify(votes))

}

function totalVotes(votes){

return Object.values(votes).reduce((a,b)=>a+b,0)

}

function renderResults(){

const results=document.getElementById("results")

results.innerHTML=""

let votes=getVotes()

let total=totalVotes(votes)

for(let c in votes){

let percent=total?((votes[c]/total)*100).toFixed(1):0

results.innerHTML+=`
<div>
<strong>${c}</strong> - ${votes[c]} votes (${percent}%)
<div class="progress">
<div class="bar" style="width:${percent}%"></div>
</div>
</div>
`

}

renderChart(votes)

}

function renderChart(votes){

const ctx=document.getElementById("voteChart")

if(chart) chart.destroy()

chart=new Chart(ctx,{
type:"pie",
data:{
labels:Object.keys(votes),
datasets:[{
data:Object.values(votes),
backgroundColor:[
"#4CAF50",
"#2196F3",
"#FFC107",
"#E91E63"
]
}]
}
})

}

function showMessage(text,color){

const msg=document.getElementById("message")

msg.textContent=text

msg.style.color=color

}

function toggleTheme(){

document.body.classList.toggle("dark")

}

function resetVotes(){

localStorage.clear()

initializeVotes()

renderResults()

}