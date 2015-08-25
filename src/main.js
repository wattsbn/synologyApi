'use strict';

// http://myds.com:5000/webapi/query.cgi?api=SYNO.API.Info&version=1&method=query&quer
// http://192.168.2.100:5000/webapi/query.cgi?api=SYNO.API.Info&version=1&method=query&query=SYNO.API.Auth,SYNO.FileStation.
var q = require('q');
var HTTP = require('q-io/http');

var options = {
    host: '192.168.2.100:5000/',
    path: '/webapi/query.cgi?api=SYNO.API.Info&version=1&method=query&query=SYNO.API.Auth'
};

//options = {
//    host: 'www.google.com',
//    path: '/something'
//};

console.log(options.host+options.path);
HTTP.request(options).then(function(response) {
    console.log(response.status);
    console.log(response.node.statusMessage);
}, function(error) {
    console.log(error);
});

var Synology = require('synology');

var syno = new Synology({
    host    : '192.168.2.100',
    user    : 'admin',
    password: 'admin'
});
//console.log(syno);
syno.fileStation.list({
    folder_path: '/',
    additional: 'real_path,size',
    pattern: '*module*'
}, function(err, data) {
    if (err) throw err;
    console.log(data.data.shares);
});