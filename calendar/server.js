const express = require("express");
const next = require("next");
const bodyparser = require("body-parser");

const dbEvents = require("./events.json").Events;

const dbParticipants = require("./participants.json").Participants;

const port = parseInt(process.env.PORT, 10) || 3000;
const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const server = express();
  server.use(bodyparser.json());

  server.get("/events", (req, res) => {
    res.send(
      dbEvents.filter(
        (event) =>
          event.month == req.query.month && event.year == req.query.year
      )
    );
  });

  server.get("/participants", (req, res) => {
    if (req.query.search)
      res.send(
        dbParticipants.filter((participant) =>
          participant.name.startsWith(req.query.search)
        )
      );
    else res.send(dbParticipants);
  });

  server.post("/event", (req, res) => {
    console.log(req.body);
    dbEvents.push(req.body);
    console.log(dbEvents);
    res.json(req.body);
  });

  server.all("*", (req, res) => {
    return handle(req, res);
  });

  server.listen(port, (err) => {
    if (err) throw err;
    console.log(`> Ready on http://localhost:${port}`);
  });
});
