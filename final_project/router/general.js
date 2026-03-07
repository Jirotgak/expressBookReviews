const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const axios = require('axios');

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
public_users.get('/', async function (req, res) {
    try {
        const response = await axios.get("http://localhost:5000/");
        
        return res.status(200).send(JSON.stringify(response.data, null, 4));
    } catch (error) {
        return res.status(500).json({ message: "Async Error fetching books", error: error.message });
    }
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', async function (req, res) {

    try {

        const { isbn } = req.params;

        const response = await axios.get(`http://localhost:5000/isbn/${isbn}`);

        return res.status(200).json(response.data);

    } catch (error) {

        const status = error.response ? error.response.status : 500;

        return res.status(status).json({
            message: "Book not found or API error"
        });

    }

});
  
// Get book details based on author
public_users.get('/author/:author', async function (req, res) {

    try {

        const { author } = req.params;

        const response = await axios.get(`http://localhost:5000/author/${author}`);

        return res.status(200).json(response.data);

    } catch (error) {

        const status = error.response ? error.response.status : 500;

        return res.status(status).json({
            message: "No books found or internal error"
        });

    }

});

// Get all books based on title
public_users.get('/title/:title', async function (req, res) {

    try {
      const { title } = req.params;
  
      const response = await axios.get(`http://localhost:5000/title/${title}`);
  
      return res.status(200).json(response.data);
  
    } catch (error) {
  
      const status = error.response ? error.response.status : 500;
  
      return res.status(status).json({
        message: "No books found or internal server error"
      });
  
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

