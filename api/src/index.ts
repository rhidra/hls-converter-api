import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import dotenv from 'dotenv';
import sqlite3 from 'sqlite3';
import apiUploadRouter from './api/upload';
import apiStatusRouter from './api/status';
import apiDownloadRouter from './api/download';
import apiCleanupRouter from './api/cleanup';
import { getDB, setupDB } from './db';

dotenv.config();

const app = express();
const port = 8080;
app.set('trust proxy', true);

// Database connexion
sqlite3.verbose();

(async () => {
  const db = await getDB();

  // Create the DB if necessary
  setupDB();

  // Log the HTTP request
  app.use(morgan('dev'));

  // CORS
  app.use(cors())

  app.get("/videos", async (req, res) => {
    try {
      const videos = await db.all(`SELECT * FROM Videos;`);
      const streams = await db.all(`SELECT * FROM StreamsQuality;`);
      const ips = await db.all(`SELECT * FROM Ips;`);
      res.send({videos, streams, ips});
    } catch (err) {
      res.status(500).send('DB error: Unable to select columns of the table');
    }
  });

  app.use('/api', apiUploadRouter);
  app.use('/api', apiStatusRouter);
  app.use('/api', apiDownloadRouter);
  app.use('/api', apiCleanupRouter);

  // Frontend serving
  // app.get('*', (req, res) => res.sendFile('index.html', {root: path.join(__dirname, './app')}));
  app.use('/', express.static(__dirname + '/app'));

  // Starts to listen on the port
  app.listen(port, () => {
    console.log(`Server started at http://localhost:${port}`);
  });
})();
