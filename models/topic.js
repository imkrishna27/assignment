const {Schema, model} = require('mongoose');


const topicSchema = new Schema({
    name:String,
    imgURL:{
        type:String,
        required:true
    }
});

module.exports = model('Topic',topicSchema);
