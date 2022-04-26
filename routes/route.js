const express = require("express");
const { verifyToken } = require("../auth");

const {
  createPost,
  updatePost,
  deletePost,
  getAllPosts,
  getPostsByPostId,
  getPostsByUser,
} = require("../controllers/post/post");
const {
  createProduct,
  updateProduct,
  deleteProduct,
  getAllProduct,
  getProductsByProductId,
  getProductsByUser,
  getProductExcelFile,
} = require("../controllers/product/product");
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

router.get(`/userAuth/login`, loginUser);
router.get(`/userAuth/logout`, logout);

router.post(`/userAuth/addUser`, verifyToken, createUser);
router.post(`/userAuth/updateUser`, verifyToken, updateUser);
router.post(`/userAuth/deleteUser/:userId`, verifyToken, deleteUser);
router.post(`/userAuth/createAdmin`, verifyToken, createAdmin);
router.post(`/userAuth/changeEmail`, verifyToken, changeEmail);
router.post(`/userAuth/changePassword`, verifyToken, changePassword);
router.post(`/userAuth/enableDisableUser`, verifyToken, enableDisableUser);

router.post(`/posts/createPost`, verifyToken, createPost);
router.post(`/posts/updatePost`, verifyToken, updatePost);
router.post(`/posts/deletePost/:postId`, verifyToken, deletePost);
router.get(`/posts/getAllPosts`, verifyToken, getAllPosts);
router.get(`/posts/getPostsByPostId/:postId`, verifyToken, getPostsByPostId);
router.get(`/posts/getPostsByUser/:useId`, verifyToken, getPostsByUser);

router.post(`/product/createProduct`, verifyToken, createProduct);
router.post(`/product/updateProduct`, verifyToken, updateProduct);
router.post(`/product/deleteProduct/:productId`, verifyToken, deleteProduct);
router.get(`/product/getAllProduct`, verifyToken, getAllProduct);
router.get(
  `/product/getProductsByProductId/:productId`,
  verifyToken,
  getProductsByProductId
);

router.get(
  `/product/getProductsByUser/:userId`,
  verifyToken,
  getProductsByUser
);
router.get(
  `/product/getProductExcelFile/:productId`,
  verifyToken,
  getProductExcelFile
);

module.exports = router;