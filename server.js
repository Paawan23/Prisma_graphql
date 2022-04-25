require("dotenv").config();
const express = require("express");
const app = express();
const Route = require("./routes/route");

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

app.listen(5000, () => {
  console.log("Server listening on port 5000 in developement mode!!");
});

app.use("/", Route);
