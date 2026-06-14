Mini Social Network Project

This project is a simple mini social network web application. It uses React with Vite for the frontend, Node.js with Express for the backend, and MySQL for the database.

Project Structure

TechCorp-Social/

* src/                  frontend React files
* public/               frontend public files
* package.json          frontend packages
* backend/              backend Node.js/Express API

  * server.js           main backend server file
  * db.js               MySQL database connection
  * .env                backend configuration
  * routes/             API route files
  * middleware/         authentication middleware
  * uploads/            uploaded post images
  * sql/schema.sql      database tables

Main Features

* User registration
* User login
* JWT authentication
* User profile
* Public/private profile setting
* Friend requests
* Accept/reject friend requests
* Remove friend
* Create posts
* Create posts with optional image
* Public/private post visibility
* Like/unlike posts
* Add comments
* Like/unlike comments
* Protect private posts from non-friends

Technologies Used

Frontend:

* React
* Vite
* Bootstrap

Backend:

* Node.js
* Express.js
* MySQL2
* bcrypt
* jsonwebtoken
* cors
* dotenv
* multer
* nodemon

Database:

* MySQL
* MySQL Workbench

How to Run the Project

1. Start MySQL

Open MySQL Workbench and make sure the MySQL server is running.

2. Create Database

Run the SQL file located at:

backend/sql/schema.sql

This creates the database tables.

3. Run Backend

Open terminal inside the backend folder:

cd backend

Install packages:

npm install

Run backend:

npm run dev

The backend will run on:

http://localhost:5000

Test backend:

http://localhost:5000

4. Run Frontend

Open another terminal in the main project folder:

npm install

Run frontend:

npm run dev

The frontend usually runs on:

http://localhost:5173

Environment Variables

The backend uses a .env file:

PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=root
DB_NAME=mini_social_network
JWT_SECRET=my_secret_key_123

Note: DB_PASSWORD should be changed depending on the local MySQL password.

Backend API Base URL

http://localhost:5000/api

Important Notes

* Passwords are not saved as plain text. They are hashed using bcrypt.
* JWT is used to protect private routes.
* Images are saved in the backend uploads folder, and only the image path is saved in MySQL.
* Private posts can only be seen by the post owner and friends.
