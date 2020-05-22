const mongoose = require('mongoose');

// User Schema
const MeetingSchema = mongoose.Schema({
  host_name:{
    type: String,
    required: true
  },
  host_email:{
    type: String,
    required: true
  },
  meeting_id:{
    type: String,
    required: true
  }
});

const Meeting = module.exports = mongoose.model('meetings', MeetingSchema);
