require("dotenv").config();
const express = require("express");
const userItems = require("../userItems/serverItems.json");

const app = express();
const port = 4000;

app.use(express.json());
app.get("/", (req, res) => {
  try {
    res.status(200).send(userItems);
    console.log(userItems);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
app.listen(port, () => console.log(`server fired up on port:${port}`));
