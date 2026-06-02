import mongoose from "mongoose";

const flightSchema = new mongoose.Schema({

  flightNumber: String,

  gate: String,

  status: String,

  departure: String,

  arrival: String,

  time: String,

});

export default mongoose.model("Flight", flightSchema);