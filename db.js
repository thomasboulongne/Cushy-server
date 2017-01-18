"use strict";
let path = require('path');
let low = require('lowdb');
const storage = require('lowdb/lib/file-sync')
let db = low(path.resolve(__dirname, './data/', 'db.json'), {storage});
db._.mixin(require('underscore-db'));
module.exports = db;