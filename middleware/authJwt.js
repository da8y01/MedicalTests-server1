const jwt = require('jsonwebtoken')
const config = require('../config/auth.config.js')
const db = require('../models')
const User = db.user

verifyToken = (req, res, next) => {
  let token = req.headers['x-access-token']

  if (!token) {
    return res.status(403).send({
      message: 'No token provided.',
    })
  }

  jwt.verify(token, config.secret, (err, decoded) => {
    if (err) {
      return res.status(401).send({
        message: 'Unauthorized.',
      })
    }
    req.userId = decoded.id
    next()
  })
}

isAdmin = (req, res, next) => {
  User.findByPk(req.userId)
    .then((user) => {
      user
        .getRoles()
        .then((roles) => {
          for (let i = 0; i < roles.length; i++) {
            if (roles[i].name === 'admin') {
              next()
              return
            }
          }

          res.status(403).send({
            message: 'Require Admin role.',
          })
          return
        })
        .catch((error) => {
          console.error(error)
          res.status(500).send({ message: 'An error ocurred.' })
          return
        })
    })
    .catch((error) => {
      console.error(error)
      res.status(500).send({ message: 'An error ocurred.' })
      return
    })
}

isMedic = (req, res, next) => {
  User.findByPk(req.userId).then((user) => {
    user.getRoles().then((roles) => {
      for (let i = 0; i < roles.length; i++) {
        if (roles[i].name === 'medic') {
          next()
          return
        }
      }

      res.status(403).send({
        message: 'Require Medic role.',
      })
    })
  })
}

isMedicOrAdmin = (req, res, next) => {
  User.findByPk(req.userId).then((user) => {
    user.getRoles().then((roles) => {
      for (let i = 0; i < roles.length; i++) {
        if (roles[i].name === 'medic') {
          next()
          return
        }

        if (roles[i].name === 'admin') {
          next()
          return
        }
      }

      res.status(403).send({
        message: 'Require Medic or Admin Role!',
      })
    })
  })
}

const authJwt = {
  verifyToken: verifyToken,
  isAdmin: isAdmin,
  isMedic: isMedic,
  isMedicOrAdmin: isMedicOrAdmin,
}
module.exports = authJwt
