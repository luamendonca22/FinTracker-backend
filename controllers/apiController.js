exports.getApi = async (req, res) => {
  return res.status(200).json({
    msg: "Bem-vindo!",
  });
};
