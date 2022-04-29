const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const fs = require("fs");

// const storeFS = ({ stream, filename }) => {
//   const uploadDir = "../../uploads";
//   const path = `${uploadDir}/${filename}`;
//   return new Promise((resolve, reject) =>
//     stream
//       .on("error", (error) => {
//         if (stream.truncated)
//           // delete the truncated file
//           fs.unlinkSync(path);
//         reject(error);
//       })
//       .pipe(fs.createWriteStream(path))
//       .on("error", (error) => reject(error))
//       .on("finish", () => resolve({ path }))
//   );
// };

const resolvers = {
  Mutation: {
    createPost: async (_, args, req) => {
      console.log("args :>> ", args);
      try {
        const { userId, title, description } = args;
        // const { filename, mimetype, createReadStream } = await args.file;
        const createdBy = req.userInformation.userId;
        // const stream = createReadStream();
        // const pathObj = await storeFS({ stream, filename });
        // const fileLocation = pathObj.path;
        // console.log("fileLocation :>> ", fileLocation);

        const userCheck = await prisma.tbl_user.count({
          where: {
            user_id: userId,
          },
        });
        if (userCheck === 0) {
          return {
            status: false,
            code: 202,
            message: `UserId not found!`,
          };
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
        return {
          status: true,
          code: 201,
          message: `Post has been created successfully!`,
        };
      } catch (error) {
        return { status: false, code: 401, message: error.message };
      }
    },
    updatePost: async (_, args, req) => {
      try {
        const { postId, title, description, image } = args;
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
          return {
            status: false,
            code: 202,
            message: `Post is deleted!`,
          };
        }

        if (postCheck === 0) {
          return {
            status: false,
            code: 202,
            message: `Post not found!`,
          };
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
        return {
          status: true,
          code: 201,
          message: `Post has been updated successfully!`,
        };
      } catch (error) {
        return { status: false, code: 401, message: error.message };
      }
    },
    deletePost: async (_, args, req) => {
      try {
        const { postId } = args;
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
          return {
            status: false,
            code: 202,
            message: `Post not found!`,
          };
        }
        if (postData[0].status !== 1) {
          return {
            status: false,
            code: 202,
            message: `Post is already deleted!`,
          };
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
        return {
          status: true,
          code: 201,
          message: `Post has been deleted successfully!`,
        };
      } catch (error) {
        return { status: false, code: 401, message: error.message };
      }
    },
  },

  Query: {
    getAllPosts: async () => {
      console.log(1);
      try {
        const data = await prisma.tbl_post.findMany({
          where: {
            status: 1,
          },
        });

        if (data.length === 0) {
          return { status: false, code: 202, message: "No data found" };
        }
        return { status: true, code: 201, message: "OK", data: data };
      } catch (error) {
        return { status: false, code: 401, message: error.message };
      }
    },
    getPostsByPostId: async (_, args, req) => {
      try {
        const { postId } = args;
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
          return {
            status: false,
            code: 202,
            message: `Post not found!`,
          };
        }
        if (postData[0].status !== 1) {
          return {
            status: false,
            code: 202,
            message: `Post is deleted!`,
          };
        }
        const data = await prisma.tbl_post.findMany({
          where: {
            post_id: postId,
            status: 1,
          },
        });

        if (data.length === 0) {
          return { status: false, code: 202, message: "No data found" };
        }
        return { status: true, code: 201, message: "OK", data: data };
      } catch (error) {
        return { status: false, code: 401, message: error.message };
      }
    },
    getPostsByUser: async (_, args, req) => {
      try {
        const { userId } = args;
        const userCheck = await prisma.tbl_user.count({
          where: {
            user_id: userId,
            status: 1,
          },
        });
        if (userCheck === 0) {
          return {
            status: false,
            code: 202,
            message: `UserId not found!`,
          };
        }
        const data = await prisma.tbl_post.findMany({
          where: {
            user_id: userId,
            status: 1,
          },
        });

        if (data.length === 0) {
          return { status: false, code: 202, message: "No data foud" };
        }
        return { status: true, code: 201, message: "OK", data: data };
      } catch (error) {
        return { status: false, code: 401, message: error.message };
      }
    },
  },
};

module.exports = resolvers;
