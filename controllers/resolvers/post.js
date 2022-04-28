const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const resolvers = {
  Mutation: {
    createPost: async (req, args, context) => {
      try {
        console.log("req :>> ", req);
        console.log("context :>> ", context);
        const { userId, title, description, image } = args.data;
        const createdBy = req.userInformation.userId;

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
  },
};

module.exports = resolvers;
