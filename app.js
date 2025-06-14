const express = require("express");
const app = express();
const fs = require("fs");
const path = require("path");

app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", function (req, res) {
  fs.readdir(`./hisaab`, function (err, files) {
    if (err) return res.status(500).send("Something went wrong");
    res.render("index", { files: files });
  });
});
// app.get("/create", function (req, res) {
//   const currentDate = new Date();
//   const day = String(currentDate.getDate()).padStart(2, "0");
//   const month = String(currentDate.getMonth() + 1).padStart(2, "0");
//   const year = currentDate.getFullYear();
//   const fn = `${day}-${month}-${year}.txt`;

//   // fs.writeFile(`./files/${fn}`,"hey hello",function(err){
//   //     if(err) throw err;
//   //     console.log("File created!");
//   // })

//   res.render("create");
// });

// create
app.get("/create", function (req, res) {
  res.render("create");
});

app.post("/createhisaab", (req, res) => {
  var currentDate = new Date();
  var date = `${currentDate.getDate()}-${
    currentDate.getMonth() + 1
  }-${currentDate.getFullYear()}`;
  var time = `${currentDate.getHours()}-${currentDate.getMinutes()}-${currentDate.getSeconds()}`;
  var filename = `${date} ${time}.txt`;
  fs.writeFile(`./hisaab/${filename}`, `${req.body.content}`, (err) => {
    if (err) res.status(500).send(err);
    else res.redirect("/");
  });
});
// edit
app.get("/edit", function (req, res) {
  res.render("edit", { fileData: "", filename: "" });
});
app.get("/edit/:filename", function (req, res) {
  fs.readFile(
    `./hisaab/${req.params.filename}`,
    "utf-8",
    function (err, fileData) {
      if (err) return res.status(500).send("something went wrong !");
      else {
        res.render("edit", { fileData, filename: req.params.filename });
      }
    }
  );
});
// update
app.post("/update/:filename", function (req, res) {
  fs.writeFile(
    `./hisaab/${req.params.filename}`,
    req.body.content,
    function (err) {
      if (err) return res.status(500).send("something went wrong!");
      res.redirect("/");
    }
  );
});
// read
app.get("/hisaab", function (req, res) {
  res.render("hisaab", { fileData: "", filename: "" });
});
app.get("/hisaab/:filename", function (req, res) {
  fs.readFile(
    `./hisaab/${req.params.filename}`,
    "utf-8",
    function (err, fileData) {
      let arr = fileData.split(/[\s,;|]+/).filter(Boolean);
      fileData = arr;
      if (err) return res.status(500).send("something went wrong!");
      else res.render("hisaab", { fileData, filename: req.params.filename });
    }
  );
});
// delete
app.get("/delete/:filename", function (req, res) {
  fs.unlink(`./hisaab/${req.params.filename}`, function (err) {
    if (err) return res.status(500).send("something went wrong!");
    res.redirect("/");
  });
});

app.listen(3000, () => {
  console.log("server is Running on ----> http://localhost:3000/");
});
