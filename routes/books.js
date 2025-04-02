const express = require('express');
const router = express.Router();

const Book = require('../models/book');
const Author = require('../models/author');
const Genre = require('../models/genre');
// Adding the comment model import
const Comment = require('../models/comment');

router.get('/', function(req, res, next) {
  const books = Book.all
  res.render('books/index', { title: 'BookedIn || books', books: books });
});

router.get('/form', async (req, res, next) => {
  res.render('books/form', { title: 'BookedIn || Books', authors: Author.all, genres: Genre.all });});

router.post('/upsert', async (req, res, next) => {
  console.log('body: ' + JSON.stringify(req.body))
  Book.upsert(req.body);
  let createdOrupdated = req.body.id ? 'updated' : 'created';
  req.session.flash = {
    type: 'info',
    intro: 'Success!',
    message: `the book ${req.body.title} has been ${createdOrupdated}!`,
  };
  res.redirect(303, '/books')
});

router.get('/edit', async (req, res, next) => {
  let bookIndex = req.query.id;
  let book = Book.get(bookIndex);
  res.render('books/form', {
    title: 'BookedIn || Books',
    book: book,
    bookIndex: bookIndex,
    authors: Author.all,
    genres: Genre.all
  });
});

router.get('/show/:id', async (req, res, next) => {
  const book = Book.get(req.params.id);
  if (!book) {
    return res.status(404).send('Book not found');
  }
  var templateVars = {
    title: "BookedIn || show",
    book: book,
    bookId: book.id // Add this line to ensure template gets the proper ID
  };
  var templateVars = {
    title: "BookedIn || show",
    book: Book.get(req.params.id)
  }
  if (req.session.currentUser) {
    templateVars.currentUser = req.session.currentUser;
  }
  if (templateVars.book.authorIds) {
    templateVars.authors = templateVars.book.authorIds.map((authorId) => Author.get(authorId));
  }
  if (templateVars.book.genreId) {
    templateVars['genre'] = Genre.get(templateVars.book.genreId);
  }
// Adjusting for show.handlebars to pull in the comments
  templateVars.comments = Comment.AllForBook(req.params.id);

  res.render('books/show', templateVars);
});

module.exports = router;
