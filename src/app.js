const express = require("express");
const connectDB = require("./config/database");
const { adminAuth, userAuth } = require("./middlewares/auth");
const app = express();
const User = require("./models/user");

app.use("/admin", adminAuth);
app.use(express.json());
app.post("/user/login", (req, res) => {
  res.send("User logged in successfully!");
});
app.get("/user/data", userAuth, (req, res) => {
  res.send("User Data Sent");
});

app.get("/getUserData", (req, res) => {
      try {
          // Logic of DB call and get user data
          console.log("DB call done");
          throw new Error("dvbzhjf");
          res.send("User Data Sent");
        } catch (err) {
          res.status(500).send("Some Error contact support team");
        }
});

app.use("/", (err, req, res, next) => {  //wild card route to catch all errors
  if (err) {
    // Log your error
    res.status(500).send("something went wrong");
  }
});

// Get user by email
app.get("/user", async (req, res) => {
  const userEmail = req.body.emailId;
  try {
    console.log(userEmail);
    const user = await User.findOne({ emailId: userEmail });
    if (!user) {
      res.status(404).send("User not found");
    } else {
      res.send(user);
    }
    // const users = await User.find({ emailId: userEmail });
    // if (users.length === 0) {
    //   res.status(404).send("User not found");
    // } else {
    //   res.send(users);
    // }
  } catch (err) {
    res.status(400).send("Something went wrong ");
  }
});

// Feed API - GET /feed - get all the users from the database
app.get("/feed", async (req, res) => {
  try {
    const users = await User.find({});
    res.send(users);
  } catch (err) {
    res.status(400).send("Something went wrong ");
  }
});


//Create Post api for user in mongoose
app.post("/signup", async (req, res) => {
  // Creating a new instance of the User model
  // const user = new User({
  //   firstName: "Ankit",
  //   lastName: "Tendulkar",
  //   emailId: "sachin@kohli.com",
  //   password: "sachin@123",
  // });
  //console.log(req.body);
   const user = new User(req.body);

  try {
    await user.save();
    res.send("User Added successfully!");
  } catch (err) {
    res.status(400).send("Error saving the user:" + err.message);
  }
});


// delete a user from the database
app.delete("/user", async (req, res) => {
  const userId = req.body.userId;
  try {
    const user = await User.findByIdAndDelete({ _id: userId });
    //const user = await User.findByIdAndDelete(userId);

    res.send("User deleted successfully");
  } catch (err) {
    res.status(400).send("Something went wrong ");
  }
});

// Update data of the user
app.patch("/user/:userId", async (req, res) => {
  const userId = req.params?.userId;
  const data = req.body;

  try {
    const ALLOWED_UPDATES = ["photoUrl", "about", "gender", "age", "skills"];
    const isUpdateAllowed = Object.keys(data).every((k) =>
      ALLOWED_UPDATES.includes(k)
    );
    if (!isUpdateAllowed) {
      throw new Error("Update not allowed");
    }
    if (data?.skills.length > 10) {
      throw new Error("Skills cannot be more than 10");
    }
    const user = await User.findByIdAndUpdate({ _id: userId }, data, {
      returnDocument: "after",
      runValidators: true,
    });
    console.log(user);
    res.send("User updated successfully");
  } catch (err) {
    res.status(400).send("UPDATE FAILED:" + err.message);
  }
});


connectDB().then(() =>{
    console.log("Connected to MongoDB")
    app.listen(7777, () => {
      console.log("Server is successfully listening on port 7777...");
    });
})
.catch((err) => {
   console.log(err)
})