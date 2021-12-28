const db = require("../models");
const Tutorial = db.tutorials;
const Op = db.Sequelize.Op;

// Create and Save a new Result
exports.create = (req, res) => {
  // Validate request
  if (!req.body.status) {
    res.status(400).send({
      message: "Content can not be empty!",
    });
    return;
  }

  // Create a Result
  const result = {
    status: req.body.status,
    description: req.body.description,
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

// Retrieve all Results from the database.
exports.findAll = (req, res) => {
  const status = req.query.status;
  var condition = status ? { status: { [Op.iLike]: `%${status}%` } } : null;

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
