const input = document.querySelector('.input')
const stats = document.querySelector('.stats')

const headers = {
  'method': "GET",
  'headers': {
    "Authorization": "ff59b7c1-3bcbb4c5-4757ac40-041a5fed"
  }
}

async function fetch_data(url) {
  if (url) {
    let data = await fetch(url, headers)
    data = data.json()
    return data
  } else {
    alert('Must be a VALID url.')
  }
}

async function getAccountId(name = "") {
  if (name) {
    const data = await fetch_data("https://fortniteapi.io/v1/lookup?username=" + name)
    return data.account_id
  } else {
    alert('Must be a VALID name!')
  }
}

//{account:{level:0, season:0}, global_stats:{duo:{}, solo:{}, trio:{}, squad: {}}, name:"", seasons_available:0, result:true}

//kd: number,kills: number,lastmodified: number, matchesplayed: number, minutesplayed: number, placetop1: number, placetop10: number, placetop12: number, placetop25: number, placetop3: number, placetop5: number, placetop6: number, playersoutlived: number, score: number, winrate: number

const ids = [
  'kd',
  'kills',
  'matchesplayed',
  'minutesplayed',
  'placetop1',
  'placetop10',
  'placetop3',
  'placetop5',
  'playersoutlived',
  'winrate'
];

const account_ids = [
	"level",
  "process_pct"
]

const teams = ["duo","trio", "squad"]
const solo = document.querySelector('.stat.solo')

function splitUp(string){
  return string.replace(/([a-z])([A-Z])/g, '$1 $2')
}

function capFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

function makeStats(){ 
  for (const team of teams){
    const div = document.createElement('div')

    const h2 = document.createElement('h2')
    h2.innerText = `${capFirstLetter(team)} Stats`

    div.appendChild(h2)

    div.classList.add('stat', team)

    for (const id of ids){
      const ele = document.createElement('p');
      const split = splitUp(id)

ele.innerHTML = `${capFirstLetter(split)}: <span id="${team}-${id}"></span>`;
      ele.childNodes[0].id = `${team}-${id}`
  
      div.appendChild(ele)
    }

    stats.appendChild(div)
  }
}
makeStats()

function handleData(stats = {}) {
  for (const team in stats){
  	for (const id in stats[team]){
    	const value = stats[team][id]
      try{
      	document.getElementById(team + '-' + id).innerText = " " + value
      } catch(e){}
    }
  }
}

function handleMain(user = "") {
  if (user) {
    getAccountId(user)
      .then((id) => {
        if (id) {
          fetch_data('https://fortniteapi.io/v1/stats?account=' + id)
            .then((data) => {
              if (data.result) {
              console.log(data)
              	for (const id in data.account){
                	const val = data.account[id]
                  if (account_ids.includes(id)){
                  	document.getElementById('accounts-' + id).innerText = val
                  }
                }
                
                const stats = data.global_stats
                handleData(stats)
              } else {
                alert(data.message || "Account is most likely private")
              }
            })
        } else {
          alert("Couldn't find user. Invalid Username?")
        }
      })
  }
}

function enter() {
  if (input.value != "" && input.value.length > 3 - 1) {
    handleMain(input.value)
    input.value = ""
  }
}

document.addEventListener('keyup', function(e) {
  if (e.key == "Enter") {
    enter()
  }
})

input.addEventListener('input', function() {
  input.value = input.value.toString().substring(0, 19)
})
