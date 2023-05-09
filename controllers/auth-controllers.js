const ctrlWrapper = require("../utils/ctrlWrapper");
const { HttpError, createToken, createVerifyEmail } = require("../helpers");
const { User } = require("../models/user");
const bcrypt = require("bcrypt");
const fs = require("fs/promises");
const path = require("path");
const gravatar = require("gravatar");
const userAvatarDir = path.resolve("public", "avatars");
const Jimp = require("jimp");
const { nanoid } = require("nanoid");
const sendEmail = require("../helpers/sendEmail");

const register = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (user) {
    throw HttpError(409, "Email in use");
  }

  const hashPassword = await bcrypt.hash(password, 10);
  const userAvatar = gravatar.url(email);
  const verificationToken = nanoid();

  const newUser = await User.create({
    ...req.body,
    password: hashPassword,
    avatarURL: userAvatar,
    verificationToken,
  });

  const verifyEmail = createVerifyEmail(verificationToken);
  await sendEmail(verifyEmail);

  // const token = createToken(newUser);

  // await User.findByIdAndUpdate(newUser._id, { token, avatarURL: userAvatar });

  res.status(201).json({
    // token,
    user: {
      email: newUser.email,
      name: newUser.name,
      avatarURL: newUser.avatarURL,
    },
  });
};

const verify = async (req, res) => {
  const { verificationToken } = req.params;
  const user = await User.findOne({ verificationToken });
  if (!user) {
    throw HttpError(401, "Not found");
  }

  await User.findByIdAndUpdate(user._id, {
    verify: true,
    verificationToken: null,
  });

  res.json({
    message: "Verification successful",
  });
};

const resendVerifyEmail = async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    throw HttpError(401, "Not found");
  }
  if (user.verify) {
    throw HttpError(400, "Verification has already been passed");
  }

  const verifyEmail = createVerifyEmail(user.verificationToken);
  await sendEmail(verifyEmail);
  res.json({
    message: "Verification email sent",
  });
};

const login = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    throw HttpError(401, "Email or password invalid");
  }

  const passwordCompare = await bcrypt.compare(password, user.password);
  if (!passwordCompare) {
    throw HttpError(401, "Email or password invalid");
  }

  if (!user.verify) {
    throw HttpError(401, "Not found");
  }

  const token = createToken(user);

  await User.findByIdAndUpdate(user._id, { token });

  res.json({
    token,
    user: {
      email: user.email,
      name: user.name,
    },
  });
};

const getCurrent = async (req, res) => {
  const { email, name, token, userAvatar } = req.user;

  res.json({
    email,
    name,
    token,
    userAvatar,
  });
};

const logout = async (req, res) => {
  const { _id } = req.user;

  await User.findByIdAndUpdate(_id, { token: "" });
  res.status(204).send();
};

const subscriptionUpdate = async (req, res, next) => {
  try {
    const { contactId } = req.params;

    if (JSON.stringify(req.body) === "{}") {
      return res.status(400).json({ message: `missing field "subscription"` });
    }
    const result = await User.findByIdAndUpdate({ _id: contactId }, req.body, {
      new: true,
    });
    if (!result) {
      return res.status(400).json({ message: `Not found` });
    }
    res.json(`Your subscription updated to ${req.body.subscription}`);
  } catch (error) {
    next(error);
  }
};

const avatarUpdate = async (req, res, next) => {
  try {
    const { path: tempUpload, filename } = req.file;
    const resultUpload = path.join(userAvatarDir, filename);
    const avatar = await Jimp.read(tempUpload);
    avatar.resize(250, 250).quality(60).write(resultUpload);
    await fs.unlink(tempUpload);
    const { _id } = req.user;

    const avatarURL = path.join("avatars", filename);

    const result = await User.findByIdAndUpdate(
      { _id },
      { avatarURL },
      {
        new: true,
      }
    );
    if (!result) {
      return res.status(401).json({ message: `Not authorized` });
    }
    res.json({
      avatarURL,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  register: ctrlWrapper(register),
  verify: ctrlWrapper(verify),
  resendVerifyEmail: ctrlWrapper(resendVerifyEmail),
  login: ctrlWrapper(login),
  getCurrent: ctrlWrapper(getCurrent),
  logout: ctrlWrapper(logout),
  subscriptionUpdate: ctrlWrapper(subscriptionUpdate),
  avatarUpdate: ctrlWrapper(avatarUpdate),
};
