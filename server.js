const fs = require("fs");
const path = require("path");
const express = require("express");

const database = require("./public/db/db.json")
var app = express();
var PORT = process.env.PORT || 3002

app.use(express.static(__dirname + '/public'));
app.use(express.static('./'));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());


app.get ("/", function (req, res) {
    res.sendFile(path.join(__dirname, "/public/index.html"));
});

app.get ("/notes", function (req, res) {
    res.sendFile(path.join(__dirname, "/public/notes.html"));
})

app.route ("/api/notes")
    .get (function (req, res) {
        res.json(database);
    })

    .post (function (req, res) {
        let jsonFilePath = path.join (__dirname, "/db/db.json");
        let newNote = req.body;

        let biggestId = 99;
        for (let i = 0; i < database.length; i++) {
            let oneNote = database[i];

            if (oneNote.id > biggestId) {
                biggestId = oneNote.id;
            }
        }
        newNote.id = biggestId + 1;
        database.push(newNote)

        fs.writeFile(jsonFilePath, JSON.stringify(database), function (err) {

            if (err) {
                return console.log(err);
            }
            console.log("Note Successfully Saved!");
        });
        res.json(newNote);
    });


app.delete("/api/notes/:id", function (req, res) {
    let jsonFilePath = path.join(__dirname, "/db/db.json");
    for (let i = 0; i < database.length; i++) {

        if (database[i].id == req.params.id) {
            database.splice(i, 1);
            break;
        }
    }
    fs.writeFileSync(jsonFilePath, JSON.stringify(database), function (err) {

        if (err) {
            return console.log(err);
        } else {
            console.log("Note Successfully deleted!");
        }
    });
    res.json(database);
});

app.listen(PORT, function () {
    console.log("App listening on PORT " + PORT);
});