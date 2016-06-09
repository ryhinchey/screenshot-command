"use strict";

const express = require('express')
const bodyParser = require('body-parser')
const dotenv = require('dotenv')
const ENV = process.env.NODE_ENV || 'development'

if (ENV === 'development') dotenv.load()

const bot = require('./bot')
  
let app = express()

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

app.get("/", (req, res) => {
  res.send("a bot to help with design work");
});

app.listen(process.env.PORT, (err) => {
  if (err) throw err
  if (process.env.SLACK_API_KEY) { bot.start(); }
});
