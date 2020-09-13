const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const topicSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  imageurl: {
    type: String,
    required: true,
  },

  article: [
    {
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users',
      },
      title: {
        type: String,
        required: true,
      },
      imageurl: {
        type: String,
        required: true,
      },
      content: {
        type: String,
        required: true,
      },
      isFeatured: {
        type: Boolean,
        required: true,
      },
    },
  ],
});

module.exports = mongoose.model('topic', topicSchema);
