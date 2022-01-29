const express = require("express");
const next = require("next");
const bodyparser = require("body-parser");
const fs = require("fs");

const mongoose = require("mongoose");
mongoose.connect("mongodb://localhost:27017/EventsDB", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const EventModel = require("./models/Event");
const ParticipantModel = require("./models/Participant");

const port = parseInt(process.env.PORT, 10) || 3000;
const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const server = express();
  server.use(bodyparser.json());

  server.get("/getEventById/:id", async (req, res) => {
    res.send(await EventModel.findOne({ id: parseInt(req.params.id) }).exec());
  });

  server.get("/participants", async (req, res) => {
    res.send(await ParticipantModel.find().exec());
  });

  server.all("/event", async (req, res) => {
    switch (req.method) {
      case "POST":
        {
          res.json(req.body);
          EventModel.create(req.body);
        }
        break;
      case "DELETE":
        {
          EventModel.deleteOne({ id: parseInt(req.body.id) }).exec();
          res.json(req.body);
        }
        break;
      case "GET":
        {
          res.send(await EventModel.find().exec());
        }
        break;
    }
  });

  server.all("*", (req, res) => {
    return handle(req, res);
  });

  server.listen(port, (err) => {
    if (err) throw err;
    console.log(`> Ready on http://localhost:${port}`);
  });
});
