const userModel = require("../models/user.model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const redis = require("../config/Cache");

async function registerUser(req, res) {
  const { username, email, password } = req.body;
  isAlreadyExist = await userModel.findOne({
    $or: [{ username: username }, { email: email }],
  });

  if (isAlreadyExist) {
    return res.status(400).json({
      message: "Username or email already exists",
    });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = await userModel.create({
    username,
    email,
    password: hashedPassword,
  });

  const token = jwt.sign(
    { id: newUser._id, username: newUser.username },
    process.env.JWT_SECRET_KEY,
    { expiresIn: "3d" },
  );
  res.cookie("token", token);

  return res.status(201).json({
    message: "User registered successfully",
    user: {
      id: newUser._id,
      username: newUser.username,
      email: newUser.email,
    },
  });
}

async function loginUser(req, res) {
  const { username, email, password } = req.body;
  const user = await userModel.findOne({
    $or: [{ username: username }, { email: email }],
  }).select("+password");

  if (!user) {
    return res.status(400).json({
      message: "Invalid credentials",
    });
  }
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return res.status(400).json({
      message: "Invalid credentials",
    });
  }
  const token = jwt.sign(
    { id: user._id, username: user.username },
    process.env.JWT_SECRET_KEY,
    { expiresIn: "3d" },
  );
  res.cookie("token", token);
  return res.status(200).json({
    message: "User logged in successfully",
    user: {
      id: user._id,
      username: user.username,
      email: user.email,
    },
  });
};

async function getMe(req, res) {
  const user = await userModel.findById(req.user.id);
  if (!user) {
    return res.status(404).json({
      message: "User not found",
    });
  }
  return res.status(200).json({
    user,
  });
};

async function logout(req, res){
const token = req.cookies.token;
res.clearCookie("token");

await redis.set(token, Date.now.toString())

res.status(200).json({
  message: "logout successfully"
})
}

module.exports = {
  registerUser,
    loginUser,
    getMe,
    logout
};
