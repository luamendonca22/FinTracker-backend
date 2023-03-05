const bcrypt = require("bcrypt");
const User = require("../models/User");
const jwt = require("jsonwebtoken");

exports.register = async (req, res) => {
  const { username, email, password } = req.body;

  // validations
  if (!username) {
    return res.status(422).json({ msg: "O nome é obrigatório." });
  }
  if (!email) {
    return res.status(422).json({ msg: "O email é obrigatório." });
  }
  if (!password) {
    return res.status(422).json({ msg: "A palavra-passe é obrigatório." });
  }

  try {
    // check if user exists
    const userExists = await User.findOne({ email: email });
    if (userExists) {
      return res.status(422).json({ msg: "Por favor, utilize outro email." });
    }

    // create password
    const salt = await bcrypt.genSalt(12);
    const passwordHash = await bcrypt.hash(password, salt);

    // create user
    const user = new User({ username, email, password: passwordHash });

    await user.save();
    res.status(201).json({ user, msg: "Utilizador criado com sucesso!" });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      msg: "Ocorreu um erro no servidor, tente novamente mais tarde.",
    });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;

  //vvalidations
  if (!email) {
    return res.status(422).json({ msg: "O email é obrigatório." });
  }
  if (!password) {
    return res.status(422).json({ msg: "A palavra-passe é obrigatório." });
  }

  // check if user exists
  const user = await User.findOne({ email: email });
  if (!user) {
    return res.status(404).json({ msg: "O utilizador não foi encontrado." });
  }

  // check if password match
  const checkPassword = await bcrypt.compare(password, user.password);

  if (!checkPassword) {
    return res.status(422).json({ msg: "Senha inválida." });
  }

  try {
    const secret = process.env.SECRET;
    const token = jwt.sign(
      { id: user._id, username: user.username, email: user.email },
      secret
    );
    res
      .status(200)
      .json({ msg: "Login realizado com sucesso", token, id: user._id });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      msg: "Ocorreu um erro no servidor, tente novamente mais tarde.",
    });
  }
};

exports.getUser = async (req, res) => {
  const id = req.params.id;

  try {
    // check if user exists
    const user = await User.findById(id, "-password");
    if (!user) {
      return res.status(404).json({ msg: "O utilizador não foi encontrado" });
    }
    return res.status(200).json({ user });
  } catch (error) {
    res.status(500).json({
      msg: "Ocorreu um erro no servidor, tente novamente mais tarde.",
    });
  }
};

exports.updateDetails = async (req, res) => {
  const id = req.params.id;
  const details = req.body;

  try {
    // check if user exists
    const user = await User.findById(id, "-password");
    if (!user) {
      return res.status(404).json({ msg: "O utilizador não foi encontrado" });
    }
    user.details = details;
    await user.save();
    return res
      .status(201)
      .json({ user, msg: "Detalhes atualizados com sucesso!" });
  } catch (error) {
    res.status(500).json({
      msg: "Ocorreu um erro no servidor, tente novamente mais tarde.",
    });
  }
};

exports.getDetails = async (req, res) => {
  const id = req.params.id;
  try {
    // check if user exists
    const user = await User.findById(id, "-password");
    if (!user) {
      return res.status(404).json({ msg: "O utilizador não foi encontrado." });
    }
    const details = user.details;
    return res.status(200).json({ details });
  } catch (error) {
    res.status(500).json({
      msg: "Ocorreu um erro no servidor, tente novamente mais tarde.",
    });
  }
};

exports.updatePassword = async (req, res) => {
  const id = req.params.id;
  const { currentPassword, newPassword, newPasswordConfirmation } = req.body;

  if (!currentPassword) {
    return res
      .status(422)
      .json({ msg: "Por favor, introduza a sua palavra-passe atual." });
  }
  if (!newPassword || !newPasswordConfirmation) {
    return res
      .status(422)
      .json({ msg: "Por favor, introduza uma nova palavra-passe." });
  }
  if (newPassword != newPasswordConfirmation) {
    return res.status(422).json({
      msg: "A confirmação da palavra-passe tem de ser igual à nova palavra-passe.",
    });
  }
  try {
    // check if user exists
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ msg: "O utilizador não foi encontrado." });
    }
    const isMatch = await bcrypt.compareSync(currentPassword, user.password);
    if (!isMatch) {
      return res.status(422).json({ msg: "Palavra-passe atual inválida" });
    }

    // create password
    const salt = await bcrypt.genSalt(12);
    const passwordHash = await bcrypt.hash(newPassword, salt);

    // create user
    user.password = passwordHash;

    await user.save();
    res.status(201).json({ user, msg: "Palavra-passe alterada com sucesso!" });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      msg: "Ocorreu um erro no servidor, tente novamente mais tarde.",
    });
  }
};
exports.deleteUser = async (req, res) => {
  const id = req.params.id;
  try {
    // check if user exists
    const user = await User.findById(id, "-password");
    if (!user) {
      return res.status(404).json({ msg: "O utilizador não foi encontrado." });
    }
    const deletedUser = await User.findByIdAndDelete(id);

    res.status(200).json({ deletedUser, msg: "Conta eliminada com sucesso!" });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      msg: "Ocorreu um erro no servidor, tente novamente mais tarde.",
    });
  }
};
exports.updatePoints = async (req, res) => {
  const id = req.params.id;
  const points = req.body.points;

  try {
    // check if user exists
    const user = await User.findById(id, "-password");
    if (!user) {
      return res.status(404).json({ msg: "O utilizador não foi encontrado" });
    }
    user.points = points;
    await user.save();
    return res
      .status(201)
      .json({ user, msg: "Pontos atualizados com sucesso!" });
  } catch (error) {
    res.status(500).json({
      msg: "Ocorreu um erro no servidor, tente novamente mais tarde.",
    });
  }
};
exports.updateUsername = async (req, res) => {
  const id = req.params.id;
  const username = req.body.username;
  try {
    // check if user exists
    const user = await User.findById(id, "-password");
    if (!user) {
      return res.status(404).json({ msg: "O utilizador não foi encontrado" });
    }
    user.username = username;
    await user.save();
    return res
      .status(201)
      .json({ username, msg: "Nome de utilizador atualizado com sucesso!" });
  } catch (error) {
    return res.status(500).json({
      msg: "Ocorreu um erro no servidor, tente novamente mais tarde.",
    });
  }
};

exports.deleteAccount = async (req, res) => {
  const id = req.params.id;
  try {
    // check if user exists
    const user = await User.findById(id, "-password");
    if (!user) {
      return res.status(404).json({ msg: "O utilizador não foi encontrado" });
    }
    const deletedUser = await User.findByIdAndDelete(id);

    return res
      .status(200)
      .json({ deletedUser, msg: "Conta eliminada com sucesso!" });
  } catch (error) {
    return res.status(500).json({
      msg: "Ocorreu um erro no servidor, tente novamente mais tarde.",
    });
  }
};
