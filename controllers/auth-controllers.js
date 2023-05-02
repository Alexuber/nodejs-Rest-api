const ctrlWrapper = require("../utils/ctrlWrapper");
const { HttpError, createToken } = require("../helpers");
const { User } = require("../models/user");
const bcrypt = require("bcrypt");

const register = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (user) {
    throw HttpError(409, "Email in use");
  }

  const hashPassword = await bcrypt.hash(password, 10);

  const newUser = await User.create({ ...req.body, password: hashPassword });
  const token = createToken(newUser);

  await User.findByIdAndUpdate(newUser._id, { token });

  res.status(201).json({
    token,
    user: {
      email: newUser.email,
      name: newUser.name,
    },
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
  const { email, name, token } = req.user;

  res.json({
    email,
    name,
    token,
  });
};

const logout = async (req, res) => {
  const { _id } = req.user;

  await User.findByIdAndUpdate(_id, { token: "" });
  res.status(204);
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

module.exports = {
  register: ctrlWrapper(register),
  login: ctrlWrapper(login),
  getCurrent: ctrlWrapper(getCurrent),
  logout: ctrlWrapper(logout),
  subscriptionUpdate: ctrlWrapper(subscriptionUpdate),
};
