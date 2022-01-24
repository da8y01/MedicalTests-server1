const db = require("../models");
const Patient = db.patients;
const Op = db.Sequelize.Op;

// Create and Save a new Patient
exports.create = (req, res) => {
  // Validate request
  if (!req.body.document) {
    res.status(400).send({
      message: "document can not be empty!",
    });
    return;
  }
  if (!req.body.firstName) {
    res.status(400).send({
      message: "firstName can not be empty!",
    });
    return;
  }
  if (!req.body.lastName) {
    res.status(400).send({
      message: "lastName can not be empty!",
    });
    return;
  }

  // Create a Patient
  const patient = {
    document: req.body.document,
    firstName: req.body.firstName,
    lastName: req.body.lastName,
  };

  // Save Patient in the database
  Patient.create(patient)
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the Patient.",
      });
    });
};

exports.createSeed = (req, res) => {
  const seed = [
    {
      document: "1111",
      firstName: "Andres",
      lastName: "Agudelo",
      address: "Calle 11 # 11 - 11 Poblado - Ed. El Doral apto 101",
      phone: "3111111111",
      email: "andres@agudelo.co",
    },
    {
      document: "2222",
      firstName: "Bernardo",
      lastName: "Botero",
      address: "Calle 11 # 11 - 11 Poblado - Ed. El Doral apto 202",
      phone: "3222222222",
      email: "bernardo@botero.co",
    },
    {
      document: "3333",
      firstName: "Carlos",
      lastName: "Caicedo",
      address: "Calle 33 # 33 - 33 Poblado - Ed. El Doral apto 303",
      phone: "3333333333",
      email: "carlos@caicedo.co",
    },
  ];

  Patient.bulkCreate(seed)
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while creating the seed.",
      });
    });
};

// Retrieve all Patients from the database.
exports.findAll = (req, res) => {
  const document = req.query.document;
  var condition = document
    ? { document: { [Op.iLike]: `%${document}%` } }
    : null;

  Patient.findAll({ where: condition })
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving patients.",
      });
    });
};

// Find a single Patient with an id
exports.findOne = (req, res) => {
  const id = req.params.id;

  Patient.findByPk(id)
    .then((data) => {
      if (data) {
        res.send(data);
      } else {
        res.status(404).send({
          message: `Cannot find Patient with id=${id}.`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error retrieving Patient with id=" + id,
      });
    });
};

// Update a Patient by the id in the request
exports.update = (req, res) => {
  const id = req.params.id;

  Patient.update(req.body, {
    where: { id: id },
  })
    .then((num) => {
      if (num == 1) {
        res.send({
          message: "Patient was updated successfully.",
        });
      } else {
        res.send({
          message: `Cannot update Patient with id=${id}. Maybe Patient was not found or req.body is empty!`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error updating Patient with id=" + id,
      });
    });
};

// Delete a Patient with the specified id in the request
exports.delete = (req, res) => {
  const id = req.params.id;

  Patient.destroy({
    where: { id: id },
  })
    .then((num) => {
      if (num == 1) {
        res.send({
          message: "Patient was deleted successfully!",
        });
      } else {
        res.send({
          message: `Cannot delete Patient with id=${id}. Maybe Patient was not found!`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Could not delete Patient with id=" + id,
      });
    });
};

// Delete all Patients from the database.
exports.deleteAll = (req, res) => {
  Patient.destroy({
    where: {},
    truncate: false,
  })
    .then((nums) => {
      res.send({ message: `${nums} Patients were deleted successfully!` });
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while removing all patients.",
      });
    });
};

// Find all As Patients
exports.findAllAs = (req, res) => {
  Result.findAll({ where: { firstName: "Andres" } })
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving patients.",
      });
    });
};
