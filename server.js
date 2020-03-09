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
//let url = "mongodb+srv://... see config.json (imported file)";
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

app.post("/login", upload.none(), async (req, res) => {
  console.log("login", req.body);
  console.log(req.body.username);
  console.log(req.body.password);
  let returnObject = {};
  let name = req.body.username;
  let pwd = sha1(req.body.password); // immediately hash password
  console.log("start call to DB");
  await dbo
    .collection("users")
    .findOne({ username: name }, async (err, user) => {
      console.log("in call to DB");
      if (err) {
        console.log("/login error");
        returnObject = { success: false, msg: "db err" };
      }
      if (user === null) {
        console.log("user === null");
        returnObject = { success: false, msg: "user null" };
      }
      if (user.password === pwd) {
        console.log("login success");
        let sessionId = generateId();
        sessions[sessionId] = name;
        res.cookie("sid", sessionId);
        //

        returnObject = {
          success: true,
          username: user.username,
          cart: user.cart,
          studentHistory: user.studentHistory,
          subscriptions: user.subscriptions,
          subscriptionSettings: user.subscriptionSettings
        };
        console.log("success : ", user);
        console.log("returnObject is ");
        console.log(returnObject);

        console.log("go to build subscribedCourses");

        // need to define a new fn to execute an async / await within a forEach
        // https://codeburst.io/javascript-async-await-with-foreach-b6ba62bbf404
        // subscribedCourses is a bit unique because it is BUILT from "live" objects on the DB,
        // depending what the user has subscribed to.

        let subscribedCoursesTemp = {};
        const subscriptionKeys = Object.keys(user.subscriptions);

        const asyncForeach = async (array, callback) => {
          console.log("asyncForEach");
          console.log(array.length);
          for (let index = 0; index < array.length; index++) {
            console.log("hi");
            console.log(array[index]);
            await callback(array[index]);
          }
        };

        const loadCourse = async x => {
          console.log("ok2");
          const course = await dbo
            .collection("courses")
            .findOne({ courseCode: Number(x) });
          console.log("ok3");
          console.log(x);
          console.log(course);
          subscribedCoursesTemp[x] = course;
          console.log("subscribedCourses");
          console.log(subscribedCoursesTemp);
        };

        const finalBuild = async () => {
          console.log("ok1");
          await asyncForeach(subscriptionKeys, loadCourse);
          console.log("done");
          returnObject.subscribedCourses = subscribedCoursesTemp;
          return res.send(JSON.stringify(returnObject));
        };

        finalBuild();
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
    studentHistory: [],
    subscriptions: [],
    subscribedCourses: [],
    subscriptionSettings: []
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
  console.log("subscriptions");
  let subscriptions = JSON.parse(req.body.subscriptions);
  console.log("subscriptionSettings");
  let subscriptionSettings = JSON.parse(req.body.subscriptionSettings);

  // i think studentHistory should be updated at every meaningful entry ... too risky to wait for logoff
  console.log("subscriptions and settings");
  console.log(subscriptions);
  console.log(subscriptionSettings);

  await dbo.collection("users").updateOne(
    { username: name },
    {
      $set: {
        cart: cart,
        studentHistory: studentHistory,
        subscriptionSettings: subscriptionSettings
        //subscriptions themselves are updated at time of purchase
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
          subscriptions: user.subscriptions
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
      subscriptions: user.subscriptions
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
  let prevSubscriptions = JSON.parse(req.body.prevSubscriptions);
  let prevStudentHistory = JSON.parse(req.body.prevStudentHistory);
  let newProduct = JSON.parse(req.body.selectedProduct);

  let newSubscriptions = JSON.parse(JSON.stringify(prevSubscriptions));
  let newStudentHistory = JSON.parse(JSON.stringify(prevStudentHistory));
  newSubscriptions[newProduct.courseCode] = newProduct;
  newStudentHistory[newProduct.courseCode] = [];

  await dbo.collection("users").updateOne(
    { username: name },
    {
      $set: {
        subscriptions: newSubscriptions,
        studentHistory: newStudentHistory
      }
    }
  );
  console.log("db updated with new subscriptions for " + name);
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
