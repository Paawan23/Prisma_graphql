require("dotenv").config();
const express = require("express");
const app = express();
const Route = require("./routes/route");
const { ApolloServer } = require("apollo-server-express");
const { ApolloServerPluginDrainHttpServer } = require("apollo-server-core");
const typeDefs = require("./controllers/schema/post");
const resolvers = require("./controllers/resolvers/post");
const http = require("http");

const verifyToken = require("./auth");

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

app.use("/", Route);

async function startApolloServer() {
  const httpServer = http.createServer(app);

  // Same ApolloServer initialization as before, plus the drain plugin.
  const server = new ApolloServer({
    typeDefs,
    resolvers,
    plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
  });

  // More required logic for integrating with Express
  await server.start();

  server.applyMiddleware({
    app,
    path: "/graphql",
  });

  // Modified server startup
  await new Promise((resolve) => httpServer.listen({ port: 4000 }, resolve));
  console.log(`🚀 Server ready at http://localhost:4000${server.graphqlPath}`);
}
startApolloServer();
//
