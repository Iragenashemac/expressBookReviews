const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");

const regd_users = express.Router();

let users = [];


// Check if username is valid (not already existing)
const isValid = (username) => {

  let user = users.filter(
    user => user.username === username
  );

  if (user.length > 0) {
    return false;
  }

  return true;

};


// Check if username and password match
const authenticatedUser = (username, password) => {

  let validUsers = users.filter(
    user =>
      user.username === username &&
      user.password === password
  );

  if (validUsers.length > 0) {
    return true;
  }

  return false;

};



// ==========================
// Task 7 — Login user
// Endpoint: /customer/login
// ==========================

regd_users.post("/login", (req, res) => {

  const username = req.body.username;
  const password = req.body.password;

  if (!username || !password) {
    return res.status(404).json({
      message: "Username and password required"
    });
  }

  if (authenticatedUser(username, password)) {

    let accessToken = jwt.sign(
      {
        data: username
      },
      "access",
      { expiresIn: 60 * 60 }
    );

    req.session.authorization = {
      accessToken,
      username
    };

    return res.status(200).json({
      message: "User successfully logged in"
    });

  } else {
    return res.status(208).json({
      message: "Invalid login"
    });
  }

});



// ==========================
// Task 8 — Add or modify review
// ==========================

regd_users.put("/auth/review/:isbn", (req, res) => {

  const isbn = req.params.isbn;

  const review = req.query.review;

  const username = req.session.authorization.username;

  if (!books[isbn]) {
    return res.status(404).json({
      message: "Book not found"
    });
  }

  // Add or modify review
  books[isbn].reviews[username] = review;

  return res.status(200).json({
    message: "Review added or modified successfully"
  });

});



// ==========================
// Task 9 — Delete review
// ==========================

regd_users.delete("/auth/review/:isbn", (req, res) => {

  const isbn = req.params.isbn;

  const username = req.session.authorization.username;

  if (!books[isbn]) {
    return res.status(404).json({
      message: "Book not found"
    });
  }

  if (books[isbn].reviews[username]) {

    delete books[isbn].reviews[username];

    return res.status(200).json({
      message: "Review deleted successfully"
    });

  } else {

    return res.status(404).json({
      message: "You have no review for this book"
    });

  }

});



module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;