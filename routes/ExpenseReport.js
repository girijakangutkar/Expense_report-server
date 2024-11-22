const express = require("express");
const Expense = require("../model/Expense");
const jwt = require("jsonwebtoken");
const router = express.Router();

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (token == null) return res.sendStatus(401);

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};

router.post("/api/expenses", authenticateToken, async (req, res) => {
  try {
    const { amount, currency, comment, created_at } = req.body;

    const expense = new Expense({
      amount,
      currency,
      comment,
      created_at: created_at ? new Date(created_at) : new Date(),
      user_id: req.user.id,
    });

    await expense.save();
    res.status(201).send(expense);
  } catch (error) {
    res.status(400).send(error);
  }
});

router.get("/api/expenses", authenticateToken, async (req, res) => {
  try {
    const expenses = await Expense.find({ user_id: req.user.id });
    res.send(expenses);
  } catch (err) {
    res.status(500).send(err);
  }
});

router.put("/api/expenses/:id", authenticateToken, async (req, res) => {
  try {
    const expenses = await Expense.findOneAndUpdate(
      {
        _id: req.params.id,
        user_id: req.user.id,
      },
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!expenses) {
      return res.status(404).send("Expense not found or unauthorized");
    }
    res.send(expenses);
  } catch (err) {
    res.status(400).send(err);
  }
});

router.delete("/api/expenses/:id", authenticateToken, async (req, res) => {
  try {
    const expense = await Expense.findOneAndDelete({
      _id: req.params.id,
      user_id: req.user.id,
    });

    if (!expense) {
      return res.status(404).send("Expense not found or unauthorized");
    }
    res.status(204).send();
  } catch (error) {
    res.status(500).send(error);
  }
});

module.exports = router;
