var generator = require('yeoman-generator');
var chalk = require('chalk');
var yosay = require('yosay');
var glob = require('glob');
require('shelljs/global');

var info = chalk.white;

module.exports = generator.Base.extend({
  prompting: {
    method1: function () {
      var done = this.async();
      var that = this;
      that.properties = {}
      console.log('method 1 just ran' + this.name);
      console.log('What is the project name?');
      var result = this.prompt({
        type: 'input',
        name: 'projectName',
        message: 'What up with thee?',
        default: 'blab'
      }, function(answers) {
        console.log('thanks, going with: ', answers);
        this.properties.projectName = answers.projectName;
        this.properties.packageName = answers.projectName.replace(' ', '_');
        done();
      }.bind(this));
    }
  },

  writing: {

    cleanexistingproject: function() {
      var done = this.async();
      this.log(info('Cleaning existing instances of project'));
      var spawn = this.spawnCommand('rm', ['-rf', 'javastarter']);
      spawn.on('close', function() {
        done();
      }.bind(this));
    },

    clonerepo: function() {
      var done = this.async();
      this.log(info('Cloning the starter project'));
      var clone = this.spawnCommand('git', ['clone',
        'git@github.com:BridgePhase/javastarter.git']);
      clone.on('close', function() {
        done();
      }.bind(this));
    },

    buildupCorrectiveActions: function() {
      this.properties.toRename = [];
      var toRename = this.properties.toRename;
      this.log(info('Computing changes needed for your project'));
      var files = glob.sync('javastarter/src/**/');
      for (var i = 0; i < files.length; i++) {
        var name = files[i];
        if (name.indexOf('foo') > 0) {
          var found = false;
          for (var j = 0; !found && j < toRename.length; j++) {
            if (name.indexOf(toRename[j].oldDirectory) == 0) {
              found = true;
            }
          }
          if (!found) {
            toRename.push({
              oldDirectory: name,
              newDirectory: name.replace('foo', this.properties.packageName)
            });
          }
        }
      }
    },

    removefiles: function() {
      var done = this.async();
      var toRename = this.properties.toRename;
      this.log(info('Updating directories to your project name'));
      for (var i = 0; i < toRename.length; i++) {
        this.log("- Renaming " + chalk.cyan(toRename[i].oldDirectory) +
        " to " + chalk.green(toRename[i].newDirectory));
        this.spawnCommand('mv', [toRename[i].oldDirectory, toRename[i].newDirectory]);
      }
      done();
    },

    updateGradle: function() {
      sed('-i', /'Bridgephase MVC Starter'/,
        '\'' + this.properties.projectName + '\'',
        'javastarter/build.gradle');
      sed('-i', /'BridgePhaseMVC'/,
        '\'' + this.properties.packageName + '\'',
        'javastarter/build.gradle');
      var toRename = this.properties.toRename;
      for (var i = 0; i < toRename.length; i++) {
        var files = glob.sync(toRename[i].newDirectory + '/**', {nodir:true});
        for (var j = 0; j < files.length; j++) {
          sed('-i', /com\.bridgephase\.foo/g,
            'com.bridgephase.' + this.properties.packageName,
            files[j]);
        }
      }
    }
  }
});
