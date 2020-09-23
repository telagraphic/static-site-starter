mkdir -p {css,html,js,img,fonts}
cd css && mkdir {styles,scripts}
cd scripts && touch imports.js critical.js postcss.config.js && cd ..
cd styles && mkdir {base,config,objects,globals,components,utilities,pages}
touch imports.css
cd base && touch defaults.css normalize.css typography.css && cd ..
cd components && touch component.css && cd ..
cd config && touch mixins.css functions.css variables.css && cd ..
cd globals && touch global.css && cd ..
cd objects && touch object.css && cd ..
cd pages && touch page.css && cd ..
cd utilities && touch utility.css && cd ..


cd ../..

cd js && touch scripts.js && echo "console.log('scripts.js is working');" > scripts.js && cd ..
cd html && mkdir -p {pages,templates}
cd templates && mkdir -p {views,components}
cd views && touch index.html

cd ../../..

pwd

touch README.md

npm init -y
npm i -D posthtml posthtml-cli posthtml-load-config html-minifier posthtml-modules posthtml-w3c posthtml-hint posthtml-classes posthtml-bem posthtml-favicons postcss postcss-cli postcss-import postcss-preset-env purgecss critical stylelint stylelint-config-rational-order stylelint-config-standard cssnano autoprefixer browser-sync npm-run-all onchange

git init
touch .gitignore
echo "node_modules/" > .gitignore
echo "**/.DS_Store" > .gitignore
