var fs = require("fs");
var postcss = require("postcss");
var atImport = require("postcss-import");

var css = fs.readFileSync("css/styles/imports.css", "utf8");

postcss()
  .use(atImport())
  .process(css, {
    from: "css/styles/imports.css",
    to: "css/styles.compiled.css"
  })
  .then(function (result) {
    fs.writeFileSync("css/styles.compiled.css", result.css);
  })
