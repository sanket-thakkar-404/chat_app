const bcrypt = require('bcrypt');
async function connectDB() {
  await mongoose.connect('mongodb+srv://learnsanket9_db_user:L6vZoy1cqJJP6owx@cluster0.d2cf6qw.mongodb.net/chat_db?appName=Cluster0');
  console.log("✅ MongoDB Connected");
}

const mongoose = require("mongoose");
const userModel = require("../Models/user.model");



const seedUsers = [
  // -------- Female --------
  {
    email: "emma.thompson@example.com",
    password: "123456",
    fullname: { firstName: "Emma", lastName: "Thompson" },
    avatar:
      "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg",
    isVerified: true,
  },
  {
    email: "olivia.miller@example.com",
    password: "123456",
    fullname: { firstName: "Olivia", lastName: "Miller" },
    avatar:
      "https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg",
    isVerified: true,
  },
  {
    email: "sophia.davis@example.com",
    password: "123456",
    fullname: { firstName: "Sophia", lastName: "Davis" },
    avatar:
      "https://images.pexels.com/photos/3760851/pexels-photo-3760851.jpeg",
    isVerified: true,
  },
  {
    email: "ava.wilson@example.com",
    password: "123456",
    fullname: { firstName: "Ava", lastName: "Wilson" },
    avatar:
      "https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg",
    isVerified: true,
  },
  {
    email: "isabella.brown@example.com",
    password: "123456",
    fullname: { firstName: "Isabella", lastName: "Brown" },
    avatar:
      "https://images.pexels.com/photos/1130626/pexels-photo-1130626.jpeg",
    isVerified: true,
  },
  {
    email: "mia.johnson@example.com",
    password: "123456",
    fullname: { firstName: "Mia", lastName: "Johnson" },
    avatar:
      "https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg",
    isVerified: true,
  },

  // -------- Male --------
  {
    email: "james.anderson@example.com",
    password: "123456",
    fullname: { firstName: "James", lastName: "Anderson" },
    avatar:
      "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg",
    isVerified: true,
  },
  {
    email: "william.clark@example.com",
    password: "123456",
    fullname: { firstName: "William", lastName: "Clark" },
    avatar:
      "https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg",
    isVerified: true,
  },
  {
    email: "benjamin.taylor@example.com",
    password: "123456",
    fullname: { firstName: "Benjamin", lastName: "Taylor" },
    avatar:
      "https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg",
    isVerified: true,
  },
  {
    email: "lucas.moore@example.com",
    password: "123456",
    fullname: { firstName: "Lucas", lastName: "Moore" },
    avatar:
      "https://images.pexels.com/photos/601170/pexels-photo-601170.jpeg",
    isVerified: true,
  },
  {
    email: "henry.jackson@example.com",
    password: "123456",
    fullname: { firstName: "Henry", lastName: "Jackson" },
    avatar:
      "https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg",
    isVerified: true,
  },
  {
    email: "alexander.martin@example.com",
    password: "123456",
    fullname: { firstName: "Alexander", lastName: "Martin" },
    avatar:
      "https://images.pexels.com/photos/936229/pexels-photo-936229.jpeg",
    isVerified: true,
  },
  {
    email: "daniel.rodriguez@example.com",
    password: "123456",
    fullname: { firstName: "Daniel", lastName: "Rodriguez" },
    avatar:
      "https://images.pexels.com/photos/1704488/pexels-photo-1704488.jpeg",
    isVerified: true,
  },
  {
    email: "michael.lewis@example.com",
    password: "123456",
    fullname: { firstName: "Michael", lastName: "Lewis" },
    avatar:
      "https://images.pexels.com/photos/3777941/pexels-photo-3777941.jpeg",
    isVerified: true,
  },
];

async function seedDatabase() {
  await connectDB();

  try {
    // optional: clear old dummy users
    // await User.deleteMany({});
    for (let user of seedUsers) {
      user.password = await bcrypt.hash(user.password, 10);
    }


    await userModel.insertMany(seedUsers);
    console.log(`✅ Seeded ${seedUsers.length} real users`);
  } catch (err) {
    console.error("❌ Seeding failed:", err);
  } finally {
    mongoose.connection.close();
  }
}

seedDatabase();