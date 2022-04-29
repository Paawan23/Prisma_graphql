const { gql } = require("apollo-server");
const typeDefs = gql`
  scalar Upload

  type File {
    filename: String!
    mimetype: String!
    encoding: String!
  }

  input InputCreatePost {
    userId: Int
    title: String
    description: String
  }

  input InputUpdatePost {
    postId: Int
    userId: Int
    title: String
    description: String
    image: String
  }

  type Post {
    postId: Int
    userId: Int
    title: String
    description: String
    image: String
    status: Int
    createdAt: String
    createdBy: Int
    updatedAt: String
    updatedBy: Int
    deletedAt: String
    deletedBy: Int
  }

  type ResponseMutation {
    status: Boolean
    code: Int
    message: String
  }

  type RepsonseGetAllPosts {
    status: Boolean
    code: Int
    message: String
    data: [Post]
  }

  type RepsonseGetPostByPostId {
    status: Boolean
    code: Int
    message: String
    data: Post
  }

  type Query {
    getAllPosts: RepsonseGetAllPosts!
    getPostsByPostId(postId: Int): RepsonseGetPostByPostId!
    getPostsByUser(userId: Int): RepsonseGetAllPosts!
  }

  type Mutation {
    createPost(image: Upload, data: InputCreatePost): ResponseMutation!
    updatePost(data: InputUpdatePost): ResponseMutation!
    deletePost(postId: Int): ResponseMutation!
  }
`;

module.exports = typeDefs;
