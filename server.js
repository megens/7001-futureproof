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
    if (user === null || user === "browsing ...") {
      // browser is reserved word
      console.log("user doesn't exist");
      return res.send(JSON.stringify({ success: false, msg: "user null" }));
    }
    console.log(user.password);
    if (user.password === pwd) {
      console.log("login success");
      let sessionId = generateId();
      console.log("generated id", sessionId);
      sessions[sessionId] = name;
      res.cookie("sid", sessionId);
      res.send(
        JSON.stringify({
          success: true,
          cart: user.cart
        })
      );
      console.log("loaded cart is ");
      console.log(user);
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
    designsCart: [],
    personalInventory: [],
    sellerStatus: false
  });
  console.log("signup success");
  let sessionId = generateId();
  console.log("generated id", sessionId);
  sessions[sessionId] = name;
  res.cookie("sid", sessionId);
  return res.send(JSON.stringify({ success: true }));
});

app.post("/logout", upload.none(), async (req, res) => {
  //delete sessions[sessionId];
  //res.cookie("sid", 0); // this sets my cookie to zero, but doesn't actually delete it
  let name = req.body.username;
  let cart = JSON.parse(req.body.cart);
  let designsCart = JSON.parse(req.body.designsCart);
  let personalInventory = JSON.parse(req.body.personalInventory);
  console.log("name and cart and personalInventory defined");
  console.log(name);
  console.log(cart);
  console.log(personalInventory);
  dbo.collection("users").updateOne(
    { username: name },
    {
      $set: {
        cart: cart,
        designsCart: designsCart,
        personalInventory: personalInventory
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

// Your endpoints go before this line

app.all("/*", (req, res, next) => {
  // needed for react router
  res.sendFile(__dirname + "/build/index.html");
});

app.listen(port, "0.0.0.0", () => {
  console.log("Server running on port " + port);
});
