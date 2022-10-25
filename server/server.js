require("dotenv").config();
const express = require("express");
const cors = require("cors");
const userItems = require("../userItems/serverItems.json");
const storeItems = new Map([
  [1, { priceInCents: 400, name: "Stock Market 101" }],
  [2, { priceInCents: 500, name: "A turd in the wind" }],
]);

const stripe = require("stripe")(
  "sk_test_51Lw6hSSBtSNzCDMOMt89yR7DrfKSJ5uMHQg9U25gA5ndvwvSJwEQDEkidLb6M7PYvu975bE7J58uQL523CIJgbgf00rkI5xiFh"
);

const app = express();
const port = 4000;

app.use(express.json());
app.use(cors());
app.get("/", (req, res) => {
  try {
    res.status(200).send(userItems);
    console.log(userItems);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

app.post("/create-checkout-session", async (req, res) => {
  const purchaseItems = req.body.items;
  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items: purchaseItems.map((item) => {
        const storeItem = storeItems.get(item.id);
        return {
          price_data: {
            currency: "usd",
            product_data: {
              name: storeItem.name,
            },
            unit_amount: storeItem.priceInCents,
          },
          quantity: item.quantity,
        };
      }),
      success_url: `http://localhost:4000/success.html`,
      cancel_url: `http://localhost:4000/cancel.html`,
    });
    res.json(session);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(port, () => console.log(`server fired up on port:${port}`));
