module.exports = {
  plugins: [
    require('postcss-nested')({}),
    require('postcss-mixins')({}),
    require('postcss-preset-env')({}),
    require('stylelint')({fix: true}),
    require('autoprefixer')({})
  ]
}
