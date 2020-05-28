import math
import json
from flask import Flask, render_template, request, jsonify

app = Flask(__name__)


@app.route('/')
def index():
    return render_template('users.html'), 200


@app.route('/users/', methods=["GET"])
def getUserList():
    page = int(request.args["page"])

    # select 6 users in same order as in users.json file, relative to page number.
    start = 6 * page - 6
    end = 6 * page

    # read users.json directly before accessing userList to ensure most up to date version is copied into variable
    with open('users.json') as file:
        userList = json.load(file)

    # return selection of users from all users, based on page number
    subList = userList[start:end]
    return jsonify({"data": subList}), 200


@app.route('/totalPages/')
def getTotalPages():

    # read users.json directly before accessing userList to ensure most up to date version is copied into variable
    with open('users.json') as file:
        userList = json.load(file)

    # page x of y - this function returns y.
    return str(math.ceil(len(userList) / 6)), 200


@app.route('/users/<userID>/', methods=["GET"])
def singleUser(userID):
    # if there is no userID, return full list.
    if len(userID) == 0:
        return getUserList

    userInt = int(userID)

    # read users.json directly before accessing userList to ensure most up to date version is copied into variable
    with open('users.json') as file:
        userList = json.load(file)

    # search through json file for correct user
    for user in userList:
        if user['id'] == str(userInt):
            return jsonify(user), 200

    # fail code
    return "User not found", 404


@app.route('/users/<userID>/', methods=["PUT"])
def updateUser(userID):
    if len(userID) == 0:
        return "Error no userID provided", 400

    # data in request is string, needs to be converted into json
    requestData = json.loads(request.data)

    userInt = int(userID)

    # read users.json directly before accessing userList to ensure most up to date version is copied into variable
    with open('users.json') as file:
        userList = json.load(file)

    for user in range(len(userList)):
        if userList[user]['id'] == str(userInt):
            found = True
            # update copy of userList in RAM with new details
            userList[user]["id"] = requestData['id']
            userList[user]["email"] = requestData['email']
            userList[user]["first_name"] = requestData['first_name']
            userList[user]["last_name"] = requestData['last_name']

            # write this onto users.json file for persistence.
            with open('users.json', 'w') as file:
                json.dump(userList, file, indent=4)
            return userList[user], 200

    return "error, user not found", 404


@app.route('/users/<userID>/', methods=["DELETE"])
def deleteUser(userID):
    if len(userID) == 0:
        return "Error no userID provided", 400  # 'bad request' http code

    userInt = int(userID)

    # read users.json directly before accessing userList to ensure most up to date version is copied into variable
    with open('users.json') as file:
        userList = json.load(file)

    found = False
    # search through json file for correct user
    for user in range(len(userList)):

        if userList[user]['id'] == str(userInt):
            found = True
            del userList[user]
            # write this onto users.json file for persistence.
            with open('users.json', 'w') as file:
                json.dump(userList, file, indent=4)
            return "success", 200

    if found == False:
        return "error user not found", 404


@app.route('/users/new/', methods=["POST"])
def createUser():
    # convert string to json
    userData = json.loads(request.data)

    # input validation
    if userData['email'] == "" or userData['first_name'] == "" or userData['last_name'] == "" or userData['avatar'] == "":
        return "createUser(): fields must not be empty", 400  # 'bad request' http code

    # read users.json directly before accessing userList to ensure most up to date version is copied into variable
    with open('users.json') as file:
        userList = json.load(file)

    # find id of last user in users.json
    lastUsedID = userList[len(userList) - 1]["id"]
    newID = str(int(lastUsedID) + 1)
    userData['id'] = newID

    # udate userList
    userList.append(userData)

    # update users.json
    with open('users.json', 'w') as file:
        json.dump(userList, file, indent=4)
    return "success", 200


if __name__ == "__main__":
    app.run(debug=True)
