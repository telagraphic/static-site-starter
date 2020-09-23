## PostCSS
CSS structure inspired by [CSS IRL](https://css-irl.info/a-modern-front-end-workflow-part-3/).
Atom plugins to make **precss** syntax play nice with Atom since you'll be SASS language features but without .scss files.

- [PostCSS Language Support](https://atom.io/packages/language-postcss)
- [Declaration Sorting](https://atom.io/packages/postcss-sorting)

### Plugins
[PostCSS](https://github.com/postcss/postcss) repo contains many more options!

- [Configure PostCSS from Package.json](https://github.com/michael-ciniawsky/postcss-load-config)
- [Imports](https://github.com/postcss/postcss-import)
- [SASS Features](https://github.com/jonathantneal/precss)
- [Modern Features](https://github.com/csstools/postcss-preset-env)
- [Linting](https://github.com/stylelint/stylelint)
- [Autoprefixir](https://github.com/postcss/autoprefixer)
- [Remove Unused CSS](https://purgecss.com/plugins/postcss.html#installation)
- [Minify](https://github.com/cssnano/cssnano)
- [Critical CSS](https://github.com/addyosmani/critical)


## TL;DR

Setup a simple and basic 'static site generator' with postCSS plugins that covers creating your own SASS pre-processor, importing files, linting and autoprefixer for development.
Build steps for removing unused css, minifying and then inlining critical css for above the fold to boost page load performance.
Plus some other cool postcss plugins.

### About

In my my last post, I covered how to set up a simple static generator with posthtml.  This post will cover the postcss implementation.
I'll only cover setting up the css parts but check out [static site starter repo](https://github.com/telagraphic/static-site-starter) to see how both posthtml and postcss
are combined together.

PostCSS takes in CSS, turns it into an Abstract Syntax Tree which parses each rule and provides access to each property and value allowing you to analyze and perform transforms.
This is how Autoprefixer works.  It reads each property and provides cross-browser vendor prefixes based on [Can I Use](https://caniuse.com/).
You can write your core css styles and not have to worry about covering every possible browser quirk.  It's called making development life better.

But you can also replace SASS language features and do tons more amazing things.  Let's get started.


### Motivation

There are lot of good articles showing how to use postcss plugins to recreate the features of SASS with sample code of the css.
There wasn't the corresponding javascript and connecting glue code that is required to make it work in a project.
I wanted to build from scratch, the installation process, setting up the project structure, configuring the package.json with dev and build workflows so that
you can see how it comes together.  This article will provide the steps to go from nothing to a working minimal static site workflow.

Check out the repo here to follow along or just follow the instructions that follow to build it up on your own.

### Setup

Just like the last post, all of our scripting will be using NPM to run our dev and build processes.
But first, let's figure out our CSS structure.  There are many options and approaches, so please modify to your way of thinking.


- css
  - styles
    - base
      - defaults.css
      - normalize.css
      - typography.css
    - components
      - components.css
    - config
      - functions.css
      - mixins.css
      - variables.css
    - globals
      - globals.css
    - objects
      - object.css
    - pages
      - page.css
    - utilities
      - utility.css
  - styles.css
  - imports.css


I've noticed that postcss performs better when using a postcss.config.js file versus the configuration loading pattern within the package.json.
I will be using postcss plugins to do all of the pre/post-processing.  No SASS at all, which is why you don't see an .scss filenames.

Let's install those now.

```
npm i -D postcss postcss-cli postcss-import postcss-preset-env precss purgecss stylelint critical stylelint-config-rational-order stylelint-config-standard cssnano autoprefixer browser-sync npm-run-all onchange
```

### Atom Editor

When you start writing postcss in atom editor, you will not be using .scss filenames and the (language-postcss)[https://atom.io/packages/language-postcss]
will provide syntax highlighting.  Super helpful.

### Imports

A slighty tricky first step is importing our css files.  Without SASS imports we will use [postcss-import](https://github.com/postcss/postcss-import)
which requires us to write some javascript code to process the imports but it is very straightforward.


css/styles/imports.css

```
@import 'config/functions.css';
@import 'config/mixins.css';
@import 'config/variables.css';

@import 'base/normalize.css';
@import 'base/typography.css';
@import 'base/defaults.css';

@import 'components/component.css';
@import 'globals/global.css';
@import 'pages/page.css';
@import 'objects/object.css';
@import 'utilities/utility.css';
```

You'll notice there is a scripts folder in the css directory, which contains the following imports.js code.

```
var fs = require("fs")
var postcss = require("postcss")
var atImport = require("postcss-import")

// css to be processed
var css = fs.readFileSync("css/styles/imports.css", "utf8")

// process css
postcss()
  .use(atImport())
  .process(css, {
    from: "css/styles/imports.css",
    to: "css/styles.css"
  })
  .then(function (result) {
    fs.writeFile('css/styles.css', result.css, (err) => {
      if (err) throw err;
    });
  })
```

To run this, add the below code to to ur package.json:

```
"styles:import": "node css/scripts/imports.js"
```

This will concatenate all the css files in the imports.css file and output to the final style.css.

### SASS Like Pre-Processor
We can duplicate the powers of SASS with [precss](https://github.com/jonathantneal/precss), a package that allows for nesting, variables, mixins and more.
This package has not been updated for about 2 years and the issues board has many open tickets that have not been resolved.
If you go down to the bottom of the github page, you'll see a list of the plugins used that we can install.
We'll add each plugin one at a time but first let's install them all at once.

```
npm i -D postcss-nested postcss-mixins postcss-preset-env stylelint stylelint-config-standard stylelint-config-rational-order autoprefixer
```

And update our css/scripts/postcss.config.js

```
module.exports = {
  plugins: [
    require('postcss-nested')({}),
    require('postcss-mixins')({}),
    require('postcss-preset-env')({}),
    require('stylelint')({fix: true}),
    require('autoprefixer')({})
  ]
}
```

Simply add the plugin to the postcss.config.js file and postcss will process the plugins in the order you add them.
Now lets add our postcss command:

```
"styles:process": "postcss css/styles.css -o css/styles.css --config css/scripts/postcss.config.js",
```

We'll be processing the style.css we created with our import script above.  We pass it right into postcss and use --config to tell it which plugins to run.

#### Nesting

It's a best practice to avoid nesting above 3 levels.

css/styles/pages/page.css

```
.page {
  display: flex;
  background-color: salmon;
  color: pink;

  h1 {
    color: red;
  }
}

```
becomes this in css/styles.css

```
.page {
  display: flex;
  background-color: salmon;
  color: pink;
}

.page h1 {
    color: red;
  }

```

#### Mixins

[postcss-mixins](https://github.com/postcss/postcss-mixins) is actively maintained and gives us SASS-like mixins.
I define the mixins in the mixins.css file and they can be used in other css files.

Just make the mixins.css is imported before other files that use them!

You can use @mixin-content to pass in rules that can be wrapped by a media query, just like SASS.

css/styles/config/mixins.css
```
@define-mixin transition $property: all, $time: 150ms, $easing: ease-out {
  transition: $(property) $(time) $(easing);
}

@define-mixin viewport-min {
  @media (min-width: 40rem) {
    @mixin-content;
  }
}

```

Now becomes:

```
body {
  @mixin transition color, 2s, ease-in;
}

header {
  @mixin viewport-min {
    background-color: red;
  }
}

.page {
  display: flex;
  background-color: salmon;
  color: pink;

  h1 {
    color: red;
  }
}

```


#### Future Features

[postcss-preset-env](https://github.com/csstools/postcss-preset-env) contains a bunch of features for using modern css into current code that browsers
can use.  Here is a list of what is [supports](https://preset-env.cssdb.org/features#custom-properties).

It's great for using custom properties which is something that SASS has problems with.

```
:root {
  --font-size: 2.45rem;
}

header {
  font-size: var(--font-size);
}
```

#### Linting

[Stylelint](https://github.com/stylelint/stylelint) will lint our CSS and make fixes to our new output CSS.
I'll be adding [stylelint-config-standard](https://github.com/stylelint/stylelint-config-standard) and [stylelint-config-rational-order](https://github.com/constverum/stylelint-config-rational-order) which will group properties by:

- Positioning
- Box Model
- Typography
- Visual
- Animation
- Misc

You could also use the atom package [postcss-sorting](https://github.com/lysyi3m/atom-postcss-sorting) to resort on save.
I already write my styles according to the above template, but this could help those who don't know where properties belong.

You'll need to add stylelint block to package.json in order to work.

```
"stylelint": {
  "extends": [
    "stylelint-config-standard",
    "stylelint-config-rational-order"
  ]
},
```

#### Autoprefixer

And the most important plugin of all, Autoprefixer will add vendor prefixes to your CSS to make it compatible across browsers.
This allows us the ability to write our core css without having to lookup all the quirks and arcane patches for certain browsers.
This is added the end of the plugin list and you will need to use a [Browserlist](https://github.com/browserslist/browserslist) configuration to work.

We can add this to our package.json:
```
"browserslist": [
  "last 2 versions"
],
```

Now our CSS will contain prefixes for flexbox and other properties:

```
.page {
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  background-color: salmon;
  color: pink;
}
```


## Build Process

We have a good development workflow going and now it's time to publish our site.  There are many modifications and performance tweaks
we can apply.

- removed unused css
- minify css
- inline above the fold critical css

We'll add build setup step that removes old files and creates a new one for each build run.
It's also a good idea to re-run our css through the postcss commands to make sure they have compiled correctly.

```
"build:clean": "rm -rf dist",
"build:dist": "mkdir -p dist/{css,js,img,fonts/web}",
"build:styles-compile": "run-s styles:import styles:process",
```


### Remove Unused CSS


[PurgeCSS]() will remove unused css.

```
"build:styles-unused": "purgecss -css css/styles.css --content html/pages/*.html --output css/styles.clean.css",
```

This will remove the .page__blockqoute rule from the final style.css.  

### Minification

[CSSNano]() will minify our css, removing whitespace which saves space and cut's file size down.
This will be saved to the /dist/css folder.

```
"build:styles-minify": "postcss css/styles.clean.css > dist/css/styles.css --use cssnano"
```

### Inline Critical CSS

Our CSS is almost ready.  We will use critical which will inline above the fold styles
directly intot the head of our index.html.  This will improve our page speed when users visit our site.
You could apply this to other pages too if need be.

```
"build:styles-critical": "node css/scripts/critical.js",
```

Critical applies this strange syntax for our css.

```
<link rel="stylesheet" href="css/styles.css" media="print" onload="this.media='all'">
```

This will [asynchronsouly load](https://www.filamentgroup.com/lab/load-css-simpler/) the CSS increasing page render performance.

## All Done

That's it.

Check out the [static-site-starer]() which combines the dev and build processes from the [posthtml-starter]() with the postcss setup above.
Overall, the benefits of having a streamlined development workflow makes building things easier.
And just as important pushing a performant and lean site to users is
