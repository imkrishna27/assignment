const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const auth = require('../../middleware/auth');
const User = require('../../models/users');
const Topic = require('../../models/topic');

// adding topic

router.post(
  '/',
  [
    auth,
    //validation check
    [
      check('name', 'Enter your Name !').not().isEmpty(),
      check('imageurl', 'Image URL cant be empty').not().isEmpty(),
    ],
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        errors: errors.array(),
      });
    }
    //take values from body
    const { name, imageurl } = req.body;

    try {
      const user = await User.findById(req.user.id).select('-password');
      //   console.log(user);

      if (user.admin != true) {
        return res.status(400).json({
          msg: 'Sorry ,You are not authorized to add Data !',
        });
      }

      const isTopic = await Topic.findOne({ name: name });
      if (isTopic) {
        return res.status(400).json({
          msg: 'Sorry ,Topic already exists !',
        });
      }

      const newTopic = new Topic({
        name: name,
        imageurl: imageurl,
      });

      const response = await newTopic.save();
      res.json(response);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  }
);

//adding article for topic
//@put request

router.put(
  '/article',
  [
    auth,
    //validation check
    [
      check('title', 'Title Cant be Empty !').not().isEmpty(),
      check('imageurl', 'Image URL cant be empty').not().isEmpty(),
      check('content', 'Enter Content!').not().isEmpty(),
      check('isFeatured', 'Select isFestured !').not().isEmpty(),
    ],
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        errors: errors.array(),
      });
    }
    //take values from body
    const { topic, title, imageurl, content, isFeatured } = req.body;

    const user = await User.findById(req.user.id).select('-password');
    console.log(user.email);
    if (user.admin != true) {
      return res.status(400).json({
        msg: 'Sorry ,You are not authorized to add Data !',
      });
    }

    const newArticle = {
      user: req.user.id,
      title,
      imageurl,
      content,
      isFeatured,
    };

    try {
      const topicname = await Topic.findOne({
        name: req.body.topic,
      });

      console.log(topicname);

      if (!topicname) {
        return res.status(400).json({
          msg: 'Topic not found for Article! kindly create topic first',
        });
      }

      topicname.article.unshift(newArticle);
      await topicname.save();

      res.json(topicname);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  }
);

//fetching all articles

router.get('/all', auth, async (req, res) => {
  try {
    const topics = await Topic.find().sort({ date: -1 });
    res.json(topics);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

//fetching topic by id
router.get('/:id', auth, async (req, res) => {
  try {
    const topic = await Topic.findById(req.params.id);

    if (!topic) {
      return res.status(404).json({
        msg: 'No Topic',
      });
    }
    res.json(topic);
  } catch (err) {
    if (err.kind == 'ObjectId') {
      return res.status(404).json({
        msg: 'No Topic',
      });
    }
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

router.get('/article/:id/:article_id', auth, async (req, res) => {
  try {
    const topic = await Topic.findById(req.params.id);

    //pull article

    const article = topic.article.find((ar) => ar.id === req.params.article_id);

    //make sure comment exist
    if (!article) {
      return res.status(404).json({
        msg: 'Article doesnt exist',
      });
    }

    console.log(article);

    res.json(article);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
