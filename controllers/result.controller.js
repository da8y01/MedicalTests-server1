const db = require("../models");
const Result = db.results;
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

exports.createSeed = (req, res) => {
  const seed = [
    {
      name: "result 1",
      link: "https://medical-tests.herokuapp.com/DummyPDFDocument.pdf",
      patient: 1,
      reading: 1
    },
    {
      name: "result 2",
      link: "https://medical-tests.herokuapp.com/Landscape1.jpg",
      patient: 2,
      reading: null
    },
    {
      name: "result 3",
      link: "https://medical-tests.herokuapp.com/Video1.mp4",
      patient: 3,
      reading: 3
    },
  ];

  Result.bulkCreate(seed)
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while creating the seed.",
      });
    });
};

// Retrieve all Results from the database.
exports.findAll = (req, res) => {
  const name = req.query.name;
  var condition = name ? { name: { [Op.iLike]: `%${name}%` } } : null;

  Result.findAll({ where: condition })
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while retrieving results.",
      });
    });
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
