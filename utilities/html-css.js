const fs = require('fs');
const posthtml = require('posthtml');
const config = {
        fileSave: true,
        filePath: 'css/index.css', // change css output name
        overwrite: true,
        eol: '\n',
        nested: true,
        curlbraces: true,
        elemPrefix: '__',
        modPrefix: '_',
        modDlmtr: '_'
    }

// target the file to parse
const html = fs.readFileSync('html/templates/views/index.html');


posthtml()
  .use(require('posthtml-classes')(config))
  .process(html);
