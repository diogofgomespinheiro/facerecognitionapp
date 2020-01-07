const jwt = require('jsonwebtoken');
const redis = require('redis');

//Setup redis
const redisClient = redis.createClient(process.env.REDIS_URI);

const handleSignIn = (db, bcrypt, req, res) => {
  const { email, password } = req.body;

  if(!email || !password) {
    return Promise.reject("Incorrect form submission");
  }

  return db.select("email", "hash")
    .from("login")
    .where("email", "=", email)
    .then(data => {
      const isValid = bcrypt.compareSync(password, data[0].hash);
      if (isValid) {
        return db.select("*")
          .from("users")
          .where("email", "=", email)
          .then(user => {
            return user[0];
          })
          .catch(err => Promise.reject("Unable to get user"));
      } else {
        Promise.reject("Wrong password");
      }
    })
    .catch(err => Promise.reject("This email doesn´t exist"));
};

const getAuthTokenId = (authorization,res) => {
  redisClient.get(authorization, (err, reply) => {
    if (err || !reply) {
      return res.status(400).json("Unauthorized")
    }
    return res.json({id: reply});
  })
}

const signToken = email => {
  const jwtPayload = { email };
  return jwt.sign(jwtPayload, process.env.JWT_SECRET, { expiresIn: "2 days" });
}

const setToken = ( token, id ) => {
  return Promise.resolve(redisClient.set(token, id));
}

const createSessions = user => {
  const { email, id } = user;
  const token = signToken(email);
  return setToken(token, id)
    .then(() => {
      return { success: true, userId: id, token}
    })
    .catch(console.log);
}

const signInAuthentication = (db, bcrypt) => (req, res) => {
  const { authorization } = req.headers;
  return authorization ? 
    getAuthTokenId(authorization,res) : 
    handleSignIn(db,bcrypt, req, res)
      .then(data => {
        return data.id && data.email ? createSessions(data) : Promise.reject(data);
      })
      .then(session => res.json(session))
      .catch(err => res.status(400).json(err));
}

// const signOut = (req, res) => {
//   const { authorization } = req.headers;
//   redisClient.del(authorization, (err, reply) => {
//     if (reply !== 1 ) {
//       return res.status(400).json("This token doesnt exist");
//     }

//     return res.status(200).json("Deleted successfully");
//   })
// }

module.exports = {
  signInAuthentication : signInAuthentication,
  redisClient: redisClient
}