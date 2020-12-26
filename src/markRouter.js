const express = require('express')
const { v4: uuid } = require('uuid')
const logger = require('./logger')
const { isWebUri } = require ('valid-url')

//const bookmarks = require('./store')
const markServices = require('./bookmarksService');

const markRouter = express.Router()
const bodyParser = express.json()

const cleanMark = bookmark => ({
  id: bookmark.id,
  url: xxs(bookmark.url),
  title: xxs(bookmark.title),
  description: bookmark.description,
  rating: bookmark.rating

})

//markServices.serviceCheck();

markRouter
    .route('/')
    .get((req, red, next) =>{

      const knexInstance = req.app.get('db')
      markServices.getAllBookmarks(knexInstance)
      .then(bookmark => {
        res.json(bookmark.map(cleanMark))
      })
      .catch(next)
    })
    .post(bodyParser, (req, res, next) => {
        const { title, url, rating, desc } = req.body;
        const newBookmark =  { title, url, rating, desc };


        for (const [key, value] of Object.entries(newBookmark))
      if (value == null)
        return res.status(400).json({
          error: { message: `Missing '${key}' in request body` }
        })

    markService.insertBookmark(
      req.app.get('db'),
      newBookmark
    )
    .then(bookmark => {
      res
        .status(201)
        .location(`/bookmarks/${bookmark.id}`)
        .json(serializeArticle(bookmark))
    })
    .catch(next)
})

markRouter
    .route('/:bookmark_id')
    .get((req, res, next) =>{
        markServices.getById(
          req.app.get('db'),
          req.params.bookmark_id
        )
      .then(bookmark => {
        if (!bookmark){
          return res.status(404).json({
            error: { message: `Article doesnt exist`}
          })
        }
        res.bookmark = bookmark;
        next()
      })
      .catch(next)
    })
    .delete((req, res, next) =>{
      markServices.deleteItem(
        req.app.get('db'),
        req.params.bookmark_id
      )

      .then(numRowsAffected => {
        res.status(204).end()
      })
      .catch(next);

    })

module.exports = markRouter