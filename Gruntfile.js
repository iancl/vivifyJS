module.exports = function(grunt){

	require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);

	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		jshint: {
			options: {
				reporter: require('jshint-stylish')
			},
			build: ['Gruntfile.js', 'src/**/*.js']
		},
		uglify: {
			options:{
				banner: '//smskip:validation\n/*\n * <%= pkg.name %>\n * version: <%= pkg.version %>\n * build date: <%= grunt.template.today("yyyy-mm-dd") %>\n * PLEASE MAKE SURE YOU IMPORT THIS FILE AT THE END OF THE BODY\n */\n'
			},
			build: {
				files: {
					'dist/js/vivify.min.js': 'src/js/vivify.js'
				}
			}
		},
		watch: {
			scripts: {
				files: ['src/**/*.js', 'examples/**/*.html'],
				tasks: ['jshint', 'uglify'],
				hostname: "localhost",
				options: {
					livereload: true
				}
			},
		},
		connect: {
			all: {
				options: {
					port: 9001,
					hostname: "0.0.0.0",
					keepalive: true,
					livereload: true
				}
			}
		},
		open: {
			all: {
				path: 'http://localhost:9001/examples/'
			}
		},
		jasmine: {
			test:{
				src: 'src/**/*.js',
				options: {
					specs: 'specs/**/*.js',
					display: "full",
					summary: true
				}
			}
		}
	});

  	grunt.registerTask('serve', ['connect']);
  	grunt.registerTask('default', ['open','watch']);
};