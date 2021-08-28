if (process.env.NODE_ENV !== "production") {
    require('dotenv').config();
}

const express = require('express');
const app = express();
const basicRouter = require('../routers/basicRouters');
const path = require('path');
const ejsMate = require('ejs-mate');
const AppError = require('../utils/appError');
const mongoose = require('mongoose');
const methodoverride = require('method-override');
const session = require('express-session');
const flash = require('connect-flash');

// coonection of mongodb database
const dbUrl = process.env.DB_URL;
mongoose.connect(dbUrl, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true,
}).then(() => {
    console.log("db connected");
}).catch((err) => {
    console.log("error in connection");
});

// setting view n ejsmate engines
app.set("view engine", "ejs");
app.engine("ejs", ejsMate);
// joining public and views folder to absolute path of project
app.set('views', path.join(__dirname, '../views'));
app.use(express.static(path.join(__dirname, '../public')));
// used to parse json while requesting path
app.use(express.urlencoded({ extended: true }));
// used to override http request method
app.use(methodoverride("_method"));

//creating and configuring session and flash
app.use(session({
    name: "midi",
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
        // secure: true,
        httpOnly: true,
        maxAge: 1000 * 60 * 60 * 24 * 7,
        expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
    },
}));
app.use(flash());
app.use((req, res, next) => {
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
});

// minimizing code through router
app.use("/", basicRouter);

// used to catch errors n display error template
app.use('*', (req, res, next) => {
    next(new AppError("Page not Found", 404));
});
app.use((err, req, res, next) => {
    const { status = 500 } = err;
    if (!err.message) {
        err.message = "Something went wrong!";
    }
    if (err.name == 'CastError') {
        err.message = "Page not Found!";
        err.status = 404;
    }
    res.status(status).render('profiles/error', { err });
});

// port used to connect to http request
const PORT = process.env.PORT;
app.listen(PORT, () => {
    console.log("connected on port " + PORT);
});