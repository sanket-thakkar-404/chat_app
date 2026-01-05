const userModel = require('../Models/user.model');
const friendRequestModel = require('../Models/friendRequest.model');


// get all user from here
module.exports.getRecommendedUsers = async (req, res) => {
  try {
    const currentUserId = req.user._id
    const friends = Array.isArray(req.user.friends) ? req.user.friends : [];

    const recommendedUsers = await userModel.find({
      $and: [
        { _id: { $ne: currentUserId } }, // to exclude own id
        { _id: { $nin: friends } }, // or current user exclude your id
        { isVerified: true },
      ]
    })

    return res.status(200).json(recommendedUsers);

  } catch (err) {
    console.error('Error in getRecommend user controller : ', err.message)
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }

}
// user friends in this route
module.exports.getMyFriends = async (req, res) => {
  try {
    const user = await userModel.findById(req.user._id)
      .select('friends')
      .populate('friends', 'fullname email avatar')

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Users friend Fetched successfully",
      friend: user.friends,
      count: user.friends?.length || 0,
    });
  } catch (err) {
    console.error('Error in get friends routes', err.message)
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });

  }
}


// to send Friend Request to user
module.exports.sendFriendRequest = async (req,res) => {
  try {
    const myId = req.user._id
    const { id: friendId } = req.params

    // prevent sending req to Yourself
    if (myId === friendId) return res.status(400).json({ message: "you can't send Friend Request to Yourself" })

    // check recipient are found in our database
    const Recipient = await userModel.findById(friendId);
    if (!Recipient) return res.status(404).json({ message: 'Friend Id  Not Found' })
    // check recipient are already friend or not
    if (Recipient.friends.includes(myId)) return res.status(400).json({ message: 'You are already friend with the user' })
    // check recipient has already sent the request
    const existingRequest = await friendRequestModel.findOne({
      $or: [
        { sender: myId, recipients: friendId },
        { sender: friendId, recipients: myId }
      ],
    })

    if (existingRequest) return res.status(400).json({ message: 'A friend request already exists between you and this user' })


    const friendRequest = await friendRequestModel.create({
      sender: myId,
      recipients: friendId
    })

    return res.status(201).json(friendRequest)
  } catch (err) {
    console.error('Error in Sending request Routes ', err)
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
}

// this will accept the friend request
module.exports.acceptFriendRequest = async (req, res) => {
  try {
    const { id: requestId } = req.params
    const friendRequest = await friendRequestModel.findById(requestId)

    // verify the current user recipient
    if (!friendRequest) return res.status(404).json({ message: 'Friend Request not found' })

    friendRequest.status = 'accepted',
      await friendRequest.save()

    await userModel.findByIdAndUpdate(friendRequest.sender, {
      $addToSet: { friends: friendRequest.recipients }
    })
    await userModel.findByIdAndUpdate(friendRequest.recipients, {
      $addToSet: { friends: friendRequest.sender }
    })

    res.status(200).json({ message: 'Your Friend Request Accepted Successfully' })

  } catch (err) {
    console.error('Error in Accepting Friend Request Controller ', err)
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
}


module.exports.getFriendRequests = async (req, res) => {
  try {
    const incomingReq = await friendRequestModel.find({
      recipients: req.user._id,
      status: 'pending',
    }).populate('sender', 'fullname , avatar , email')


    const acceptedReq = await friendRequestModel.find({
      sender: req.user._id,
      status: 'accepted',
    }).populate("recipients", 'fullname , avatar')
    res.status(200).json({ incomingReq, acceptedReq })
  } catch (err) {
    console.error('Error in Get Friend Request routes', err)
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });

  }
}


module.exports.getOutGoingFriendRequest = async (req,res) => {
  try {
    const outgoingReq = await friendRequestModel.find({
      sender: req.user._id,
      status: "pending",
    }).populate("recipients", "fullname ,avatar,email ")
    res.status(200).json({ outgoingReq })
  } catch (err) {
    console.error("Error in OutGoing Friend Request :", err)
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
}
