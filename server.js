let express = require("express");
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

app.use("/", express.static("build")); // Needed for the HTML and JS files
app.use("/", express.static("public")); // Needed for local assets
app.use("/uploads", express.static("uploads"));
app.use("/icons", express.static("icons"));

let dbo = undefined;
/*
let url = "mongodb+srv://... see config.json (imported file)";
*/
MongoClient.connect(url, { useNewUrlParser: true }, (err, db) => {
  dbo = db.db("alibay"); //
});

let generateId = () => {
  return "" + Math.floor(Math.random() * 100000000);
};

// Your endpoints go after this line

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

app.post("/become-seller", upload.none(), async (req, res) => {
  let name = req.body.username;
  dbo
    .collection("users")
    .updateOne({ username: name }, { $set: { sellerStatus: true } });

  console.log("db updated");
  return res.send(JSON.stringify({ success: true }));
});

app.post(
  "/new-design",
  upload.fields([
    { name: "image", maxCount: 1 },
    { name: "instructions", maxCount: 1 }
  ]),
  async (req, res) => {
    console.log("writing new-design to db");
    let imgFile = req.files.image;
    let instrFile = req.files.instructions && req.files.instructions; // defined only if exists
    let imgFrontendPath = "/uploads/" + imgFile[0].filename;
    let instrFrontendPath = instrFile
      ? "/uploads/" + instrFile[0].filename
      : "";

    let instrFileType = instrFile ? instrFile[0].mimetype : ""; // not needed here, but good to know in case
    console.log("up to HEREEEE now");
    dbo.collection("designs").insertOne({
      username: req.body.username,
      description: req.body.description,
      imgFrontendPath: imgFrontendPath,
      instrFrontendPath: instrFrontendPath,
      designParts: JSON.parse(req.body.designParts),
      theme: req.body.theme,
      size: req.body.size,
      unitPrice: req.body.unitPrice,
      completed: true
    });

    console.log("db updated");
    return res.send(JSON.stringify({ success: true }));
  }
);
app.post(
  "/edit-design",
  upload.fields([
    { name: "image", maxCount: 1 },
    { name: "instructions", maxCount: 1 }
  ]),

  async (req, res) => {
    console.log("writing new-design to db");
    console.log(req.body);
    let imgFrontendPath = "";
    let instrFrontendPath = "";
    if (req.files.image) {
      // if a new file has been uploaded
      let imgFile = req.files.image;
      imgFrontendPath = "/uploads/" + imgFile[0].filename;
    } else {
      imgFrontendPath = req.body.formerImgFrontendPath;
      console.log("imgFrontendPath is ", imgFrontendPath);
    }
    console.log("imgFrontendPath is ", imgFrontendPath);
    //
    if (req.files.instructions) {
      // if a new file has been uploaded
      let instrFile = req.files.instructions;
      instrFrontendPath = "/uploads/" + instrFile[0].filename;
    } else {
      instrFrontendPath = req.body.formerInstrFrontendPath;
    }
    //let instrFileType = instrFile ? instrFile[0].mimetype : ""; // not needed here, but good to know in case
    dbo.collection("designs").updateOne(
      { _id: ObjectID(req.body._id) },
      {
        $set: {
          username: req.body.username,
          description: req.body.description,
          theme: req.body.theme,
          size: req.body.size,
          unitPrice: req.body.unitPrice,
          completed: true,
          imgFrontendPath: imgFrontendPath,
          instrFrontendPath: instrFrontendPath,
          designParts: JSON.parse(req.body.designParts)
        }
      }
    );
    console.log("db updated");
    return res.send(JSON.stringify({ success: true }));
  }
);

app.post("/delete-design", upload.none(), async (req, res) => {
  console.log("deleting design on db");
  console.log(req.body);

  dbo.collection("designs").remove({ _id: ObjectID(req.body._id) });
  console.log("db updated for delete");
  return res.send(JSON.stringify({ success: true }));
});

app.get("/all-items", async (req, res) => {
  console.log("request to /all-items");
  dbo
    .collection("itemsForSale")
    .find({})
    .toArray((err, item) => {
      if (err) {
        console.log("error", err);
        return res.send(JSON.stringify({ success: false }));
      }
      res.send(JSON.stringify(item));
    });
});

app.get("/all-designs", async (req, res) => {
  console.log("request to /all-designs");
  dbo
    .collection("designs")
    .find({})
    .toArray((err, design) => {
      if (err) {
        console.log("error", err);
        return res.send(JSON.stringify({ success: false }));
      }
      res.send(JSON.stringify(design));
    });
});

app.post("/new-part", upload.none(), async (req, res) => {
  console.log("writing new-part to db");
  dbo.collection("itemsForSale").insertOne({
    dimensions: req.body.dimensions,
    depth: req.body.depth,
    color: req.body.color,
    inStock: 10000,
    unitPrice: req.body.unitPrice,
    seller: "house",
    imgPath: req.body.imgPath,
    includesPlan: "false",
    type: req.body.type
  });

  console.log("db updated");
  return res.send(JSON.stringify({ success: true }));
});

// Your endpoints go before this line

app.all("/*", (req, res, next) => {
  // needed for react router
  res.sendFile(__dirname + "/build/index.html");
});

app.listen(4000, "0.0.0.0", () => {
  console.log("Server running on port 4000");
});
