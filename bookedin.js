const express = require("express");
const path = require("path");
const { credentials } = require('./config');

// Initialize app first
const app = express();
const port = 3000;

// Handlebars configuration
const handlebars = require('express-handlebars').create({
  helpers: {
    eq: (v1, v2) => v1 == v2,
    ne: (v1, v2) => v1 != v2,
    lt: (v1, v2) => v1 < v2,
    gt: (v1, v2) => v1 > v2,
    lte: (v1, v2) => v1 <= v2,
    gte: (v1, v2) => v1 >= v2,
    and() {
      return Array.prototype.every.call(arguments, Boolean);
    },
    or() {
      return Array.prototype.slice.call(arguments, 0, -1).some(Boolean);
    },
    someId: (arr, id) => arr && arr.some(obj => obj.id == id),
    in: (arr, obj) => arr && arr.some(val => val == obj),
    dateStr: (v) => v && v.toLocaleDateString("en-US")
  },
  layoutsDir: path.join(__dirname, 'views/layouts'),
  partialsDir: path.join(__dirname, 'views/partials')
});

// 1. Template Engine Setup
app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, 'views'));

// 2. Body Parsing Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// 3. Static Files (if you have any)
app.use(express.static(path.join(__dirname, 'public')));

// 4. Session/Cookie Middleware
const cookieParser = require('cookie-parser');
const session = require('express-session');
app.use(cookieParser(credentials.cookieSecret));
app.use(session({
  secret: credentials.cookieSecret,
  resave: false,
  saveUninitialized: false,
  cookie: { 
    maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
    httpOnly: true
  }
}));

// 5. CSRF Protection (must come after session)
const csrf = require('csurf');
app.use(csrf({ cookie: true }));

// 6. Response Local Variables
app.use((req, res, next) => {
  res.locals._csrfToken = req.csrfToken();
  res.locals.currentUser = req.session.currentUser;
  res.locals.flash = req.session.flash;
  if (req.session.flash) delete req.session.flash;
  next();
});

// 7. Route Handlers
const indexRouter = require('./routes/index');
const authorsRouter = require('./routes/authors');
const booksRouter = require('./routes/books');
const usersRouter = require('./routes/users');
const genresRouter = require('./routes/genres');
const commentsRouter = require('./routes/comments');

app.use('/', indexRouter);
app.use('/authors', authorsRouter);
app.use('/books', booksRouter);
app.use('/users', usersRouter);
app.use('/genres', genresRouter);
app.use('/comments', commentsRouter);

// 8. Error Handlers (must come after routes)
app.use((req, res) => {
  res.status(404).send(`
    <h1>404 - Not Found</h1>
    <p>The page you requested doesn't exist.</p>
  `);
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send(`
    <h1>500 - Server Error</h1>
    <p>Something went wrong:</p>
    <pre>${err.message}</pre>
  `);
});

// Start Server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
  console.log('Available routes:');
  console.log('GET  /books/show/:id');
  console.log('POST /comments');
  console.log('GET  /comments/:id/edit');
});