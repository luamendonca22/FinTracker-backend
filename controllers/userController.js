const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");
const User = require("../models/User");
const jwt = require("jsonwebtoken");
const fs = require("fs");

// -------- POST ---------

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
    return res.status(422).json({ msg: "A palavra-passe é obrigatória." });
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

exports.forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ msg: "O utilizador não foi encontrado." });
    }

    const secret = process.env.SECRET + user.password;

    // Generate a unique token and store it in the user's document
    const token = jwt.sign({ email: user.email, id: user._id }, secret, {
      expiresIn: "1m",
    });
    const link = `http://localhost:3000/user/${user._id}/resetPassword/${token}`;

    // Send an email to the user with a link to the password reset page
    const transporter = nodemailer.createTransport({
      service: "Hotmail",
      auth: {
        user: process.env.EMAIL_ADDRESS,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_ADDRESS,
      to: email,
      subject: `Recuperação de palavra-passe`,
      html: `
      <div style="background-color: #5990FF; padding: 20px; width:60%; text-align: center; margin: 0 auto;">
      <p style="color: #fff; font-size: 18px; margin-bottom: 20px; font-weight: bold; font-size: 20px;">Recuperação de palavra-passe</p>
      <p style="color: #fff; font-size: 16px;">Olá ${user.username},</p>
      <p style="color: #fff; font-size: 16px;">Para alterares a tua palavra-passe, clica no botão abaixo e segue as instruções.</p>
      <a href="${link}" style="display: inline-block; padding: 10px 20px; background-color: #fff; color: #000; text-decoration: none; border-radius: 5px; font-size: 16px; font-weight: bold; margin-top: 20px; box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.2);">Alterar senha</a>
      <p style="color: #fff; font-size: 16px; margin-top: 20px;">Se não pediste recuperação de palavra-passe, ignora este email.</p>
      <p style="color: #fff; font-size: 16px;">Se tiveres alguma dúvida, não hesites em nos contactar.</p>
      <p style="color: #fff; font-size: 16px;">Obrigado,</p>
      <p style="color: #fff; font-size: 16px; font-weight:bold;">Equipa de Suporte</p>
    </div>
      `,
    };

    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error);
      } else {
        console.log("Email enviado: " + info.response);
      }
    });

    res.status(200).json({ msg: "Email enviado!" });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      msg: "Ocorreu um erro no servidor, tente novamente mais tarde.",
    });
  }
};
exports.resetPassword = async (req, res) => {
  const { id, token } = req.params;
  const { password } = req.body;
  const user = await User.findById(id);
  if (!user) {
    return res.status(404).json({ msg: "O utilizador não foi encontrado." });
  }
  if (!password) {
    return res.redirect(
      `http://localhost:3000/user/${user._id}/resetPassword/${token}`
    );
  }
  const secret = process.env.SECRET + user.password;
  try {
    const verify = jwt.verify(token, secret);

    // create password
    const salt = await bcrypt.genSalt(12);
    const passwordHash = await bcrypt.hash(password, salt);

    // create user
    user.password = passwordHash;
    await user.save();
    res.render("password-reseted");
  } catch (error) {
    res.render("non-authorized");
  }
};
// --------- GET ---------

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
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    return res.json({ users });
  } catch (error) {
    return res.status(500).json({
      msg: "Ocorreu um erro no servidor, tente novamente mais tarde.",
    });
  }
};
exports.getPicture = async (req, res) => {
  const id = req.params.id;
  try {
    const user = await User.findById(id, "-password");
    if (!user) {
      return res.status(404).json({ msg: "O utilizador não foi encontrado" });
    }
    const userPictureSrc = user.picture;
    if (userPictureSrc == "") {
      return res.status(404).json({ msg: "A imagem de perfil não existe." });
    }
    // pick the file source
    console.log(userPictureSrc);

    // send the source
    res.status(200).json({
      userPictureSrc,
      msg: "Imagem de perfil atualizada com sucesso!",
    });
  } catch (error) {
    return res.status(500).json({
      msg: "Ocorreu um erro no servidor, tente novamente mais tarde.",
    });
  }
};
exports.showResetPassword = async (req, res) => {
  const { id, token } = req.params;

  const user = await User.findById(id);
  if (!user) {
    return res.status(404).json({ msg: "O utilizador não foi encontrado" });
  }
  const secret = process.env.SECRET + user.password;
  try {
    const verify = jwt.verify(token, secret);

    res.render("index");
  } catch (error) {
    console.log(error);
    res.render("non-authorized");
  }
};

// -------- UPDATE ---------

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

