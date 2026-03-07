const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

public_users.post("/register", (req, res) => {
     //Write your code here
     const { username, password } = req.body;
  
    if (!username || !password) {
      return res.status(400).json({ message: "Username and password are required" });
    }
  
    const userExists = users.some((user) => user.username === username);
  
    if (userExists) {
      return res.status(409).json({ message: "Username already exists!" });
    }
  
    users.push({ "username": username, "password": password });
    
    return res.status(201).json({ message: "User successfully registered. Now you can login" });
  });

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  //Write your code here
  const bookList = JSON.stringify(books, null, 4)
  return res.status(200).send(bookList);
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
    const isbn = req.params.isbn;

    const book = books[isbn];

    if (book) {
        return res.status(200).send(JSON.stringify(book, null, 4));
    } else {
        return res.status(404).json({ message: "Book not found" });
    }
});
  
// Get book details based on author
public_users.get('/author/:author', function (req, res) {
    const author = req.params.author;
    
    const keys = Object.keys(books);
    
    let filtered_books = [];

    keys.forEach(key => {
        if (books[key].author === author) {
            filtered_books.push(books[key]);
        }
    });

    if (filtered_books.length > 0) {
        return res.status(200).send(JSON.stringify(filtered_books, null, 4));
    } else {
        return res.status(404).json({ message: "No books found by this author" });
    }
});

// Get all books based on title
public_users.get('/title/:title', function (req, res) {
   const title = req.params.title;
    
    const keys = Object.keys(books);
    
    let results = [];
  
    for (let i = 0; i < keys.length; i++) {
      let isbn = keys[i];
      if (books[isbn].title === title) {
        results.push(books[isbn]);
      }
    }
  
    if (results.length > 0) {
      return res.status(200).send(JSON.stringify(results, null, 4));
    } else {
      return res.status(404).json({ message: "No books found with this title" });
    }
  });

//  Get book review
public_users.get('/review/:isbn', function (req, res) {
    const isbn = req.params.isbn;
  
    const book = books[isbn];
  
    if (book) {
        return res.status(200).send(JSON.stringify(book.reviews, null, 4));
    } else {
        return res.status(404).json({ message: "Book not found" });
    }
  });

module.exports.general = public_users;
