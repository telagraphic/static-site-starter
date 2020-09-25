const fs = require('fs');

let posthtml = require('posthtml'),
    config = {
        elemPrefix: '__',
        modPrefix: '_',
        modDlmtr: '--'
    };

const html = fs.readFileSync('html/templates/bem/index.html');

posthtml()
    .use(require('posthtml-bem')(config))
    .process(html)
    .then(function (result) {
        fs.writeFileSync('html/templates/views/index.html', result.html)
    });
