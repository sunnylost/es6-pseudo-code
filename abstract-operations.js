/**
 * http://people.mozilla.org/~jorendorff/es6-draft.html#sec-abstract-operations
 *
 * NOTE:
 *     In this specification, only Date Objects and Symbol objects over-ride default ToPrimitive behaviour.
 */
function ToPrimitive(argument, PreferredType) {
    var type = Type(argument),
        hint;
    if(type === 'completion record') {
        if(argument.__type__ !== 'normal') { // abrupt completion
            return argument;
        } else {
            return ToPrimitive(argument.__value__, PreferredType);
        }
    } else if(type === 'object') {
        if(!PreferredType) {
            hint = 'default';
        } else if(PreferredType === 'string') {
            hint = 'string';
        } else if(PreferredType === 'number') {
            hint = 'number';
        }

        var exoticToPrim = Get(argument, @@toPrimitive); //@@ means well-known Symbol
        ReturnIfAbrupt(exoticToPrim);
        if(exoticToPrim !== undefine) {
            if(!IsCallable(exoticToPrim)) throw TypeError();
            var result = exoticToPrim.__Call__(thisArgument, new List(hint));
            ReturnIfAbrupt(result);
            if(Type(result) != 'object') {// result must be an ECMAScript language value 
                return result;  
            } else {
                throw TypeError();
            }
        }
        if(hint === 'default') hint = 'number';
        return OrdinaryToPrimitive(argument, hint);
    } else {
        return argument;
    }
}

function OrdinaryToPrimitive(O, hint) {
    if(Type(O) === 'object') {
        var type = Type(hint);
        var methodNames;
        if(type === 'string' || type === 'number') {
            if(hint === 'string') {
                methodNames = new List('toString', 'valueOf');
            } else {
                methodNames = new List('valueOf', 'toString');
            }
            for(var name in methodNames) {
                var method = methodNames[name];
                ReturnIfAbrupt(method);
                if(IsCallable(method)) {
                    var result = method.__Call__(O, new List());
                    ReturnIfAbrupt(result);
                    if(Type(result) !== 'object') return result;
                }
            }

            throw TypeError();
        }
    }
}

/**
 * return false:
 *     +0
 *     -0
 *     NaN
 *     ''
 *     null
 *     undefined
 */
function ToBoolean(argument) {
    var type = Type(argument);
    if(type === 'completion record') {
        if(argument.__type__ !== 'normal') { // abrupt completion
            return argument;
        } else {
            return ToBoolean(argument.__value__);
        }
    } else if(type === 'undefine') {
        return false;
    } else if(type === 'null') {
        return false;
    } else if(type === 'boolean') {
        return argument;
    } else if(type === 'number') {
        if(argument === +0 || argument === -0 || argument === NaN) {
            return false;
        }
        return true;
    } else if(type === 'string') {
        if(argument.length === 0) return false;// empty string
        return true;
    } else if(type === 'symbol') {
        return true;
    } else if(type === 'object') {
        return true;
    }
}

function ToNumber(argument) {}
function ToInteger(argument) {}
function ToInt32(argument) {}
function ToUint32(argument) {}
function ToInt16(argument) {}
function ToUint16(argument) {}
function ToInt8(argument) {}
function ToUint8(argument) {}
function ToUint8Clamp(argument) {}
function ToString(argument) {}
function ToObject(argument) {}
function ToPropertyKey(argument) {}
function ToLength(argument) {}

/**
 * http://people.mozilla.org/~jorendorff/es6-draft.html#sec-testing-and-comparison-operations
 * Testing and Comparison Operations
 */

function CheckObjectCoercible(argument) {}
function IsCallable(argument) {}
function SameValue(x, y) {}
function SameValueZero(x, y) {}
function IsConstructor(argument) {}
function IsPropertyKey(argument) {}
function IsExtensible(O) {}

/**
 * http://people.mozilla.org/~jorendorff/es6-draft.html#sec-operations-on-objects
 * Operations on Objects
 */

function Get(O, P){}
function Put(O, P, V, Throw){}
function CreateDataProperty(O, P, V){}
function CreateDataPropertyOrThrow(O, P, V){}
function DefinePropertyOrThrow(O, P, desc){}
function DeletePropertyOrThrow(O, P){}
function HasProperty(O, P){}
function HasOwnProperty(O, P){}
function GetMethod(O, P){}
function SetIntegrityLevel(O, level){}
function TestIntegrityLevel(O, level){}
function CreateArrayFromList(elements){}
function CreateListFromArrayLike(obj){}
function OrdinaryHasInstance(C, O){}
function GetPrototypeFromConstructor(constructor, intrinsicDefaultProto){}
function OrdinaryCreateFromConstructor(constructor, intrinsicDefaultProto, internalDataList){}

/**
 * http://people.mozilla.org/~jorendorff/es6-draft.html#sec-operations-on-iterator-objects
 *
 * Operation on Iterator Objects
 */

function GetIterator(obj) {}
function IteratorNext(iterator, value) {}
function IteratorComplete(iterResult) {}
function IteratorValue(iterResult) {}
function IteratorStep(iterator, value) {}
function CreateResultObject(value, done) {}
function CreateListIterator(list) {}
//ListIterator next()
function CreateEmptyIterator() {}