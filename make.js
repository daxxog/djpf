/* djpf / make.js
 * (c) 2013 David (daXXog) Volm ><> + + + <><
 * Released under Apache License, Version 2.0:
 * http://www.apache.org/licenses/LICENSE-2.0.html  
 */

var bor = require('bor'),
    stoptime = require('stoptime'),
    UglifyJS = require('uglify-js'),
    fs = require('fs');
    
var H, build;

require('bitfactory').make({ //routes
    "": function(err, results) {
        console.log('built djpf in ' + results[0].timer.elapsed() + 'ms');
    }
}, { //dependencies
    "*": { //wildcard
        "timer": [function(cb) {
            cb(null, stoptime());
        }],
        "header": function(cb) {
            H = fs.readFileSync('./djpf.h', 'utf8');
            cb();
        },
        "build": function(cb) {
            bor.robot('./djpf.src.js', function(data) {
                build = data;
                cb();
            });
        },
        "write": ["build", function(cb) {
            fs.writeFileSync('./djpf.js', build, 'utf8');
            cb();
        }],
        "uglify": ["header", "build", function(cb) {
            fs.writeFileSync('./djpf.min.js', H + UglifyJS.minify(build, {fromString: true}).code, 'utf8');
            cb();
        }]
    }
});