require('dotenv').config()

var createError = require('http-errors')
var express = require('express')
var path = require('path')
var cookieParser = require('cookie-parser')
var logger = require('morgan')
const nodemailer = require('nodemailer')

var indexRouter = require('./routes/index')
var usersRouter = require('./routes/users')

var app = express()

const cors = require('cors')
app.use(
  cors({
    // origin: 'http://localhost:4200/'
    origin: '*',
    // origin: ['http://localhost:4200/', 'http://localhost:8080/']
  })
)

// view engine setup
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'jade')

app.use(logger('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(express.static(path.join(__dirname, 'public')))

const db = require('./models')
const Role = db.role
const User = db.user
// db.sequelize.sync()
db.sequelize.sync({ force: true }).then(() => {
  // db.sequelize.sync().then(() => {
  console.log('Drop and re-sync db.')
  // console.log('Sync db without force.')
  // initial();
})

app.use('/', indexRouter)
app.use('/users', usersRouter)
require('./routes/result.routes')(app)
// require("./routes/patient.routes")(app);
require('./routes/auth.routes')(app)
require('./routes/user.routes')(app)

mailer().catch((error) => console.error(error))

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404))
})

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message
  res.locals.error = req.app.get('env') === 'development' ? err : {}

  // render the error page
  res.status(err.status || 500)
  res.render('error')
})

// async..await is not allowed in global scope, must use a wrapper
async function mailer() {
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

  const messageOptions = {
    from: '"mailer@domain.com" <mailer@domain.com>', // sender address
    to: 'recipient1@domain.com, recipient2@domain.com', // list of receivers
    subject: 'Recordatorio de clave.', // Subject line
    text: 'La clave de ingreso es: password', // plain text body
    html: '<b>La clave de ingreso es: password</b>', // html body
  }
  // send mail with defined transport object
  let info = await transporter.sendMail(messageOptions)

  console.log('Message sent: %s', info.messageId)
  // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

  // Preview only available when sending through an Ethereal account
  console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info))
  // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
}

module.exports = app
