import math
import json
from flask import Flask, render_template, request, jsonify

app = Flask(__name__)

# used a separate json file for persistence.
with open('users.json') as file:
    userList = json.load(file)


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
    if len(userID) == 0:
        return "Error no userID provided"

    # data in request is string, needs to be converted into json
    requestData = json.loads(request.data)

    userInt = int(userID) - 1

    # update copy of userList in RAM with new details
    userList[userInt]["id"] = requestData['id']
    userList[userInt]["email"] = requestData['email']
    userList[userInt]["first_name"] = requestData['first_name']
    userList[userInt]["last_name"] = requestData['last_name']

    # write this onto users.json file for persistence.
    with open('users.json', 'w') as file:
        json.dump(userList, file, indent=4)
    return userList[userInt]


app.run(debug=True)
