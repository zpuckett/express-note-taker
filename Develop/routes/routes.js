const fs = require('fs');
const path = require('path');
const notesData = getNotes();

function getNotes() {
   let data = fs.readFileSync("../db/db.json", "utf8");

    let notes = JSON.parse(data);

    for (let i = 0; i < notes.length; i++) {
        notes[i].id = '' + i;
    }

    return notes;
}

module.exports = function (app) {
    app.get("/api/notes", function (req, res) {
        res.json(notesData);
        getNotes();
    });

    app.post("/api/notes", function (req, res) {
        let newNote = req.body;
        notesData.push(req.body);
        fs.writeFileSync('../db/db.json', JSON.stringify(notesData));
        res.json(true);
        return console.log("Added new note: " + newNote.title);
    });

    app.delete("/api/notes/:id", function (req, res) {
        const requestID = req.params.id;
        console.log(requestID);

        let note = notesData.filter(note => {
            return note.id === requestID;
        })[0];

        console.log(note);
        const index = notesData.indexOf(note);

        notesData.splice(index, 1);

        fs.writeFileSync('../db/db.json', JSON.stringify(notesData), 'utf8');
        res.json("Note deleted");
    });
    app.get("/notes", function (req, res) {
        res.sendFile(path.join(__dirname, "../public/notes.html"));
    });

    app.get("*", function (req, res) {
        res.sendFile(path.join(__dirname, "../public/index.html"));
    });
}
