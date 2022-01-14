const express = require("express");
const next = require("next");
const bodyparser = require("body-parser");
const fs = require("fs");

const dbEvents = require("./events.json");

const dbParticipants = require("./participants.json").Participants;

const port = parseInt(process.env.PORT, 10) || 3000;
const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const server = express();
  server.use(bodyparser.json());

  server.get("/getEvents", (req, res) => {
    res.send(
      dbEvents.filter(
        (event) =>
          event.month == req.query.month && event.year == req.query.year
      )
    );
  });

  server.get("/getEvent/:id", (req, res) => {
    res.send(dbEvents.filter((event) => event.id == req.params.id));
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

  server.post("/addEvent", (req, res) => {
    dbEvents.push(req.body);
    res.json(req.body);
    fs.writeFile("./events.json", JSON.stringify(dbEvents), "utf8");
  });

  server.post("/deleteEvent", (req, res) => {
    dbEvents.splice(dbEvents.indexOf(req.body.event), 1);
    res.json(req.body);
    fs.writeFile("./events.json", JSON.stringify(dbEvents), "utf8");
  });

  server.all("*", (req, res) => {
    return handle(req, res);
  });

  server.listen(port, (err) => {
    if (err) throw err;
    console.log(`> Ready on http://localhost:${port}`);
  });
});
