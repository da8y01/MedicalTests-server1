const { authJwt } = require("../middleware");
const controller = require("../controllers/user.controller");
const patientController = require("../controllers/patient.controller");

module.exports = function (app) {
  app.use(function (req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  app.get("/api/test/all", controller.allAccess);

  app.get("/api/test/patient", [authJwt.verifyToken], controller.patientBoard);
  
  app.get("/api/patients", [authJwt.verifyToken], patientController.findAll);
  app.get("/api/users/:id", [authJwt.verifyToken], patientController.findOne);
  app.put("/api/users", [authJwt.verifyToken], patientController.update);
  app.post("/api/patients/delete", [authJwt.verifyToken, authJwt.isAdmin], patientController.deleteAll);
  app.post("/api/patients/assignMedic", [authJwt.verifyToken, authJwt.isAdmin], patientController.assignMedic);
  app.post("/api/patients/undoAssignMedic", [authJwt.verifyToken, authJwt.isAdmin], patientController.undoAssignMedic);
  app.get("/api/patients/assignedTo/:medicId", [authJwt.verifyToken, authJwt.isAdmin], patientController.assignedToMedic);

  app.get(
    "/api/test/medic",
    [authJwt.verifyToken, authJwt.isMedic],
    controller.medicBoard
  );

  app.get(
    "/api/test/admin",
    [authJwt.verifyToken, authJwt.isAdmin],
    controller.adminBoard
  );
};
