const { role } = require('../models')
const db = require('../models')
// const Patient = db.patients;
const User = db.user
const Role = db.role
const Op = db.Sequelize.Op

// Create and Save a new Patient
exports.create = (req, res) => {
  // Validate request
  if (!req.body.document) {
    res.status(400).send({
      message: 'document can not be empty!',
    })
    return
  }
  if (!req.body.firstName) {
    res.status(400).send({
      message: 'firstName can not be empty!',
    })
    return
  }
  if (!req.body.lastName) {
    res.status(400).send({
      message: 'lastName can not be empty!',
    })
    return
  }

  // Create a Patient
  const patient = {
    document: req.body.document,
    firstName: req.body.firstName,
    lastName: req.body.lastName,
  }

  // Save Patient in the database
  Patient.create(patient)
    .then((data) => {
      res.send(data)
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || 'Some error occurred while creating the Patient.',
      })
    })
}

exports.createSeed = (req, res) => {
  const seed = [
    {
      document: '1111',
      firstName: 'Andres',
      lastName: 'Agudelo',
      address: 'Calle 11 # 11 - 11 Poblado - Ed. El Doral apto 101',
      phone: '3111111111',
      email: 'andres@agudelo.co',
    },
    {
      document: '2222',
      firstName: 'Bernardo',
      lastName: 'Botero',
      address: 'Calle 22 # 22 - 22 Poblado - Ed. El Doral apto 202',
      phone: '3222222222',
      email: 'bernardo@botero.co',
    },
    {
      document: '3333',
      firstName: 'Carlos',
      lastName: 'Caicedo',
      address: 'Calle 33 # 33 - 33 Poblado - Ed. El Doral apto 303',
      phone: '3333333333',
      email: 'carlos@caicedo.co',
    },
    {
      document: '4444',
      firstName: 'Dario',
      lastName: 'Delgado',
      address: 'Calle 44 # 44 - 44 Poblado - Ed. El Doral apto 404',
      phone: '3444444444',
      email: 'dario@delgado.co',
    },
    {
      document: '5555',
      firstName: 'Ernesto',
      lastName: 'Echeverry',
      address: 'Calle 55 # 55 - 55 Poblado - Ed. El Doral apto 505',
      phone: '3555555555',
      email: 'ernesto@echeverry.co',
    },
    {
      document: '6666',
      firstName: 'Fanny',
      lastName: 'Fuentes',
      address: 'Calle 66 # 66 - 66 Poblado - Ed. El Doral apto 606',
      phone: '3666666666',
      email: 'fanny@fuentes.co',
    },
    {
      document: '7777',
      firstName: 'Gustavo',
      lastName: 'Gomez',
      address: 'Calle 77 # 77 - 77 Poblado - Ed. El Doral apto 707',
      phone: '3777777777',
      email: 'gustavo@gomez.co',
    },
  ]

  Patient.bulkCreate(seed)
    .then((data) => {
      res.send(data)
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || 'Some error occurred while creating the seed.',
      })
    })
}

// Retrieve all Patients from the database.
exports.findAll = (req, res) => {
  try {
    const queryUsername = req.query.document
    var conditionUsername =
      queryUsername && queryUsername !== ''
        ? { username: { [Op.iLike]: `%${queryUsername}%` } }
        : null

    const queryMedic = req.query.medic
    var conditionMedic =
      queryMedic && queryMedic !== '' ? { medic: queryMedic } : null

    const queryRoles = req.query.roles
    var conditionRoles =
      queryRoles && queryRoles !== '' ? { name: queryRoles } : null

    const conditionMixed = {
      ...conditionUsername,
      ...conditionMedic,
    }

    let params = {
      where: conditionMixed,
      limit: req.query.limit || 5,
      offset: req.query.offset || 0,
      include: [
        {
          model: Role,
          as: 'roles',
          where: conditionRoles,
        },
      ],
    }

    User.findAndCountAll(params)
      .then((data) => {
        res.status(200).send(data) // apply good documentation and self-xyz , and use some significative constant
      })
      .catch((err) => {
        res.status(500).send({
          message:
            err.message || 'Some error occurred while retrieving patients.',
        })
      })
  } catch (error) {
    console.error(error)
    res.status(500).send(error)
  }
}

// Find a single Patient with an id
exports.findOne = (req, res) => {
  const id = req.params.id

  Patient.findByPk(id)
    .then((data) => {
      if (data) {
        res.status(200).send(data)
      } else {
        res.status(404).send({
          message: `Cannot find Patient with id=${id}.`,
        })
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: 'Error retrieving Patient with id=' + id,
      })
    })
}

// Update a Patient by the id in the request
exports.update = (req, res) => {
  const id = req.params.id

  Patient.update(req.body, {
    where: { id: id },
  })
    .then((num) => {
      if (num == 1) {
        res.status(200).send({
          message: 'Patient was updated successfully.',
        })
      } else {
        res.send({
          message: `Cannot update Patient with id=${id}. Maybe Patient was not found or req.body is empty.`,
        })
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: 'Error updating Patient with id=' + id,
      })
    })
}

// Delete a Patient with the specified id in the request
exports.delete = (req, res) => {
  const id = req.params.id

  Patient.destroy({
    where: { id: id },
  })
    .then((num) => {
      if (num == 1) {
        res.status(200).send({
          message: 'Patient was deleted successfully.',
        })
      } else {
        res.send({
          message: `Cannot delete Patient with id=${id}. Maybe Patient was not found.`,
        })
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: 'Could not delete Patient with id=' + id,
      })
    })
}

// Delete all Patients from the database.
exports.deleteAll = (req, res) => {
  User.destroy({
    // where: {},
    where: {id: req.body.patients},
    truncate: false,
  })
    .then((nums) => {
      res
        .status(200)
        .send({ message: `${nums} Patients were deleted successfully.` })
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || 'Some error occurred while removing all patients.',
      })
    })
}

// Find all As Patients
exports.findAllAs = (req, res) => {
  Result.findAll({ where: { firstName: 'Andres' } })
    .then((data) => {
      res.send(data)
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || 'Some error occurred while retrieving patients.',
      })
    })
}
