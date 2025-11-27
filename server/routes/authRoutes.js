const express = require('express');

const router = express.Router();

const jwt = require('jsonwebtoken');

const bcrypt = require('bcryptjs');

const User = require('../models/User');



router.post('/signup', async (req, res) => {

    const { name, email, password } = req.body;

    try {

        const hashedPassword = await bcrypt.hash(password, 12);

        const user = await User.create({ name, email, password: hashedPassword });

        const token = jwt.sign({ email: user.email, id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.status(200).json({ result: user, token });

    } catch (e) { res.status(500).json({ message: "Error" }); }

});



router.post('/signin', async (req, res) => {

    const { email, password } = req.body;

    try {

        const user = await User.findOne({ email });

        if (!user) return res.status(404).json({ message: "No existe usuario" });

        const isPasswordCorrect = await bcrypt.compare(password, user.password);

        if (!isPasswordCorrect) return res.status(400).json({ message: "Credenciales inválidas" });

        const token = jwt.sign({ email: user.email, id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.status(200).json({ result: user, token });

    } catch (e) { res.status(500).json({ message: "Error" }); }

});

module.exports = router;

