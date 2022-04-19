const express = require("express");
const app = express();
const morgen = require("morgan");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");

app.use(
  cors({
    origin: "*",
    methods: ["GET", "PUT", "POST", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization", "Range"],
    exposedHeaders: ["Content-Range", "X-Content-Range"],
    credentials: true,
  })
);
// app.options("*", cors());

dotenv.config();

// db config
mongoose
  .connect(process.env.MONGO_URI, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
  })
  .then(() => {
    console.log("MongoDB successfully connected");
  });

mongoose.connection.on("error", (err) => {
  console.log(`db connection error  : ${err.message}`);
});
// middelware
app.use(morgen("dev"));
app.use(bodyParser.json());
app.use(cookieParser());

//bring routes
const authRouter = require("./routes/auth");
const prospect = require("./routes/prospect");
const cours = require("./routes/cours");
const city = require("./routes/city");
const teacher = require("./routes/teacher");
const formation = require("./routes/formation");
const student = require("./routes/student");
const classRouter = require("./routes/class");
const cashRouter = require("./routes/cash");

app.use("/", authRouter);
app.use("/", prospect);
app.use("/", cours);
app.use("/", city);
app.use("/", teacher);
app.use("/", formation);
app.use("/", student);
app.use("/", classRouter);
app.use("/", cashRouter);

const port = process.env.PORT || 8080;

app.listen(port, () => {
  console.log(`the iac api lisnting to port : ${port}`);
});
