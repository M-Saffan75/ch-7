const express = require('express');
const router = express.Router();
const { Valid_User } = require('../middleware/auth_middleware');
const { Login_Here, Update_Profile, Register_Here } = require('../controllers/user_controller');


/* user Private Routes start Here */

router.use('/update/profile', Valid_User);

/* user Private Routes End Here */


/* user Public Routes start Here */

router.post('/login', Login_Here);
router.post('/update/profile', Update_Profile);
router.post('/register', Register_Here);

/* user Public Routes End Here */


module.exports = router;