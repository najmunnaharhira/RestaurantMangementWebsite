const User = require('../models/User');

const verifyAdmin = async (req, res, next) => {
  try {
    const email = req.decoded?.email;
    if (!email) {
      return res.status(401).send({ message: "Unauthorized access" });
    }
    const user = await User.findOne({ email });
    const isAdmin = user?.role === 'admin';

    if (!isAdmin) {
      return res.status(403).send({ message: "Forbidden access" });
    }
    next();
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = verifyAdmin;