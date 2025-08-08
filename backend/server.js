const express = require('express');
const dotenv = require('dotenv');
const communityMemberRoutes = require('./routes/communityMemberRoutes');
const userRoutes = require('./routes/userRoutes');
const cors = require('cors');

dotenv.config();
const app = express();

app.use(cors());

// ✅ Body parsers should come before your routes
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(express.static('public'));
app.use('/uploads', express.static('public/uploads'));
app.use('/CommunityProblems', express.static('public/CommunityProblems'));

// ✅ Routes come after middleware
app.use('/api/community-members', communityMemberRoutes);
app.use(userRoutes);


app.get('/', (req, res) => {
  res.send('LocalVoice Backend Running...');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