exports.updatePoints = async (req, res) => {
  const id = req.params.id;
  const points = req.body.points;

  try {
    // check if user exists
    const user = await User.findById(id, "-password");
    if (!user) {
      return res.status(404).json({ msg: "O utilizador não foi encontrado" });
    }
    user.points = user.points + points;
    await user.save();
    return res.status(201).json({ user, msg: points });
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
exports.updatePicture = async (req, res) => {
  const id = req.params.id;
  const src = req.body.src;
  try {
    const user = await User.findById(id, "-password");
    if (!user) {
      return res.status(404).json({ msg: "O utilizador não foi encontrado" });
    }

    user.picture = src;
    await user.save();

    res
      .status(200)
      .json({ user, msg: "Imagem de perfil adicionada com sucesso!" });
  } catch (error) {
    return res.status(500).json({
      msg: "Ocorreu um erro no servidor, tente novamente mais tarde.",
    });
  }
};
exports.updateFavorites = async (req, res) => {
  const id = req.params.id;
  const { cetaceanId } = req.body;
  try {
    const user = await User.findById(id, "-password");
    if (!user) {
      return res.status(404).json({ msg: "O utilizador não foi encontrado" });
    }
    const isFavorite = user.favorites.includes(cetaceanId);
    if (isFavorite) {
      return res
        .status(400)
        .json({ msg: "Este cetáceo já está nos favoritos!" });
    }

    const updatedUser = await User.findByIdAndUpdate(
      { _id: id },
      { $push: { favorites: cetaceanId } },
      { new: true } // retorna o novo documento atualizado
    );

    res
      .status(200)
      .json({ updatedUser, msg: "Cetáceo adicionado aos favoritos!" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      msg: "Ocorreu um erro no servidor, tente novamente mais tarde.",
    });
  }
};
exports.updateVisited = async (req, res) => {
  const id = req.params.id;
  const { cetaceansIds } = req.body;
  try {
    if (cetaceansIds.length === 0) {
      return res.status(400).json({
        msg: "Não foram encontrados os parâmetros no corpo da solicitação",
      });
    }

    const user = await User.findById(id, "-password");
    if (!user) {
      return res.status(404).json({ msg: "O utilizador não foi encontrado" });
    }
    const vistedIds = user.visited;

    const newVisitedIds = cetaceansIds.filter((id) => !vistedIds.includes(id));
    if (newVisitedIds.length === 0) {
      return res
        .status(400)
        .json({ msg: "Estes cetáceos já foram visitados!" });
    }

    const updatedUser = await User.findByIdAndUpdate(
      { _id: id },
      { $push: { visited: { $each: newVisitedIds } } },
      { new: true }
    );

    const pointsReceived = newVisitedIds.length * 5;
    res.status(200).json({
      updatedUser,
      pointsReceived,
      msg: "Cetáceos adicionados aos visitados!",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      msg: "Ocorreu um erro no servidor, tente novamente mais tarde.",
    });
  }
};
// -------- DELETE ---------

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
exports.deletePicture = async (req, res) => {
  const id = req.params.id;
  try {
    const user = await User.findById(id, "-password");
    if (!user) {
      return res.status(404).json({ msg: "O utilizador não foi encontrado" });
    }
    // retrieve the picture property of user

    if (user.picture == "") {
      return res
        .status(404)
        .json({ msg: "O utilizador não tem nenhuma foto de perfil." });
    }

    // delete the picture property of user
    user.picture = "";
    await user.save();
    res.status(200).json({ msg: "Imagem de perfil removida com sucesso!" });
  } catch (error) {
    return res.status(500).json({
      msg: "Ocorreu um erro no servidor, tente novamente mais tarde.",
    });
  }
};
exports.deleteFavorite = async (req, res) => {
  const id = req.params.id;
  const { cetaceanToRemove } = req.body;
  try {
    const user = await User.findById(id, "-password");
    if (!user) {
      return res.status(404).json({ msg: "O utilizador não foi encontrado" });
    }
    const isFavorite = user.favorites.includes(cetaceanToRemove);
    if (!isFavorite) {
      return res
        .status(400)
        .json({ msg: "Este cetáceo não está nos favoritos!" });
    }
    const updatedUser = await User.findByIdAndUpdate(
      { _id: id },
      { $pull: { favorites: cetaceanToRemove } },
      { new: true }
    );

    res
      .status(200)
      .json({ updatedUser, msg: "Cetáceo removido dos favoritos!" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      msg: "Ocorreu um erro no servidor, tente novamente mais tarde.",
    });
  }
};
