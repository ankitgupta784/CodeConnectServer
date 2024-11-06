const express = require("express")
const profileRouter = express.Router();

const { userAuth } = require("../middlewares/auth");
const { validateEditProfileData } = require("../utils/validation");
const bcrypt = require("bcrypt");
const User = require("../models/user");

profileRouter.get("/profile/view", userAuth, async (req, res) => {
    try {
      const user = req.user;
  
      res.send(user);
    } catch (err) {
      res.status(400).send("ERROR : " + err.message);
    }
  });


  profileRouter.patch("/profile/edit", userAuth, async (req, res) => {
    try {
      if (!validateEditProfileData(req)) {
        throw new Error("Invalid Edit Request");
      }
      const loggedInUser = req.user;
      Object.keys(req.body).forEach((key) => (loggedInUser[key] = req.body[key]));
      await loggedInUser.save();
      res.json({
        message: `${loggedInUser.firstName}, your profile updated successfuly`,
        data: loggedInUser,
      });
    } catch (err) {
      res.status(400).send("ERROR : " + err.message);
    }
  });

  profileRouter.patch("/profile/password", async (req, res) => {
    try {
        const user = await User.findOne({ emailId: req.body.emailId });
        const id = user._id;
        if (!user) {
          res.status(404).send("User not Exists");
        } else {      
            const passwordHash = await bcrypt.hash(req.body.password, 10);
            const user = await User.findByIdAndUpdate({ _id: id}, { password: passwordHash}, {
              returnDocument: "after",
              runValidators: true,
            });
            res.send("password update Successfully");
        }
     } catch (err) {
       res.status(400).send("ERROR : " + err.message);
     }
  });

module.exports = profileRouter;