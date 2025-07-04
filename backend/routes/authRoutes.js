const express=require('express');
const { registerUser,loginUser,getUserProfile,updateUserProfile }=require('../controllers/authController');
const { protect }=require("../middleware/authMiddlewares");
const upload=require("../middleware/uploadMiddlewares");

const router=express.Router();

//Auth routes
router.post("/register",registerUser);  //register user
router.post("/login",loginUser);         //login user
router.get("/profile", protect ,getUserProfile);  //get user profile
router.put("/profile", protect ,updateUserProfile);//update user profile


//upload route
router.post("/upload-image",upload.single("image"),(req,res) => {
    
    if(!req.file)
    {
        return res.status(400).json({message: "No file Uploaded" });
    }
    const imageUrl=`${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`;
    res.status(200).json({imageUrl});
});

module.exports = router;