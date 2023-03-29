const { Picture } = require("../models/Picture");
const fs = require("fs");

exports.addNew = async (req, res) => {
  try {
    const { name } = req.bo;
    const file = req.file;
    const picture = new Picture({ name, src: file.path });
    await picture.save();
    res.status(201).json({ picture, msg: "Imagem guardada com sucesso!" });
  } catch (error) {
    res.status(500).json({ msg: "Erro ao guardar a imagem." });
  }
};
exports.delete = async (req, res) => {
  const id = req.params.id;

  try {
    const picture = await Picture.findById(id);
    if (!picture) {
      return res.status(404).json({ msg: "A imagem não foi encontrada." });
    }
    fs.unlinkSync(picture.src);
    await picture.remove();
    res.status(200).json({ msg: "Imagem removida com sucesso!" });
  } catch (error) {
    res.status(500).json({ msg: "Erro ao remover a imagem." });
  }
};
