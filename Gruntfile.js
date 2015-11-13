/*global module:false*/
module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    // Metadata.
    pkg: grunt.file.readJSON('package.json'),
    // Task configuration.

  });

  // These plugins provide necessary tasks.
  [
    'grunt-contrib-clean',
    'grunt-contrib-uglify',
    'grunt-contrib-jshint',
    'grunt-contrib-copy',
    'grunt-contrib-cssmin',
    'grunt-contrib-watch',
    'grunt-contrib-concat'
  ].forEach(function(ele) {
    grunt.loadNpmTasks(ele);
  });

  // Default task.
  grunt.registerTask('default', ['clean', 'copy', 'cssmin']);

};
