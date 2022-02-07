const db = require("../models");
const config = require("../config/auth.config");
const User = db.user;
const Role = db.role;

const Op = db.Sequelize.Op;

var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");
const { user } = require("../models");

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
            res.send({ message: "User was registered successfully!" });
          });
        });
      } else {
        // user role = 1
        user.setRoles([1]).then(() => {
          res.send({ message: "User was registered successfully!" });
        });
      }
    })
    .catch((err) => {
      res.status(500).send({ message: err.message });
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
        return res.status(404).send({ message: "User Not found." });
      }

      var passwordIsValid = bcrypt.compareSync(
        req.body.password,
        user.password
      );

      if (!passwordIsValid) {
        return res.status(401).send({
          accessToken: null,
          message: "Invalid Password!",
        });
      }

      var token = jwt.sign({ id: user.id }, config.secret, {
        expiresIn: 86400, // 24 hours
      });

      var authorities = [];
      user.getRoles().then((roles) => {
        for (let i = 0; i < roles.length; i++) {
          authorities.push("ROLE_" + roles[i].name.toUpperCase());
        }
        res.status(200).send({
          id: user.id,
          username: user.username,
          email: user.email,
          roles: authorities,
          accessToken: token,
        });
      });
    })
    .catch((err) => {
      res.status(500).send({ message: err.message });
    });
};

exports.createSeed = (req, res) => {
  const seed = [
    {
      username: "1001",
      password: bcrypt.hashSync("password", 8),
      email: "patient1@mail.co",
      roles: ["patient"],
    },
    {
      username: "2002",
      password: bcrypt.hashSync("password", 8),
      email: "medic1@mail.co",
      roles: ["medic"],
    },
    {
      username: "3003",
      password: bcrypt.hashSync("password", 8),
      email: "admin1@mail.co",
      roles: ["admin"],
    },
  ];

  User.bulkCreate(seed)
    .then((data) => {
      const users = seed.map(async (user) => {
        const userCurrent = await User.findOne({
          where: {
            username: user.username,
          },
        });
        const rolesFound = await Role.findAll({
          where: {
            name: {
              [Op.or]: user.roles,
            },
          },
        });
        return userCurrent.setRoles(rolesFound);
      });
      Promise.all(users)
        .then((result) => {
          res.send(result);
        })
        .catch((error) => console.error(error));
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while creating the seed.",
      });
    });
};

exports.createSeedFull = (req, res) => {
  const seed = [
    {
      username: "1001",
      password: bcrypt.hashSync("password", 8),
      email: "patient1@mail.co",
      roles: ["patient"],
    },
    {
      username: "2002",
      password: bcrypt.hashSync("password", 8),
      email: "medic1@mail.co",
      roles: ["medic"],
    },
    {
      username: "3003",
      password: bcrypt.hashSync("password", 8),
      email: "admin1@mail.co",
      roles: ["admin"],
    },
  ];

  Role.create({
    id: 1,
    name: "patient",
  });
  Role.create({
    id: 2,
    name: "medic",
  });
  Role.create({
    id: 3,
    name: "admin",
  });

  User.create({
    username: "patient1",
    password: "password",
    email: "patient1@email.co",
    roles: ["patient"],
  });
  User.create({
    username: "medic1",
    password: "password",
    email: "medic1@email.co",
    roles: ["medic"],
  });
  User.create({
    username: "admin1",
    password: "password",
    email: "admin1@email.co",
    roles: ["admin"],
  });

  User.bulkCreate(seed)
    .then((data) => {
      const users = seed.map(async (user) => {
        const userCurrent = await User.findOne({
          where: {
            username: user.username,
          },
        });
        const rolesFound = await Role.findAll({
          where: {
            name: {
              [Op.or]: user.roles,
            },
          },
        });
        return userCurrent.setRoles(rolesFound);
      });
      Promise.all(users)
        .then((result) => {
          res.send(result);
        })
        .catch((error) => console.error(error));
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while creating the seed.",
      });
    });
};
