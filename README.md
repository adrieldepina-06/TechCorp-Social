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
  * .env                backend configuration file
  * routes/             API route files
  * middleware/         authentication middleware
  * uploads/            uploaded post images
  * sql/schema.sql      database tables
  * sql/initDb.js       optional helper file, not used automatically

Main Features

* User registration
* User login
* JWT authentication
* User profile
* Public/private profile setting
* Friend requests
* Accept/reject friend requests
* View sent and received friend requests
* Remove friend
* Create posts
* Create posts with optional image
* Public/private post visibility
* Like/unlike posts
* Delete own posts
* Add comments to posts
* Like/unlike comments
* Protect private profiles and private posts
* Public posts from private accounts are hidden from non-friends
* Delete own posts and remove uploaded image file from uploads folder
* Bidirectional friendships: when two users become friends, two friendship records are stored in the database.
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

Create the database:

CREATE DATABASE IF NOT EXISTS mini_social_network;

Then run the SQL file:

backend/sql/schema.sql

This creates all tables needed by the project.

3. Backend Setup

Open terminal inside the backend folder:

cd backend

Install packages:

npm install

Run backend:

npm run dev

Backend runs on:

http://localhost:5000

4. Frontend Setup

Open another terminal in the main project folder:

npm install

Run frontend:

npm run dev

Frontend usually runs on:

http://localhost:5173

Environment Variables

The backend needs a .env file inside the backend folder:

PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=mini_social_network
JWT_SECRET=my_secret_key_123

Note: DB_PASSWORD must match the local MySQL password.

Important Notes

* Passwords are hashed using bcrypt before saving in MySQL.
* JWT tokens are used to protect private routes.
* Uploaded images are saved in backend/uploads.
* MySQL only stores the image path, not the image file itself.
* schema.sql is the official database setup file.
* initDb.js is optional and is not called automatically from server.js.
* Only the post owner can delete a post.
* Only the comment owner can delete a comment.
* Private profiles and posts are protected in the backend, not only in the frontend.
* When a post with an image is deleted, the backend also deletes the image file from the uploads folder.
* Friendships are stored bidirectionally in the database. When two users become friends, the `friendships` table stores two records: one from User A to User B and another from User B to User A. This makes friend-list and timeline queries simpler because the backend can directly search friendships where `user1_id` is the logged-in user.

# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
