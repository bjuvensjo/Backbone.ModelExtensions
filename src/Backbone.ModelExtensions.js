if (typeof module !== 'undefined' && module.exports) {
    var _ = require('underscore');
    var Backbone = require('backbone');
}

'use strict';

/**
 * Backbone.ModelExtensions
 *
 * Adds extensions into Backbone's base classes
 *
 * @author Magnus Bjuvensjö
 */
(function(Backbone, _) {

    var ModelExtensions = Backbone.ModelExtensions = Backbone.ModelExtensions || {};

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
    ModelExtensions.toBackboneModel = function(options) {

        var createModel = function (scheme) {
            if (scheme.model) {
                return new scheme.model();
            }
            if (scheme.collection) {
                return new scheme.collection();
            }
            return new Backbone.Model();
        };

        var createCollection = function (scheme) {
            if (scheme.collection) {
                return new scheme.collection();
            }
            return new Backbone.Collection();
        };

        var addEventProxy = function (parent, child) {
            if (options.bubbleEvents) {
                child.on("all", function(eventName) {
                    parent.trigger.apply(parent, arguments);
                });            
            }
        };

        return _.reduce(options.object, function(model, value, key) {
            var child;
            var scheme = {};

            if (options.scheme && options.scheme[key]) {
                scheme = options.scheme[key];
            }

            if (_.isArray(value)) {
                child = createCollection(scheme);
                _.each(value, function (element) {
                    child.add(ModelExtensions.toBackboneModel({
                        object: element,
                        scheme: scheme
                    }));
                }, model);
                addEventProxy(model, child);
                model.set(key, child);
            } else if (_.isObject(value)) {
                child = createModel(scheme);
                addEventProxy(model, child);
                model.set(key, ModelExtensions.toBackboneModel({
                    object: value, 
                    target: child,
                    scheme: scheme
                }));
            } else {
                model.set(key, value);
            }

            return model;
        }, options.target || createModel(options.scheme));

    };

}(Backbone, _));
