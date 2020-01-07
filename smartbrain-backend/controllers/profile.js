const Clarifai = require("clarifai");

const app = new Clarifai.App({
  apiKey: process.env.CLARIFAI_KEY
});

const handleApiCall = () => (req, res) => {
  app.models
    .predict(Clarifai.DEMOGRAPHICS_MODEL, req.body.input)
    .then(data => res.json(data))
    .catch(err => res.status(400).json("Unable to work with API"));
};

const getProfile = db => (req, res) => {
  const { id } = req.params;
  db.select("*")
    .from("users")
    .where({ id: id })
    .then(user => {
      if (user.length) {
        res.json(user[0]);
      } else {
        res.status(404).json("No such user");
      }
    })
    .catch(err => res.status(400).json("Error getting user"));
};

const getEntries = db => (req, res) => {
  const { id } = req.body;
  db("users")
    .where("id", "=", id)
    .increment("entries", 1)
    .returning("entries")
    .then(entries => {
      res.json(entries[0]);
    })
    .catch(err => res.status(400).json("Unable to get entries"));
};

const handleProfileUpdate = db => (req, res) => {
  const { id } = req.params;
  const { name, age, pet } = req.body.formInput;

  db('users')
    .where({ id })
    .update({ name })
    .then(response => {
      if (response) {
        return res.json("success");
      } else {
        res.status.json("Unable to update");
      }
    })
    .catch(err => res.status(400).json("Error updating user"));
}

module.exports = {
  getProfile: getProfile,
  getEntries: getEntries,
  handleApiCall: handleApiCall,
  handleProfileUpdate: handleProfileUpdate
};
