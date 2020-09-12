const express = require('express');
const connectDB = require('./config/db');
const cookieSession = require('cookie-session');
const bodyParser = require('body-parser');
const keys = require('./config/dev');
// const passport = require('passport');
const multer = require('multer');
const path = require('path');
require('./models/users');
// require('./services/passport');
require('./models/topic');

const app = express();

connectDB();

//    image disk storage

const storage = multer.diskStorage({
  destination:path.join(__dirname,'image/uploads'),
  filename: (req, file, cb) => {
    cb(null, new Date().getTime() + path.extname(file.originalname));
  }
});

app.use(multer.MulterError({storage}).single('image'));

//cookies for gOauth

// app.use(
//   cookieSession({
//     maxAge: 30*24*60*60*1000,         //setting cookie expire time for 30 days
//     keys: [keys.cookieKey]
//   })
// );

// app.use(passport.initialize());
// app.use(passport.session());
//@init middlewar
app.use(
  express.json({
    extended: false,
  })
);

// @define routes

app.use(bodyParser.json());

app.use('/api/users', require('./routes/api/users'));
app.use('/api/auth', require('./routes/api/auth'));
app.use('/api/profile', require('./routes/api/profile'));
app.use('/api/topic',require('./routes/api/topic'));

// require('./routes/api/auth')(app);
// require('./routes/api/authRoutes')(app);

const PORT = process.env.PORT || 5000;

app.listen(PORT); //Dont need the console log

module.exports = connectDB;
