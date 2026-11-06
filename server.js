const express = require("express");

const { connection } = require("./db");

const { userRouter } = require("./routes/user.route");
const { notesRouter } = require("./routes/notes.route");

const { auth } = require("./middlewere/auth.middlewere");

const app = express();

app.use(express.json());


// HOME ROUTE
app.get("/", (req, res) => {
    res.send("HOME Page");
});


// USER ROUTES
app.use("/user", userRouter);


// NOTES ROUTES
app.use("/notes", auth, notesRouter);


// DASHBOARD
app.get("/dashboard", auth, (req, res) => {
    res.send("Private Route");
});


app.listen(8080, async () => {
    try {
        await connection;
        console.log("DB Connected");
    } catch (error) {
        console.log(error);
    }

    console.log("Server started");
});