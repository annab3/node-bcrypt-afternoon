const bcrypt = require("bcryptjs");
const express = require("express");
const app = express();

const register = async (req, res) => {
  const { username, password, isAdmin } = req.body;
  const result = await req.app
    .get("db")
    .get_user(username)
    .catch(error => {
      console.log(error);
      res.status(500).json("Internal Server Error");
    });
  if (result.length != 0) {
    res.status(409).json("Username taken");
  } else {
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(password, salt);
    const registeredUser = await req.app
      .get("db")
      .register_user([isAdmin, username, hash])
      .catch(error => {
        console.log(error);
      });
    console.log(registeredUser);
    const user = registeredUser[0];
    req.session.user = {
      isAdmin: user.is_admin,
      id: user.id,
      username: user.username
    };
    res.status(201).json(req.session.user);
  }
};

const login = async (req, res) => {
  const { username, password } = req.body;
  const foundUser = await req.app
    .get("db")
    .get_user(username)
    .catch(error => {
      console.log(error);
      res.status(403).json("Incorrecct username or password");
    });
  if (foundUser.length != 0) {
    const user = foundUser[0];
    const isAuthenticated = bcrypt.compareSync(password, user.hash);
    if (!isAuthenticated) {
      res.status(403).json("Incorrect Password");
    } else {
      req.session.user = {
        isAdmin: user.is_admin,
        id: user.id,
        username: user.username
      };
      res.status(200).json(req.session.user);
    }
  } else {
    res
      .status(401)
      .json("User not found. Please register as a new user before logging in.");
  }
};

const logout = async (req, res) => {
  req.session.destroy();
  res.sendStatus(200);
};

module.exports = {
  register,
  login,
  logout
};
