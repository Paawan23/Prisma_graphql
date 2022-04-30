const { gql } = require("apollo-server");
const typeDefs = gql`
  scalar Upload
  scalar DATETIME

  type File {
    filename: String!
    mimetype: String!
    encoding: String!
  }

  input InputCreatePost {
    userId: Int
    title: String
    description: String
    image: String
  }

  input InputUpdatePost {
    postId: Int
    userId: Int
    title: String
    description: String
    image: String
  }

  type Post {
    post_id: Int
    user_id: Int
    title: String
    description: String
    image: String
    status: Int
    created_at: DATETIME
    created_by: Int
    updated_at: DATETIME
    updated_by: Int
    deleted_at: DATETIME
    deleted_by: Int
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
    createPost(v: InputCreatePost): ResponseMutation!
    updatePost(data: InputUpdatePost): ResponseMutation!
    deletePost(postId: Int): ResponseMutation!
  }
`;

module.exports = typeDefs;
