const express = require('express');
const router = express.Router();
const Account = require('../models/account');
const authMiddleware = require('../middleware/authMiddleware');
const bcrypt = require('bcrypt');
const { createUserWithEmailAndPassword } = require('firebase/auth');


router.get('/', authMiddleware, async (req, res) => {
  try {
    const limit = req.query.limit ? parseInt(req.query.limit) : null;
    const accounts = await Account.findAll({ limit });
    res.json(accounts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

const registerUser = async (email, password) => {
  try {
    const hashedPassword = bcrypt.hashSync(password, 10);
    const userRecord = await createUserWithEmailAndPassword({
      email: email,
      password: hashedPassword
    }).then((userCredential) => {
      var user = userCredential.user;
      console.log(user);
      console.log('User registered successfully:', userRecord.uid);
      return userRecord;
      });
      console.error('Error registering user:', error.message);
  } catch (error) {
    console.error('Error registering user:', error.message);
    throw error;
  }
};

router.post('/', async (req, res) => {
  try {
    const res = await registerUser(req.body.email, req.body.password)
    console.log(res)
    res.status(201).json(account);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const account = await Account.findOne({ where: { id } });
    if (account) {
      res.json(account);
    } else {
      res.status(404).json({ error: 'Account not found' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const [updated] = await Account.update(req.body, { where: { id } });
    if (updated) {
      const updatedAccount = await Account.findOne({ where: { id } });
      res.json(updatedAccount);
    } else {
      res.status(404).json({ error: 'Account not found' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Account.destroy({ where: { id } });
    if (deleted) {
      res.status(204).send("Account deleted");
    } else {
      res.status(404).json({ error: 'Account not found' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const account = await Account.findOne({ where: { email } });
    if (account && bcrypt.compareSync(password, account.password)) {
      res.json({ message: 'Login successful', account });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
