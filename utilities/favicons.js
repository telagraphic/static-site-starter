const fs = require('fs');
const posthtml = require('posthtml');
const favIconPlugin = require("posthtml-favicons");
const html = fs.readFileSync('html/templates/components/head.html');

posthtml()
    .use(favIconPlugin({ outDir: "./dist/img/favicons", configuration: { path: "img/favicons" } }))
    .process(html)
    .then((res) => {
        fs.writeFileSync('html/pages/index.html', res.html);
    });
