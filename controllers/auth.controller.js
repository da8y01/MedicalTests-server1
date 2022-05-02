require("dotenv").config();

const nodemailer = require("nodemailer");
const db = require("../models");
const config = require("../config/auth.config");
const User = db.user;
const Role = db.role;
const Result = db.results;
const Reading = db.readings;

const Op = db.Sequelize.Op;

var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");
const { user } = require("../models");
const { create } = require("./patient.controller");

exports.signup = (req, res) => {
  // Save User to Database
  User.create({
    username: req.body.username,
    email: req.body.email,
    password: bcrypt.hashSync(req.body.password, 8),
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    documentType: req.body.documentType,
  })
    .then((user) => {
      if (req.body.roles) {
        Role.findAll({
          where: {
            name: {
              [Op.or]: req.body.roles,
            },
          },
        })
          .then((roles) => {
            user
              .setRoles(roles)
              .then(() => {
                // res.send({ message: 'OK: User was registered successfully.' })
                res.status(200).send(user);
              })
              .catch((error) => {
                console.info(error);
                res.status(500).send(error);
              });
          })
          .catch((error) => {
            console.info(error);
            res.status(500).send(error);
          });
      } else {
        // user role = 1
        user
          .setRoles([1])
          .then(() => {
            // res.send({ message: 'OK: User was registered successfully.' })
            res.status(200).send(user);
          })
          .catch((error) => {
            console.info(error);
            res.status(500).send(error);
          });
      }
    })
    .catch((error) => {
      console.info(error);
      res.status(500).send(error);
    });
};

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
          .send({ message: "[ERROR] Usuario no encontrado." });
      }

      var passwordIsValid = bcrypt.compareSync(
        req.body.password,
        user.password
      );

      if (!passwordIsValid) {
        return res.status(401).send({
          message: "[ERROR] Password inválido.",
        });
      }

      var token = jwt.sign({ id: user.id }, config.secret, {
        expiresIn: 86400, // 24 hours
      });

      var authorities = [];
      user.getRoles().then((roles) => {
        for (let i = 0; i < roles.length; i++) {
          authorities.push(roles[i].name.toUpperCase());
        }
        res.status(200).send({
          id: user.id,
          username: user.username,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          roles: authorities,
          accessToken: token,
        });
      });
    })
    .catch((error) => {
      res.status(500).send(error);
    });
};

