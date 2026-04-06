const express = require('express');
const axios = require('axios');

let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;

const public_users = express.Router();


// ==========================
// Task 6 — Register user
// ==========================

public_users.post("/register", (req, res) => {

  const username = req.body.username;
  const password = req.body.password;

  if (!username || !password) {
    return res.status(404).json({
      message: "Username and password required"
    });
  }

  if (!isValid(username)) {
    return res.status(404).json({
      message: "User already exists"
    });
  }

  users.push({
    username: username,
    password: password
  });

  return res.status(200).json({
    message: "User successfully registered"
  });

});


// =======================================================
// Task 10 — Get all books using Async / Await with Axios
// =======================================================

public_users.get('/', async function (req, res) {

  try {

    const response = await axios.get(
      "http://localhost:5000/"
    );

    return res.status(200).json(
      response.data
    );

  } catch (error) {

    return res.status(500).json({
      message: "Error retrieving books"
    });

  }

});


// =======================================================
// Task 11 — Get book by ISBN using Async / Await
// =======================================================

public_users.get('/isbn/:isbn', async function (req, res) {

  const isbn = req.params.isbn;

  try {

    const response = await axios.get(
      `http://localhost:5000/isbn/${isbn}`
    );

    return res.status(200).json(
      response.data
    );

  } catch (error) {

    return res.status(500).json({
      message: "Error retrieving book by ISBN"
    });

  }

});


// =======================================================
// Task 12 — Get books by Author using Async / Await
// =======================================================

public_users.get('/author/:author', async function (req, res) {

  const author = req.params.author;

  try {

    const response = await axios.get(
      `http://localhost:5000/author/${author}`
    );

    return res.status(200).json(
      response.data
    );

  } catch (error) {

    return res.status(500).json({
      message: "Error retrieving books by author"
    });

  }

});


// =======================================================
// Task 13 — Get books by Title using Async / Await
// =======================================================

public_users.get('/title/:title', async function (req, res) {

  const title = req.params.title;

  try {

    const response = await axios.get(
      `http://localhost:5000/title/${title}`
    );

    return res.status(200).json(
      response.data
    );

  } catch (error) {

    return res.status(500).json({
      message: "Error retrieving books by title"
    });

  }

});


// ==========================
// Get book review
// ==========================

public_users.get('/review/:isbn', function (req, res) {

  const isbn = req.params.isbn;

  return res.status(200).json(
    books[isbn].reviews
  );

});

module.exports.general = public_users;