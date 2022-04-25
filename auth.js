const jwt = require("jsonwebtoken");

const verifyToken = async (req, res, next) => {
  try {
    const token = req.headers.cookie.split("=")[1];
    if (token) {
      const decode = jwt.verify(token, "secret");
      req.userInformation = {};
      req.userInformation.userId = decode.userId;
      req.userInformation.emailId = decode.emailId;
      next();
    } else {
      return res
        .status(202)
        .json({ status: false, code: 401, message: `Token not found` });
    }
  } catch (error) {
    return res
      .status(403)
      .json({ status: false, code: 401, message: error.message });
  }
};
module.exports = { verifyToken };
