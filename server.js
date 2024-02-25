const express = require('express');
const accountRoutes = require('./routes/accountRoutes');
const serviceAccount = require('./serviceAccountKey.json');
const Account = require('./models/account');
const { initializeApp } = require('firebase/app')
const { getAuth } = require("firebase/auth");

const app = express();
const PORT = process.env.PORT || 3000;
const firebaseConfig = {
  apiKey: "AIzaSyA2OHTxJkPiPI2_aRR1Wk43FhpO9wFieWA",
  authDomain: "be-assignment-rs.firebaseapp.com",
  projectId: "be-assignment-rs",
  storageBucket: "be-assignment-rs.appspot.com",
  messagingSenderId: "889917406758",
  appId: "1:889917406758:web:a4a6bbd825e75f4fc7f0e7",
  measurementId: "G-2VVDVZBHC1"
};

// Initialize Firebase
const fbApp = initializeApp(firebaseConfig);
const admin = getAuth(fbApp)

const loginUser = async (email, password) => {
  try {
    const userCredential = await admin.getAuth().signInWithEmailAndPassword(email, password);
    const user = userCredential.user;
    console.log('User logged in:', user.uid);
    return user;
  } catch (error) {
    console.error('Error logging in user:', error.message);
    throw error;
  }
};

app.use(express.json());
app.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const account = await Account.findOne({ where: { email } });
    if (account && bcrypt.compareSync(password, account.password)) {
      loginUser(email, password)
      res.json({ message: 'Login successful', account });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.use('/api/accounts', accountRoutes);
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

module.exports = admin;