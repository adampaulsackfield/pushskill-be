# PushSkill

## Description

This API was created as part of the final project phase of the Northcoders bootcamp.

The API has several endpoints, most of which are protected using JWT. The databse was created using MongoDB and a chat functionality is enabled using socket.io. The purpose of the API was to create a way to allow a user to sign up, login and get authenticated. Once authenticated they can access a list of the other registered users and post messages to a message table. This will then be utlisied in the front-end to allow two users to chat in real time. Users can also recieve achievements which are stored in their entry on the users table. The users password is encrypted using Json Web Token before being stored in the database.

a hosted version of the API can be found at: https://pushskill.herokuapp.com

Team members:

- Adam Sackfield - github: adampaulsackfield
- Dane Whitfield - github: danewhitfield
- Abdirasak Ahmed - github: abdirasak
- Owen Corrigan - github: ojcorrigan

---

### Dependencies

- bcryptjs
- cors
- dotenv
- express
- jsonwebtoken
- mongoose
- nodemon
- socket.io

for testing:

- jest
- supertest

---

#### Using the API

Local use:

1.  Fork the repo on git hub.

2.  Once you have the URL for your forked repo run navigate your terminal to the folder you wish to clone it into. Once there run the command

        git clone

3.  After your repo is cloned you will need to install the dependencies listed above using the following command:

        npm i

4.  When they have finished installing you can start the server. You can do this using the custom script:

        npm run server

5.  Your terminal should now display the message:

         listening on 9090

         connected

6.  To access the endpoints you will need to you API client software such as Insomnia. The end points and how to access them can be found below.

---

#### Minimum Versions

| Dependency   | Version |
| ------------ | ------- |
| bcrypt       | v2      |
| cors         | v2      |
| dotenv       | v16     |
| express      | v4      |
| jsonwebtoken | v8      |
| mongoose     | v6      |
| nodemon      | v2      |
| socket.io    | v6      |

---

#### Available Scripts

`npm test` - runs test on all test suites

`npm run server` - starts the server locally

---

#### Endpoints

**For all the protected endpoints you will need to send a valid token as authorisation in the following format:** **_Bearer tokenhere_**

- GET /api/hc - Health check route logs to the console 'API is running'

- POST /api/users - allows registration of a new user.

  - example send: {"username": "example", "password": "password123"}

  - example response: {<br>

    "user": {<br>
    "username": "example",<br>
    "traits": [],<br>
    "learningInterests": [],<br>
    "achievements": [],<br>
    "password": "_encypted password_", <br>
    "\_id": "6", <br>
    "\_\_v": 0<br>
    }}

- POST /api/users/login - allows a user to recieve a token which will give them access to protected routes.

  - example send: {"username": "example", "password": "password123"}

  - example response: {<br>
    "user": { <br>
    "username": "example",
    "id": "6",<br>
    "token": "_token_"<br>
    }}

- GET /api/users - See a list of registered users. **Protected route**

  - example response: {<br>
    users: [ <br>
    {*user1 data*}, {*user2 data*}, {*user3 data*}<br>
    ]}

- PATCH /api/users/:user_id - add an achievement to the user by user_id. **Protected route**

  - example send body: {"name": "_achievement name_", "description": "_description_"
    }

- GET /api/rooms - retrieves an array of all the chat rooms a user is participant in. **Protected route**

  - example response: {<br>
    rooms: [<br>
    {*room1 data*}, {*room2 data*}<br>
    ]}

- POST /api/rooms - create a new chat room with 2 users in **Protected route**

  - example send: {<br>
    creator: "_user1_", <br>
    member: "_user2_ <br>
    }

  - example response: {<br>
    "room": {<br>
    "creator": "_user1_",<br>
    "member": "_user2_", <br>
    "messages": [],<br>
    "\_id": "_id_",<br>
    "createdAt": "2022-05-04T10:17:05.446Z",<br>
    "updatedAt": "2022-05-04T10:17:05.446Z",<br>
    "\_\_v": 0 <br>
    }}

- GET /api/rooms/:room_id - User can get a single room using the room_id **Protected route**

  - example response: {<br>
    "room": {<br>
    "creator": "_user1_",<br>
    "member": "_user2_", <br>
    "messages": [],<br>
    "\_id": "_id_",<br>
    "createdAt": "2022-05-04T10:17:05.446Z",<br>
    "updatedAt": "2022-05-04T10:17:05.446Z",<br>
    "\_\_v": 0 <br>
    }}

- GET /api/rooms/:room_id/messages - User can retrieve all of the messages asscociated with a room **Protected route**

  - example response: {<br>
    "messages": [<br>
    {*messagedata*}, {*messagedata*}, {*messagedata*},<br>
    ]}

- GET /api/messages - returns an array of all messages **Protected route**

  - example response: {<br>
    "messages": [<br>
    {*messagedata*}, {*messagedata*}, {*messagedata*},<br>
    ]}

- POST /api/messages - allows user to add a message to the message table **Protected route**

  - example send: {<br>
    room*id: roomId,<br>
    recipientId: '\_user_id*',<br>
    message: 'This is a test message',<br>
    }
  - example response: {<br>
    {message: <br>
    room*id: roomId,<br>
    recipientId: '\_user_id*',<br>
    message: 'This is a test message',<br>
    senderId: '_senderId_ <br>
    "createdAt": "2022-05-04T10:17:05.446Z", <br>
    "updatedAt": "2022-05-04T10:17:05.446Z", <br>
    "\_\_v": 0<br>
    }}
