const db = require("../models");
const Result = db.results;
const User = db.user;
const Reading = db.readings;
const Op = db.Sequelize.Op;

// Create and Save a new Result
exports.create = (req, res) => {
  // Validate request
  if (!req.body.name) {
    res.status(400).send({
      message: "Name can not be empty!",
    });
    return;
  }
  if (!req.body.link) {
    res.status(400).send({
      message: "Link can not be empty!",
    });
    return;
  }
  if (!req.body.patient) {
    res.status(400).send({
      message: "Patient can not be empty!",
    });
    return;
  }

  // Create a Result
  const result = {
    name: req.body.name,
    link: req.body.link,
    patient: req.body.patient,
  };

  // Save Result in the database
  Result.create(result)
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the Result.",
      });
    });
};

exports.uploadReading = async (req, res) => {
  try {
    const file = req["file"];
    console.info(file);
    // const result = await Result.findByPk(req.params.resultId)
    // result.setReading()
    const link = `${req.protocol}://${req.get("host")}/${file.filename}`;
    console.info(link);
    const reading = await Reading.create({
      name: file.filename,
      link,
      resultId: req.params.resultId,
    });
    console.info(reading);
    res.status(200).send(reading);
  } catch (error) {
    console.info(error);
    res.status(500).send(error);
  }
};

exports.upload = async (req, res) => {
  try {
    const file = req["file"];
    console.info("file: ", file);
    const link = `${req.protocol}://${req.get("host")}/${file.filename}`;
    // res.statusCode = 200;
    // res.setHeader('Content-Type', 'application/json');
    // res.json(req.file);
    // res.status(200).send()
    const result = await Result.create({ name: file.filename, link });
    console.info("result", result);
    const user = await User.findOne({
      where: { username: req.params.patientUsername },
    });
    const assigned = await user.setResults(result);
    // console.info("assigned");
    // console.info(assigned);
    // res.status(200).json(assigned);
    res.status(200).send(result);
  } catch (error) {
    console.info(error);
    // res.status(500).send(error.message)
    res.status(500).send(error);
  }
};

// Retrieve all Results from the database.
exports.findAll = (req, res) => {
  try {
    const name = req.query.name;
    const queryPatient = req.query.patient;
    // const queryPatient = req.query.patiento
    // var condition = queryPatient ? { patient: queryPatient } : null
    var condition = queryPatient ? { userId: queryPatient } : null;
    let params = {
      where: condition,
      // where: {userId: null},
      limit: req.query.limit || 10,
      offset: req.query.offset || 0,
      include: [
        {
          model: Reading,
          as: "reading",
          // where: conditionRoles,
        },
      ],
    };

    Result.findAndCountAll(params)
      .then((data) => {
        res.status(200).send(data);
      })
      .catch((error) => {
        console.error(error);
        res.status(500).send({
          message:
            error.message || "Some error occurred while retrieving results.",
        });
      });
  } catch (error) {
    console.error(error);
    return res.status(500).send(error);
  }
};

// Find a single Result with an id
exports.findOne = (req, res) => {
  const id = req.params.id;

  Result.findByPk(id)
    .then((data) => {
      if (data) {
        res.send(data);
      } else {
        res.status(404).send({
          message: `Cannot find Result with id=${id}.`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error retrieving Result with id=" + id,
      });
    });
};

// Update a Result by the id in the request
exports.update = (req, res) => {
  const id = req.params.id;

  Result.update(req.body, {
    where: { id: id },
  })
    .then((num) => {
      if (num == 1) {
        res.send({
          message: "Result was updated successfully.",
        });
      } else {
        res.send({
          message: `Cannot update Result with id=${id}. Maybe Result was not found or req.body is empty!`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error updating Result with id=" + id,
      });
    });
};

// Delete a Result with the specified id in the request
exports.delete = (req, res) => {
  const id = req.params.id;

  Result.destroy({
    where: { id: id },
  })
    .then((num) => {
      if (num == 1) {
        res.send({
          message: "Result was deleted successfully!",
        });
      } else {
        res.send({
          message: `Cannot delete Result with id=${id}. Maybe Result was not found!`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Could not delete Result with id=" + id,
      });
    });
};

// Delete all Results from the database.
exports.deleteAll = (req, res) => {
  Result.destroy({
    where: {},
    truncate: false,
  })
    .then((nums) => {
      res.send({ message: `${nums} Results were deleted successfully!` });
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while removing all results.",
      });
    });
};

// Find all published Tutorials
exports.findAllPublished = (req, res) => {
  Result.findAll({ where: { patient: 1 } })
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while retrieving results.",
      });
    });
};
