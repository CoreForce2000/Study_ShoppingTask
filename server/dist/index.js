"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const cors_1 = __importDefault(require("cors"));
const sqlite3_1 = __importDefault(require("sqlite3"));
const app = (0, express_1.default)();
const port = 3001;
// Enable CORS and Body Parsing Middleware
app.use((0, cors_1.default)());
app.use(body_parser_1.default.json());
// Connect to SQLite Database
let db = new sqlite3_1.default.Database(':memory:', (err) => {
    if (err) {
        console.error(err.message);
    }
    else {
        console.log('Connected to the in-memory SQLite database.');
    }
});
// Create table
db.run('CREATE TABLE participants (id INTEGER PRIMARY KEY, participantId TEXT, age TEXT, groupSelected TEXT, gender TEXT, handedness TEXT)', (err) => {
    if (err) {
        console.error(err.message);
    }
    else {
        console.log('Participants table created.');
    }
});
// Endpoint to add a participant
app.post('/add-participant', (req, res) => {
    const { participantId, age, selectedGroup, gender, handedness } = req.body;
    const query = 'INSERT INTO participants (participantId, age, groupSelected, gender, handedness) VALUES (?, ?, ?, ?, ?)';
    db.run(query, [participantId, age, selectedGroup, gender, handedness], function (err) {
        if (err) {
            res.status(500).send(err.message);
        }
        else {
            res.status(200).send({ id: this.lastID });
        }
    });
});
// Start server
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
