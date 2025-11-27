const express = require('express');

const router = express.Router();

const auth = require('../middleware/auth');

const { sendMessage, getMessages, createConversation } = require('../controllers/chatController');



router.post('/send', auth, sendMessage);

router.get('/:conversationId', auth, getMessages);

router.post('/create', auth, createConversation);



module.exports = router;


