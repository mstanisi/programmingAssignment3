const express = require('express');
const router = express.Router();
const Comment = require('../models/comment');
const Book = require('../models/book');

// Edit comment form
router.get('/:id/edit', (req, res) => {
  if (!req.session.currentUser) {
    return res.redirect('/users/login');
  }
  
  const comment = Comment.get(req.params.id);
  if (comment.userEmail !== req.session.currentUser.email) {
    return res.status(403).send('Forbidden');
  }
  
  res.render('comments/edit', {
    title: "Edit Comment",
    comment: comment,
    bookId: comment.bookId
  });
});

// Update comment
router.post('/:id', (req, res) => {
  if (!req.session.currentUser) {
    return res.redirect('/users/login');
  }
  
  const comment = Comment.get(req.params.id);
  if (comment.userEmail !== req.session.currentUser.email) {
    return res.status(403).send('Forbidden');
  }
  
  comment.text = req.body.text;
  Comment.upsert(comment);
  
  res.redirect(`/books/show/${comment.bookId}`);
});

// Add new comment
router.post('/', (req, res) => {
  if (!req.session.currentUser) {
    return res.status(403).send('Forbidden');
  }

  if (!req.body.bookId) {
    return res.status(400).send('Missing book ID');
  }

  const book = Book.get(req.body.bookId); 
  if (!book) {
    return res.status(404).send('Book not found');
  }

  const newComment = {
    bookId: book.id,
    userEmail: req.session.currentUser.email,
    text: req.body.text
  };

  Comment.add(newComment);
  res.redirect(`/books/show/${book.id}`);
});

module.exports = router;