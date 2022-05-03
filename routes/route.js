const express = require("express");
const { verifyToken } = require("../auth");
// const passport = require("passport");

const {
  createUser,
  loginUser,
  createAdmin,
  updateUser,
  deleteUser,
  changeEmail,
  changePassword,
  logout,
  enableDisableUser,
} = require("../controllers/user/user");
const router = express.Router();

// router.get(
//   `/userAuth/google`,
//   passport.authenticate("google", {
//     scope: ["email", "profile"],
//   })
// );
// router.get(
//   "/google/callback",
//   passport.authenticate("google", {
//     failureRedirect: "/failed",
//   }),
//   function (req, res) {
//     res.redirect("/success");
//   }
// );

// router.get("/failed", (req, res) => {
//   res.send("Failed");
// });
// router.get("/success", (req, res) => {
//   res.send(`Welcome user`);
// });

router.post(`/userAuth/login`, loginUser);
router.get(`/userAuth/logout`, logout);

router.post(`/userAuth/addUser`, verifyToken, createUser);
router.post(`/userAuth/updateUser`, verifyToken, updateUser);
router.post(`/userAuth/deleteUser/:userId`, verifyToken, deleteUser);
router.post(`/userAuth/createAdmin`, verifyToken, createAdmin);
router.post(`/userAuth/changeEmail`, verifyToken, changeEmail);
router.post(`/userAuth/changePassword`, verifyToken, changePassword);
router.post(`/userAuth/enableDisableUser`, verifyToken, enableDisableUser);

module.exports = router;
