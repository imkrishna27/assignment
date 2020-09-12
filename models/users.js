const mongoose = require('mongoose');
const schema = mongoose.Schema;

const userSchema = new schema({
  name: String,
  email: {
    type: String,
    required: false,
    unique: true,
  },
  password: {
    type: String,
    required: false,
  },
  admin:{
    type: Boolean,
    required:false,
    default:false
  },
  date: {
    type: Date,
    default: Date.now,
  },
 
});



module.exports = mongoose.model('users', userSchema);
