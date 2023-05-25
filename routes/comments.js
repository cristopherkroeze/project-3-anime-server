var express = require('express');
var router = express.Router();
var mongoose = require('mongoose')


const Comment = require('../models/Comment');

router.get('/', (req, res, next) => {
    Comment.find()
      .populate('addedBy')
      .then(allComments => res.json(allComments))
      .catch(err => res.json(err));
  });

router.post("/", (req, res, next) => {

    const { title, comment, addedBy } = req.body;
    Comment.findOne({title})
    .then((foundComment) => {
     if(foundComment) {
       if (foundComment.comment === comment) {
            res.status(400).json({ message: "Duplicate Comment" });
            return;
       }
     }
    })
    
    Comment.create({ title, comment, addedBy })
      .then(response => res.json(response))
      .catch(err => res.json(err));
  });

router.get("/:commentId", (req, res, next) => {
  const { commentId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(commentId)) {
    res.status(400).json({ message: "Specified id is not valid" });
    return;
  }

  Comment.findById(commentId)
    .populate("addedBy")
    .then((comment) => res.status(200).json(comment))
    .catch((error) => res.json(error));
});
  
  
  router.put('/:commentId', (req, res, next) => {
    const { commentId } = req.params;
  
    if (!mongoose.Types.ObjectId.isValid(commentId)) {
      res.status(400).json({ message: 'Specified id is not valid' });
      return;
    }
  
    Comment.findByIdAndUpdate(commentId, req.body, { new: true })
      .then((updatedComment) => res.json(updatedComment))
      .catch(error => res.json(error));
  });
  
  router.delete('/:commentId', (req, res, next) => {
    const { commentId } = req.params;
    
    if (!mongoose.Types.ObjectId.isValid(commentId)) {
      res.status(400).json({ message: 'Specified id is not valid' });
      return;
    }
  
    Comment.findByIdAndRemove(commentId)
      .then(() => res.json({ message: `Comment with ${commentId} is removed successfully.` }))
      .catch(error => res.json(error));
  });
   

module.exports = router;