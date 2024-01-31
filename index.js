const dotenv = require('dotenv');
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const connectDB = require('./config/connectdb');
const user_routes = require('./routes/user_routes');


const app = express();
app.use(cors())
dotenv.config();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use('/documents/profile/uploads', express.static('documents/profile/uploads'));
app.use('/documents/certificate/uploads', express.static('documents/certificate/uploads'));
app.use('/documents/national/uploads', express.static('documents/national/uploads'));

const port = process.env.PORT || 4000;
const DATABASE_URL = process.env.DATABASE_URL;
connectDB(DATABASE_URL)

app.use('/api/user', user_routes)

app.use('/', async (req, res) => {
    res.json({ message: 'API is running' });
  });
  
app.listen(port, () => {
    console.log(`server listening at http://localhost:${port}`);
})