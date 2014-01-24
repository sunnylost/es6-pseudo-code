/**
 * http://people.mozilla.org/~jorendorff/es6-draft.html#sec-ecmascript-data-types-and-values
 */

function K() {
    //Need to be implement
};

function Type(V) {
    if(V === null) return 'null';
    var type = typeof V;
    if(type == 'object') {
        if(V instanceof Reference) return 'reference';
    }

    return type;
}

/**
 * Language Types
 *
 * Undefined
 * Null
 * Boolean
 * String
 * Number
 * Object
 */

/**
 * http://tc39wiki.calculist.org/es6/symbols/
 *
 * @param {[type]} name [description]
 */
function Symbol(name) {
    this.__Description__ = name;
}

/**
 * Well-Known Symbols
 * http://people.mozilla.org/~jorendorff/es6-draft.html#sec-well-known-symbols
 *
 * @@create             'Symbol.create'
 * @@hasInstance        'Symbol.hasInstance'
 * @@isConcatSpreadable 'Symbol.isConcatSpreadable'
 * @@isRegExp           'Symbol.isRegExp'
 * @@iterator           'Symbol.iterator'
 * @@toPrimitive        'Symbol.toPrimitive'
 * @@toStringTag        'Symbol.toStringTag'
 * @@unscopables        'Symbol.unscopables'
 */

/**
 * Property Attributes
 * http://people.mozilla.org/~jorendorff/es6-draft.html#sec-property-attributes
 */

function Property() {
    this.__Enumerable__   = false;
    this.__Configurable__ = false;
}

function DataProperty() {
    Property.call(this);
    this.__Value__    = undefined;
    this.__Writable__ = false;
}

function AccessorProperty() {
    Property.call(this);
    this.__Get__ = undefined;
    this.__Set__ = undefined;
}

/**
 * Object Internal Methods and Internal Slots
 * http://people.mozilla.org/~jorendorff/es6-draft.html#sec-object-internal-methods-and-internal-slots
 *
 * These names are polymorphic.
 *
 * The target of an internal method is the object the internal method is called upon.
 *
 * A target is non-extensible if it has been observed to return false from its [[IsExtensible]] internal method, or true from its [[PreventExtensions]] internal method.
 *
 * A non-existent property is a property that does not exist as an own property on a non-extensible target.
 *
 */

/**
 *
 * Determine the object that provides inherited properties for this object.
 * A null value indicates that there are no inherited properties.
 *
 * return either Object or Null
 *
 * An object's prototype chain must have finite length.
 */
Object.prototype.__GetPrototypeOf__ = K;

/**
 * Associate with an object another object that provides inherited properties.
 * Passing null indicates that there are no inherited properties.
 * Returns true indicating that the operation was completed successfully
 * or false indicating that the operation was not successful.
 *
 * Must return Boolean Type.
 */
Object.prototype.__SetPrototypeOf__ = K;

/**
 * Determine whether it is permitted to add additional properties to an object.
 */
Object.prototype.__IsExtensible__ = K;

/**
 * Control whether new properties may be added to an object.
 * Returns true indicating that the operation was completed successfully
 * or false indicating that the operation was not successful.
 */
Object.prototype.__PreventExtensions__ = K;

/**
 * Returns a Property Descriptor for the own property of this object
 * whose key is propertyKey, or undefined if no such property exists.
 */
Object.prototype.__GetOwnProperty__ = K;

/**
 * Returns a Boolean value indicating whether the object
 * already has either an own or inherited property whose key is propertyKey.
 */
Object.prototype.__HasProperty__ = K;

/**
 * Retrieve the value of an object’s property using the propertyKey parameter.
 * If any ECMAScript code must be executed to retrieve the property value,
 * Receiver is used as the this value when evaluating the code.
 */
Object.prototype.__Get__ = K;

/**
 * Try to set the value of an object’s property indentified by propertyKey to value.
 * If any ECMAScript code must be executed to set the property value,
 * Receiver is used as the this value when evaluating the code.
 * Returns true indicating that the property value was set or false
 * indicating that it could not be set.
 */
Object.prototype.__Set__ = K;

/**
 * Removes the own property indentified by the propertyKey parameter from the object.
 * Return false if the property was not deleted and is still present.
 * Return true if the property was deleted or was not present.
 */
Object.prototype.__Delete__ = K;

/**
 * Creates or alters the named own property to have the state described
 * by a Property Descriptor. Returns true indicating that the property was
 * successfully created/updated or false indicating that the property could
 * not be created or updated.
 */
Object.prototype.__DefineOwnProperty__ = K;

