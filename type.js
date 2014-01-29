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
    this.[[Description]] = name;
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

function PropertyDescriptor() {
    this.[[Enumerable]]   = false;
    this.[[Configurable]] = false;
}

function DataDescriptor() {
    PropertyDescriptor.call(this);
    this.[[Value]]    = undefined;
    this.[[Writable]] = false;
}

function AccessorDescriptor() {
    PropertyDescriptor.call(this);
    this.[[Get]] = undefined;
    this.[[Set]] = undefined;
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
Object.prototype.[[GetPrototypeOf]] = K;

/**
 * Associate with an object another object that provides inherited properties.
 * Passing null indicates that there are no inherited properties.
 * Returns true indicating that the operation was completed successfully
 * or false indicating that the operation was not successful.
 *
 * Must return Boolean Type.
 */
Object.prototype.[[SetPrototypeOf]] = K;

/**
 * Determine whether it is permitted to add additional properties to an object.
 */
Object.prototype.[[IsExtensible]] = K;

/**
 * Control whether new properties may be added to an object.
 * Returns true indicating that the operation was completed successfully
 * or false indicating that the operation was not successful.
 */
Object.prototype.[[PreventExtensions]] = K;

/**
 * Returns a Property Descriptor for the own property of this object
 * whose key is propertyKey, or undefined if no such property exists.
 */
Object.prototype.[[GetOwnProperty]] = K;

/**
 * Returns a Boolean value indicating whether the object
 * already has either an own or inherited property whose key is propertyKey.
 */
Object.prototype.[[HasProperty]] = K;

/**
 * Retrieve the value of an object’s property using the propertyKey parameter.
 * If any ECMAScript code must be executed to retrieve the property value,
 * Receiver is used as the this value when evaluating the code.
 */
Object.prototype.[[Get]] = K;

/**
 * Try to set the value of an object’s property indentified by propertyKey to value.
 * If any ECMAScript code must be executed to set the property value,
 * Receiver is used as the this value when evaluating the code.
 * Returns true indicating that the property value was set or false
 * indicating that it could not be set.
 */
Object.prototype.[[Set]] = K;

/**
 * Removes the own property indentified by the propertyKey parameter from the object.
 * Return false if the property was not deleted and is still present.
 * Return true if the property was deleted or was not present.
 */
Object.prototype.[[Delete]] = K;

/**
 * Creates or alters the named own property to have the state described
 * by a Property Descriptor. Returns true indicating that the property was
 * successfully created/updated or false indicating that the property could
 * not be created or updated.
 */
Object.prototype.[[DefineOwnProperty]] = K;

/**
 * Returns an iterator object over the string values of the keys
 * of the enumerable properties of the object.
 */
Object.prototype.[[Enumerate]] = K;

/**
 * Returns an Iterator object that produces all of the own property keys for the object.
 */
Object.prototype.[[OwnPropertyKeys]] = K;

/**
 * Executes code associated with the object.
 * Invoked via a function call expression.
 * The arguments to the internal method are a this value and
 * a list containing the arguments passed to the function by a call expression.
 * Objects that implement this internal method are callable.
 */
Function.prototype.[[Call]] = K;

/**
 * Creates an object. Invoked via the new operator.
 * The arguments to the internal method are the arguments passed to the new operator.
 * Objects that implement this internal method are called constructors.
 * A Function object is not necessarily a constructor and such non-constructor Function
 * objects do not have a [[Construct]] internal method.
 */
Function.prototype.[[Construct]] = K;

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
    this.[[type]] = 'normal';//normal, break, continue, return, throw
    this.[[value]];
    this.[[target]];
}

function ReturnIfArupt(argument) {}

/**
 * http://people.mozilla.org/~jorendorff/es6-draft.html#sec-reference-specification-type
 */
function Reference(base, referenceName, strictReference) {
    this.base = base || undefined;
    this.referenceName = referenceName || undefined;
    this.strictReference = strictReference || false;
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
            base = ToObject(base);
        } else {
            return base.[[Get]](GetReferenceName(V), GetThisValue(V));
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
            base = ToObject(base);
        }
        succeeded = base.[[Set]](GetReferenceName(V), W, GetThisValue(V));
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

function IsAccessorDescriptor(Desc) {
    if(Desc === undefined) return false;
    if(Desc.[[Get]] && Desc.[[Set]]) return false;
    return true;
}

function IsDataDescriptor(Desc) {
    if(Desc === undefined) return false;
    if(Desc.[[Value]] && Desc.[[Writable]]) return false;
    return true;
}

function IsGenericDescriptor(Desc) {
    if(Desc === undefined) return false;
    if(!IsAccessorDescriptor(Desc) && !IsDataDescriptor(Desc)) return true;
    return false;
}

function FromPropertyDescriptor(Desc) {
    if(Desc === undefined) return undefined;
    if('[[Origin]]' in Desc) return Desc.[[Origin]];
    var obj = Object.create(Object.prototype);
    //Assert
    if('[[Value]]' in Desc) {
        OrdinaryDefineOwnProperty(obj, 'value', {
            [[Value]]: Desc.[[Value]],
            [[Writable]]: true,
            [[Enumerable]]: true,
            [[Configurable]]: true
        })
    }

    if('[[Writable]]' in Desc) {
        OrdinaryDefineOwnProperty(obj, 'Writable', {
            [[Value]]: Desc.[[Writable]],
            [[Writable]]: true,
            [[Enumerable]]: true,
            [[Configurable]]: true
        })
    }

    if('[[Get]]' in Desc) {
        OrdinaryDefineOwnProperty(obj, 'get', {
            [[Value]]: Desc.[[Get]],
            [[Writable]]: true,
            [[Enumerable]]: true,
            [[Configurable]]: true
        })
    }

    if('[[Set]]' in Desc) {
        OrdinaryDefineOwnProperty(obj, 'Set', {
            [[Value]]: Desc.[[Set]],
            [[Writable]]: true,
            [[Enumerable]]: true,
            [[Configurable]]: true
        })
    }

    if('[[Enumerate]]' in Desc) {
        OrdinaryDefineOwnProperty(obj, 'enumerable', {
            [[Value]]: Desc.[[Enumerate]],
            [[Writable]]: true,
            [[Enumerable]]: true,
            [[Configurable]]: true
        })
    }

    if('[[Configurable]]' in Desc) {
        OrdinaryDefineOwnProperty(obj, 'configurable', {
            [[Value]]: Desc.[[Configurable]],
            [[Writable]]: true,
            [[Enumerable]]: true,
            [[Configurable]]: true
        })
    }

    return obj;
}

function ToPropertyDescriptor(Obj) {
    //...
}

function CompletePropertyDescriptor(Desc, LikeDesc) {
    //...
}

/**
 * http://people.mozilla.org/~jorendorff/es6-draft.html#sec-data-blocks
 */
function DataBlock(size) {
}

function CreateByteDataBlock(size) {
    var db = new DataBlock(size);
    if(!db) {
        throw RangeError();
    }
    for(var i = 0; i < size; i++) {
        db[i] = 0;
    }
    return db;
}

function CopyDataBlockBytes(toBlock, toIndex, fromBlock, fromIndex, count) {}