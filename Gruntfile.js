module.exports = function(grunt) {

    // load dependencies
//    require('load-grunt-tasks')(grunt);
//    'use strict';

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    buildIndex: grunt.file.readJSON('build.json'),
    banner: '/* <%= pkg.title || pkg.name %> -v <%= pkg.version %>*/  \n ',

    distrib: {
        root: 'distrib'
    }
    
    ,copy: {
        build: {
            cwd: '.',
            src: [ 'api/**', 'api-docs/**', 'assets/**', 'config/**', 'lib/**', 'swagger/**', 'tasks/**', 'views/**', '*.js', '*.json', '!Gruntfile.js'],
            dest: '<%= distrib.root%>',
            expand: true
        },
        all: {
            cwd: '.',
            src: ['config/**', 'transformations/**'],
            dest: '<%= distrib.root%>',
            expand: true
        }
    }
    //location of GIT HEAD
    ,revision: {
        options: {
            property: 'meta.revision',
            ref: 'HEAD',
            short: true
        }
    }
    //revision ends
    ,easy_rpm: {
        options: {
            //   summary: 'Creating rpm packages!',
            name: "<%=pkg.name %>"
            ,version: "<%= pkg.version %>.<%= buildIndex.build %>"
            ,release: "<%= meta.revision %>"
            //,release: "1234"
            ,buildArch: "x86_64"

            /*
            // Below is for Kettle binary to rpm
            name: "Kettle-data-integration"
            ,version: " 5.1.0.0"
            ,release: "752"
            ,buildArch: "x86_64"
*/

            ,preInstallScript: [
                'if [ ! -d "/compass/integration/app/<%=pkg.name %>" ]; then echo "/compass/integration/app/<%=pkg.name %> not exist. Create new one"; sudo mkdir -p /compass/integration/app/<%=pkg.name %>; fi'
                ,'logger -s Backup previous version of <%=pkg.name %>'
                , 'if [ -d "/compass/integration/app/<%=pkg.name %>.previous" ]; then echo "Remove previous version /compass/integration/app/<%=pkg.name %>.previous"; sudo rm -r /compass/integration/app/<%=pkg.name %>.previous; cp -pr /compass/integration/app/<%=pkg.name %> /compass/integration/app/<%=pkg.name %>.previous; fi'
                , 'sudo rm -r /compass/integration/app/<%=pkg.name %>'
//                'logger -s Stopping forever-crab-api service',
//                'sudo service forever-crab-api stop',
//                'if [ -L "/compass/permission/web/crab-api" ]; then echo "/compass/permission/web/crab-api exist"; sudo rm /compass/permission/web/crab-api.previous; cp -pr /compass/permission/web/crab-api  /compass/permission/web/crab-api.previous; sudo rm  /compass/permission/web/crab-api; else echo "/compass/permission/web/crab-api not exist"; fi'
            ]

            ,postInstallScript: [
                'logger -s link deployed version to release directory'
//                ,'sudo ln -sf /compass/integration/app/<%=pkg.name %>-<%= pkg.version %>.<%= buildIndex.build %>-<%= meta.revision %>/distrib /compass/integration/app/<%=pkg.name %>'
////                ,'sudo ln -sf /compass/integration/app/<%=pkg.name %>-<%= pkg.version %>.<%= buildIndex.build %>/distrib /compass/integration/app/<%=pkg.name %>'
                ,'sudo ln -sf /compass/integration/app/<%=pkg.name %>-<%= pkg.version %>.<%= buildIndex.build %> /compass/integration/app/<%=pkg.name %>'
//                'logger -s Starting forever-crab-api service',
//                'sudo service forever-crab-api start'
            ]
        },
        release: {
            files: [
                { cwd: '<%= distrib.root%>/', src: "**", dest: "/compass/integration/app/<%=pkg.name %>-<%= pkg.version %>.<%= buildIndex.build %>"}
//                { cwd: 'Kettle/', src: "**", dest: "/compass/integration/app/<%=pkg.name %>-<%= pkg.version %>.<%= buildIndex.build %>"}
            ]
        }
    }
        
    ,clean: {
          distrib: ['<%= distrib.root%>'],
          temp: ['.tmp', 'tmp*']
    }
    
  });

  // Load the Grunt plugins. Alternative solution if too many grunt plug-in is using require('load-grunt-tasks')
  grunt.loadNpmTasks('grunt-easy-rpm');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-git-revision');

  grunt.registerTask("build-rpm", ['clean:distrib', 'copy:all', 'revision', 'easy_rpm']); // task for rpm via git repo
  grunt.registerTask("pentaho-rpm", ['easy_rpm']); // place Kettle binary to the folder name "Kettle" then update field name,version, and release in options.
    // Remove pre/post installation script because Kettle doesn't need it. Finally, update dest field in files to be Kettle target directory.
//  grunt.registerTask("build-rpm", ['clean:distrib', 'copy:all', 'easy_rpm']); // offline test. No git repo
};