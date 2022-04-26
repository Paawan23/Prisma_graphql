const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
let validator = require("validator");
const formidable = require("formidable");
const fs = require("fs");
const path = require("path");
const { createExcel, assetsFolder } = require("../../common/commonFunctions");

const headingColumnNames = [
  "Product Name",
  "Product Price",
  "Weight",
  "Manufactured By",
  "Status",
  "Created By",
  "Created At",
  "Updated By",
  "Updated At",
  "Deleted By",
  "Deleted At",
];

const getProductExcelAndPDFFileList = async (getType, condition) => {
  try {
    let selectQuery = await prisma.tbl_product.findMany({
      where: {
        status: 1,
      },
      select: {
        name: true,
        price: true,
        weight: true,
        manufactured_by: true,
        status: true,
        created_at: true,
        created_by: true,
        updated_at: true,
        updated_by: true,
        deleted_at: true,
        deleted_by: true,
      },
    });

    let selectQueryById = await prisma.tbl_product.findMany({
      where: {
        status: 1,
        product_id: condition.productIds,
      },
      select: {
        name: true,
        price: true,
        weight: true,
        manufactured_by: true,
        status: true,
        created_at: true,
        created_by: true,
        updated_at: true,
        updated_by: true,
        deleted_at: true,
        deleted_by: true,
      },
    });
    console.log("selectQuery :>> ", selectQuery);
    console.log("selectQueryById :>> ", selectQueryById);

    let responseMessage = {};
    switch (getType) {
      case "all":
        responseMessage = { status: true, data: selectQuery };
        break;
      case "productIds":
        responseMessage = { status: true, data: selectQueryById };
        break;
    }

    return responseMessage;
  } catch (error) {
    return { status: false, message: error.message };
  }
};

