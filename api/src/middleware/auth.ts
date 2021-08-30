import { NextFunction, Request, Response } from "express";
import { Ip } from "../types";
import { getDB } from "../db";

// Middleware to limit the number of times a route is accessed per day
// We compare IP addresses, it may not be secure enough though
export function limitRequestPerDay() {
  return async (req: Request, res: Response, next: NextFunction) => {
    if (process.env.NODE_ENV === 'development') {
      next();
    } else if (req.headers['X-RapidAPI-Proxy-Secret'] === process.env.RAPID_API_KEY) {
      next();
    } else if (await hasAlreadyAccessed(req)) {
      // If the user has already accessed, we forbid the access
      res.sendStatus(403);
    } else {
      // If it is his first time for the day, we allow him
      // but we register his IP to prevent future connections.
      const db = await getDB();
      db.run(`INSERT INTO Ips (ip, date) VALUES (?, ?)`, [req.ip, (new Date()).toISOString()]);
      next();
    }
  }
}

// Checks if the IP of the request has already been noticed today
export async function hasAlreadyAccessed(req: Request) {
  const db = await getDB();
  const rows: Ip[] = await db.all(`SELECT * FROM Ips WHERE ip = ?`, [req.ip]);
  const now = new Date();
  const [d, m, y] = [now.getDate(), now.getMonth(), now.getFullYear()];
  return rows.some(el => {
    const date = new Date(el.date);
    if (d === date.getDate() && m === date.getMonth() && y === date.getFullYear()) {
      return true;
    }
    return false;
  });
}