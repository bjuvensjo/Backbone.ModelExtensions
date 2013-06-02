Backbone.ModelExtensions
========================

Adds extensions into Backbone's base classes

# Installation
Just copy [Backbone.ModelExtensions](https://github.com/bjuvensjo/Backbone.ModelExtensions/blob/master/Backbone.ModelExtensions.js)

# Usage
### Backbone.ModelExtensions.toBackboneModel
Given a deep/nested object, it creates corresponding Backbone models and collections.
For instance, it can be useful when you're using model-view-binding.

```js
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
            collection: Backbone.Collection.extend({}),
            model: {
                model: Backbone.Model.extend({}),
                type: Backbone.Model.extend({})
            }
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
```
### Backbone.ModelExtensions.toBackboneCollection
Analog with ```toBackboneModel``` but takes an ```array``` option instead of ```object```, and returns a Backbone.Collection