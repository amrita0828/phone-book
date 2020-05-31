const mongoose = require("mongoose");

var phoneSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: "This field is required.",
  },
  email: {
    type: String,
  },
  mobile: {
    type: String,
    required: "This field is required.",
  },
});

mongoose.model("Phone", phoneSchema);
