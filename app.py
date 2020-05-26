import math
from flask import Flask, render_template, request, jsonify

app = Flask(__name__)

userList = [
    {
        "id": 1,
        "email": "george.bluth@reqres.in",
        "first_name": "George",
        "last_name": "Bluth",
        "avatar": "https://s3.amazonaws.com/uifaces/faces/twitter/calebogden/128.jpg"
    },
    {
        "id": 2,
        "email": "janet.weaver@reqres.in",
        "first_name": "Janet",
        "last_name": "Weaver",
        "avatar": "https://s3.amazonaws.com/uifaces/faces/twitter/josephstein/128.jpg"
    },
    {
        "id": 3,
        "email": "emma.wong@reqres.in",
        "first_name": "Emma",
        "last_name": "Wong",
        "avatar": "https://s3.amazonaws.com/uifaces/faces/twitter/olegpogodaev/128.jpg"
    },
    {
        "id": 4,
        "email": "eve.holt@reqres.in",
        "first_name": "Eve",
        "last_name": "Holt",
        "avatar": "https://s3.amazonaws.com/uifaces/faces/twitter/marcoramires/128.jpg"
    },
    {
        "id": 5,
        "email": "charles.morris@reqres.in",
        "first_name": "Charles",
        "last_name": "Morris",
        "avatar": "https://s3.amazonaws.com/uifaces/faces/twitter/stephenmoon/128.jpg"
    },
    {
        "id": 6,
        "email": "tracey.ramos@reqres.in",
        "first_name": "Tracey",
        "last_name": "Ramos",
        "avatar": "https://s3.amazonaws.com/uifaces/faces/twitter/bigmancho/128.jpg"
    },
    {
        "id": 7,
        "email": "michael.lawson@reqres.in",
        "first_name": "Michael",
        "last_name": "Lawson",
        "avatar": "https://s3.amazonaws.com/uifaces/faces/twitter/follettkyle/128.jpg"
    },
    {
        "id": 8,
        "email": "lindsay.ferguson@reqres.in",
        "first_name": "Lindsay",
        "last_name": "Ferguson",
        "avatar": "https://s3.amazonaws.com/uifaces/faces/twitter/araa3185/128.jpg"
    },
    {
        "id": 9,
        "email": "tobias.funke@reqres.in",
        "first_name": "Tobias",
        "last_name": "Funke",
        "avatar": "https://s3.amazonaws.com/uifaces/faces/twitter/vivekprvr/128.jpg"
    },
    {
        "id": 10,
        "email": "byron.fields@reqres.in",
        "first_name": "Byron",
        "last_name": "Fields",
        "avatar": "https://s3.amazonaws.com/uifaces/faces/twitter/russoedu/128.jpg"
    },
    {
        "id": 11,
        "email": "george.edwards@reqres.in",
        "first_name": "George",
        "last_name": "Edwards",
        "avatar": "https://s3.amazonaws.com/uifaces/faces/twitter/mrmoiree/128.jpg"
    },
    {
        "id": 12,
        "email": "rachel.howell@reqres.in",
        "first_name": "Rachel",
        "last_name": "Howell",
        "avatar": "https://s3.amazonaws.com/uifaces/faces/twitter/hebertialmeida/128.jpg"
    },
    {
        "id": 13,
        "email": "TEMP TEST",
        "first_name": "TEST F NAME",
        "last_name": "TEST S NAME",
        "avatar": "data:image/jpeg;base64,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"
    }
]


@app.route('/')
def index():
    return render_template('users.html')


@app.route('/users/', methods=["GET"])
def getUserList():
    page = int(request.args["page"])
    start = 6 * page - 6
    end = 6 * page

    # return a subsection of userList based on page number
    subList = userList[start:end]
    return jsonify({"data": subList})


@app.route('/totalPages/')
def getTotalPages():
    # page x of y - this function returns y.
    return str(math.ceil(len(userList) / 6))


@app.route('/users/<userID>/', methods=["GET"])
def singleUser(userID):
    # if there is no userID, return full list.
    if len(userID) == 0:
        return getUserList

    userInt = int(userID) - 1
    if userInt < len(userList):
        return jsonify(userList[userInt])
    else:
        return "User not found", 404


@app.route('/users/<userID>/', methods=["PUT"])
def updateUser(userID):
    print("update user called")
    if len(userID) == 0:
        return "Error no userID provided"
    userInt = int(userID) - 1
    currUser = userList[userInt]
    print(currUser)
    return currUser


app.run()  # debug=True)
