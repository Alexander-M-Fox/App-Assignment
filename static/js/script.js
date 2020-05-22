var pageOne = document.getElementById('btnPrevious');
var pageTwo = document.getElementById('btnNext');

function getReqres(pageNo) {
    document.getElementById('pageNumber').innerHTML = pageNo;
    var request1 = new XMLHttpRequest();
    request1.open('GET', 'https://reqres.in/api/users?page=' + pageNo);
    request1.onload = function () {
        var jReponse = JSON.parse(request1.response);
        createTable(jReponse);
    }
    request1.send();
}

function createTable(users) {
    console.log(users.data);
    var table = document.getElementById('tblUsers');
    
    table.innerHTML = "";

    // create header row
    var headerRow = table.insertRow(index=-1);
    headerCell = document.createElement('th');
    headerCell.innerHTML = "User ID";
    headerRow.appendChild(headerCell);

    headerCell2 = document.createElement('th');
    headerCell2.innerHTML = "Email";
    headerRow.appendChild(headerCell2);

    headerCell3 = document.createElement('th');
    headerCell3.innerHTML = "First Name";
    headerRow.appendChild(headerCell3);

    headerCell4 = document.createElement('th');
    headerCell4.innerHTML = "Last Name";
    headerRow.appendChild(headerCell4);

    headerCell5 = document.createElement('th');
    headerCell5.innerHTML = "Avatar";
    headerRow.appendChild(headerCell5);

    for (user in users.data) {

        var tRow = table.insertRow(index=-1);

        var tCell0 = tRow.insertCell(index=0);
        tCell0.innerHTML = users.data[user].id;

        var tCell1 = tRow.insertCell(index=1);
        tCell1.innerHTML = users.data[user].email;

        var tCell2 = tRow.insertCell(index=2);
        tCell2.innerHTML = users.data[user].first_name;

        var tCell3 = tRow.insertCell(index=3);
        tCell3.innerHTML = users.data[user].last_name;

        var tCell4 = tRow.insertCell(index=4);
        tCell4.innerHTML = "<img src='" + users.data[user].avatar + "'/>";

    }

}

getReqres(1);

pageOne.addEventListener('click', function(){getReqres(1)});
pageTwo.addEventListener('click', function(){getReqres(2)});

