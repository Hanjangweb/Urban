const express = require("express")
const multer = require("multer")
const cloudinary = require("cloudinary").v2
const streamifier = require("streamifier")

const router = express.Router()

require("dotenv").config()

// Cloudinary configuration
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
})

// Multer storage using menory storage
const storage = multer.memoryStorage()
const upload = multer({ storage })



router.post("/", upload.single("image"), async (req, res) => {
    try{
        if(!req.file){
            return res.status(400).json({message: "No file uploaded"})
        }

        // Function to handle the stream upload to cloudinary
        const streamUpload = (fileBuffer) => {
            return new Promise((resolve, reject) => {
                const stream = cloudinary.uploader.upload_stream((error, result) => {
                    if(result){
                        resolve(result)
                    }else{
                        reject(error)
                    }
                })
                // Use streamifier to convert file bufer to stream
                streamifier.createReadStream(fileBuffer).pipe(stream)
            })
        }
        // Call the stream upload function
        const result = await streamUpload(req.file.buffer)
        // Respond with the image upload url
        res.json({ imageUrl: result.secure_url})
    }catch(err){
        console.error(err)
        res.status(500).json({message: "Server error"})
    }
})

module.exports = router