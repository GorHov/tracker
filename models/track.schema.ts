const mongoose = require("mongoose")

const TrackSchema = new mongoose.Schema(
  {
    event: { type: String, required: true },
    tags: { type: Array, required: true },
    url: { type: String, required: true },
    title: { type: String, required: true },
    ts: { type: Number, required: true }
  },
  { strict: true }
)

export default TrackSchema
