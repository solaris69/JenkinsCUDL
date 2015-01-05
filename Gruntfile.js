module.exports = function(grunt) {

    // load dependencies
//    require('load-grunt-tasks')(grunt);
//    'use strict';

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    //buildIndex: grunt.file.readJSON('build.json'),
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
          /*
            name: "<%=pkg.name %>"
            ,version: "<%= pkg.version %>.<%= buildIndex.build %>"
            ,release: "<%= meta.revision %>"
            //,release: "1234"
            ,buildArch: "x86_64"


           ,preInstallScript: [
           'if [ ! -d "/compass/integration/app/<%=pkg.name %>" ]; then echo "/compass/integration/app/<%=pkg.name %> not exist. Create new one"; sudo mkdir -p /compass/integration/app/<%=pkg.name %>; fi'
           ,'logger -s Backup previous version of <%=pkg.name %>'
           , 'if [ -d "/compass/integration/app/<%=pkg.name %>.previous" ]; then echo "Remove previous version /compass/integration/app/<%=pkg.name %>.previous"; sudo rm -r /compass/integration/app/<%=pkg.name %>.previous; cp -pr /compass/integration/app/<%=pkg.name %> /compass/integration/app/<%=pkg.name %>.previous; fi'
           , 'sudo rm -r /compass/integration/app/<%=pkg.name %>'
           ]

           ,postInstallScript: [
           'logger -s link deployed version to release directory'
           ,'sudo ln -sf /compass/integration/app/<%=pkg.name %>-<%= pkg.version %>.<%= buildIndex.build %> /compass/integration/app/<%=pkg.name %>'
           ]
            */

            // Below is for Kettle binary to rpm
            name: "<%=pkg.pentahoName %>"
            ,version: "<%=pkg.pentahoVersion %>"
            ,release: "<%=pkg.pentahoRelease %>"
            ,buildArch: "x86_64"


            ,preInstallScript: [
                'logger -s Backup previous version of <%=pkg.pentahoName %>'
                , 'if [ -d "/compass/integration/app/<%=pkg.pentahoName %>.previous" ]; then echo "Remove previous version /compass/integration/app/<%=pkg.pentahoName %>.previous"; sudo rm -r /compass/integration/app/<%=pkg.name %>.previous; cp -pr /compass/integration/app/<%=pkg.name %> /compass/integration/app/<%=pkg.name %>.previous; fi'
                , 'if [ -d "/compass/integration/app/pentaho" ]; then sudo rm -r /compass/integration/app/pentaho; fi'
            ]

            ,postInstallScript: [
                'logger -s link deployed version to release directory'
                ,'sudo ln -sf /compass/integration/app/<%=pkg.pentahoName %>-<%=pkg.pentahoVersion %>.<%=pkg.pentahoRelease %> /compass/integration/app/pentaho'
            ]
        },
        release: {
            files: [
//                { cwd: '<%= distrib.root%>/', src: "**", dest: "/compass/integration/app/<%=pkg.name %>-<%= pkg.version %>.<%= buildIndex.build %>"}
                { cwd: 'Kettle/', src: "**", dest: "/compass/integration/app/<%=pkg.pentahoName %>-<%=pkg.pentahoVersion %>.<%=pkg.pentahoRelease %>"}
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
    // DONT'T forget to comment build.json. this pentaho.rpm doesn't need it.
//  grunt.registerTask("build-rpm", ['clean:distrib', 'copy:all', 'easy_rpm']); // offline test. No git repo
};