const mongoose = require("mongoose");

const ParticipantSchema = new mongoose.Schema({
  id: {
    type: Number,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("Participant", ParticipantSchema);
