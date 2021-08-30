import { Database, open } from 'sqlite';
import sqlite3 from 'sqlite3';
import path from 'path';
import {EncodingSpeed, StreamQuality, VideoStatus} from './types';

/**
 * Connect to the SQLite database and configures it correctly.
 * Setup the basic tables used across the API.
 * The get a reference to the DB, use getDB() to obtain
 * the singleton handle to the DB.
 */

let db: Database<sqlite3.Database, sqlite3.Statement>;

export async function getDB() {
  if (db) {
    return db;
  } else {
    db = await open({
      filename: path.join(__dirname, "../data/videos.db"),
      driver: sqlite3.Database
    });
    return db;
  }
}

export async function setupDB() {
  // DROP TABLE IF EXISTS StreamsQuality;
  // DROP TABLE IF EXISTS Videos;
  await db.exec(`
    PRAGMA foreign_keys = ON;

    CREATE TABLE IF NOT EXISTS Videos (
      uploadId TEXT PRIMARY KEY,
      originalName TEXT,
      status TINYINT NOT NULL DEFAULT ${VideoStatus.NOT_UPLOADED},

      encodingSpeed TINYINT NOT NULL DEFAULT ${EncodingSpeed.MEDIUM},
      segmentSize TINYINT NOT NULL DEFAULT 6,
      framerate INTEGER NOT NULL DEFAULT 25
    );

    CREATE TABLE IF NOT EXISTS StreamsQuality (
      uploadId TEXT,
      stream INTEGER,
      quality TINYINT NOT NULL DEFAULT ${StreamQuality.MOBILE_360P},
      FOREIGN KEY(uploadId) REFERENCES Videos(uploadId) ON DELETE CASCADE,
      PRIMARY KEY(uploadId, stream)
    );

    CREATE TABLE IF NOT EXISTS Ips (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      ip TEXT NOT NULL,
      date TEXT NOT NULL
    );
  `);
}