const getProductExcelFile = async (req, res) => {
  try {
    const productId = parseInt(req.params.productId);

    let response;
    if (productId) {
      response = await getProductExcelAndPDFFileList("productIds", {
        productIds: productId,
      });
    } else {
      response = await getProductExcelAndPDFFileList("all", {});
    }

    if (response.status) {
      const fileName = `${req.userInformation.userId}_product.xlsx`;
      const createFile = await createExcel(
        "Product",
        headingColumnNames,
        response,
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

const createProduct = async (req, res) => {
  try {
    let form = new formidable.IncomingForm();
    form.parse(req, async function (err, fields, file) {
      const { userId, name, price, weight, manufacturedBy } = fields;
      const { image } = file;

      const oldPath = image.filepath;
      const newPath =
        path.join(__dirname, "../../uploads") + "/" + image.originalFilename;

      const rawData = fs.readFileSync(oldPath);

      fs.writeFile(newPath, rawData, (err) => {
        if (err) {
          return res.status(202).json({
            status: false,
            code: 202,
            message: err.message,
          });
        }
      });

      const createdBy = req.userInformation.userId;
      if (parseInt(userId) <= 0) {
        return res.status(202).json({
          status: false,
          code: 202,
          message: `Please provide valid user id!`,
        });
      }
      if (
        validator.isEmpty(name) ||
        validator.isEmpty(price) ||
        validator.isEmpty(weight) ||
        validator.isEmpty(manufacturedBy)
      ) {
        return res.status(202).json({
          status: false,
          code: 202,
          message: `Empty fields!`,
        });
      }
      const userCheck = await prisma.tbl_user.count({
        where: {
          user_id: parseInt(userId),
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
      const productExists = await prisma.tbl_product.count({
        where: {
          user_id: parseInt(userId),
          name: {
            contains: name,
            mode: "insensitive",
          },
        },
      });
      if (productExists > 0) {
        return res.status(202).json({
          status: false,
          code: 202,
          message: `Product already exists!`,
        });
      }
      await prisma.tbl_product.create({
        data: {
          user_id: parseInt(userId),
          name: name,
          price: price,
          weight: weight,
          image: image.originalFilename,
          manufactured_by: manufacturedBy,
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
        message: `Product has been created successfully!`,
      });
    });
  } catch (error) {
    return res
      .status(401)
      .json({ status: false, code: 401, message: error.message });
  }
};
const updateProduct = async (req, res) => {
  try {
    let form = new formidable.IncomingForm();
    form.parse(req, async function (err, fields, file) {
      const { productId, name, price, weight, manufacturedBy } = fields;
      const { image } = file;
      const updatedBy = req.userInformation.userId;

      const getImg = await prisma.tbl_product.findMany({
        where: {
          product_id: parseInt(productId),
        },
      });
      fs.unlink(
        path.join(__dirname, `../../uploads/${getImg[0].image}`),
        (err) => {
          if (!err) {
            res.json({ message: `Image has been updated successfully` });
          }
          return err.message;
        }
      );

      const oldPath = image.filepath;
      const newPath =
        path.join(__dirname, "../../uploads") + "/" + image.originalFilename;
      const rawData = fs.readFileSync(oldPath);

      fs.writeFile(newPath, rawData, (err) => {
        if (err) {
          return res.status(202).json({
            status: false,
            code: 202,
            message: err.message,
          });
        }
      });

      if (productId <= 0) {
        return res.status(202).json({
          status: false,
          code: 202,
          message: `Please provide valid product id!`,
        });
      }
      //Checks
      const productCheck = await prisma.tbl_product.count({
        where: {
          product_id: parseInt(productId),
        },
      });
      if (productCheck === 0) {
        return res.status(202).json({
          status: false,
          code: 202,
          message: `Product not found!`,
        });
      }
      //Checks
      const statusCheck = await prisma.tbl_product.findMany({
        where: {
          product_id: parseInt(productId),
        },
      });
      if (statusCheck[0].status !== 1) {
        return res.status(202).json({
          status: false,
          code: 202,
          message: `Product is deleted!`,
        });
      }

      await prisma.tbl_product.update({
        where: {
          product_id: parseInt(productId),
        },
        data: {
          name: name,
          price: price,
          weight: weight,
          image: image.originalFilename,
          manufactured_by: manufacturedBy,
          updated_by: updatedBy,
          deleted_at: null,
          deleted_by: null,
          updated_at: new Date(),
        },
      });
      return res.status(201).json({
        status: true,
        code: 201,
        message: `Product has been updated successfully!`,
      });
    });
  } catch (error) {
    return res
      .status(401)
      .json({ status: false, code: 401, message: error.message });
  }
};
const deleteProduct = async (req, res) => {
  try {
    const productId = parseInt(req.params.productId);
    if (productId <= 0) {
      return res.status(202).json({
        status: false,
        code: 202,
        message: `Please provide valid product id!`,
      });
    }
    const deletedBy = req.userInformation.userId;
    const productCheck = await prisma.tbl_product.count({
      where: {
        product_id: productId,
      },
    });
    const productData = await prisma.tbl_product.findMany({
      where: {
        product_id: productId,
      },
    });

    if (productCheck === 0) {
      return res.status(202).json({
        status: false,
        code: 202,
        message: `Product not found!`,
      });
    }
    if (productData[0].status !== 1) {
      return res.status(202).json({
        status: false,
        code: 202,
        message: `Product is already deleted!`,
      });
    }
    await prisma.tbl_product.update({
      where: {
        product_id: productId,
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
      message: `Product has been deleted successfully!`,
    });
  } catch (error) {
    return res
      .status(401)
      .json({ status: false, code: 401, message: error.message });
  }
};
const getAllProduct = async (req, res) => {
  try {
    const data = await prisma.tbl_product.findMany({
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
const getProductsByProductId = async (req, res) => {
  try {
    const productId = parseInt(req.params.productId);
    if (productId <= 0) {
      return res.status(202).json({
        status: false,
        code: 202,
        message: `Please provide valid product id!`,
      });
    }
    const productCheck = await prisma.tbl_product.count({
      where: {
        product_id: productId,
      },
    });
    const productData = await prisma.tbl_product.findMany({
      where: {
        product_id: productId,
      },
    });
    if (productCheck === 0) {
      return res.status(202).json({
        status: false,
        code: 202,
        message: `Product not found!`,
      });
    }
    if (productData[0].status !== 1) {
      return res.status(202).json({
        status: false,
        code: 202,
        message: `Product is deleted!`,
      });
    }
    const data = await prisma.tbl_product.findMany({
      where: {
        product_id: productId,
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
const getProductsByUser = async (req, res) => {
  try {
    const userId = parseInt(req.params.userId);
    if (userId <= 0) {
      return res.status(202).json({
        status: false,
        code: 202,
        message: `Please provide valid user id!`,
      });
    }
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
    const data = await prisma.tbl_product.findMany({
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
  createProduct,
  updateProduct,
  deleteProduct,
  getAllProduct,
  getProductsByProductId,
  getProductsByUser,
  getProductExcelFile,
};
