'use strict';
var path = require('path');
var util = require('util');
var dappUtils = require('../util.js');
var yeoman = require('yeoman-generator');

var Generator = module.exports = function Generator() {
  yeoman.generators.NamedBase.apply(this, arguments);
  this.sourceRoot(path.join(__dirname, '../templates'));

  if (typeof this.env.options.appPath === 'undefined') {
    try {
      this.env.options.appPath = require(path.join(process.cwd(), 'bower.json')).appPath;
    } catch (e) {}
    this.env.options.appPath = this.env.options.appPath || 'app';
  }
};

util.inherits(Generator, yeoman.generators.NamedBase);

Generator.prototype.addViewToConfig = function (script) {
  try {
    var appPath = this.env.options.appPath;
    var fullPath = path.join(appPath, 'config.json');
	  console.log('   Add view ' + this.name + ' to config.json.');
	  this.log.create('   Add view ' + this.name + ' to config.json.');

	  dappUtils.rewriteFile({
      file: fullPath,
      needle: '} // end of last view, add generated views above here',
      splicable: [
		  '},',
		  '"'+this.name+'":{',
		  '    "template": "app/views/'+this.name+'/'+this.name+'.html",',
		  '    "controller" : "app/views/'+this.name+'/'+this.name+'.js"'
      ]
    });
  } catch (e) {
    console.log('\nUnable to find '.yellow + fullPath + '. Reference to '.yellow + ' view ' + this.name + ' not added.\n'.yellow);
  }
};

Generator.prototype.addViewToHomeHTML = function (script) {
  try {
    var appPath = this.env.options.appPath;
    var fullPath = path.join(appPath, 'views/home/home.html');
	//console.log('\nAdded link to view '.green + this.name + 'to home.html.\n'.green);
	  console.log('   Add link to view ' + this.name + ' in home.html');
	//  this.log.writeln('Added link to view ' + this.name + ' to home.html');

	  dappUtils.rewriteFile({
      file: fullPath,
      needle: '</ul> <!-- end of list of views -->',
      splicable: [
	  '  <li data-dojo-type="dojox/mobile/ListItem"',
      '      data-dojo-props="clickable:true, ',
	  "                       target:'"+this.name+"'"+"\">",
      '   '+this.name,
	  '  </li>'
      ]
    });
  } catch (e) {
    //console.log('\nUnable to find '.yellow + fullPath + '. Reference to '.yellow + ' view ' + this.name + ' not added.\n'.yellow);
    console.log('\nUnable to find ' + fullPath + '. Reference to ' + ' view ' + this.name + ' not added.\n');
  }
};


Generator.prototype.createViewFiles = function createViewFiles() {
  //this.mkdir('app/views/'+this.name);
  this.template(
    'view.html',
    path.join(
      this.env.options.appPath,
      'views/'+this.name,
      this.name + '.html'
    )
  );
  this.template(
   'view.js',
   path.join(
     this.env.options.appPath,
     'views/'+this.name,
     this.name + '.js'
   )
 );
};
/*
Generator.prototype.addViewToConfig = function (script) {
  try {
    var appPath = this.env.options.appPath;
    var fullPath = path.join(
         this.env.options.appPath,
         'config.json'
       );
    util.rewriteFile({
      file: fullPath,
      needle: '//afterLastView',
		splicable: [
    "  templateUrl: 'views/" + this.name.toLowerCase() + ".html'" + (coffee ? "" : "," ),
    "  controller: '" + this.classedName + "Ctrl'"
  ]
//
  //    splicable: [
//		  '  "+this.name+":{ ',
//		  '  template": "app/views/+this.name+/+this.name+.html"',
//		  '  controller" : "app/views/+this.name+/+this.name+.js"',
//	  '  }'
//      ]
    });
  } catch (e) {
    console.log('\nUnable to find '.yellow + fullPath + '. Reference to '.yellow + script + '.js ' + 'not added.\n'.yellow);
  }
};
*/