/**
 * Returns an iterator object over the string values of the keys
 * of the enumerable properties of the object.
 */
Object.prototype.__Enumerate__ = K;

/**
 * Returns an Iterator object that produces all of the own property keys for the object.
 */
Object.prototype.__OwnPropertyKeys__ = K;

/**
 * Executes code associated with the object.
 * Invoked via a function call expression.
 * The arguments to the internal method are a this value and
 * a list containing the arguments passed to the function by a call expression.
 * Objects that implement this internal method are callable.
 */
Function.prototype.__Call__ = K;

/**
 * Creates an object. Invoked via the new operator.
 * The arguments to the internal method are the arguments passed to the new operator.
 * Objects that implement this internal method are called constructors.
 * A Function object is not necessarily a constructor and such non-constructor Function
 * objects do not have a [[Construct]] internal method.
 */
Function.prototype.__Construct__ = K;

//http://people.mozilla.org/~jorendorff/es6-draft.html#sec-invariants-of-the-essential-internal-methods


/**
 * Specification Types
 *
 *  Reference
 *  List
 *  Completion
 *  Property Descriptor
 *  Lexical Environment
 *  Environment Record
 *  Data Block
 */

/**
 * used for explain **arguments** list
 */
function List() {}

function Record() {}

/**
 * http://wiki.ecmascript.org/doku.php?id=harmony:completion_reform
 */
function CompletionRecord() {
    Record.call(this);
    this.__type__ = 'normal';//normal, break, continue, return, throw
    this.__value__;
    this.__target__;
}

function ReturnIfArupt(argument) {}

/**
 * http://people.mozilla.org/~jorendorff/es6-draft.html#sec-reference-specification-type
 */
function Reference() {
    this.base = undefined;
    this.referenceName = undefined;
    this.strictReference = false;
}

function GetBase(V) {
    return V.base;
}

function GetReferenceName(V) {
    return V.referenceName;
}

function IsStrictReference(V) {
    return V.strictReference;
}

function HasPrimitiveBase(V) {
    var types = {
        boolean: true,
        string: true,
        symbol: true,
        number: true
    };
    return !!(Type(V.base) in types);
}

function IsPropertyReference(V) {
    return Type(V.base) == 'object' || HasPrimitiveBase(V);
}

function IsUnresolvableReference(V) {
    return Type(V.base) === 'undefined';
}

function IsSuperReference(V) {
    return !!V.thisValue;
}

//http://people.mozilla.org/~jorendorff/es6-draft.html#sec-getvalue
function GetValue(V) {
    ReturnIfArupt(V);
    if(Type(V) !== 'reference') return V;
    var base = GetBase(V);
    if(IsUnresolvableReference(V)) throw new ReferenceError();
    if(IsPropertyReference(V)) {
        if(HasPrimitiveBase(V)) {
            //Assert:
            base = ToObject(base);
        } else {
            return base.__Get__(GetReferenceName(V), GetThisValue(V));
        }
    } else { // base is an environment record
        return base.GetBindingValue(GetReferenceName(V), IsStrictReference(V));
    }
}

function PutValue(V, W) {
    var base, globalObj, succeeded;

    ReturnIfArupt(V);
    ReturnIfArupt(W);
    if(Type(V) !== 'reference') throw new ReferenceError();
    base = GetBase(V);
    if(IsUnresolvableReference(V)) {
        if(IsStrictReference(V)) {
            throw new ReferenceError();
        }
        globalObj = GetGlobalObject();
        return Put(globalObj, GetReferenceName(V), W, false);
    } else if(IsPropertyReference(V)) {
        if(HasPrimitiveBase(V)) {
            //TODO: Assert
            base = ToObject(base);
        }
        succeeded = base.__Set__(GetReferenceName(V), W, GetThisValue(V));
        ReturnIfArupt(succeeded);
        if(!succeeded && IsStrictReference(V)) throw new TypeError();
        return;
    } else {
        return base.SetMutableBinding(GetReferenceName(V), W, IsStrictReference(V));
    }

    return;
}

function GetThisValue(V) {
    ReturnIfArupt(V);
    if(Type(V) !== 'reference') return V;
    if(IsUnresolvableReference(V)) throw new ReferenceError();
    if(IsSuperReference(V)) {
        return V.thisValue;
    }

    return GetBase(V);
}

/**
 * http://people.mozilla.org/~jorendorff/es6-draft.html#sec-property-descriptor-specification-type
 * The Property Descriptor Specification Type
 */

function PropertyDescriptor() {}

//TODO
