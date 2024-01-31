const express = require('express');
const router = express.Router();
const { Valid_User } = require('../middleware/auth_middleware');
const { Login_Here, Update_Profile, Payment_User, Current_User, Register_Here, Update_National, Update_Cerificate } = require('../controllers/user_controller');


/* user Private Routes start Here */

router.use('/update/profile', Valid_User);
router.use('/update/national', Valid_User);
router.use('/update/certificate', Valid_User);
router.use('/current/user', Valid_User);

/* user Private Routes End Here */


/* user Public Routes start Here */

router.post('/login', Login_Here);
router.post('/register', Register_Here);
router.get('/current/user', Current_User);

router.post('/update/profile', Update_Profile);
router.post('/update/national', Update_National);
router.post('/update/certificate', Update_Cerificate);
router.post('/user/payment', Payment_User);


/* user Public Routes End Here */


module.exports = router;