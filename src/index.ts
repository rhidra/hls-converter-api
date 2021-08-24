import express from 'express';
import morgan from 'morgan';
import sqlite3 from 'sqlite3';
import apiUploadRouter from './api/upload';
import apiStatusRouter from './api/status';
import apiDownloadRouter from './api/download';
import { getDB, setupDB } from './db';

const app = express();
const port = 8080;

// Database connexion
sqlite3.verbose();

(async () => {
  const db = await getDB();

  // Create the DB if necessary
  setupDB();

  // Log the HTTP request
  app.use(morgan('dev'));

  app.get("/videos", async (req, res) => {
    try {
      const rows = await db.all(`SELECT * FROM Videos;`);
      res.send(rows);
    } catch (err) {
      res.status(500).send('DB error: Unable to select columns of the table');
    }
  });

  app.use('/api', apiUploadRouter);
  app.use('/api', apiStatusRouter);
  app.use('/api', apiDownloadRouter);

  app.listen(port, () => {
      console.log( `server started at http://localhost:${ port }` );
  });

})();
