#!/usr/bin/env node
var name = process.argv[2];

if (!name) {
    console.log('Error: name is required.');
    process.exit();
}

console.log();
