const { authJwt } = require("../middleware");

const multer = require("multer");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/");
  },

  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});
const imageFileFilter = (req, file, cb) => {
  if (!file.originalname.match(/\.(jpg|jpeg|png|avi|mp4|pdf)$/)) {
    return cb(new Error("You can upload only documents files!"), false);
  }
  cb(null, true);
};

// const upload = multer({ dest: 'public/' })
const upload = multer({ storage: storage, fileFilter: imageFileFilter });

module.exports = (app) => {
  const results = require("../controllers/result.controller.js");

  var router = require("express").Router();

  // Create a new Result
  router.post("/", results.create);

  router.post(
    "/upload/:patientUsername",
    upload.single("exam"),
    results.upload
  );
  // router.post("/upload", upload.array('result'), results.upload);
  router.post(
    "/uploadReading/:resultId",
    upload.single("reading"),
    results.uploadReading
  );

  // Retrieve all Results
  router.get("/", results.findAll);

  // Retrieve all published Results
  router.get("/published", results.findAllPublished);

  // Retrieve a single Result with id
  router.get("/:id", results.findOne);

  // Update a Result with id
  router.put("/:id", results.update);

  // Delete a Result with id
  router.delete("/:id", results.delete);

  // Delete the Reading of a Result with the id of the Result
  router.delete(
    "/reading/:resultId",
    [authJwt.verifyToken, authJwt.isAdmin],
    results.deleteReading
  );

  // Create a new Result
  router.delete("/", results.deleteAll);

  app.use("/api/results", router);
};
