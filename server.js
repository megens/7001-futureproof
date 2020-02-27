let express = require("express");
let router = express.Router();
let app = express();
let mongodb = require("mongodb");
let MongoClient = mongodb.MongoClient;
let ObjectID = mongodb.ObjectID;
let multer = require("multer");
let upload = multer({ dest: __dirname + "/uploads" });
let cookieParser = require("cookie-parser");
app.use(cookieParser());
let reloadMagic = require("./reload-magic.js");
let sha1 = require("sha1");
reloadMagic(app);
let sessions = {};
let configJson = require("./config.json");
let url = configJson.url;
// STRIPE
const bodyParser = require("body-parser");
const postCharge = require("./src/stripey.js");
require("dotenv").config();
const port = process.env.PORT || 7000;
app.use(bodyParser.json());

app.use("/", express.static("build")); // Needed for the HTML and JS files
app.use("/", express.static("public")); // Needed for local assets
app.use("/uploads", express.static("uploads"));
app.use("/icons", express.static("icons"));
app.use("/logos", express.static("logos"));

let dbo = undefined;
/*
let url = "mongodb+srv://... see config.json (imported file)";
*/
MongoClient.connect(url, { useNewUrlParser: true }, (err, db) => {
  dbo = db.db("futureProofMe"); //
});

let generateId = () => {
  return "" + Math.floor(Math.random() * 100000000);
};

// Your endpoints go after this line
//STRIPE
router.post("/stripe/charge", postCharge);
app.use("/api", router);
app.use((_, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
}); // enable CORS for all requests

app.post("/login", upload.none(), (req, res) => {
  console.log("login", req.body);
  let name = req.body.username;
  let pwd = sha1(req.body.password); // immediately hash password
  dbo.collection("users").findOne({ username: name }, (err, user) => {
    if (err) {
      console.log("/login error");
      return res.send(JSON.stringify({ success: false, msg: "db err" }));
    }
    if (user === null) {
      console.log("user === null");
      return res.send(JSON.stringify({ success: false, msg: "user null" }));
    }
    if (user.password === pwd) {
      console.log("login success");
      let sessionId = generateId();
      sessions[sessionId] = name;
      res.cookie("sid", sessionId);
      res.send(
        JSON.stringify({
          success: true,
          username: user.username,
          cart: user.cart,
          studentHistory: user.studentHistory,
          courseHistory: user.courseHistory,
          questionVec: user.questionVec
        })
      );
      console.log("success : ", user);
      return;
    }
  });
});

app.post("/signup", upload.none(), async (req, res) => {
  let name = req.body.username;
  let pwd = sha1(req.body.password); // immediately hash password
  console.log("signup", name, pwd);
  const user = await dbo.collection("users").findOne({ username: name });
  if (user) {
    console.log(user);
    console.log("error: user exists");
    return res.send(
      JSON.stringify({ success: false, message: "user already exists" })
    );
  }
  dbo.collection("users").insertOne({
    username: name,
    password: pwd,
    cart: [],
    studentHistory: {},
    courseHistory: [],
    questionVec: []
  });
  console.log("signup success");
  let sessionId = generateId();
  sessions[sessionId] = name;
  res.cookie("sid", sessionId);
  return res.send(JSON.stringify({ success: true }));
});

app.post("/logout", upload.none(), async (req, res) => {
  console.log("entering logout");
  //delete sessions[sessionId];
  //res.cookie("sid", 0); // this sets my cookie to zero, but doesn't actually delete it
  let name = req.body.username;
  console.log(name);
  let cart = JSON.parse(req.body.cart);
  console.log(cart);
  let studentHistory = JSON.parse(req.body.studentHistory);
  console.log("studentHistory ", studentHistory);
  let courseHistory = JSON.parse(req.body.courseHistory);
  let questionVec = JSON.parse(req.body.questionVec);
  // i think studentHistory should be updated at every meaningful entry ... too risky to wait for logoff

  await dbo.collection("users").updateOne(
    { username: name },
    {
      $set: {
        cart: cart,
        studentHistory: studentHistory,
        courseHistory: courseHistory,
        questionVec: questionVec
      }
    }
  );

  console.log("db updated");
  return res.send(JSON.stringify({ success: true }));
});

app.get("/all-courses", async (req, res) => {
  console.log("request to /all-courses");
  dbo
    .collection("courses")
    .find({})
    .toArray((err, item) => {
      if (err) {
        console.log("error", err);
        return res.send(JSON.stringify({ success: false }));
      }
      res.send(JSON.stringify(item));
    });
});

app.post("/update-my-profile/", upload.none(), async (req, res) => {
  console.log("request to /update-my-profile");
  let username = req.body.username;
  dbo.collection("users").findOne({ username: username }, (err, user) => {
    if (err) {
      console.log("/update error error");
      return res.send(JSON.stringify({ success: false, msg: "db err" }));
    }
    if (user === null) {
      console.log("user === null");
      return res.send(JSON.stringify({ success: false, msg: "user null" }));
    } else {
      console.log("update success");
      res.send(
        JSON.stringify({
          success: true,
          username: user.username,
          cart: user.cart,
          studentHistory: user.studentHistory,
          courseHistory: user.courseHistory
        })
      );
      console.log("success : ", user);
      return;
    }
  });

  res.send(
    JSON.stringify({
      success: true,
      username: user.username,
      cart: user.cart,
      studentHistory: user.studentHistory,
      courseHistory: user.courseHistory
    })
  );

  dbo
    .collection("courses")
    .find({})
    .toArray((err, item) => {
      if (err) {
        console.log("error", err);
        return res.send(JSON.stringify({ success: false }));
      }
      res.send(JSON.stringify(item));
    });
});

app.post("/record-purchased-course/", upload.none(), async (req, res) => {
  let name = req.body.username;
  console.log("name is " + name);
  let newCourseHistory = JSON.parse(req.body.newCourseHistory);

  await dbo
    .collection("users")
    .updateOne(
      { username: name },
      { $set: { courseHistory: newCourseHistory } }
    );
  console.log("db updated with new courseHistory for " + name);
  return res.send(JSON.stringify({ success: true }));
});

// Your endpoints go before this line

app.all("/*", (req, res, next) => {
  // needed for react router
  res.sendFile(__dirname + "/build/index.html");
});

app.listen(port, "0.0.0.0", () => {
  console.log("Server running on port " + port);
});
