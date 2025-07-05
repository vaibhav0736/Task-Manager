const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

//generate jwt token
const generateToken=(userId) => {
    return jwt.sign({id:userId,}, process.env.JWT_SECRET,{expiresIn:"7d"});
};

// @desc  register a new user
// @route POST /api/auth/register
// @access Public

const registerUser=async (req, res) => {
    try
    {
        const {name,email,password,profileImageUrl,adminInviteToken}=req.body;

        //validation
        if(!name || !email || !password)
        {
            return res.status(400).json({message:"Please fill all the fields"});

        }

        //check is user already exists
        const extistingUser=await User.findOne({email});
        if(extistingUser)
        {
            return res.status(400).json({message:"User already Exists"});

        }

        //determine user role:Admin if correct token is provided,otherwise member
        let role="member";
        if(adminInviteToken && adminInviteToken ==process.env.ADMIN_INVITE_TOKEN)
        {
            role="admin";

        }



        //hash the passowrd
        const salt= await bcrypt.genSalt(10);
        const hashedPassword=await bcrypt.hash(password,salt);




        //create a new user
        const user=await User.create({
            name,
            email,
            password:hashedPassword,
            profileImageUrl,
            role,
        });
            

        //return user data with jwt
        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            profileImageUrl: user.profileImageUrl,
            token:generateToken(user._id),
        });


    }
    catch(error)
    {
        res.status(500).json({message: "server error", error: error.message});
    }
    
};


// @desc  Login a  user
// @route POST /api/auth/login
// @access Public

const loginUser=async (req, res) => {
    try{
        const {email,password}=req.body;

        //check if email and passowrd are provided
        if(!email || !password)
        {
            return res.status(400).json({message: "please provide  a email and password"});
        }


        //find user by email
        const user=await User.findOne({email});


        //check if user exists
        if(!user)
        {
            return res.status(401).json({message: "Invalid email or password"});
        }
        
        // comapred enetered password with the hashed password in DB
            
        const isMatch=await bcrypt.compare(password,user.password);


        if(!isMatch)
        {
            return res.status(401).json({message: "Invalid Credentials"})
        }

        //return user data and token
        res.status(200).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            profileImageUrl: user.profileImageUrl,
            token: generateToken(user._id),
        })

    }
    catch(error)
    {
        res.status(500).json({message: "server error", error: error.message});
    }
};


// @desc  get a  user profile
// @route POST /api/auth/profile
// @access private(requires jwt)

const getUserProfile=async (req, res) => {
    try{

        const user=await User.findById(req.user.id).select("-password");
        if(!user)
        {
            return res.status(404).json({message: "User not found"});
        }
        res.status(200).json(user)
    }
    catch(error)
    {
        res.status(500).json({message: "server error", error: error.message});
    }
};




// @desc  update a  userprofile
// @route POST /api/auth/profile
// @access private(requires jwt)

const updateUserProfile=async (req, res) => {
    try{
         //find user by id
        const user=await User.findById(req.user.id);
         
        //check if user exists
        if(!user)
            return res.status(404).json({message: "User Not Found"});

        //update field if provided in request body
        user.name=req.body.name || user.name;
        user.email=req.body.email || user.email;
        user.profileImageUrl=req.body.profileImageUrl || user.profileImageUrl;


        //if password is being updated
        if(req.body.password)
        {
            const salt=await bcrypt.genSalt(10);
            user.password=await bcrypt.hash(req.body.password);
        }

        //store the updated user
        const updateUser=await user.save();

        res.status(200).json({
            _id:updateUser._id,
            name:updateUser.name,
            email: updateUser.email,
            role: updateUser.role,
            profileImageUrl: updateUser.profileImageUrl,
            token: generateToken(updateUser._id),

        })

    }
    catch(error)
    {
        res.status(500).json({message: "server error", error: error.message});
    }
};


module.exports={registerUser,loginUser,getUserProfile,updateUserProfile};