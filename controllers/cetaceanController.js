const Cetacean = require("../models/Cetacean");
const { Picture } = require("../models/Picture");

exports.create = async (req, res) => {
  const {
    timestamp_start,
    timestamp_end,
    local_identifier,
    id: individualId,
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
      local_identifier,
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
  console.log(req.params.id);
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
