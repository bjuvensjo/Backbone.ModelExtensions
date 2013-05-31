var buster = require('buster');
var _ = require('underscore');
var Backbone = require('backbone');
require('../src/Backbone.ModelExtensions.js');

buster.testCase("Backbone.ModelExtensions", {
    "should handle primitives": function () {
        'use strict';
        var object = {
            key1 : 'string',
            key2 : 1,
            key3 : null,
            key4 : undefined,
            key5 : NaN,
            key6 : Infinity
        };

        var scheme = {};

        var backboneModel = Backbone.ModelExtensions.toBackboneModel({
            object : object,
            scheme : scheme
        });

        var expected = new Backbone.Model(object).attributes;

        buster.assert.equals(expected, backboneModel.attributes);
    },

    "should create custom model": function () {
        'use strict';
        var object = {};

        var MyModel = Backbone.Model.extend({});

        var scheme = {
            model : MyModel
        };

        var backboneModel = Backbone.ModelExtensions.toBackboneModel({
            object : object,
            scheme : scheme
        });

        var expected = new MyModel().attributes;

        buster.assert.equals(expected, backboneModel.attributes);
    },

    "should create custom collection": function () {
        'use strict';
        var object = [];

        var MyCollection = Backbone.Collection.extend({});

        var scheme = {
            collection : MyCollection
        };

        var backboneModel = Backbone.ModelExtensions.toBackboneModel({
            object : object,
            scheme : scheme
        });

        var expected = new MyCollection();

        buster.assert.equals(expected, backboneModel);
    },

    "should create deep model": function () {
        'use strict';
        var object = {
            name: 'Name',
            addresses: [
                {
                    street: 'street 1',
                    phone: {
                        type: 'mobile',
                        number: '1'
                    }
                },
                {
                    street: 'street 2',
                    phone: {
                        type: 'mobile',
                        number: '2'
                    }
                }
            ]
        };

        var MyModel = Backbone.Model.extend({});
        var MyCollection = Backbone.Collection.extend({});

        var scheme = {
            model: MyModel,
            addresses: {
                collection: MyCollection
            }
        };

        var backboneModel = Backbone.ModelExtensions.toBackboneModel({
            object : object,
            scheme : scheme
        });

        var expected = new MyModel({
            name : 'Name',
            addresses : new MyCollection([
                new Backbone.Model({
                    street: 'street 1',
                    phone: new Backbone.Model({
                        type: 'mobile',
                        number: '1'
                    })
                }),
                new Backbone.Model({
                    street: 'street 1',
                    phone: new Backbone.Model({
                        type: 'mobile',
                        number: '1'
                    })
                })
            ])
        });

        buster.assert.equals(expected, backboneModel);
    }
});




/*
 // Test
 (function () {

 // An object
 var myObject = {
 name: 'Name',
 addresses: [
 {
 street: 'street 1',
 phone: {
 type: 'mobile',
 number: '1'
 }
 },
 {
 street: 'street 2',
 phone: {
 type: 'mobile',
 number: '2'
 }
 }
 ]
 };

 // Optionally, specify models and collections to use
 var myObjectScheme = {
 model: Backbone.Model.extend({}),
 addresses: {
 //collection: Backbone.Collection.extend({}),
 //model: Backbone.Model.extend({})
 }
 };

 // Specifies if events should "bubble" from child models and collections
 var bubbleEvents = true;

 var myBackboneModelObject = Backbone.ModelExtensions.toBackboneModel({
 object: myObject,
 scheme: myObjectScheme,
 bubbleEvents: bubbleEvents
 });

 myBackboneModelObject.on('all', function (eventName) {
 console.dir(arguments);
 });

 myBackboneModelObject.get('addresses').at(0).set('street', 'new street');

 console.log(JSON.stringify(myBackboneModelObject));

 }());
 */