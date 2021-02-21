/*
|--------------------------------------------------------------------------
| api.js -- server routes
|--------------------------------------------------------------------------
|
| This file defines the routes for your server.
|
*/

const express = require("express");

// import models so we can interact with the database
const User = require("./models/user");
const Board = require('./models/board');

// import authentication library
const auth = require("./auth");

// api endpoints: all these paths will be prefixed with "/api/"
const router = express.Router();

//initialize socket
const socketManager = require("./server-socket");

// mongoose
const mongoose = require('mongoose')

router.post("/login", auth.login);
router.post("/logout", auth.logout);
router.get("/whoami", (req, res) => {
  if (!req.user) {
    // not logged in
    return res.send({});
  }

  res.send(req.user);
});

router.post("/initsocket", (req, res) => {
  // do nothing if user not logged in
  if (req.user) socketManager.addUser(req.user, socketManager.getSocketFromSocketID(req.body.socketid));
  res.send({});
});

// |------------------------------|
// | write your API methods below!|
// |------------------------------|

router.get('/boards', async (req, res) => {
	res.send(await Board.find({}).populate('author'))
})

router.post('/boards', async (req, res) => {
    if (!req.user) return res.sendStatus(401)
    console.log('req.user', req.user)

    const doesUserHaveBoard = await Board.exists({ author: mongoose.Types.ObjectId(req.user._id) })
    if (doesUserHaveBoard) {
        return res.sendStatus(409)
    }

    const board = await Board.create({
        author: mongoose.Types.ObjectId(req.user._id),
        colors: new Array(36).fill('#dbdbdb')
    })

    return res.send(await Board.find({}).populate('author'))
})

router.post('/boards/color', async (req, res) => {
    if (!req.user) return res.sendStatus(401)
    console.log('req.user', req.user)

    const usersBoard = await Board.findOne({ author: mongoose.Types.ObjectId(req.user._id) }).lean()
    let updatedColors = usersBoard.colors
    updatedColors[req.body.position] = req.body.newColor
    await Board.findOneAndUpdate({ author: mongoose.Types.ObjectId(req.user._id) }, { colors: updatedColors })
    console.log(`[${req.body.position}] = ${req.body.newColor}`)

    return res.send({ success: true })
})

// anything else falls to this "not found" case
router.all("*", (req, res) => {
  console.log(`API route not found: ${req.method} ${req.url}`);
  res.status(404).send({ msg: "API route not found" });
});

module.exports = router;