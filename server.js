require("dotenv").config();
const express = require("express");
const app = express();
const Route = require("./routes/route");
const { ApolloServer } = require("apollo-server-express");
const { verifyToken } = require("./auth");
const cors = require("cors");

const typeDefs = require("./controllers/schema/post");
const resolvers = require("./controllers/resolvers/post");
// const cookieSession = require("cookie-session");
// const passport = require("passport");

// require("./passport");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// app.use(
//   cookieSession({
//     name: "google-auth-session",
//     keys: ["key1", "key2"],
//   })
// );

// app.use(passport.initialize());
// app.use(passport.session());
const corsOptions = {
  origin: "http://localhost:3001",
  credentials: true,
};

app.use(cors(corsOptions));
let port = process.env.PORT || 3000;

app.use("/", Route);
app.use(verifyToken);

async function startApolloServer() {
  const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: ({ req }) => {
      return req;
    },
  });

  await server.start();

  server.applyMiddleware({
    app,
    path: "/graphql",
    corsOptions,
  });
}
startApolloServer();

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
