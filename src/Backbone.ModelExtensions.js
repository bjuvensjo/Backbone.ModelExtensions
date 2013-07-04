if (typeof module !== 'undefined' && module.exports) {
    var _ = require('underscore');
    var Backbone = require('backbone');
}

/**
 * Backbone.ModelExtensions
 *
 * Adds extensions into Backbone's base classes
 *
 * @author Magnus Bjuvensjö, Anders Bälter
 */
(function (Backbone, _) {
    'use strict';

    var ModelExtensions = Backbone.ModelExtensions = Backbone.ModelExtensions || {};

    var addEventProxy = function (parent, child, options) {
        if (options.bubbleEvents) {
            child.on("all", function (eventName) {
                parent.trigger.apply(parent, arguments);
            });
        }
    };

    var handleObject = function (value, scheme, parent, options) {
        var result;
        if (_.isArray(value)) {
            result = ModelExtensions.toBackboneCollection({
                array: value,
                scheme: scheme,
                bubbleEvents: options.bubbleEvents
            });
            addEventProxy(parent, result, options);
        } else if (_.isObject(value)) {
            result = ModelExtensions.toBackboneModel({
                object: value,
                scheme: scheme,
                bubbleEvents: options.bubbleEvents
            });
            addEventProxy(parent, result, options);
        } else {
            result = value;
        }
        return result;
    };

    /**
     * Creates nested Backbone models and collections from object.
     *
     * Usage example:
     *
     * var myObject = {
     *     name: 'Name',
     *     addresses: [
     *         {
     *             street: 'street 1',
     *             phone: {
     *                 type: 'mobile',
     *                 number: '1'
     *             }
     *         },
     *         {
     *             street: 'street 2',
     *             phone: {
     *                 type: 'mobile',
     *                 number: '2'
     *             }
     *         }
     *     ]
     * };

     * var myObjectScheme = {
     *     model: Backbone.Model.extend({}),
     *     addresses: {
     *         //collection: Backbone.Collection.extend({}),
     *         //model: Backbone.Model.extend({})
     *     }
     * };

     * var myBackboneModelObject = Backbone.ModelExtensions.toBackboneModel({
     *     object: myObject,
     *     scheme: myObjectScheme,
     *     bubbleEvents: true
     * });
     *
     * myBackboneModelObject.on('all', function (eventName) {
     *     console.dir(arguments);
     * });
     *
     * myBackboneModelObject.get('addresses').at(0).set('street', 'new street');
     */
    ModelExtensions.toBackboneModel = function (options) {
        if (!options.object) {
            throw 'Illegal arguments, options.object must be set';
        }
        var createModel = function (scheme) {
            if (scheme && scheme.model) {
                return new scheme.model();
            }
            return new Backbone.Model();
        };

        return _.reduce(options.object, function (model, value, key) {
            var result;
            var scheme = {};

            if (options.scheme && options.scheme[key]) {
                scheme = options.scheme[key];
            }

            result = handleObject(value, scheme, model, options);

            model.set(key, result);

            return model;
        }, createModel(options.scheme));

    };

    ModelExtensions.toBackboneCollection = function (options) {
        if (!options.array) {
            throw 'Illegal arguments, options.array must be set';
        }
        var createCollection = function (scheme) {
            var collection;
            if (scheme && scheme.collection) {
                collection = new scheme.collection();
            } else {
                collection = new Backbone.Collection();
            }
            if (scheme && scheme.model) {
                collection.model = scheme.model.model;
            }
            return collection;
        };

        return _.reduce(options.array, function (collection, value) {
            var result;
            var scheme = {};

            if (options.scheme && (options.scheme.collection || options.scheme.model)) {
                scheme = options.scheme.model || options.scheme;
            }

            result = handleObject(value, scheme, collection, options);
            collection.add(result);

            return collection;
        }, createCollection(options.scheme));
    };

    ModelExtensions.toJSON = function (object, options) {
        var json;
        if (object instanceof Backbone.Model) {
            json = Backbone.Model.prototype.toJSON.call(object, options);
        } else {
            json = Backbone.Collection.prototype.toJSON.call(object, options);
        }
        _.each(json, function (value, key, list) {
            if (value instanceof Backbone.Model || value instanceof Backbone.Collection) {
                json[key] = ModelExtensions.toJSON(value, options);
            }
        });
        return json;
    };

    ModelExtensions.toJSONMixin = function(options) {
        return ModelExtensions.toJSON(this, options);
    };
}(Backbone, _));
