var jsonData;

async function startPage1() {
    await fetch("./data.json")
        .then(response => response.json())
        .then(data => jsonData = data);
    loadPage1();
}

function loadPage1() {

}



function prepRent() {
    // Get the modal
    var modal = document.getElementById("myModal");

    // Get the button that opens the modal
    var btn = document.getElementById("myBtn");
    var pickBtn = document.getElementById("pick");
    var closeBtn = document.getElementById("closeBtn");
    var startDate = document.getElementById("startDate");
    var endDate = document.getElementById("endDate");

    

    // Get the <span> element that closes the modal
    var span = document.getElementsByClassName("close")[0];

    // When the user clicks on <span> (x), close the modal
    span.onclick = function () {
        modal.style.display = "none";
    }

    pickBtn.onclick = function(){
        var name = document.getElementById("name").value;
        var email = document.getElementById("email").value;

        if(name && email && startDate && endDate){
            alert(name + " a request has been submited for the following dates.\nStart Date:" + startDate.value + "\nEnd Date:"+ endDate.value + "\nyou will get an email with follow up information. The email was sent to:\n"+email);
        }else{
            alert("Invalid input: Please fill out all the information");
        }
        
    }

    closeBtn.onclick = function () {
        modal.style.display = "none";
    }

    // When the user clicks anywhere outside of the modal, close it
    window.onclick = function (event) {
        if (event.target == modal) {
            modal.style.display = "none";
        }
    }
}

function openModal(carname){
    prepRent();
    var modal = document.getElementById("myModal");
    var modalTitle = document.getElementById("modalTitle");
    var modalDescription = document.getElementById("modalDescription");
    var modalImage = document.getElementById("modalImage");
    var modalPrice = document.getElementById("modalPrice");

    let rentData = jsonData.page2.find((car) => car.carName == carname);

    modalTitle.innerHTML = carname;
    modalDescription.innerHTML = rentData.description;
    modalImage.innerHTML = `<img src="${rentData.image}" alt="${rentData.carName}" width="50%" height="50%"/>`;
    modalPrice.innerHTML = `<p>Price = $${rentData.price}/day`;


    modal.style.display = "block";


}

function loadRent(carName) {

}


async function startPage2() {
    await fetch("./data.json")
        .then(response => response.json())
        .then(data => jsonData = data);
    loadPage2();
}

function loadPage2() {
    
    let page2 = document.getElementById("cards");
    page2.innerHTML = "";
    for (let card of jsonData["page2"]) {
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
                                <button onclick="javascript:openModal('${name}')" type="button" class="btn btn-sm btn-outline-secondary">View</button>
                        </div>
                        <small class="text-muted">\$${price}/day</small>
                    </div>
                </div>
            </div>
        </div>
    `;
    }

}

function page2SortBy(field, order = 1) {
    let pos;
    let temp;
    let arr = jsonData["page2"];
    for (let i = 0; i < arr.length - 1; i++) {
        pos = i;
        for (let p = i; p < arr.length; p++) {
            let tester = (Number.isInteger(arr[p][field])) ? order * arr[p][field] : arr[p][field];
            let testy = (Number.isInteger(arr[pos][field])) ? order * arr[pos][field] : arr[pos][field];
            if (tester < testy) {
                pos = p;
            }
        }
        temp = arr[pos];
        arr[pos] = arr[i];
        arr[i] = temp;
    }
    loadPage2();
}

