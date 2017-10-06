// Copyright Prashant Balan. All Rights Reserved.
// Node module: loopback-mysql-referential-integrity-component
// This file is licensed under MIT license.
// License text available at https://github.com/pbalan/loopback-mysql-referential-integrity/blob/master/LICENSE
'use strict';

var SG = require('strong-globalize');
SG.SetRootDir(__dirname);

var ForeignKey = require('./lib/ForeignKey');

module.exports = ForeignKey;
