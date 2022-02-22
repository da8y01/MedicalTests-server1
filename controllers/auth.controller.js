const nodemailer = require('nodemailer')
const db = require('../models')
const config = require('../config/auth.config')
const User = db.user
const Role = db.role
const Result = db.results
const Reading = db.readings

const Op = db.Sequelize.Op

var jwt = require('jsonwebtoken')
var bcrypt = require('bcryptjs')
const { user } = require('../models')
const { create } = require('./patient.controller')

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
            res.send({ message: 'OK: User was registered successfully.' })
          })
        })
      } else {
        // user role = 1
        user.setRoles([1]).then(() => {
          res.send({ message: 'OK: User was registered successfully.' })
        })
      }
    })
    .catch((error) => {
      res.status(500).send(error)
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
          .send({ message: 'ERROR: Usuario no encontrado.' })
      }

      var passwordIsValid = bcrypt.compareSync(req.body.password, user.password)

      if (!passwordIsValid) {
        return res.status(401).send({
          message: 'ERROR: Password inválido.',
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
          id: user.id,
          username: user.username,
          email: user.email,
          roles: authorities,
          accessToken: token,
        })
      })
    })
    .catch((error) => {
      res.status(500).send(error)
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
  await Role.bulkCreate(seedRoles).then((createdRoles) => {
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
      patients: [
        {
          username: '1001',
          password,
          email: 'patient1@mail.co',
          firstName: 'Patricia',
          lastName: 'Cortes Corredor',
          results: [
            {
              name: '31-01-2022-MA-PATRICIA_CORTES-JC-MMT_1',
              link: 'https://medical-tests.herokuapp.com/31-01-2022-MA-PATRICIA_CORTES-JC-MMT_1.pdf',
            },
            {
              name: 'CORTES_CORREDOR_PATRICIA-MACULA_AF_OD',
              link: 'https://medical-tests.herokuapp.com/CORTES_CORREDOR_PATRICIA-MACULA_AF_OD.JPG',
              reading: {
                name: 'Reading 1',
                link: 'https://medical-tests.herokuapp.com/Reading.pdf',
              },
            },
            {
              name: 'CORTES_CORREDOR_PATRICIA-MACULA_AF_OI',
              link: 'https://medical-tests.herokuapp.com/CORTES_CORREDOR_PATRICIA-MACULA_AF_OI.JPG',
            },
            {
              name: 'CORTES_CORREDOR_PATRICIA-MACULA_COLOR_OD',
              link: 'https://medical-tests.herokuapp.com/CORTES_CORREDOR_PATRICIA-MACULA_COLOR_OD.JPG',
              reading: {
                name: 'Reading 2',
                link: 'https://medical-tests.herokuapp.com/Reading.pdf',
              },
            },
            {
              name: 'CORTES_CORREDOR_PATRICIA-MACULA_COLOR_OI',
              link: 'https://medical-tests.herokuapp.com/CORTES_CORREDOR_PATRICIA-MACULA_COLOR_OI.JPG',
            },
            {
              name: 'CORTES_CORREDOR_PATRICIA-MACULA_ESPESORES_AO',
              link: 'https://medical-tests.herokuapp.com/CORTES_CORREDOR_PATRICIA-MACULA_ESPESORES_AO.JPG',
            },
          ],
        },
        {
          username: '1002',
          password,
          email: 'patient2@mail.co',
          firstName: 'Rodrigo',
          lastName: 'Sanin Garcia',
          results: [
            {
              name: '28-01-2022-MA-RODRIGO_SANIN-MZ-MMT',
              link: 'https://medical-tests.herokuapp.com/28-01-2022-MA-RODRIGO_SANIN-MZ-MMT.pdf',
              reading: {
                name: 'Reading 3',
                link: 'https://medical-tests.herokuapp.com/Reading.pdf',
              },
            },
            {
              name: '28-01-2022-NO-RODRIGO_SANIN-_MZ-MMT',
              link: 'https://medical-tests.herokuapp.com/28-01-2022-NO-RODRIGO_SANIN-_MZ-MMT.pdf',
            },
            {
              name: 'SANIN_GARCIA_RODRIGO-MACULA_AF_OD',
              link: 'https://medical-tests.herokuapp.com/SANIN_GARCIA_RODRIGO-MACULA_AF_OD.JPG',
            },
            {
              name: 'SANIN_GARCIA_RODRIGO-MACULA_AF_OI',
              link: 'https://medical-tests.herokuapp.com/SANIN_GARCIA_RODRIGO-MACULA_AF_OI.JPG',
              reading: {
                name: 'Reading 4',
                link: 'https://medical-tests.herokuapp.com/Reading.pdf',
              },
            },
            {
              name: 'result SANIN_GARCIA_RODRIGO-MACULA_COLOR_OD',
              link: 'https://medical-tests.herokuapp.com/SANIN_GARCIA_RODRIGO-MACULA_COLOR_OD.JPG',
            },
          ],
        },
        {
          username: '1003',
          password,
          email: 'patient3@mail.co',
          firstName: 'Patient',
          lastName: 'Tres',
          results: [
            {
              name: 'CORTES_CORREDOR_PATRICIA-MACULA_VIDEO_0_OD',
              link: 'https://medical-tests.herokuapp.com/CORTES_CORREDOR_PATRICIA-MACULA_VIDEO_0_OD.avi',
            },
          ],
        },
      ],
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

  const createdUsers = await seedUsers.map(async (seedUser) => {
    const createdUser = await User.create(seedUser)
    if (seedUser.patients) {
      const createdPatients = await seedUser.patients.map(
        async (seedUserPatient) => {
          seedUserPatient.medic = createdUser.id
          const createdPatient = await User.create(seedUserPatient)
          if (seedUserPatient.results) {
            const createdResults = await seedUserPatient.results.map(
              async (seedUserPatientResult) => {
                seedUserPatientResult.patient = createdPatient.id
                const createdResult = await Result.create(seedUserPatientResult)
                if (seedUserPatientResult.reading) {
                  let tempReading = seedUserPatientResult.reading
                  tempReading.result = createdResult.id
                  const createdReading = await Reading.create(tempReading)
                }
                return createdResult
              }
            )
            Promise.all(createdResults)
              .then((createdResults) => {
                createdPatient.setResults(createdResults)
              })
              .catch((error) => {
                console.error(error)
                return res.status(500).send(error)
              })
          }
          return createdPatient
        }
      )
    }
    return createdUser
  })

  return Promise.all(createdUsers)
    .then(async (createdUsers) => {
      const users = await User.findAll()
      return res.status(200).send(users)
    })
    .catch((error) => res.status(500).send(error))
}

exports.forgotPassword = async (req, res) => {
  try {
    // Generate test SMTP service account from ethereal.email
    // Only needed if you don't have a real mail account for testing
    let testAccount = await nodemailer.createTestAccount()

    const transportOptions = {
      host: 'smtp.ethereal.email',
      // host: 'smtp.gmail.com',
      // host: 'outlook.office365.com', // IMAP
      // host: 'smtp-mail.outlook.com', // SMTP
      // port: 465,
      port: 587, // SMTP
      // port: 993, // IMAP
      secure: false, // true for 465, false for other ports
      auth: {
        user: testAccount.user, // generated ethereal user
        pass: testAccount.pass, // generated ethereal password
      },
      tls: {
        // do not fail on invalid certs
        rejectUnauthorized: false,
      },
    }

    // create reusable transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport(transportOptions)
    // verify connection configuration
    await transporter.verify(function (error, success) {
      if (error) {
        console.log(error)
      } else {
        console.log('OK: Server is ready to take messages.')
      }
    })

    const user = await User.findOne({
      where: { username: req.params.username },
    })
    const messageOptions = {
      from: '"mailer@server.com" <mailer@server.com>', // sender address
      to: user.email,
      subject: 'Recordatorio de clave.', // Subject line
      text: 'La clave de ingreso es: password', // plain text body
      html: '<b>La clave de ingreso es: password</b>', // html body
    }
    // send mail with defined transport object
    let info = await transporter.sendMail(messageOptions)

    console.log('Message sent: %s', info.messageId)
    // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

    // Preview only available when sending through an Ethereal account
    const messageUrl = nodemailer.getTestMessageUrl(info)
    console.log('Preview URL: %s', messageUrl)
    // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
    res.status(200).send({ message: messageUrl })
  } catch (error) {
    console.error(error)
    res.status(500).send(error)
  }
}
