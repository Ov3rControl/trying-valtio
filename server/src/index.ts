import express from "express";
import sqlite3 from "sqlite3";
import bodyParser from "body-parser";
import cors from "cors";
import { faker } from "@faker-js/faker";

const app = express();
const db = new sqlite3.Database("./eventsDB.sqlite");

app.use(cors());
app.use(bodyParser.json());

// Initialize DB
db.serialize(() => {
  db.run(
    "CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY, email TEXT, password TEXT, name TEXT)"
  );

  db.run(
    "CREATE TABLE IF NOT EXISTS events (id INTEGER PRIMARY KEY, title TEXT, date TEXT, price REAL, image TEXT, location TEXT, description TEXT, speakers TEXT, capacity INTEGER, availableSpots INTEGER)"
  );
  db.run(
    `CREATE TABLE IF NOT EXISTS registrations (
      userId INTEGER, 
      eventId INTEGER, 
      FOREIGN KEY(userId) REFERENCES users(id),
      FOREIGN KEY(eventId) REFERENCES events(id),
      UNIQUE(userId, eventId)
    );
    `
  );
});

interface Row {
  count: number;
  id: number;
  name: string;
  email: string;
  speakers: string;
}

const populateEvents = () => {
  db.get("SELECT COUNT(*) as count FROM events", (err, row: Row) => {
    if (err) {
      console.error(err.message);
      return;
    }

    // Check if the events table is empty
    if (row.count === 0) {
      const insertQuery =
        "INSERT INTO events (title, date, price, image, location, description, speakers, capacity, availableSpots) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)";

      for (let i = 0; i < 20; i++) {
        const title = faker.company.name();
        const date = faker.date.future().toISOString();
        const price = faker.commerce.price();
        const image = faker.image.imageUrl();
        const location = faker.address.city();
        const description = faker.lorem.paragraph();
        const speakers = JSON.stringify([
          `${faker.name.firstName()} ${faker.name.lastName()}, ${faker.name.firstName()} ${faker.name.lastName()}`,
        ]);
        const capacity = Math.floor(Math.random() * 100) + 1;
        const availableSpots = Math.floor(Math.random() * capacity);

        db.run(
          insertQuery,
          [
            title,
            date,
            price,
            image,
            location,
            description,
            speakers,
            capacity,
            availableSpots,
          ],
          function (err) {
            if (err) {
              console.error(err.message);
              return;
            }
            console.log(`Inserted row with ID: ${this.lastID}`);
          }
        );
      }
    } else {
      console.log("Events table already populated. Skipping...");
    }
  });
};

populateEvents();

// Sign Up
app.post("/signup", (req, res) => {
  const { email, password, name } = req.body;
  const stmt = db.prepare(
    "INSERT INTO users (email, password, name) VALUES (?, ?, ?)"
  );
  stmt.run([email, password, name], function (err) {
    if (err) return res.status(500).send("Error during signup");
    res.json({ id: String(this.lastID), name, email });
  });
});

// Login
app.post("/login", (req, res) => {
  const { email, password } = req.body;
  db.get(
    "SELECT id, email, name FROM users WHERE email = ? AND password = ?",
    [email, password],
    (err, row: Row) => {
      if (err || !row) return res.status(401).send("Unauthorized");

      // Convert id to string and return along with name and email
      res.json({ id: String(row.id), name: row.name, email: row.email });
    }
  );
});

// Fetch Events
app.get("/events", (_, res) => {
  db.all(
    "SELECT id, title, date, price, image, location FROM events",
    [],
    (err, rows) => {
      if (err) return res.status(500).send("Error fetching events");
      res.json(rows);
    }
  );
});

app.get("/events/:eventId", (req, res) => {
  const eventId = req.params.eventId;
  db.get("SELECT * FROM events WHERE id = ?", [eventId], (err, row: Row) => {
    if (err) return res.status(500).send("Error fetching event");
    if (!row) return res.status(404).send("Event not found");

    // Parse the speakers field to an array
    row.speakers = JSON.parse(row.speakers);

    res.json(row);
  });
});

// Register for an Event
app.post("/register", (req, res) => {
  const { userId, eventId } = req.body;

  // Check if the user is already registered for the event
  db.get(
    "SELECT * FROM registrations WHERE userId = ? AND eventId = ?",
    [userId, eventId],
    (err, row) => {
      if (err)
        return res.status(500).send("Error during checking registration");
      if (row) return res.status(400).send("Already registered for this event");

      // Register the user for the event
      const stmt = db.prepare(
        "INSERT INTO registrations (userId, eventId) VALUES (?, ?)"
      );
      stmt.run([userId, eventId], function (err) {
        if (err) return res.status(500).send("Error during registration");
        res.json({ id: String(this.lastID) });
      });
    }
  );
});

app.get("/user/:userId/events", (req, res) => {
  const { userId } = req.params;
  const sql = `
    SELECT e.* 
    FROM events e
    JOIN registrations r ON e.id = r.eventId
    WHERE r.userId = ?
  `;

  db.all(sql, [userId], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: "Could not fetch events" });
    }
    console.log({ rows });
    res.json(rows);
  });
});

app.listen(3001, () => {
  console.log("Server running on http://localhost:3001/");
});
