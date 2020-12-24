const express = require('express')
const { v4: uuid } = require('uuid')
const logger = require('./logger')
const { bookmarks } = require('./store')

const markRouter = express.Router()
const bodyParser = express.json()

module.exports = {markRouter}