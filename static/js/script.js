var btnPageOne = document.getElementById('btnPrevious');
var btnPageTwo = document.getElementById('btnNext');

function getReqres(pageNo) {
    document.getElementById('pageNumber').innerHTML = pageNo;
    var request = new XMLHttpRequest();
    request.open('GET', 'https://reqres.in/api/users?page=' + pageNo);
    request.onload = function () {
        var jReponse = JSON.parse(request.response);
        createTable(jReponse);
    }
    request.send();
}


function getUsers(pageNo) {
    document.getElementById('pageNumber').innerHTML = pageNo;
    var request = new XMLHttpRequest();
    request.open('GET', 'https://reqres.in/api/users?page=' + pageNo);
    request.onload = function () {
        var jReponse = JSON.parse(request.response);
        createTable(jReponse);
    }
    request.send();
}


function createTable(users) {
    var table = document.getElementById('tblUsers');

    // reset table
    table.innerHTML = "";

    // create header row
    var headerRow = table.insertRow(index = -1);
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

        var tRow = table.insertRow(index = -1);

        // event listener for get request upon click
        // must use let here, as var overwrites each command with the next. 
        // let uses block level scope, thus not overwriting the last command each loop. 
        let thisUser = parseInt(user);
        tRow.addEventListener('click', function() {getUser(thisUser+1)});

        var tCell0 = tRow.insertCell(index = 0);
        tCell0.innerHTML = users.data[user].id;

        var tCell1 = tRow.insertCell(index = 1);
        tCell1.innerHTML = users.data[user].email;

        var tCell2 = tRow.insertCell(index = 2);
        tCell2.innerHTML = users.data[user].first_name;

        var tCell3 = tRow.insertCell(index = 3);
        tCell3.innerHTML = users.data[user].last_name;

        var tCell4 = tRow.insertCell(index = 4);
        tCell4.innerHTML = "<img src='" + users.data[user].avatar + "'/>";

    }

}

function getUser(userID) {
    var pageNo = document.getElementById('pageNumber').innerHTML;
    userID = userID + (pageNo * 6) - 6;
    var request = new XMLHttpRequest();
    request.open('GET', '/users/' + userID);
    request.onload = function () {
        var jReponse = JSON.parse(request.response);
        refreshUpdateCredentials(jReponse);
    }
    request.send();
}

function refreshUpdateCredentials(response) {
    // document.getElementById('userAvatar').src = "test.jpg";
    return console.log(response);
}

getReqres(1);

// function() {} used to pass parameter without calling function on this line of code.
// found out about this from Mozilla documentation of addEventListener.
btnPageOne.addEventListener('click', function () { getReqres(1) });
btnPageTwo.addEventListener('click', function () { getReqres(2) });

