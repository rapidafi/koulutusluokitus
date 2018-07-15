'use strict';

module.exports = function (grunt) {

  require('load-grunt-tasks')(grunt);
  require('time-grunt')(grunt);

  grunt.loadNpmTasks('grunt-google-fonts');
  grunt.loadNpmTasks('grunt-contrib-watch');

  var srcDir = 'src';
  var distDir = 'dist';

  grunt.initConfig({
    clean: {
      files: distDir,
      options: {
        force: true
      }
    },
    useminPrepare: {
      html: [
        srcDir+'/index.html'
      ],
      options: {
        dest: distDir,
        flow: {
          steps: {
            'css': ['concat','cssmin'],
            'js': ['concat','uglify']
          },
          post: {}
        }
      }
    },
    usemin: {
      html: [
        distDir+'/index.html'
      ]
    },
    copy: {
      main: {
        files: [
          //html:
          {
            expand: true,
            cwd: srcDir,
            src: [
              './*.html'
            ],
            dest: distDir,
            options : {
              noProcess: '**/*.{png,gif,jpg,ico,svg,eot,ttf,woff,woff2}',
              process: function (content) {
                return content.replace(/<!-- dev -->.*<!-- enddev -->/g, '')
                  .replace(/<!-- mustache /g, '')
                  .replace(/ end mustache -->/g, '');
              }
            }
          },
          //js:
          {
            expand: true,
            cwd: srcDir,
            src: [
              'js/*.js'
            ],
            dest: distDir
          },
          //css:
          {
            expand: true,
            cwd: srcDir,
            src: [
              'css/*.css'
            ],
            dest: distDir
          },
          //bootstrapfonts:
          {
            expand: true,
            cwd: 'node_modules/bootstrap-css-only',
            src: [
              './fonts/**'
            ],
            dest: distDir+'/'
          },
          //fontawesomefonts:
          {
            expand: true,
            cwd: 'node_modules/font-awesome',
            src: [
              './fonts/**'
            ],
            dest: distDir+'/'
          }
        ]
      },
      develop: {
        expand: true,
        cwd: srcDir,
        src: [
          'koulutusluokitus.json'
        ],
        dest: distDir
      }
    },
    googlefonts: {
      dest: {
        options: {
          fontPath: distDir+'/fonts/',
          httpPath: '../fonts/',
          cssFile: distDir+'/css/fonts.css',
          fonts: [
            {
              family: 'Open Sans',
              styles: [
                400, 700
              ]
            }
          ]
        }
      }
    },
    watch: {
      scripts: {
        files: ['**/*.js','**/*.css','**/*.html'],
        tasks: ['copy'],
        options: {
          spawn: false,
        },
      },
    },
  });

  grunt.registerTask('default', [
    'clean',
    'build'
  ]);

  grunt.registerTask('build', [
    'useminPrepare',
    'concat',
    'uglify',
    'cssmin',
    'copy:main',
    'googlefonts',
    'usemin'
  ]);

  grunt.registerTask('dev', [
    'build',
    'copy:develop'
  ]);
};