exports.createSeedFull = async (req, res) => {
  try {
    const seedRoles = [
      {
        id: 1,
        name: "patient",
      },
      {
        id: 2,
        name: "medic",
      },
      {
        id: 3,
        name: "admin",
      },
      {
        id: 4,
        name: "reader",
      },
    ];
    let newRoles = {
      patient: null,
      medic: null,
      admin: null,
    };
    await Role.bulkCreate(seedRoles).then((createdRoles) => {
      createdRoles.map((createdRole) => {
        newRoles[createdRole.name] = createdRole;
      });
      return createdRoles;
    });

    const password = bcrypt.hashSync("password", 8);
    const seedUsers = [
      {
        username: "2001",
        password: bcrypt.hashSync("2001", 8),
        email: "medic1@mail.co",
        email2: "medic1@alternate.co",
        firstName: "Medic",
        lastName: "Uno",
        address: "Calle 21 # 21 - 21 Poblado - Ed. El Doral apto 201",
        phone: "321 211 2121",
        birthdate: new Date(1970, 1, 20),
        documentType: "cedula",
        roles: ["medic"],
        patients: [
          {
            username: "1001",
            password: bcrypt.hashSync("1001", 8),
            email: "patient1@mail.co",
            firstName: "Patricia",
            lastName: "Cortes Corredor",
            address: "Calle 11 # 11 - 11 Poblado - Ed. El Doral apto 101",
            phone: "311 111 1111",
            birthdate: new Date(1970, 1, 20),
            documentType: "cedula",
            results: [
              {
                name: "31-01-2022-MA-PATRICIA_CORTES-JC-MMT_1",
                link: "https://medical-tests.herokuapp.com/31-01-2022-MA-PATRICIA_CORTES-JC-MMT_1.pdf",
              },
              {
                name: "CORTES_CORREDOR_PATRICIA-MACULA_AF_OD",
                link: "https://medical-tests.herokuapp.com/CORTES_CORREDOR_PATRICIA-MACULA_AF_OD.JPG",
                reading: {
                  name: "Reading 1",
                  link: "https://medical-tests.herokuapp.com/Reading.pdf",
                },
              },
              {
                name: "CORTES_CORREDOR_PATRICIA-MACULA_AF_OI",
                link: "https://medical-tests.herokuapp.com/CORTES_CORREDOR_PATRICIA-MACULA_AF_OI.JPG",
              },
              {
                name: "CORTES_CORREDOR_PATRICIA-MACULA_COLOR_OD",
                link: "https://medical-tests.herokuapp.com/CORTES_CORREDOR_PATRICIA-MACULA_COLOR_OD.JPG",
                reading: {
                  name: "Reading 2",
                  link: "https://medical-tests.herokuapp.com/Reading.pdf",
                },
              },
              {
                name: "CORTES_CORREDOR_PATRICIA-MACULA_COLOR_OI",
                link: "https://medical-tests.herokuapp.com/CORTES_CORREDOR_PATRICIA-MACULA_COLOR_OI.JPG",
              },
              {
                name: "CORTES_CORREDOR_PATRICIA-MACULA_ESPESORES_AO",
                link: "https://medical-tests.herokuapp.com/CORTES_CORREDOR_PATRICIA-MACULA_ESPESORES_AO.JPG",
              },
            ],
          },
          {
            username: "1002",
            password: bcrypt.hashSync("1002", 8),
            email: "patient2@mail.co",
            firstName: "Rodrigo",
            lastName: "Sanin Garcia",
            address: "Calle 12 # 12 - 12 Poblado - Ed. El Doral apto 102",
            phone: "312 122 1212",
            birthdate: new Date(1970, 1, 20),
            documentType: "cedula",
            results: [
              {
                name: "28-01-2022-MA-RODRIGO_SANIN-MZ-MMT",
                link: "https://medical-tests.herokuapp.com/28-01-2022-MA-RODRIGO_SANIN-MZ-MMT.pdf",
                reading: {
                  name: "Reading 3",
                  link: "https://medical-tests.herokuapp.com/Reading.pdf",
                },
              },
              {
                name: "28-01-2022-NO-RODRIGO_SANIN-_MZ-MMT",
                link: "https://medical-tests.herokuapp.com/28-01-2022-NO-RODRIGO_SANIN-_MZ-MMT.pdf",
              },
              {
                name: "SANIN_GARCIA_RODRIGO-MACULA_AF_OD",
                link: "https://medical-tests.herokuapp.com/SANIN_GARCIA_RODRIGO-MACULA_AF_OD.JPG",
              },
              {
                name: "SANIN_GARCIA_RODRIGO-MACULA_AF_OI",
                link: "https://medical-tests.herokuapp.com/SANIN_GARCIA_RODRIGO-MACULA_AF_OI.JPG",
                reading: {
                  name: "Reading 4",
                  link: "https://medical-tests.herokuapp.com/Reading.pdf",
                },
              },
              {
                name: "SANIN_GARCIA_RODRIGO-MACULA_COLOR_OD",
                link: "https://medical-tests.herokuapp.com/SANIN_GARCIA_RODRIGO-MACULA_COLOR_OD.JPG",
              },
            ],
          },
        ],
      },
      {
        username: "2002",
        password: bcrypt.hashSync("2002", 8),
        email: "medic2@mail.co",
        email2: "medic2@alternate.co",
        firstName: "Medic",
        lastName: "Dos",
        address: "Calle 22 # 22 - 22 Poblado - Ed. El Doral apto 202",
        phone: "322 222 2222",
        birthdate: new Date(1970, 1, 20),
        documentType: "cedula",
        roles: ["medic"],
        patients: [
          {
            username: "1003",
            password: bcrypt.hashSync("1003", 8),
            email: "patient3@mail.co",
            firstName: "Patient",
            lastName: "Tres",
            address: "Calle 13 # 13 - 13 Poblado - Ed. El Doral apto 103",
            phone: "313 133 1313",
            birthdate: new Date(1970, 1, 20),
            documentType: "cedula",
            results: [
              {
                name: "CORTES_CORREDOR_PATRICIA-MACULA_VIDEO_0_OD",
                link: "https://medical-tests.herokuapp.com/CORTES_CORREDOR_PATRICIA-MACULA_VIDEO_0_OD.avi",
              },
            ],
          },
        ],
      },
      {
        username: "3001",
        password: bcrypt.hashSync("3001", 8),
        email: "admin1@mail.co",
        firstName: "Admin",
        lastName: "Uno",
        address: "Calle 31 # 31 - 31 Poblado - Ed. El Doral apto 301",
        phone: "331 311 3131",
        birthdate: new Date(1970, 1, 20),
        documentType: "cedula",
        roles: ["admin"],
      },
      {
        username: "4001",
        password: bcrypt.hashSync("4001", 8),
        email: "reader1@mail.co",
        firstName: "Reader",
        lastName: "Uno",
        address: "Calle 41 # 41 - 41 Poblado - Ed. El Doral apto 401",
        phone: "341 411 4141",
        birthdate: new Date(1970, 1, 20),
        documentType: "cedula",
        roles: ["reader"],
      },
    ];

    const createdUsers = await seedUsers.map(async (seedUser) => {
      const createdUser = await User.create(seedUser);
      await createdUser.setRoles(newRoles[seedUser.roles[0]]);
      if (seedUser.patients) {
        const createdPatients = await seedUser.patients.map(
          async (seedUserPatient) => {
            const seedUserPatientUpdated = {
              ...seedUserPatient,
              medic: createdUser.id,
            };
            const createdPatient = await User.create(seedUserPatientUpdated);
            await createdPatient.setRoles(newRoles.patient);
            if (seedUserPatient.results) {
              const createdResults = await seedUserPatient.results.map(
                async (seedUserPatientResult) => {
                  const createdResult = await Result.create(
                    seedUserPatientResult
                  )
                    .then(async (result) => {
                      if (seedUserPatientResult.reading) {
                        let tempReading = seedUserPatientResult.reading;
                        tempReading.resultId = result.id;
                        const createdReading = await Reading.create(tempReading)
                          .then(async (reading) => {
                            const result = await Result.findOne({
                              where: { id: reading.resultId },
                              include: [{ model: Reading, as: "reading" }],
                            });
                            return reading;
                          })
                          .catch((error) => {
                            console.error(error);
                            res.status(500).send(error);
                          });
                      }
                      return result;
                    })
                    .catch((error) => {
                      console.error(error);
                      res.status(500).send(error);
                    });

                  return createdResult;
                }
              );
              const newResults = await Promise.all(createdResults)
                .then(async (createdResults) => {
                  const setResults = await createdPatient.setResults(
                    createdResults
                  );
                  const newPatient = await User.findOne({
                    where: { id: createdPatient.id },
                    include: [
                      {
                        model: Result,
                        as: "results",
                      },
                    ],
                  });
                  return createdResults;
                })
                .catch((error) => {
                  console.error(error);
                  res.status(500).send(error);
                });
            }
            return createdPatient;
          }
        );
        await Promise.all(createdPatients)
          .then((createdPatients) => {
            return createdPatients;
          })
          .catch((error) => {
            console.error(error);
            res.status(500).send(error);
          });
      }
      return createdUser;
    });

    await Promise.all(createdUsers)
      .then(async (createdUsers) => {
        const users = await User.findAll({
          include: [
            {
              model: Result,
              as: "results",
            },
          ],
        });
        res.status(200).send(users);
      })
      .catch((error) => {
        console.error(error);
        res.status(500).send(error);
      });
  } catch (error) {
    console.error(error);
    return res.status(500).send(error);
  }
};

