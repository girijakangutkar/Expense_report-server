const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const UserModel = require("../model/User");
const router = express.Router();

router.post("/login", (req, res) => {
  const { email, password } = req.body;

  UserModel.findOne({ email: email }).then((user) => {
    if (user) {
      if (bcrypt.compareSync(password, user.password)) {
        const token = jwt.sign(
          {
            id: user._id,
            name: user.name,
            email: user.email,
          },
          process.env.JWT_SECRET,
          { expiresIn: "1h" }
        );
        res.json({
          success: true,
          token,
          user: {
            id: user._id,
            name: user.name,
            email: user.email,
          },
        });
      } else {
        res
          .status(401)
          .json({ success: false, error: "The password is incorrect" });
      }
    } else {
      res.status(404).json({
        success: false,
        error: "You are not registered to this service",
      });
    }
  });
});

router.post("/register", (req, res) => {
  const { name, email, password } = req.body;

  UserModel.findOne({ email: email })
    .then((existingUser) => {
      if (existingUser) {
        return res.status(400).json({
          success: false,
          error: "Email already registered",
        });
      }

      UserModel.create({
        name,
        email,
        password,
        // authProvider: "local",
      })
        .then((user) => {
          const token = jwt.sign(
            {
              id: user._id,
              name: user.name,
              email: user.email,
            },
            process.env.JWT_SECRET,
            { expiresIn: "1h" }
          );
          res.json({
            success: true,
            token,
            user: {
              id: user._id,
              name: user.name,
              email: user.email,
            },
          });
        })
        .catch((err) =>
          res.status(500).json({ success: false, error: err.message })
        );
    })
    .catch((err) =>
      res.status(500).json({ success: false, error: err.message })
    );
});

router.get("/users", (req, res) => {
  UserModel.find({}, { password: 0 })
    .then((users) => res.json(users))
    .catch((err) => res.json({ error: err.message }));
});

module.exports = router;
