const db = require('../models')
const config = require('../config/auth.config')
const User = db.user
const Role = db.role
const Result = db.results

const Op = db.Sequelize.Op

var jwt = require('jsonwebtoken')
var bcrypt = require('bcryptjs')
const { user } = require('../models')

exports.signup = (req, res) => {
  // Save User to Database
  User.create({
    username: req.body.username,
    email: req.body.email,
    password: bcrypt.hashSync(req.body.password, 8),
  })
    .then((user) => {
      if (req.body.roles) {
        Role.findAll({
          where: {
            name: {
              [Op.or]: req.body.roles,
            },
          },
        }).then((roles) => {
          user.setRoles(roles).then(() => {
            res.send({ message: 'User was registered successfully!' })
          })
        })
      } else {
        // user role = 1
        user.setRoles([1]).then(() => {
          res.send({ message: 'User was registered successfully!' })
        })
      }
    })
    .catch((err) => {
      res.status(500).send({ message: err.message })
    })
}

exports.signin = (req, res) => {
  User.findOne({
    where: {
      username: req.body.username,
    },
  })
    .then((user) => {
      if (!user) {
        return res
          .status(404)
          .send({ code: 404, data: 'ERROR: Usuario no encontrado.' })
      }

      var passwordIsValid = bcrypt.compareSync(req.body.password, user.password)

      if (!passwordIsValid) {
        return res.status(401).send({
          code: 401,
          data: 'ERROR: Password inválido.',
        })
      }

      var token = jwt.sign({ id: user.id }, config.secret, {
        expiresIn: 86400, // 24 hours
      })

      var authorities = []
      user.getRoles().then((roles) => {
        for (let i = 0; i < roles.length; i++) {
          authorities.push('ROLE_' + roles[i].name.toUpperCase())
        }
        res.status(200).send({
          code: 200,
          data: {
            id: user.id,
            username: user.username,
            email: user.email,
            roles: authorities,
            accessToken: token,
          },
        })
      })
    })
    .catch((err) => {
      res.status(500).send({ code: 500, data: err.message })
    })
}

exports.createSeed = (req, res) => {
  const seed = [
    {
      username: '1001',
      password: bcrypt.hashSync('password', 8),
      email: 'patient1@mail.co',
      roles: ['patient'],
    },
    {
      username: '2002',
      password: bcrypt.hashSync('password', 8),
      email: 'medic1@mail.co',
      roles: ['medic'],
    },
    {
      username: '3003',
      password: bcrypt.hashSync('password', 8),
      email: 'admin1@mail.co',
      roles: ['admin'],
    },
  ]

  User.bulkCreate(seed)
    .then((data) => {
      const users = seed.map(async (user) => {
        const userCurrent = await User.findOne({
          where: {
            username: user.username,
          },
        })
        const rolesFound = await Role.findAll({
          where: {
            name: {
              [Op.or]: user.roles,
            },
          },
        })
        return userCurrent.setRoles(rolesFound)
      })
      Promise.all(users)
        .then((result) => {
          res.send(result)
        })
        .catch((error) => console.error(error))
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || 'Some error occurred while creating the seed.',
      })
    })
}

