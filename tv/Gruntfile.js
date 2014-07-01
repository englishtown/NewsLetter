module.exports = function(grunt) {

    grunt.initConfig({
        pkg: '<json:package.json>',
        
        less: {
          development: {
            options: {
              paths: ["css"]
            },
            files: {
              "css/main.css": "css/main.less"
            }
          }
        },

        concat: {
          options: {
            separator: ';'
          },
          dist: {
            src: [
            'js/jquery-2.1.1.min.js',
            'js/chart.min.js',
            'js/moment.min.js',
            'js/main.js'
            ],
            dest: 'js/site.js'
          }
        },

        uglify: {
          options: {
            banner: '/*! <%= grunt.template.today("dd-mm-yyyy") %> */\n'
          },
          dist: {
            files: {
              'js/site.min.js': ['<%= concat.dist.dest %>']
            }
          }
        }
    });

  grunt.loadNpmTasks("grunt-contrib-less");
  grunt.loadNpmTasks("grunt-contrib-uglify");
  grunt.loadNpmTasks("grunt-contrib-concat");

  grunt.registerTask('default', ['less', 'concat', 'uglify']);

};
