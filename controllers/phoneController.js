const express = require("express");
var router = express.Router();
const mongoose = require("mongoose");
const Phone = mongoose.model("Phone");

router.get("/", (req, res) => {
  res.render("phone/addOrEdit", {
    viewTitle: "Phone Book",
  });
});

router.post("/", (req, res) => {
  if (req.body._id == "") insertRecord(req, res);
  else updateRecord(req, res);
});

function insertRecord(req, res) {
  var phone = new Phone();
  phone.fullName = req.body.fullName;
  phone.email = req.body.email;
  phone.mobile = req.body.mobile;
  phone.save((err, doc) => {
    if (!err) res.redirect("phone/list");
    else {
      if (err.name == ValidationError) {
        handleValidationError(err, req.body);
        res.render("phone/addOrEdit", {
          viewTitle: "Phone Book",
          phone: req.body,
        });
      } else console.log("Error during record insertion : " + err);
    }
  });
}

function updateRecord(req, res) {
  Phone.findOneAndUpdate(
    { _id: req.body._id },
    req.body,
    { new: true },
    (err, doc) => {
      if (!err) {
        res.redirect("phone/list");
      } else {
        if (err.name == "ValidationError") {
          handleValidationError(err, req.body);
          res.remove("phone/addOrEdit", {
            viewTitle: "Update Phone",
            phone: req.body,
          });
        } else console.log("Error during record update : " + err);
      }
    }
  );
}

router.get("/list", (req, res) => {
  Phone.find((err, docs) => {
    if (!err) {
      res.render("phone/list", {
        list: docs,
      });
    } else {
      console.log("Error in retrieving phone list :" + err);
    }
  });
});

function handleValidationError(err, body) {
  for (field in err.errors) {
    switch (err.errors[field].path) {
      case "fullName":
        body["fullNameError"] = err.errors[field].message;
        break;
      case "mobile":
        body["mobileError"] = err.errors[field].message;
        break;
      default:
        break;
    }
  }
}

router.get("/:id", (req, res) => {
  Phone.findById(req.params.id, (err, doc) => {
    if (!err) {
      res.render("phone/addOrEdit", {
        viewTitle: "Update Phone",
        phone: doc,
      });
    }
  });
});

router.get("/delete/:id", (req, res) => {
  Phone.findByIdAndRemove(req.params.id, (err, doc) => {
    if (!err) {
      res.redirect("/phone/list");
    } else {
      console.log("Error in phone delete :" + err);
    }
  });
});

module.exports = router;
