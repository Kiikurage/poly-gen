#!/usr/bin/env node

var fs = require('fs-extra');
var path = require('path');
var name = process.argv[2];

if (!name) {
    console.log('Error: name is required.');
    process.exit();
}
var $copy = $(fs.copy),
    $move = $(fs.move),
    $write = $(fs.writeFile),
    $read = $(fs.readFile),
    cwd = process.cwd();

$copy('./template', path.join(cwd, name))
    .then(function() {
        return Promise.all(
            ['css', 'html', 'js']
            .map(function(ext) {
                var outputPath = path.join(cwd, name, name + '.' + ext);
                return $move(
                        path.join(cwd, name, '{{name}}.' + ext),
                        outputPath
                    )
                    .then(function() {
                        return $read(outputPath, 'utf8')
                    })
                    .then(function(data) {
                        return $write(outputPath, data[0].replace(/\{\{name\}\}/g, name));
                    });
            }));
    })
    .catch(function(err) {
        console.log(err.stack);
    });

function $(fn) {
    return function() {
        var args = Array.prototype.slice.call(arguments, 0),
            self = this;
        return new Promise(function(resolve, reject) {
            args.push(function(err) {
                if (err) {
                    return reject(err);
                }

                return resolve(Array.prototype.slice.call(arguments, 1));
            });
            fn.apply(self, args);
        });
    }
}
