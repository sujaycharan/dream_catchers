const express = require('express');
const session = require("express-session");
const path = require("path");
const bcrypt = require("bcrypt");
const collection = require("./config");

const app = express();
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(session({
    secret: 'a71b07c53f3e5f0a1f9dc1f3d13e5872c7b8c1f45d751963497b6f3d2e4a55ce7de0f3f0d19a44bfcf9b',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false } // Set secure: true if using HTTPS
}));

app.set('view engine','ejs')
app.use(express.static("public"));

app.get("/", (req,res) => {
    res.render("home", { session: req.session });
});

app.get('/login', (req, res) => {
    res.render('login'); // Renders login.ejs
});
 
app.get("/signup", (req,res) => {
    res.render("signup");
});

app.post("/signup", async(req,res) => {
    const data = {
        name: req.body.username,
        password: req.body.password,
        mobile_no: req.body.mobile_no
    }

    const existingUser = await collection.findOne({name: data.name});
    if(existingUser){
        res.send("User already exists. Please choose a different username.");
        res.redirect("/signup");
    }
    else {
        //hash the password using bcrypt
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(data.password, saltRounds);

        data.password = hashedPassword;

        const userdata = await collection.insertMany(data);
        console.log(userdata);
        res.redirect('/login');
    }
});

app.post("/login", async(req,res) => {
    try{
        const check = await collection.findOne({name: req.body.username});
        if(!check)
        {
            return res.status(401).send("user name cannot find");
        }
        
        const isPasswordMatch = await bcrypt.compare(req.body.password, check.password);
        if(isPasswordMatch){
            req.session.user = {
                username: check.name
            };
            console.log("Session set after login:", req.session);
            return res.redirect('/');
        }
        else{
            console.log("Wrong password");
            //return res.send("wrong password");
        }
        
    }
    catch(err){
        return res.status(500).send("wrong details");
    }
});

app.post('/logout', (req, res) => {
    req.session.destroy(err => {
        if (err) {
            return res.redirect('/'); // Redirect if there's an error
        }
        res.redirect('/'); // Redirect after logout
    });
});

const port = 3000;
app.listen(port, () => {
    console.log(`Server running on port: ${port}`);
});