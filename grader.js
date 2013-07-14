#!/usr/bin/env node
/*
Automatically grade files for the presence of specified HTML tags/attributes.
Uses commander.js and cheerio. Teaches command line application development
and basic DOM parsing.

References:

 + cheerio
   - https://github.com/MatthewMueller/cheerio
   - http://encosia.com/cheerio-faster-windows-friendly-alternative-jsdom/
   - http://maxogden.com/scraping-with-node.html

 + commander.js
   - https://github.com/visionmedia/commander.js
   - http://tjholowaychuk.com/post/9103188408/commander-js-nodejs-command-line-interfaces-made-easy

 + JSON
   - http://en.wikipedia.org/wiki/JSON
   - https://developer.mozilla.org/en-US/docs/JSON
   - https://developer.mozilla.org/en-US/docs/JSON#JSON_in_Firefox_2
*/

var fs = require('fs');
var program = require('commander');
var cheerio = require('cheerio');

//added by Rahul Dutta
var rest = require('restler');

var HTMLFILE_DEFAULT = "index.html";
var CHECKSFILE_DEFAULT = "checks.json";
var URL_DEFAULT = "http://young-dusk-6473.herokuapp.com/";

var assertFileExists = function(infile) {
    var instr = infile.toString();
    if(!fs.existsSync(instr)) {
        console.log("%s does not exist. Exiting.", instr);
        process.exit(1); // http://nodejs.org/api/process.html#process_process_exit_code
    }
    return instr;
};





var cheerioHtmlFile = function(htmlfile) {
    return cheerio.load(fs.readFileSync(htmlfile));
};


var loadChecks = function(checksfile) {
    return JSON.parse(fs.readFileSync(checksfile));
};

var checkHtmlFile = function(htmlfile, checksfile) {
    
    console.log("check html file....");
    $ = cheerioHtmlFile(htmlfile);
    var checks = loadChecks(checksfile).sort();
    var out = {};
    for(var ii in checks) {
        var present = $(checks[ii]).length > 0;
        out[checks[ii]] = present;
    }
    return out;
};


var checkUrl = function(url, checksfile) {

   console.log("in check url..");
   rest.get(url).on('complete',function(data){
   if (data instanceof Error) {
	console.log("Error:" + data.message);
	console.log("%s doesnt exist.Exiting...",url);
	process.exit(1);
}else {

   $ = cheerio.load(data);
   var checks = loadChecks(checksfile).sort();
   var out = {};
   for (var ii in checks) {
	var present = $(checks[ii]).length > 0;
	out[checks[ii]] = present;
}
}
   stringify(out);
   console.log("exiting..checkurl");

});
}

var stringify = function(arr){

   console.log("printing JSON output...");
   console.log(JSON.stringify(arr, null, 4));
}

var clone = function(fn) {
    // Workaround for commander.js issue.
    // http://stackoverflow.com/a/6772648
    return fn.bind({});
};

if(require.main == module) {
    program
        .option('-c, --checks <check_file>', 'Path to checks.json', clone(assertFileExists), CHECKSFILE_DEFAULT)
        .option('-f, --file <html_file>', 'Path to index.html', clone(assertFileExists), HTMLFILE_DEFAULT)
	.option('-u, --url <url>', 'Url to index.html')
        .parse(process.argv);
    if (program.url){
	console.log("url is...");
	console.log(program.url);
	checkUrl(program.url, program.checks);
}else if (program.file){


    console.log("entering the files option..");
    var checkJson = checkHtmlFile(program.file, program.checks);
    //var outJson = stringify(checkJson);
    //console.log(outJson);
}
} else {
    exports.checkHtmlFile = checkHtmlFile;
}
