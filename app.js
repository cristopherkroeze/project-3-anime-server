var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var mongoose = require('mongoose');
var cors = require('cors');



var animesRouter = require('./routes/animes');
var authRouter = require('./routes/auth');
var charactersRouter = require('./routes/characters');
var commentsRouter = require('./routes/comments');
var usersRouter = require('./routes/users');
var photoRouter = require('./routes/photo');
var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.set('trust proxy', 1);
app.enable('trust proxy');

app.use(
    cors({
      origin: ['http://localhost:3000']
    })
  );
  

app.use('/animes', animesRouter);
app.use('/auth', authRouter);
app.use('/characters', charactersRouter);
app.use('/comments', commentsRouter);
app.use('/users', usersRouter);
app.use('/photo', photoRouter)


mongoose
  .connect(process.env.MONGODB_URI)
  .then((x) => {
    console.log(`Connected to Mongo! Database name: "${x.connections[0].name}"`);
  })
  .catch((err) => {
    console.error("Error connecting to mongo: ", err);
  });

module.exports = app;
