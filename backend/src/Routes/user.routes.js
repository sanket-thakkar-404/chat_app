const express = require('express')
const { protectedRoute } = require('../Middleware/auth.middleware')
const UserController = require('../Controller/user.controller')
const router = express.Router()


// to apply protectedRoute to every do this
router.use(protectedRoute)


router.get('/', UserController.getRecommendedUsers)
router.get('/friends', UserController.getMyFriends)


router.post('/friend-request/:id', UserController.sendFriendRequest)
router.put('/friend-request/:id/accept', UserController.acceptFriendRequest)

router.get('/friend-requests', UserController.getFriendRequests)
router.get('/outgoing-friend-requests', UserController.getOutGoingFriendRequest)





module.exports = router