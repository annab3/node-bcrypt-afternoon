const express = require("express");
const app = express();

const dragonTreasure = async (req, res) => {
  const response = await req.app
    .get("db")
    .get_dragon_treasure(1)
    .catch(error => {
      console.log(error);
      res.status(500).json("Server Error");
    });
  res.status(200).json(response);
};

const getUserTreasure = async (req, res) => {
  const reply = await req.app.get("db").get_user_treasure(req.session.user.id);
  res.status(200).json(reply);
};

const addUserTreasure = async (req, res) => {
  const { treasureURL } = req.body;
  const { id } = req.session.user;
  const userTreasure = await req.app
    .get("db")
    .add_user_treasure([treasureURL, id])
    .catch(error => console.log(error));
  res.status(200).json(userTreasure);
};

const getAllTreasure = async (req, res) => {
  const reply = await req.app
    .get("db")
    .get_all_treasure()
    .catch(error => console.log(error));
  res.status(200).json(reply);
};

module.exports = {
  dragonTreasure,
  getUserTreasure,
  addUserTreasure,
  getAllTreasure
};
