const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
var mongoose = require('mongoose')
const router = express.Router();
const saltRounds = 10;

const isAuthenticated = require("../middleware/isAuthenticated");

router.post("/signup", (req, res, next) => {
  const { email, userName, password, name, favoriteGenre } = req.body;

  if (email === "" || userName === "" || password === "" || name === "") {
    res
      .status(400)
      .json({ message: "Provide email, username, password, and name" });
    return;
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  if (!emailRegex.test(email)) {
    res.status(400).json({ message: "Provide a valid email address." });
    return;
  }

  if (userName.length < 4) {
    res.status(400).json({ message: "Username must be at least 4 characters" });
    return;
  }

  User.findOne({ email })
    .then((foundUser) => {
      if (foundUser) {
        res.status(400).json({ message: "Email is taken" });
        return;
      }

      return User.findOne({ userName })
  })
      .then((foundUser) => {

          if (foundUser) {
              res.status(400).json({ message: "Username is taken" });
              return;
            }

          const salt = bcrypt.genSaltSync(saltRounds);
          const hashedPassword = bcrypt.hashSync(password, salt);
    
          return User.create({ email, userName, password: hashedPassword, name, favoriteGenre, favoriteAnimes: [] });
      })

    .then((createdUser) => {
      const { img, role, email, userName, name, _id, favoriteGenre } = createdUser;

      const user = { img, role, email, userName, name, _id, favoriteGenre };

      res.status(201).json(user);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ message: "Internal Server Error" });
    });
});

router.post("/login", (req, res, next) => {
  const { userName, password } = req.body;

  if (userName === "" || password === "") {
    res.status(400).json({ message: "Provide userName and password." });
    return;
  }

  User.findOne({ userName })
    .then((foundUser) => {
      if (!foundUser) {
        res.status(401).json({ message: "User not found." });
        return;
      }

      const passwordCorrect = bcrypt.compareSync(password, foundUser.password);

      if (passwordCorrect) {
        const { _id, userName, name, img, email, role, favoriteGenre, favoriteAnimes } = foundUser;

        const payload = { _id, userName, name, img, email, role, favoriteGenre, favoriteAnimes };

        const authToken = jwt.sign(payload, process.env.SECRET, {
          algorithm: "HS256",
          expiresIn: "6h",
        });

        res.status(200).json({ authToken: authToken });
      } else {
        res.status(401).json({ message: "Unable to authenticate the user" });
      }
    })
    .catch((err) => res.status(500).json({ message: "Internal Server Error" }));
});

router.get("/verify", isAuthenticated, (req, res, next) => {
  console.log("req.user", req.user);

  User.findById(req.user._id)
      //  .populate('favoriteAnimes')
      .populate({path: 'favoriteAnimes', populate: {path: 'comments addedBy mainCharacter'}})
      .then((foundUser) => {
        console.log("VERIFY ROUTE:", foundUser)
        res.json(foundUser);
      })
      .catch(error => res.json(error));
  
});

router.get('/:userId', (req, res, next) => {
  const { userId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(userId)) {
    res.status(400).json({ message: 'Specified id is not valid' });
    return;
  }
  console.log("userId:", userId)
  User.findById(userId)
    .populate({path: 'favoriteAnimes', populate: {path: 'comments addedBy mainCharacter'}})
    .then(user => {
      console.log("user after populate!!!!:", user)
      res.json(user)
    })
    .catch(error => res.json(error));
});



router.put('/:userId', (req, res, next) => {
  const { userId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(userId)) {
    res.status(400).json({ message: 'Specified id is not valid' });
    return;
  }

  User.findByIdAndUpdate(userId, req.body, { new: true })
    .then((updatedUser) => res.json(updatedUser))
    .catch(error => res.json(error));
});

module.exports = router;
