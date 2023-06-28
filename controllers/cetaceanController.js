const Cetacean = require("../models/Cetacean");
const User = require("../models/User");
const { Picture } = require("../models/Picture");
const { Comment } = require("../models/Comment");

exports.create = async (req, res) => {
  const {
    timestamp_start,
    timestamp_end,
    /* local_identifier, */
    /* id: individualId, */
    individualId,
    socialBehavior,
    physic,
    details,
    name,
    history,
    migration,
    introduction,
  } = req.body;
  try {
    const picture = new Picture({
      name: details[1].value,
      src: `cetaceans/${details[1].value.trim()}.jpg`,
    });
    const cetacean = new Cetacean({
      timestamp_start,
      timestamp_end,
      /* local_identifier, */
      socialBehavior,
      physic,
      individualId,
      details,
      name,
      picture,
      history,
      migration,
      introduction,
    });
    await cetacean.save();
    res.status(201).json({ cetacean, msg: "Cetáceo criado com sucesso!" });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      msg: "Ocorreu um erro no servidor, tente novamente mais tarde.",
    });
  }
};

exports.updateComment = async (req, res) => {
  const { text, userId } = req.body;
  const id = req.params.id;
  try {
    const user = await User.findById(userId, "-password");
    if (!user) {
      return res.status(404).json({ msg: "O utilizador não foi encontrado" });
    }

    const comment = new Comment({
      text,
      userId,
    });
    await comment.save();

    const updatedCetacean = await Cetacean.findOneAndUpdate(
      { individualId: id },
      { $push: { comments: comment } },
      { new: true } // retorna o novo documento atualizado
    );

    res.status(200).json({ updatedCetacean, msg: "Comentário adicionado!" });
  } catch (error) {
    return res.status(500).json({
      msg: "Ocorreu um erro no servidor, tente novamente mais tarde.",
    });
  }
};
exports.getAll = async (req, res) => {
  try {
    const cetaceans = await Cetacean.find();
    return res.json({ cetaceans, msg: "Cetáceos atualizados!" });
  } catch (error) {
    return res.status(500).json({
      msg: "Ocorreu um erro no servidor, tente novamente mais tarde.",
    });
  }
};
exports.getByIndividualId = async (req, res) => {
  const id = req.params.id;
  try {
    const cetacean = await Cetacean.findOne({ individualId: id });
    if (!cetacean) {
      return res.status(404).json({ msg: "O cetáceo não foi encontrado!" });
    }

    return res.json({ cetacean, msg: "Cetáceos filtrados por id!" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      msg: "Ocorreu um erro no servidor, tente novamente mais tarde.",
    });
  }
};
exports.deleteAll = async (req, res) => {
  try {
    await Cetacean.deleteMany({});
    return res.json({ msg: "Cetáceos eliminados!" });
  } catch (error) {
    return res.status(500).json({
      msg: "Ocorreu um erro no servidor, tente novamente mais tarde.",
    });
  }
};

exports.deleteComment = async (req, res) => {
  //comment id
  const id = req.params.id;
  const cetaceanId = req.params.cetaceanId;

  try {
    const comment = await Comment.findById(id);
    if (!comment) {
      return res.status(404).json({ msg: "O comentário não foi encontrado" });
    }
    const updatedCetacean = await Cetacean.findOneAndUpdate(
      { individualId: cetaceanId },
      { $pull: { comments: { _id: id } } },
      { new: true } // retorna o novo documento atualizado
    );
    if (!updatedCetacean) {
      return res.status(404).json({ msg: "O cetáceo não foi encontrado" });
    }
    await comment.remove();
    res.status(200).json({ updatedCetacean, msg: "Comentário eliminado!" });
  } catch (error) {
    return res.status(500).json({
      msg: "Ocorreu um erro no servidor, tente novamente mais tarde.",
    });
  }
};
