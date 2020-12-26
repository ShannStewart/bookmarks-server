const express = require('express')
const { v4: uuid } = require('uuid')
const logger = require('./logger')
const { isWebUri } =require ('valid-url')

const bookmarks = require('./store')

const markRouter = express.Router()
const bodyParser = express.json()

markRouter
    .route('/bookmarks')
    .get((req,res) =>{

      const knexInstance = req.app.get('db')
console.log("Does this work?: " + knexInstance);

        res
    .json(bookmarks);
    })
    .post(bodyParser, (req,res) => {
        const { title, url, rating, desc } = req.body;

        if (!title) {
            logger.error(`Title is required`);
            return res
              .status(400)
              .send('Title is required');  
          }
          if (!url) {
            logger.error(`URL is required`);
            return res
              .status(400)
              .send('URL is required');  
          }
          if(!isWebUri(url)){
            logger.error(`Not a valid URL`);
            return res
              .status(400)
              .send('URL is nor valid');  
          }
          if (!rating) {
            logger.error(`Rating is required`);
            return res
              .status(400)
              .send('Rating is required');  
          }
          if (!desc) {
            logger.error(`Description is required`);
            return res
              .status(400)
              .send('Description is required');  
          }
          if (rating < 0){
              logger.error(`Rating must be more then zero`);
              return res
              .status(400)
              .send('Rating must be more then zero');
          }

          const id = uuid();

          const bookmark = {
              id,
              title,
              url,
              rating,
              desc,
          };

          bookmarks.push(bookmark);

          logger.info(`Bookmark with id ${id} created`);

            res
            .status(201)
            .location(`http://localhost:8000/bookmarks/${id}`)
            .json(bookmark);
    })

markRouter
    .route('/bookmarks/:id')
    .get((req,res) =>{
        const { id } = req.params;
        const bookmark = bookmarks.find(b => b.id == id);

        if (!bookmark) {
            logger.error(`Card with id ${id} not found.`);
            return res
              .status(404)
              .send('Card Not Found');
          }
      
          res.json(bookmark)
    })
    .delete((req, res) =>{
        const { id } = req.params;

        const bookIndex = bookmarks.findIndex(c => c.id == id);

        if (bookIndex === -1) {
            logger.error(`Bookmark with id ${id} not found.`);
            return res
              .status(404)
              .send('Not found');
          }
      
          bookmarks.splice(bookIndex, 1);
      
          logger.info(`Bookmark with id ${id} deleted.`);
      
          res
            .status(204)
            .end();
    })

module.exports = markRouter