module.exports = {
  first: ['newer:jshint'],
  second:['newer:concat','newer:copy','newer:htmlmin'],
  third: ['newer:uglify','newer:sass'],
  //fourth: ['clean'],
};