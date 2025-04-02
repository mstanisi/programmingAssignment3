const express = require('express');
const router = express.Router();
const Comment = require('../models/comment');

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

  const newComment = {
    bookId: req.body.bookId,
    userEmail: req.session.currentUser.email,
    text: req.body.text
  };

  console.log('Adding comment:', newComment); // Debug

  Comment.add(newComment);
  res.redirect(`/books/show/${req.body.bookId}`);
});

module.exports = router;