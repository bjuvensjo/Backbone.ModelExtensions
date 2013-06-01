var buster = require('buster');
var _ = require('underscore');
var Backbone = require('backbone');
require('../src/Backbone.ModelExtensions.js');

buster.testCase("Backbone.ModelExtensions.toBackboneModel", {
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
        var object = {
            myCollection : []
        };

        var MyCollection = Backbone.Collection.extend({});

        var scheme = {
            myCollection: {
                collection : MyCollection
            }
        };

        var backboneModel = Backbone.ModelExtensions.toBackboneModel({
            object : object,
            scheme : scheme
        });

        var expected = new Backbone.Model({
            myCollection : new MyCollection()
        }).attributes;

        buster.assert.equals(expected, backboneModel.attributes);
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
                    street: 'street 2',
                    phone: new Backbone.Model({
                        type: 'mobile',
                        number: '2'
                    })
                })
            ])
        }).attributes;

        buster.assert.equals(expected.name, backboneModel.attributes.name);
        buster.assert.equals(expected.addresses.pop().attributes.street, backboneModel.attributes.addresses.pop().attributes.street);
        buster.assert.equals(expected.addresses.pop().attributes.phone.attributes, backboneModel.attributes.addresses.pop().attributes.phone.attributes);
    },

    "should create collection with specific model": function () {
        'use strict';
        var object = {
            myCollection : [
                {
                    name : 'Name'
                }
            ]
        };

        var MyModel = Backbone.Model.extend({
            initialize : function () {
                this.set('specific', 'specific');
            }
        });
        var MyCollection = Backbone.Collection.extend({});

        var scheme = {
            myCollection : {
                collection : MyCollection,
                model : {
                    model : MyModel
                }
            }
        };

        var backboneModel = Backbone.ModelExtensions.toBackboneModel({
            object : object,
            scheme : scheme
        });

        var expected = new Backbone.Model({
            myCollection: new MyCollection([
                new MyModel({
                    name : 'Name'
                })
            ])
        }).attributes;

        buster.assert.equals(expected.myCollection.pop().attributes, backboneModel.attributes.myCollection.pop().attributes);
    },

    "events should not bubble" : function (done) {
        'use strict';
        var object = {
            child : {}
        };

        var scheme = {};

        var backboneModel = Backbone.ModelExtensions.toBackboneModel({
            object : object,
            scheme : scheme
        });

        var bubbled = false;
        backboneModel.on('all', function () {
            bubbled = true;
        });
        backboneModel.attributes.child.set('change', 'change');
        setTimeout(done(function () {
            buster.assert.equals(false, bubbled);
        }), 200);
    },

    "events should bubble" : function (done) {
        'use strict';
        var object = {
            child : {}
        };

        var scheme = {};

        var backboneModel = Backbone.ModelExtensions.toBackboneModel({
            object : object,
            scheme : scheme,
            bubbleEvents : true
        });

        var bubbled = false;
        backboneModel.on('all', function () {
            bubbled = true;
        });
        backboneModel.attributes.child.set('change', 'change');
        setTimeout(done(function () {
            buster.assert.equals(true, bubbled);
        }), 200);
    }
});

/*
buster.testCase("Backbone.ModelExtensions.toBackboneCollection", {
    "should handle primitives": function () {
        'use strict';
        var object = ['string', 1, null, undefined, NaN, Infinity];

        var scheme = {};

        var backboneCollection = Backbone.ModelExtensions.toBackboneCollection({
            object : object,
            scheme : scheme
        });

        var expected = new Backbone.Collection(object);

        buster.assert.equals(expected.pop(), backboneCollection.pop());
    }
});
*/