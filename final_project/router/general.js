const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const axios = require('axios'); // Required for Tasks 10-13

// Task 6: Register a new user
public_users.post("/register", (req,res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (username && password) {
    const userExists = users.filter((user) => user.username === username);
    if (userExists.length === 0) {
      users.push({"username": username, "password": password});
      return res.status(200).json({message: "User successfully registered. Now you can login"});
    } else {
      return res.status(404).json({message: "User already exists!"});    
    }
  } 
  return res.status(400).json({message: "Username and password are required."});
});

// Task 1: Get the book list available in the shop
public_users.get('/',function (req, res) {
  // Using a Promise to resolve the book data
  let getBooksPromise = new Promise((resolve, reject) => {
    resolve(res.status(200).send(JSON.stringify(books, null, 4)));
  });

  getBooksPromise.then(() => console.log("Task 1/10 Promise resolved"));
});

// Task 2: Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  const isbn = req.params.isbn;
  let getBookPromise = new Promise((resolve, reject) => {
    if(books[isbn]) {
      resolve(res.status(200).send(books[isbn]));
    } else {
      reject(res.status(404).json({message: "Book not found"}));
    }
  });

  getBookPromise
    .then(() => console.log("Task 2/11 Promise resolved"))
    .catch(() => console.log("Task 2/11 Promise rejected"));
});
  
// Task 3: Get book details based on author
public_users.get('/author/:author',function (req, res) {
  const author = req.params.author;
  let getAuthorPromise = new Promise((resolve, reject) => {
    let booksByAuthor = {};
    let isbns = Object.keys(books);
    isbns.forEach((isbn) => {
      if(books[isbn].author === author) {
        booksByAuthor[isbn] = books[isbn];
      }
    });
    resolve(res.status(200).send(JSON.stringify(booksByAuthor, null, 4)));
  });

  getAuthorPromise.then(() => console.log("Task 3/12 Promise resolved"));
});

// Task 4: Get all books based on title
public_users.get('/title/:title',function (req, res) {
  const title = req.params.title;
  let getTitlePromise = new Promise((resolve, reject) => {
    let booksByTitle = {};
    let isbns = Object.keys(books);
    isbns.forEach((isbn) => {
      if(books[isbn].title === title) {
        booksByTitle[isbn] = books[isbn];
      }
    });
    resolve(res.status(200).send(JSON.stringify(booksByTitle, null, 4)));
  });

  getTitlePromise.then(() => console.log("Task 4/13 Promise resolved"));
});

// Task 5: Get book review
public_users.get('/review/:isbn',function (req, res) {
  const isbn = req.params.isbn;
  if (books[isbn]) {
    return res.status(200).send(books[isbn].reviews);
  } else {
    return res.status(404).json({message: "Book not found"});
  }
});


// ==========================================
// TASKS 10-13: AXIOS & ASYNC/AWAIT EXAMPLES
// ==========================================
// These functions simulate external API calls using Axios

// Task 10: Get all books using async/await and Axios
const getAllBooksWithAxios = async () => {
    try {
        const response = await axios.get('http://localhost:5000/');
        console.log(response.data);
    } catch (error) {
        console.error("Error fetching books:", error);
    }
};

// Task 11: Get book details by ISBN using Promises and Axios
const getBookByISBNWithAxios = (isbn) => {
    axios.get(`http://localhost:5000/isbn/${isbn}`)
    .then(response => {
        console.log(response.data);
    })
    .catch(error => {
        console.error("Error fetching book by ISBN:", error);
    });
};

// Task 12: Get book details by Author using async/await and Axios
const getBookByAuthorWithAxios = async (author) => {
    try {
        const response = await axios.get(`http://localhost:5000/author/${author}`);
        console.log(response.data);
    } catch (error) {
        console.error("Error fetching book by author:", error);
    }
};

// Task 13: Get book details by Title using async/await and Axios
const getBookByTitleWithAxios = async (title) => {
    try {
        const response = await axios.get(`http://localhost:5000/title/${title}`);
        console.log(response.data);
    } catch (error) {
        console.error("Error fetching book by title:", error);
    }
};

module.exports.general = public_users;