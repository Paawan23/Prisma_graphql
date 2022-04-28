const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const { createExcel, assetsFolder } = require("../../common/commonFunctions");

const headingColumnNames = [
  "Post Title",
  "Description",
  "Status",
  "Created At",
  "Created By",
  "Updated At",
  "Updated By",
  "Deleted At",
  "Deleted By",
];

const getPostExcelAndPDFFileList = async (getType, condition) => {
  try {
    let selectQuery = await prisma.tbl_post.findMany({
      where: {
        status: 1,
      },
      select: {
        title: true,
        description: true,
        status: true,
        created_at: true,
        created_by: true,
        updated_at: true,
        updated_by: true,
        deleted_at: true,
        deleted_by: true,
      },
    });

    let selectQueryById = await prisma.tbl_post.findMany({
      where: {
        status: 1,
        post_id: condition.postIds,
      },
      select: {
        title: true,
        description: true,
        status: true,
        created_at: true,
        created_by: true,
        updated_at: true,
        updated_by: true,
        deleted_at: true,
        deleted_by: true,
      },
    });

    let responseMessage = {};
    switch (getType) {
      case "all":
        responseMessage = { status: true, data: selectQuery };
        break;
      case "postIds":
        responseMessage = { status: true, data: selectQueryById };
        break;
    }

    return responseMessage;
  } catch (error) {
    return { status: false, message: error.message };
  }
};

const getPostExcelFile = async (req, res) => {
  try {
    let response;
    if (req.query) {
      response = await getPostExcelAndPDFFileList("postIds", {
        postIds: parseInt(req.query["postId"]),
      });
    }
    if (req.query.length === undefined) {
      response = await getPostExcelAndPDFFileList("all", {});
    }
    if (response.status) {
      const fileName = `${req.userInformation.userId}_post.xlsx`;
      const createFile = await createExcel(
        "Post",
        headingColumnNames,
        response.data,
        fileName
      );
      if (createFile.status) {
        return res.json({
          data: assetsFolder.downloadFileUrl + createFile.fileName,
        });
      } else {
        return res.json({ status: false, message: `File not created` });
      }
    } else {
      return response;
    }
  } catch (error) {
    return res.json({ status: false, message: error.message });
  }
};

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
  getPostExcelFile,
};
