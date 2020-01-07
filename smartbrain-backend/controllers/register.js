const handleRegister = (req, res, db, bcrypt, saltRounds) => {
  const { email, name, password } = req.body;
  if(!email || !name || !password) {
    return res.status(400).json("Incorrect form submit");
  }
  bcrypt.hash(password, saltRounds, (err, hash) => {
    db.transaction(trx => {
      trx
        .insert({
          hash: hash,
          email: email
        })
        .into("login")
        .returning("email")
        .then(loginEmail => {
          db("users")
            .returning("*")
            .insert({
              email: loginEmail[0],
              name: name,
              joined: new Date()
            })
            .then(user => {
              res.json(user[0]);
            });
        })
        .then(trx.commit)
        .catch(trx.rollback);
    }).catch(err => res.status(400).json("Unable to register"));
  });
};

module.exports = { handleRegister: handleRegister };
