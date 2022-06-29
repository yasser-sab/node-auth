const monk = require('monk');
const db = monk('localhost/db');

module.exports=db;