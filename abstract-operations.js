/**
 * http://people.mozilla.org/~jorendorff/es6-draft.html#sec-abstract-operations
 */

function ToPrimitive(argument, PreferredType) {
    var type = Type(argument),
        hint;
    if(type === 'completion record') {
        //TODO
    } else if(type === 'object') {
        if(!PreferredType) {
            hint = 'default';
        } else if(PreferredType === 'string') {
            hint = 'string';
        } else if(PreferredType === 'number') {
            hint = 'number';
        }

        //TODO
    } else {
        return argument;
    }
}

function ToBoolean(argument) {}
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