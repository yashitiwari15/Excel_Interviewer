const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const chatRoutes = require('./routes/chat');
const mongoose = require("mongoose");

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5001;

app.use(cors());
app.use(express.json());
app.use('/api/chat', chatRoutes);

mongoose.connect(process.env.MONGODB_ATLAS_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('✅ Connected to MongoDB Atlas'))
.catch((err) => console.error('❌ MongoDB Atlas connection error:', err));

app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});
