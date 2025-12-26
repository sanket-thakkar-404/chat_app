const express = require('express');
const router = express.Router();
const authMiddleware = require('../Middleware/auth.middleware');
const messageController = require('../Controller/message.controller');


router.get('/users', authMiddleware.protectedRoute, messageController.getUsersForSidebar);
router.get('/:id', authMiddleware.protectedRoute, messageController.getMessage);
router.post('/send/:id', authMiddleware.protectedRoute, messageController.sendMessage);



module.exports = router;