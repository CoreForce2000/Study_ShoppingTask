import express, { Application, Request, Response } from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import sqlite3 from 'sqlite3';
import { promisify } from 'util';
import { createObjectCsvWriter as createCsvWriter } from 'csv-writer';
import path from 'path';

import fs_1 from "fs";

const app: Application = express();
const port = 3001;

// Enable CORS and Body Parsing Middleware
app.use(cors());
app.use(bodyParser.json());


// Connect to SQLite Database
let db = new sqlite3.Database(':memory:', (err) => {
  if (err) {
    console.error(err.message);
  } else {
    console.log('Connected to the in-memory SQLite database.');
  }
});

const dbGet = promisify(db.get).bind(db);
const dbAll = promisify(db.all).bind(db);

// Create table
db.run('CREATE TABLE participants (id INTEGER PRIMARY KEY, participantId TEXT, age TEXT, groupSelected TEXT, gender TEXT, handedness TEXT)', (err) => {
  if (err) {
    console.error(err.message);
  } else {
    console.log('Participants table created.');
  }
});

// Endpoint to add a participant
app.post('/add-participant', (req: Request, res: Response) => {
  const { participantId, age, selectedGroup, gender, handedness } = req.body;
  const query = 'INSERT INTO participants (participantId, age, groupSelected, gender, handedness) VALUES (?, ?, ?, ?, ?)';
  db.run(query, [participantId, age, selectedGroup, gender, handedness], function(this: sqlite3.RunResult, err) {
    if (err) {
      res.status(500).send(err.message);
      console.log(err.message)
    } else {
      res.status(200).send({ id: this.lastID });
      console.log(`A row has been inserted with rowid ${this.lastID}`)
    }
  });
});

app.get('/export', async (req: Request, res: Response) => {
    try {
      // Replace 'your_table' with the actual table name
      const data: any = await dbAll('SELECT * FROM participants');
  
      // Define the CSV writer with headers based on your data columns
      const csvWriter = createCsvWriter({
        path: 'out.csv',
        header: [
          // Replace these with your actual column names
          { id: 'participantId', title: 'PARTICIPANT_ID' },
          { id: 'age', title: 'AGE' },
          { id: 'groupSelected', title: 'GROUP_SELECTED' },
          { id: 'gender', title: 'GENDER'},
          { id: 'handedness', title: 'HANDEDNESS'}
          // Add more headers as needed
        ]
      });
  
      // Write to a file in the server
      await csvWriter.writeRecords(data);
  
      // Set the headers to provide a file to download
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', 'attachment; filename="export.csv"');
  
      // Read the file and send it as a response
      res.sendFile(path.join(__dirname, 'out.csv'));
    } catch (error) {
      res.status(500).send(`Error exporting data: ${(error as Error).message}`);
    }
  });


  const sqlFilePath = 'combined_categories.sql';
  fs_1.readFile(sqlFilePath, 'utf8', (err, data) => {
      if (err) {
          console.error(`Could not read file ${sqlFilePath}:`, err.message);
          return;
      }
      // Execute SQL commands
      db.exec(data, (err) => {
          if (err) {
              console.error(`Error executing ${sqlFilePath}:`, err.message);
          } else {
              console.log(`Executed ${sqlFilePath} successfully.`);
          }
      });
  });
  
interface RowTypes {
  image_name: string;
  item: number;
  minimum: number;
  maximum: number;
  category: string;
}

// Endpoint to get unique categories
app.get('/categories', (req, res) => {
    const query = 'SELECT DISTINCT category FROM products'; 
    db.all(query, [], (err, rows: RowTypes[]) => {
        if (err) {
            res.status(500).send(err.message);
        } else {
            res.status(200).send(rows.map(row => row.category));
        }
    });
});


app.get('/items', (req, res) => {
  // Access the category from the query string
  const category = req.query.category;

  if (!category) {
    return res.status(400).send('Category parameter is required');
  }

  const query = 'SELECT DISTINCT image_name, item, minimum, maximum FROM products WHERE category = ?';

  db.all(query, [category], (err, rows) => {
      if (err) {
          res.status(500).send(err.message);
      } else {
          res.status(200).json(rows);
      }
  });
});

// Start server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

