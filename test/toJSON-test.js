var buster = require('buster');
var _ = require('underscore');
var Backbone = require('backbone');
require('../src/Backbone.ModelExtensions.js');

buster.testCase("Backbone.ModelExtensions.toJSON", {

    "should convert deep Backbone.Model": function () {
        'use strict';
        var expected = {key : {key: 'value'}};
        var model = new Backbone.Model({
                key : new Backbone.Model({
                    key : 'value'
                })
            }
        );
        buster.assert.equals(expected, Backbone.ModelExtensions.toJSON(model));
    },

    "should convert nested Backbone.Model Backbone.Collection": function () {
        'use strict';
        var expected = {key: [{key:'value'}]};
        var model = new Backbone.Model({
                key : new Backbone.Collection({
                        key : 'value'
                    }
                )
            }
        );
        buster.assert.equals(expected, Backbone.ModelExtensions.toJSON(model));
    }
});

buster.testCase("Backbone.ModelExtensions.toJSONMixin", {

    "should work as mixin on model": function () {
        'use strict';
        var expected = {key : {key: 'value'}};
        var MyModel = Backbone.Model.extend({
            toJSON : Backbone.ModelExtensions.toJSONMixin
        });
        var model = new MyModel({
                key : new MyModel({
                    key : 'value'
                })
            }
        );
        buster.assert.equals(expected, model.toJSON());
    },

    "should work as mixin on collection": function () {
        'use strict';
        var expected = [{key: 'value'}];
        var MyCollection = Backbone.Collection.extend({
            toJSON : Backbone.ModelExtensions.toJSONMixin
        });
        var collection = new MyCollection({
                key : 'value'
            }
        );
        buster.assert.equals(expected, collection.toJSON());
    }
});