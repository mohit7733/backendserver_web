const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const auth = require('./middleware/auth');
const userRoutes = require('./routes/userRoutes');
const pagesRoutes = require('./routes/pagesRoutes')
const colorsRoutes = require('./routes/colorsRoutes')
const tagsRoutes = require('./routes/tagsRoutes')
const categoriesRoutes = require('./routes/categoriesRoutes')
const websitesRoutes = require('./routes/websiteroutes')
const likeViewRoutes = require('./routes/like_view')
const awordsRoutes = require('./routes/awordsRoutes')
const winnerwebsite = require('./routes/winnerwebsite');
const blogsRoutes = require("./routes/blogsRoutes")
const jobsRoutes = require("./routes/jobsRoutes")
const adspaceRoutes = require("./routes/adespaceRoutes")
const userloginRoutes = require("./routes/userloginRoutes")
const emailer = require("./routes/emailer")
const subscriberRoutes = require("./routes/subscriberRoutes")
const contactsRoutes = require("./routes/contactsRoutes")
const countryRoutes = require("./routes/country")
const usersRoutes = require("./routes/usersRoutes")
const newslettersRoutes = require("./routes/newslettersRoutes")
const pricingRoutes = require("./routes/pricingRoutes")
const createOrder = require("./routes/createOrder")
const paypalRoutes = require("./routes/paypal")

dotenv.config();
const app = express();
app.use(express.json({ limit: '50mb' }));
const PORT = process.env.PORT || 8080;
// const corsOptions = {
//     origin: ["*"], // Replace with your frontend URLs allowed to access the server
//     methods: ["GET", "POST", "PUT", "DELETE"],
//     credentials: true,  // enable set cookie
//     optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
// };
app.use(cors());
// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected'))
    .catch((err) => console.log(err));

app.use(express.json());
app.use('/public/uploads', express.static('public/uploads'));
app.use('/public/blogs', express.static('public/blogs'));
app.use('/public/ads', express.static('public/ads'));
app.use('/public/job_images', express.static('public/job_images'));

// Sample route
app.get('/api', (req, res) => {
    res.send('Hello World');
});
app.use('/api/paypal', paypalRoutes);
// app.use('/api', createOrder);
app.use('/api', userRoutes);
app.use('/api', pagesRoutes);
app.use('/api', colorsRoutes);
app.use('/api', tagsRoutes);
app.use('/api', adspaceRoutes)
app.use("/api", jobsRoutes)
app.use('/api', categoriesRoutes);
app.use('/api', websitesRoutes);
app.use('/api', likeViewRoutes);
app.use('/api', winnerwebsite);
app.use('/api', blogsRoutes)
app.use('/api', emailer);
app.use('/api', subscriberRoutes);
app.use('/api', userloginRoutes)
app.use('/api', contactsRoutes)
app.use('/api', countryRoutes)
app.use('/api', usersRoutes)
app.use('/api', newslettersRoutes)
app.use('/api', pricingRoutes)

app.use('/api', auth, awordsRoutes);
//auth middleware
// app.get('/', auth, (req, res) => {
//     res.send('Hello World');
// });

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
