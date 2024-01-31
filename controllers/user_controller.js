const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user.js');
const multer = require('multer');
const dotenv = require('dotenv');
dotenv.config();



// Image upload Api


const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './documents/uploads');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname);
    }
});

const upload = multer({ storage: storage });


// Register Api 



const Register_Here = async (req, res) => {

    const emailRegex = /^[-!#$%&'*+\/0-9=?A-Z^_a-z{|}~](\.?[-!#$%&'*+\/0-9=?A-Z^_a-z`{|}~])*@[a-zA-Z0-9](-*\.?[a-zA-Z0-9])*\.[a-zA-Z](-?[a-zA-Z0-9])+$/;

    try {
        const { name, email, password } = req.body;
        const errors = emailRegex.test(email);

        if (!errors) {
            return res.status(403).json({ message: 'Please provide a valid email address', status: 'failed', code: 403 });
        }

        if (!name || !email || !password) {
            return res.status(400).json({ message: 'All Fields and Image Are Required', code: 400 });
        }

        const emailExist = await User.findOne({ email });

        if (emailExist) {
            return res.status(402).json({ message: 'Email Already Exists', status: 'failed', });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await User({
            name,
            email,
            password: hashedPassword,
        });

        await user.save();
        const token = jwt.sign({ userID: user._id }, process.env.ACCESS_SECRET_KEY, { expiresIn: '5d' });
        res.status(200).json({ message: 'User registered successfully', user: user, token: token, code: 200, });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

//  Login Api

const Login_Here = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ status: "failed", message: "All Fields Are Required", code: 400 });
        }

        const user = await User.findOne({ email: email });

        if (!user) {
            return res.status(402).json({ status: "failed", message: "User Not Found", code: 402 });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (isMatch) {
            const token = jwt.sign({ userID: user._id }, process.env.ACCESS_SECRET_KEY, { expiresIn: "5d" });
            return res.status(200).json({ status: "success", message: "Login Successfully", user: user, code: 200, token: token });
        } else {
            return res.status(401).json({ status: "failed", message: "Email or Password is Invalid", code: 401 });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ status: "error", message: "Internal Server Error", code: 500 });
    }
};

//  Upload Documents Api

const Update_Profile = async (req, res) => {
    try {
        upload.single('profileImage')(req, res, async function (err) {
            if (err) {
                return res.status(402).json({ message: 'File upload failed.', status: 'failed', code: 402 });
            }
            if (req.file) {
                const updatedUser = await User.findByIdAndUpdate(
                    req.user._id,
                    { profileImage: req.file.filename },
                    { new: true }
                );
                return res.status(200).json({ message: 'Image uploaded successfully.', code: 200, updatedUser: updatedUser, });
            } else {
                return res.status(400).json({ message: 'No file uploaded.', status: 'failed', code: 400 });
            }
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Server Error', status: 'failed' });
    }
};


module.exports = {
    Register_Here, Login_Here,Update_Profile, 
}
