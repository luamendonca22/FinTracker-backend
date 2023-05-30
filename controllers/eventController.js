const Event = require("../models/Event");
const Cetacean = require("../models/Cetacean");
exports.create = async (req, res) => {
  const {
    timestamp,
    location_lat,
    location_long,
    individual_id: individualId,
    tag_id,
  } = req.body;
  try {
    const correctLong =
      location_long < -180 ? -180 : location_long > 180 ? 180 : location_long;
    const correctLat =
      location_lat < -90 ? -90 : location_lat > 90 ? 90 : location_lat;
    // check if that cetacean associated exists
    const cetaceanExists = await Cetacean.findOne({
      individualId: individualId,
    });
    if (!cetaceanExists) {
      return res.status(404).json({ msg: "O cetáceo não foi encontrado!" });
    }
    const event = new Event({
      timestamp: timestamp,
      location: {
        type: "Point",
        coordinates: [parseFloat(correctLong), parseFloat(correctLat)],
      },
      individualId,
      tag_id,
    });
    await event.save();
    res.status(201).json({ event, msg: "Evento criado com sucesso!" });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      msg: "Ocorreu um erro no servidor, tente novamente mais tarde.",
    });
  }
};
exports.getAll = async (req, res) => {
  try {
    const events = await Event.find();
    return res.json({ events, msg: "Eventos atualizados!" });
  } catch (error) {
    return res.status(500).json({
      msg: "Ocorreu um erro no servidor, tente novamente mais tarde.",
    });
  }
};

exports.deleteAll = async (req, res) => {
  try {
    await Event.deleteMany({});
    return res.json({ msg: "Eventos eliminados!" });
  } catch (error) {
    return res.status(500).json({
      msg: "Ocorreu um erro no servidor, tente novamente mais tarde.",
    });
  }
};

exports.getByIndividualId = async (req, res) => {
  const id = req.params.id;
  try {
    const events = await Event.find({ individualId: id });
    if (!events) {
      return res
        .status(404)
        .json({ msg: "Não foram encontrados eventos para este cetáceo!" });
    }

    return res.json({ events, msg: "Eventos filtrados por individualId!" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      msg: "Ocorreu um erro no servidor, tente novamente mais tarde.",
    });
  }
};

exports.getNear = async (req, res) => {
  const { long, lat } = req.params;

  try {
    const events = await Event.aggregate([
      {
        $geoNear: {
          near: {
            type: "Point",
            coordinates: [parseFloat(long), parseFloat(lat)],
          },
          key: "location",
          distanceField: "dist.calculated",
          spherical: true,
        },
      },
    ]);

    return res.json({
      events,
      msg: "Eventos próximos atualizados com sucesso!",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      msg: "Ocorreu um erro no servidor, tente novamente mais tarde.",
    });
  }
};
