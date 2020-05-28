function getUsers(pageNo) {
    document.getElementById('pageNumber').innerHTML = pageNo;
    var request = new XMLHttpRequest();
    request.open('GET', '/users/?page=' + pageNo);
    request.onload = function () {
        if (request.readyState == 4 && request.status == '200') {
            // returns list of users within a page. 
            var jReponse = JSON.parse(request.response);
            getMaxPage();
            if (jReponse['data'].length == 0) {
                getUsers(pageNo-1);
                return "something";  // need a return here to stop createTable(jResponse) from overwriting recursion
            }
            createTable(jReponse);
        } else {
            console.error(JSON.parse(request.responseText));
        }

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
        let thisUser = parseInt(users.data[user].id);

        // needs to call backend for user ID
        tRow.addEventListener('click', function () { getUser(thisUser) });

        var tCell0 = tRow.insertCell(index = 0);
        tCell0.innerHTML = users.data[user].id;

        var tCell1 = tRow.insertCell(index = 1);
        tCell1.innerHTML = users.data[user].email;

        var tCell2 = tRow.insertCell(index = 2);
        tCell2.innerHTML = users.data[user].first_name;

        var tCell3 = tRow.insertCell(index = 3);
        tCell3.innerHTML = users.data[user].last_name;

        var tCell4 = tRow.insertCell(index = 4);
        tCell4.innerHTML = "<img src='" + users.data[user].avatar + "' style='width:128px; height:128px;' />";

    }

}

function getUser(userID) { // getUser (singular) is different from getUsers (plural) at the very top of script.js
    var pageNo = document.getElementById('pageNumber').innerHTML;

    var request = new XMLHttpRequest();
    request.open('GET', '/users/' + userID + '/');
    request.onload = function () {
        if (request.readyState == 4 && request.status == '200') {
            var jReponse = JSON.parse(request.response);
            refreshUpdateCredentials(jReponse);
        } else {
            console.log(JSON.parse(request.responseText));
        }

    }
    request.send();
}

function updateUser() {

    // pull data from form
    var data = {};
    data.id = document.getElementById('userID').value;
    data.email = document.getElementById('userEmail').value;
    data.first_name = document.getElementById('userFirstName').value;
    data.last_name = document.getElementById('userLastName').value;

    var json = JSON.stringify(data);

    // create and send put request to backend
    var request = new XMLHttpRequest();
    request.open('PUT', '/users/' + data.id + '/');
    request.onload = function () {
        if (request.readyState == 4 && request.status == '200') {
            // make "Save Changes" button provide feedback that user has been updated
            var button = document.getElementById('btnSaveUser')
            button.innerHTML = "User updated!";
            button.className = "w3-button w3-disabled w3-margin-top";
            getUsers(document.getElementById('pageNumber').innerHTML);
        } else {
            console.error(JSON.parse(request.responseText));
        }

    }
    request.send(json);
}

function deleteUser() {

    // pull data from form
    var id = document.getElementById('userID').value;

    var request = new XMLHttpRequest();
    request.open('DELETE', '/users/' + id + '/');
    request.onload = function () {
        if (request.readyState == 4 && request.status == '200') {
            // make "Save Changes" button provide feedback that user has been updated
            var button = document.getElementById('btnDeleteUser')
            button.innerHTML = "User deleted!";
            button.className = "w3-button w3-disabled w3-margin-top";
            getUser(1);
            getUsers(document.getElementById('pageNumber').innerHTML);
        } else {
            console.error(JSON.parse(request.responseText));
        }

    }
    request.send();
}

function newUser() {
    var newEmail = document.getElementById('newEmail').value;
    var newFirstName = document.getElementById('newFirstName').value;
    var newLastName = document.getElementById('newLastName').value;
    var newAvatar = document.getElementById('newAvatar').value;
    var newButton = document.getElementById('btnNewUser');
    // input validation
    if (
        newEmail == "" ||
        newFirstName == "" ||
        newLastName == "" ||
        newAvatar == ""
    ) {
        console.log("One or more fields are blank");
        newButton.innerHTML = "Error";
    }

    // POST request to backend
    var data = { "id": "", "email": newEmail, "first_name": newFirstName, "last_name": newLastName, "avatar": newAvatar };
    var json = JSON.stringify(data);

    var request = new XMLHttpRequest();
    request.open('POST', '/users/new/');
    request.onload = function () {
        if (request.readyState == 4 && request.status == "200") {
            // make "New User" button provide feedback that user has been created
            newButton.innerHTML = "User created!";
            document.getElementById('newEmail').value = "";
            document.getElementById('newFirstName').value = "";
            document.getElementById('newLastName').value = "";
            document.getElementById('newAvatar').value = "";
            newButton.className = "w3-button w3-disabled w3-margin-top";
            getUsers(document.getElementById('pageNumber').innerHTML);
        } else {
            console.error(JSON.parse(request.responseText));
        }

    }
    request.send(json);
}

function refreshUpdateCredentials(response) {
    // updates 'Update Credentials' container
    document.getElementById('userAvatar').src = response.avatar;
    document.getElementById('userAvatar').style = "width:160px; height:144px;"; // accounts for w3-padding
    document.getElementById('userID').value = response.id;
    document.getElementById('userEmail').value = response.email;
    document.getElementById('userFirstName').value = response.first_name;
    document.getElementById('userLastName').value = response.last_name;

    // ensure "save changes" button no longer says "user updated" from updateUser();
    var button1 = document.getElementById('btnSaveUser')
    button1.innerHTML = "Save Changes";
    button1.className = "w3-button w3-margin-top";
    button1.style = "background-color: #42B2A6; color:white;";

    // ensure "delete user" button no longer says "user deleted" from deleteUser();
    var button2 = document.getElementById('btnDeleteUser');
    button2.innerHTML = "Delete User";
    button2.className = "w3-button w3-margin-top";
    button2.style = "background-color: #42B2A6; color:white;";

    // ensure "new user" button no longer says "user created" from newUser();
    var newButton = document.getElementById('btnNewUser');
    newButton.innerHTML = "New User";
    newButton.className = "w3-button w3-margin-top"



}

getUsers(1);
getUser(1);

// function() {} used to pass parameter without calling function on this line of code.
// found out about this from Mozilla documentation of addEventListener.

function getMaxPage() {
    var request = new XMLHttpRequest();
    request.open('GET', '/totalPages/');
    request.onload = function () {
        if (request.readyState == 4 && request.status == '200') {
            var totalPages = request.response;
            document.getElementById('totalPages').innerHTML = totalPages;
            return totalPages;
        } else {
            console.error(JSON.parse(request.responseText));
        }

    }
    request.send();
}

var currPage = parseInt(document.getElementById('pageNumber').innerHTML);

var btnPageOne = document.getElementById('btnPrevious');
var btnPageTwo = document.getElementById('btnNext');

btnPageOne.addEventListener('click', function () {
    var prevPage = parseInt(document.getElementById('pageNumber').innerHTML) - 1;
    if (prevPage < 1) {
        prevPage = 1;
    }
    getUsers(prevPage);
});
btnPageTwo.addEventListener('click', function () {
    var nextPage = parseInt(document.getElementById('pageNumber').innerHTML) + 1;
    if (nextPage > parseInt(document.getElementById('totalPages').innerHTML)) {
        nextPage = parseInt(document.getElementById('totalPages').innerHTML);
    }
    getUsers(nextPage);
});

