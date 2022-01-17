module.exports = (app) => {
  const results = require("../controllers/result.controller.js");

  var router = require("express").Router();

  // Create a new Result
  router.post("/", results.create);

  // Retrieve all Results
  router.get("/", results.findAll);
  
  router.get("/seed", results.createSeed);

  // Retrieve all published Results
  router.get("/published", results.findAllPublished);

  // Retrieve a single Result with id
  router.get("/:id", results.findOne);

  // Update a Result with id
  router.put("/:id", results.update);

  // Delete a Result with id
  router.delete("/:id", results.delete);

  // Create a new Result
  router.delete("/", results.deleteAll);

  app.use("/api/results", router);
};
