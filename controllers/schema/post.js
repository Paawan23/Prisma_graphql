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

  type User {
    user_id: Int
    first_name: String
    last_name: String
    email_id: String
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

  type RepsonseGetAllUsers {
    status: Boolean
    code: Int
    message: String
    data: [User]
  }
  type RepsonseGetAllUsersByUserId {
    status: Boolean
    code: Int
    message: String
    data: User
  }

  type RepsonseGetPostByPostId {
    status: Boolean
    code: Int
    message: String
    data: Post
  }

  type Query {
    getAllPosts: RepsonseGetAllPosts!
    getAllUsers: RepsonseGetAllUsers!
    getAllUsersByUserId(userId: Int): RepsonseGetAllUsersByUserId!
    getPostsByPostId(postId: Int): RepsonseGetPostByPostId!
    getPostsByUser(userId: Int): RepsonseGetAllPosts!
  }

  type Mutation {
    createPost(data: InputCreatePost): ResponseMutation!
    updatePost(data: InputUpdatePost): ResponseMutation!
    deletePost(postId: Int): ResponseMutation!
  }
`;

module.exports = typeDefs;
