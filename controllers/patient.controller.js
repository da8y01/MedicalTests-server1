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

exports.assignMedic = async (req, res) => {
  try {
    const medic = await User.findOne({ where: { username: req.body.medic } })
    const patients = await User.findAll({ where: { username: { [Op.in]: req.body.patients } } })
    const updatedPatients = await patients.map(async patient => {
      patient.medic = medic.id
      const saved = await patient.save()
      return saved
    })
    res.status(200).send(updatedPatients)
  } catch (error) {
    console.error(error)
    res.status(500).send(error)
  }
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

  // User.findByPk(id)
  User.findOne({ where: { username: id } })
    .then((data) => {
      if (data) {
        res.status(200).send(data)
      } else {
        res.status(404).send({
          message: `Cannot find User with id=${id}.`,
        })
      }
    })
    .catch((err) => {
      res.status(500).send(
        // { message: 'Error retrieving User with id=' + id, }
        err
      )
    })
}

// Update a Patient by the id in the request
exports.update = (req, res) => {
  console.info('\n\n\n\n', req.body)
  const id = req.params.id

  User.update(req.body, {
    where: { id: req.body.id },
  })
    .then((num) => {
      if (num == 1) {
        res.status(200).send({
          message: 'User was updated successfully.',
        })
      } else {
        res.send({
          message: `Cannot update User with id=${id}. Maybe User was not found or req.body is empty.`,
        })
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: 'Error updating User with id=' + id,
      })
    })
}

// Delete a Patient with the specified id in the request
exports.delete = (req, res) => {
  const id = req.params.id

  Patient.destroy({
    // where: { id: id },
    where: { username: id },
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
    // where: { id: req.body.patients },
    where: { username: req.body.patients },
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