exports.createSeedFull = async (req, res) => {
  const seedRoles = [
    {
      id: 1,
      name: 'patient',
    },
    {
      id: 2,
      name: 'medic',
    },
    {
      id: 3,
      name: 'admin',
    },
  ]
  let newRoles = {
    patient: null,
    medic: null,
    admin: null,
  }
  Role.bulkCreate(seedRoles).then((createdRoles) => {
    createdRoles.map((createdRole) => {
      newRoles[createdRole.name] = createdRole
    })
    return createdRoles
  })

  const password = bcrypt.hashSync('password', 8)
  const seedUsers = [
    {
      username: '2001',
      password,
      email: 'medic1@mail.co',
      firstName: 'Medic',
      lastName: 'Uno',
      roles: ['medic'],
    },
    {
      username: '3001',
      password,
      email: 'admin1@mail.co',
      firstName: 'Admin',
      lastName: 'Uno',
      roles: ['admin'],
    },
    {
      username: '3002',
      password,
      email: 'admin2@mail.co',
      firstName: 'Admin',
      lastName: 'Dos',
      roles: ['admin'],
    },
  ]

  const seedResults = {
    1001: [
      {
        name: '31-01-2022-MA-PATRICIA_CORTES-JC-MMT_1',
        link: 'https://medical-tests.herokuapp.com/31-01-2022-MA-PATRICIA_CORTES-JC-MMT_1.pdf',
        patient: null,
        reading: null,
      },
      {
        name: 'CORTES_CORREDOR_PATRICIA-MACULA_AF_OD',
        link: 'https://medical-tests.herokuapp.com/CORTES_CORREDOR_PATRICIA-MACULA_AF_OD.JPG',
        patient: null,
        reading: null,
      },
      {
        name: 'CORTES_CORREDOR_PATRICIA-MACULA_AF_OI',
        link: 'https://medical-tests.herokuapp.com/CORTES_CORREDOR_PATRICIA-MACULA_AF_OI.JPG',
        patient: null,
        reading: null,
      },
      {
        name: 'CORTES_CORREDOR_PATRICIA-MACULA_COLOR_OD',
        link: 'https://medical-tests.herokuapp.com/CORTES_CORREDOR_PATRICIA-MACULA_COLOR_OD.JPG',
        patient: null,
        reading: null,
      },
      {
        name: 'CORTES_CORREDOR_PATRICIA-MACULA_COLOR_OI',
        link: 'https://medical-tests.herokuapp.com/CORTES_CORREDOR_PATRICIA-MACULA_COLOR_OI.JPG',
        patient: null,
        reading: null,
      },
      {
        name: 'CORTES_CORREDOR_PATRICIA-MACULA_ESPESORES_AO',
        link: 'https://medical-tests.herokuapp.com/CORTES_CORREDOR_PATRICIA-MACULA_ESPESORES_AO.JPG',
        patient: null,
        reading: null,
      },
    ],
    1002: [
      {
        name: '28-01-2022-MA-RODRIGO_SANIN-MZ-MMT',
        link: 'https://medical-tests.herokuapp.com/28-01-2022-MA-RODRIGO_SANIN-MZ-MMT.pdf',
        patient: null,
        reading: null,
      },
      {
        name: '28-01-2022-NO-RODRIGO_SANIN-_MZ-MMT',
        link: 'https://medical-tests.herokuapp.com/28-01-2022-NO-RODRIGO_SANIN-_MZ-MMT.pdf',
        patient: null,
        reading: null,
      },
      {
        name: 'SANIN_GARCIA_RODRIGO-MACULA_AF_OD',
        link: 'https://medical-tests.herokuapp.com/SANIN_GARCIA_RODRIGO-MACULA_AF_OD.JPG',
        patient: null,
        reading: null,
      },
      {
        name: 'SANIN_GARCIA_RODRIGO-MACULA_AF_OI',
        link: 'https://medical-tests.herokuapp.com/SANIN_GARCIA_RODRIGO-MACULA_AF_OI.JPG',
        patient: null,
        reading: null,
      },
      {
        name: 'result SANIN_GARCIA_RODRIGO-MACULA_COLOR_OD',
        link: 'https://medical-tests.herokuapp.com/SANIN_GARCIA_RODRIGO-MACULA_COLOR_OD.JPG',
        patient: null,
        reading: null,
      },
    ],
    1003: [
      {
        name: 'CORTES_CORREDOR_PATRICIA-MACULA_VIDEO_0_OD',
        link: 'https://medical-tests.herokuapp.com/CORTES_CORREDOR_PATRICIA-MACULA_VIDEO_0_OD.avi',
        patient: null,
        reading: null,
      },
    ],
  }

  const seedPatients = [
    {
      username: '1001',
      password,
      email: 'patient1@mail.co',
      firstName: 'Patricia',
      lastName: 'Cortes Corredor',
    },
    {
      username: '1002',
      password,
      email: 'patient2@mail.co',
      firstName: 'Rodrigo',
      lastName: 'Sanin Garcia',
    },
    {
      username: '1003',
      password,
      email: 'patient3@mail.co',
      firstName: 'Patient',
      lastName: 'Tres',
    },
  ]

  const createdUsers = seedUsers.map(async (seedUser) => {
    const newUser = await User.create(seedUser)
    await newUser.setRoles(newRoles[seedUser.roles[0]])

    if (seedUser.roles.includes('medic')) {
      const completedPatients = seedPatients.map((seedPatient) => {
        seedPatient.medic = newUser.id
        return seedPatient
      })
      User.bulkCreate(completedPatients)
        .then((newPatients) => {
          newPatients.map(async (newPatient) => {
            await newPatient.setRoles(newRoles.patient)
            const completedResults = seedResults[newPatient.username].map(
              (seedResult) => {
                seedResult.patient = newPatient.id
                return seedResult
              }
            )
            Result.bulkCreate(completedResults)
              .then((createdResults) => createdResults)
              .catch((error) => console.error(error.message))
          })
        })
        .catch((error) => console.error(error.message))
    }
    return newUser
  })
  return Promise.all(createdUsers)
    .then((createdUsers) => {
      return res.status(200).send(createdUsers)
    })
    .catch((error) => (res.status(500).send(error)))
}
