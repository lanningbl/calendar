const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const eventSchema = new Schema(
  {
    title: { type: String, required: true },
    location: { type: String, required: false },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    isTimeSet: { type: Boolean, required: false },
  },
  {
    timestamps: true,
  }
);

const Event = mongoose.model('Event', eventSchema);

module.exports = Event;
