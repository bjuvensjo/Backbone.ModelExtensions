var _ = require('underscore');
var Backbone = require('backbone');

eval(require('fs').readFileSync('./Backbone.ModelExtensions.js', 'utf8'));

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
