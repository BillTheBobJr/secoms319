var jsonData;

async function startPage1(){
    await fetch("./data.json")
    .then(response => response.json())
    .then(data => jsonData = data);
    loadPage1();
}

function loadPage1(){

}


async function startPage2(){
    await fetch("./data.json")
    .then(response => response.json())
    .then(data => jsonData = data);
    loadPage2();
}

function loadPage2(){

    let page2 = document.getElementById("cards");
    page2.innerHTML = "";
    for(let card of jsonData["page2"]){
        let name = card["carName"];
        let description = card["description"];
        let image = card["image"];
        let price = card["price"];
        page2.innerHTML += 
        `<div class = "col">
            <div class="card shadow-sm">
                <img src="${image}" alt="${name}">
                <div class="card-header">
                    <h2>${name}</h2>
                </div>
                <div class="card-body">
                    <p class="card-text">${description}</p>
                    <div class="d-flex justify-content-between align-items-center">
                        <div class="btn-group">
                            <a href="${image}">
                                <button type="button" class="btn btn-sm btn-outline-secondary">View</button>
                            </a>
                        </div>
                        <small class="text-muted">\$${price}/day</small>
                    </div>
                </div>
            </div>
        </div>
    `;
    }

}

function page2SortBy(field, order = 1){
    let pos;
    let temp;
    let arr = jsonData["page2"];
    for(let i = 0; i < arr.length - 1; i++){
        pos = i;
        for(let p = i; p < arr.length; p++){
            let tester = (Number.isInteger(arr[p][field])) ? order * arr[p][field]: arr[p][field];
            let testy = (Number.isInteger(arr[pos][field])) ? order * arr[pos][field]: arr[pos][field];
            if(tester < testy){
                pos = p;
            }
        }
        temp = arr[pos];
        arr[pos] = arr[i];
        arr[i] = temp;
    }
    loadPage2();
}

