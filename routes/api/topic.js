const { Router } = require('express');
const route = Router();
const cloudinary = require('cloudinary');

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
})

const images = require('../../models/topic');
const fs = require('fs-extra');
const router = require('./users');
//      
//          Get route         
// 
// router.get('/', async(req,res) => {
//     const image = await images.find();
//     res.status(200).json({
//         image
//     });
// });

router.post('/add',async(res,req) => {
    // image will be save on cloudinary

    try {
        const result = await cloudinary.v2.uploader.upload(req.file.path);
        const newImage = new images({
            name:   result.name,
            imgURL: result.url
            
        });
        const savedImage = await newImage.save();
        await fs.unlink(req.file.path);
        res.statusCode(200).json({
            savedImage
        })
    
    } catch (e) {
        res.json(e)
    }
});

