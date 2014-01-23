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
 */

Object.prototype.__GetPrototypeOf__ = K;
Object.prototype.__SetPrototypeOf__ = K;
Object.prototype.__IsExtensible__ = K;
Object.prototype.__PreventExtensions__ = K;
Object.prototype.__GetOwnProperty__ = K;
Object.prototype.__HasProperty__ = K;
Object.prototype.__Get__ = K;
Object.prototype.__Set__ = K;
Object.prototype.__Delete__ = K;
Object.prototype.__DefineOwnProperty__ = K;
Object.prototype.__Enumerate__ = K;
Object.prototype.__OwnPropertyKeys__ = K;

Function.prototype.__Call__ = K;
Function.prototype.__Construct__ = K;

//http://people.mozilla.org/~jorendorff/es6-draft.html#sec-invariants-of-the-essential-internal-methods


/**
 * Specification Types
 */

function List() {}

function Record(){}

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