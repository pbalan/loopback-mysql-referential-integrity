// Copyright Prashant Balan. All Rights Reserved.
// Node module: loopback-mysql-referential-integrity-component
// This file is licensed under MIT license.
// License text available at https://github.com/pbalan/loopback-mysql-referential-integrity/blob/master/LICENSE
'use strict';

var asyncLib = require('async');
var async = require('asyncawait/async');
var await = require('asyncawait/await');
var ForeignKey = {
  dataSource: null,

  /**
   * Initialize the datasource for LoopBack data sources
   * @param {object} options DataSource instance
   */
  initialize: function(dataSource) {
    if ('mysql' !== dataSource.connector.name) {
      throw 'This library currently supports only MySQL database.';
    }
    ForeignKey.dataSource = dataSource;
    return ForeignKey;
  },

  /**
  * Initialize the datasource for LoopBack data sources
  * @param {string} model instance
  */
  checkTableExist: (async(function checkTableExist(model) {
    return await(ForeignKey.dataSource.isActual(model, (err, exists) => {
      console.log('exists: ' + exists);
      if (err) {
        throw err;
      }

      return exists;
    }));
  })),

  /**
   * Initialize the datasource for LoopBack data sources
   * @param {string} model               Model name
   * @param {string} foreignKeyName      Foreign Key name
   * @param {string} property            Property name
   * @param {string} referenceModel      Reference Model name
   * @param {string} referenceProperty   Reference Property name
   */
  createForeignKey: function(model, foreignKeyName, property, referenceModel, referenceProperty) {
    var existStatus = {
      model: false,
      referenceModel: false,
    };
    if (undefined === model || null === model) {
      throw 'model name must be provided.';
    }
    if (undefined === property || null === property) {
      throw 'property name must be provided.';
    }
    if (undefined === referenceModel || null === referenceModel) {
      throw 'referenceModel name must be provided.';
    }
    if (undefined === referenceProperty) {
      referenceProperty = 'id';
    }
    if (undefined === foreignKeyName) {
      foreignKeyName = 'FK_' + model.toUpperCase() + '_' +
        property.toUpperCase() + '_' + referenceModel.toUpperCase() + '_' +
        referenceProperty.toUpperCase();
    }

    var hah = ForeignKey.checkTableExist(model);
    // console.log(model);
    console.log(hah);
    asyncLib.parallel([
      function(callback) {
        ForeignKey.checkTableExist(model).then(function(exist) {
          existStatus.model = exist;
          callback();
        });
      },
      function(callback) {
        ForeignKey.checkTableExist(referenceModel).then(function(exist) {
          existStatus.referenceModel = exist;
          callback();
        });
      },
    ], function(err) {
      if (err) {
        throw err;
      }
    });

    var sql = 'ALTER TABLE ' + model + ' ADD CONSTRAINT ' + foreignKeyName +
    ' FOREIGN KEY (' + property + ') REFERENCES ' + referenceModel +
    ' (' + referenceProperty + ');';

    if (existStatus.model && existStatus.referenceModel) {
      ForeignKey.dataSource.connector.query(sql, function(err) {
        if (err) {
          throw err;
        }
      });
    }
  },
};

module.exports = ForeignKey;
