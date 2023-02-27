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
    res.status(201).json({ msg: "Utilizador criado com sucesso!" });
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

  // check if user exists
  const user = await User.findById(id, "-password");
  if (!user) {
    return res.status(404).json({ msg: "O utilizador não foi encontrado" });
  }
  return res.status(200).json({ user });
};
