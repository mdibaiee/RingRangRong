module.exports = function(grunt) {
  require('grunt-task-loader')(grunt);

  grunt.initConfig({
    less: {
      build: {
        files: {
          'app/css/main.css': 'app/css/main.less'
        }
      }
    },
    concat: {
      main: {
        files: {
          '.tmp/main.js': [
            'app/js/media.js',
            'app/js/main.js',
            'app/js/audio.js',
            'app/js/timelapse.js',
            'app/js/wave.js'
          ]
        }
      }
    },
    babel: {
      options: {
        sourceMap: true,
        modules: 'ignore'
      },
      js: {
        files: {
          'app/js/build.js': '.tmp/main.js',
        }
      },
      views: {
        files: {
          'app/js/views.js': '.tmp/views.js'
        }
      }
    },
    clean: ['.tmp/*'],
    react: {
      build: {
        files: {
          '.tmp/views.js': 'app/views/**/*.jsx'
        }
      }
    },
    watch: {
      less: {
        files: ['app/css/**/*.less'],
        tasks: ['less']
      },
      js: {
        files: ['app/js/audio.js', 'app/js/main.js', 
                'app/js/wave.js', 'app/js/media.js',
                'app/js/timelapse.js'],
        tasks: ['concat', 'babel:js', 'clean']
      },
      react: {
        files: ['app/views/**/*.jsx'],
        tasks: ['react', 'babel:views', 'clean']
      }
    }
  });

  grunt.registerTask('default', ['less', 'concat', 'react', 'babel', 'clean', 'watch']);
};