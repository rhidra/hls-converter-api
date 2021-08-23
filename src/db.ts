import { Database, open } from 'sqlite';
import sqlite3 from 'sqlite3';
import path from 'path';
import {VideoStatus} from './types';

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
      filename: path.join(__dirname, "videos.db"),
      driver: sqlite3.Database
    });
    return db;
  }
}

export async function setupDB() {
  await db.exec(`
    CREATE TABLE IF NOT EXISTS Videos (
      uploadId TEXT PRIMARY KEY,
      originalName TEXT,
      mp4Path TEXT,
      hlsPath TEXT,
      status TINYINT NOT NULL DEFAULT ${VideoStatus.NOT_UPLOADED} 
    );
  `);
} 