exports.forgotPassword = async (req, res) => {
  try {
    // Generate test SMTP service account from ethereal.email
    // Only needed if you don't have a real mail account for testing
    let testAccount = await nodemailer.createTestAccount();

    const transportOptions = {
      // host: 'smtp.ethereal.email',
      // host: "mail.sdiagnosticovisual.com",
      host: "portalsdv.com",
      // host: 'smtp.gmail.com',
      // host: 'outlook.office365.com', // IMAP
      // host: 'smtp-mail.outlook.com', // SMTP
      port: 465,
      // port: 587, // SMTP
      // port: 993, // IMAP
      // port: 995, // IMAP
      // secure: false, // true for 465, false for other ports
      secure: true, // true for 465, false for other ports
      auth: {
        // user: testAccount.user, // generated ethereal user
        // pass: testAccount.pass, // generated ethereal password
        // user: "webmaster@sdiagnosticovisual.com", // generated ethereal user
        // user: "wwwportalsdv@portalsdv.com", // generated ethereal user
        user: process.env.EMAIL_USER, // generated ethereal user
        // pass: "ffdgF8941*/", // generated ethereal password
        pass: process.env.EMAIL_PASS, // generated ethereal password
      },
      tls: {
        // do not fail on invalid certs
        rejectUnauthorized: false,
      },
    };

    // create reusable transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport(transportOptions);
    // verify connection configuration
    await transporter.verify(function (error, success) {
      if (error) {
        console.log(error);
      } else {
        console.log("OK: Server is ready to take messages.");
      }
    });

    const user = await User.findOne({
      where: { username: req.params.username },
    });
    const messageOptions = {
      // from: '"webmaster@sdiagnosticovisual.com" <webmaster@sdiagnosticovisual.com>', // sender address
      from: '"webmaster@portalsdv.com" <webmaster@portalsdv.com>', // sender address
      to: user.email,
      subject: "Recordatorio de clave.", // Subject line
      text: `La clave de ingreso es: ${user.username}`, // plain text body
      html: "<b>La clave de ingreso es: password</b>", // html body
    };
    // send mail with defined transport object
    let info = await transporter.sendMail(messageOptions);

    console.log("Message sent: %s", info.messageId);
    // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

    // Preview only available when sending through an Ethereal account
    const messageUrl = nodemailer.getTestMessageUrl(info);
    console.log("Preview URL: %s", messageUrl);
    // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
    res.status(200).send({ message: messageUrl });
  } catch (error) {
    console.error(error);
    res.status(500).send(error);
    // res.status(500).send({message: 'ERROR: Falla al enviar el recordatorio.'})
  }
};
