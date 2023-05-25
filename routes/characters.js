var express = require('express');
var router = express.Router();
var mongoose = require('mongoose')


const Character = require('../models/Character');
const Anime = require('../models/Anime')
router.get('/', (req, res, next) => {
    Character.find()
      .populate('voicedBy')
      .populate('createdBy')
      .populate('anime')
      .then(allCharacters => res.json(allCharacters))
      .catch(err => res.json(err));
  });

router.post("/", (req, res, next) => {

    const { img, name, anime, voicedBy, createdBy } = req.body;
   
    Character.findOne({name})
         .then((foundCharacter) => {
          if(foundCharacter) {
            res.status(400).json({ message: "Character already exists" });
            return;
          }
         })

    Character.create({ img, name, anime, voicedBy, createdBy })
      .then(response => {
        Anime.findByIdAndUpdate(anime,  {
          mainCharacter: response._id
        })
            .then((updatedAnime) => {
                console.log(updatedAnime)
            })
            .catch(error => res.json(error));

        res.json(response)
      })
      .catch(err => res.json(err));
  });

router.get("/:characterId", (req, res, next) => {
  const { characterId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(characterId)) {
    res.status(400).json({ message: "Specified id is not valid" });
    return;
  }

  Character.findById(characterId)
    .populate("voicedBy")
    .populate("createdBy")
    .populate("anime")
    .then((character) => res.status(200).json(character))
    .catch((error) => res.json(error));
});
  
  
  router.put('/:characterId', (req, res, next) => {
    const { characterId } = req.params;
  
    if (!mongoose.Types.ObjectId.isValid(characterId)) {
      res.status(400).json({ message: 'Specified id is not valid' });
      return;
    }
  
    Character.findByIdAndUpdate(characterId, req.body, { new: true })
      .then((updatedCharacter) => res.json(updatedCharacter))
      .catch(error => res.json(error));
  });
  
  router.delete('/:characterId', (req, res, next) => {
    const { characterId } = req.params;
    
    if (!mongoose.Types.ObjectId.isValid(characterId)) {
      res.status(400).json({ message: 'Specified id is not valid' });
      return;
    }
  
    Character.findByIdAndRemove(characterId)
      .then(() => res.json({ message: `Character with ${characterId} is removed successfully.` }))
      .catch(error => res.json(error));
  });
   

module.exports = router;