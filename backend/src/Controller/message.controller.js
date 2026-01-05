const messageModel = require('../Models/message.model');
const userModel = require('../Models/user.model')
const cloudinary = require('../config/cloudinary.config');
const { getReceiverSocketId, io } = require('../lib/Socket');


module.exports.getMessage = async (req, res) => {
  try {
    const { id: userToChat } = req.params;
    const myId = req.user._id;

    const messages = await messageModel
      .find({
        $or: [
          { senderId: myId, receiverId: userToChat },
          { senderId: userToChat, receiverId: myId },
        ],
      })
      .sort({ createdAt: 1 }); // IMPORTANT

    return res.status(200).json({
      success: true,
      message: "Messages fetched successfully",
      messages,
    });

  } catch (err) {
    console.error("getMessage error:", err);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

module.exports.sendMessage = async (req, res) => {
  try {
    const { text, image } = req.body;
    const { id: receiverId } = req.params;
    const senderId = req.user._id;

    if (!receiverId) {
      return res.status(400).json({
        success: false,
        message: "Receiver ID is required",
      });
    }

    if (!text && !image) {
      return res.status(400).json({
        success: false,
        message: "Message cannot be empty",
      });
    }

    let imageUrl = null;

    // Upload image if available
    if (image) {
      const uploadRes = await cloudinary.uploader.upload(image, {
        folder: "chatty/messages",
      });

      imageUrl = uploadRes.secure_url;
    }

    const newMessage = await messageModel.create({
      senderId,
      receiverId,
      text: text || "",
      image: imageUrl,
    });

    await newMessage.save()

    //  realtime functionally goes here ===> socket.io
    const receiverSocketId = getReceiverSocketId(receiverId)
    if (receiverSocketId) {
      io.to(receiverSocketId).emit('newMessage', newMessage)
    }


    return res.status(201).json({
      success: true,
      message: "Message sent successfully",
      newMessage,
    });

  } catch (err) {
    console.error("Error in sendMessage:", err);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};