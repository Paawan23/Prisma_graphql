const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const createPost = async (req, res) => {
  try {
    const { userId, title, description, image } = req.body;
    const createdBy = req.userInformation.userId;

    const userCheck = await prisma.tbl_user.count({
      where: {
        user_id: userId,
      },
    });
    if (userCheck === 0) {
      return res.status(202).json({
        status: false,
        code: 202,
        message: `UserId not found!`,
      });
    }
    await prisma.tbl_post.create({
      data: {
        user_id: userId,
        title: title,
        description: description,
        image: image,
        created_by: createdBy,
        updated_by: null,
        updated_at: null,
        deleted_by: null,
        deleted_at: null,
      },
    });
    return res.status(201).json({
      status: true,
      code: 201,
      message: `Post has been created successfully!`,
    });
  } catch (error) {
    return res
      .status(401)
      .json({ status: false, code: 401, message: error.message });
  }
};
const updatePost = async (req, res) => {
  try {
    const { postId, title, description, image } = req.body;
    const updatedBy = req.userInformation.userId;
    const postCheck = await prisma.tbl_post.count({
      where: {
        post_id: postId,
      },
    });

    const postData = await prisma.tbl_post.findMany({
      where: {
        post_id: postId,
      },
    });

    if (postData[0].status !== 1) {
      return res.status(202).json({
        status: false,
        code: 202,
        message: `Post is deleted!`,
      });
    }

    if (postCheck === 0) {
      return res.status(202).json({
        status: false,
        code: 202,
        message: `Post not found!`,
      });
    }
    await prisma.tbl_post.update({
      where: {
        post_id: postId,
      },
      data: {
        title: title,
        description: description,
        image: image,
        updated_by: updatedBy,
        deleted_at: null,
        deleted_by: null,
        updated_at: new Date(),
      },
    });
    return res.status(201).json({
      status: true,
      code: 201,
      message: `Post has been updated successfully!`,
    });
  } catch (error) {
    return res
      .status(401)
      .json({ status: false, code: 401, message: error.message });
  }
};
const deletePost = async (req, res) => {
  try {
    const postId = parseInt(req.params.postId);
    const deletedBy = req.userInformation.userId;
    const postCheck = await prisma.tbl_post.count({
      where: {
        post_id: postId,
      },
    });

    const postData = await prisma.tbl_post.findMany({
      where: {
        post_id: postId,
      },
    });

    if (postCheck === 0) {
      return res.status(202).json({
        status: false,
        code: 202,
        message: `Post not found!`,
      });
    }
    if (postData[0].status !== 1) {
      return res.status(202).json({
        status: false,
        code: 202,
        message: `Post is already deleted!`,
      });
    }
    await prisma.tbl_post.update({
      where: {
        post_id: postId,
      },
      data: {
        status: 2,
        deleted_at: new Date(),
        deleted_by: deletedBy,
      },
    });
    return res.status(201).json({
      status: true,
      code: 201,
      message: `Post has been deleted successfully!`,
    });
  } catch (error) {
    return res
      .status(401)
      .json({ status: false, code: 401, message: error.message });
  }
};
const getAllPosts = async (req, res) => {
  try {
    const data = await prisma.tbl_post.findMany({
      where: {
        status: 1,
      },
    });

    if (data.length === 0) {
      return res
        .status(202)
        .json({ status: false, code: 202, message: "No data found" });
    }
    return res
      .status(201)
      .json({ status: true, code: 201, message: "OK", data: data });
  } catch (error) {
    return res
      .status(401)
      .json({ status: false, code: 401, message: error.message });
  }
};
const getPostsByPostId = async (req, res) => {
  try {
    const postId = parseInt(req.params.postId);
    const postCheck = await prisma.tbl_post.count({
      where: {
        post_id: postId,
      },
    });
    const postData = await prisma.tbl_post.findMany({
      where: {
        post_id: postId,
      },
    });
    if (postCheck === 0) {
      return res.status(202).json({
        status: false,
        code: 202,
        message: `Post not found!`,
      });
    }
    if (postData[0].status !== 1) {
      return res.status(202).json({
        status: false,
        code: 202,
        message: `Post is deleted!`,
      });
    }
    const data = await prisma.tbl_post.findMany({
      where: {
        post_id: postId,
        status: 1,
      },
    });

    if (data.length === 0) {
      return res
        .status(202)
        .json({ status: false, code: 202, message: "No data found" });
    }
    return res
      .status(201)
      .json({ status: true, code: 201, message: "OK", data: data });
  } catch (error) {
    return res
      .status(401)
      .json({ status: false, code: 401, message: error.message });
  }
};
const getPostsByUser = async (req, res) => {
  try {
    const userId = parseInt(req.params.userId);
    const userCheck = await prisma.tbl_user.count({
      where: {
        user_id: userId,
        status: 1,
      },
    });
    if (userCheck === 0) {
      return res.status(202).json({
        status: false,
        code: 202,
        message: `UserId not found!`,
      });
    }
    const data = await prisma.tbl_post.findMany({
      where: {
        user_id: userId,
        status: 1,
      },
    });

    if (data.length === 0) {
      return res
        .status(202)
        .json({ status: false, code: 202, message: "No data foud" });
    }
    return res
      .status(201)
      .json({ status: true, code: 201, message: "OK", data: data });
  } catch (error) {
    return res
      .status(401)
      .json({ status: false, code: 401, message: error.message });
  }
};
module.exports = {
  createPost,
  updatePost,
  deletePost,
  getAllPosts,
  getPostsByPostId,
  getPostsByUser,
};
