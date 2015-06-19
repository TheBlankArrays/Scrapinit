module.exports = function(grunt) {

  grunt.initConfig({
    pkg: grunt.file.readJSON('./server/package.json'),
    concat: {
        options: {
          separator: ';'
        },
        dist: {
           src: ['./server/*.js'],
           dest: './server/dist/<%= pkg.name %>.js'
       }
      },
    jshint: {
      files: [
        'server/*',
        'client/app/*',
        'client/specs/*.js',
        'server/*.js'

      ]
    },

    nodemon: {
        dev: {
          script: 'server.js'
        }
      },

    install: {
        tasks: [
          'concat'
        ]
      },
    serve: {
      tasks: [ 
      'shell:enterServer'
      ]
    },

    shell: {
      npmInstall: {
      command: 'cd server; npm install; cd ..; cd client; npm install; bower install; cd .. ',

      options: {
            stdout: true,
            stderr: true
        }
      },
      enterServer: {
        command: 'cd server; nodemon server.js'
      },
    }
    });


  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-nodemon');
  grunt.loadNpmTasks('grunt-shell');

  grunt.registerTask('install', [
    'concat', 'shell:npmInstall']);
    grunt.registerTask('serve', ['shell:enterServer']);
}




