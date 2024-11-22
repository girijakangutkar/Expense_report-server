require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const app = express();

const authRoutes = require("./routes/auth");
const ExpenseRoutes = require("./routes/ExpenseReport");

app.use(express.json());
app.use(cors());

mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    family: 4,
  })
  .then(() => console.log("Connected to the DB"))
  .catch((err) => console.error("error in connection", err));

app.use(authRoutes);
app.use(ExpenseRoutes);

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Something went wrong!" });
});

app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});

const port = 5000;

app.listen(port, () => {
  console.log("Server is running on port 5000");
});
