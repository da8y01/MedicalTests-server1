exports.allAccess = (req, res) => {
  res.status(200).send("Public Content.");
};

exports.patientBoard = (req, res) => {
  res.status(200).send("Patient Content.");
};

exports.adminBoard = (req, res) => {
  res.status(200).send("Admin Content.");
};

exports.medicBoard = (req, res) => {
  res.status(200).send("Medic Content.");
};
