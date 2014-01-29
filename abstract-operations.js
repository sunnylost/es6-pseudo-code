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
        if(argument.[[type]] !== 'normal') { // abrupt completion
            return argument;
        } else {
            return ToPrimitive(argument.[[value]], PreferredType);
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
            var result = exoticToPrim.[[Call]](thisArgument, new List(hint));
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
    var methodNames;
    if(hint === 'string') {
        methodNames = new List('toString', 'valueOf');
    } else {
        methodNames = new List('valueOf', 'toString');
    }
    for(var name in methodNames) {
        var method = methodNames[name];
        ReturnIfAbrupt(method);
        if(IsCallable(method)) {
            var result = method.[[Call]](O, new List());
            ReturnIfAbrupt(result);
            if(Type(result) !== 'object') return result;
        }
    }

    throw TypeError();
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
        if(argument.[[type]] !== 'normal') { // abrupt completion
            return argument;
        } else {
            return ToBoolean(argument.[[value]]);
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

function ToNumber(argument) {
    var type = Type(argument);
    if(type === 'completion record') {
        if(argument.[[type]] !== 'normal') { // abrupt completion
            return argument;
        } else {
            return ToNumber(argument.[[value]]);
        }
    } else if(type === 'undefine') {
        return NaN;
    } else if(type === 'null') {
        return +0;
    } else if(type === 'boolean') {
        return argument ? 1 : +0;
    } else if(type === 'number') {
        return argument;
    } else if(type === 'string') {
        /**
         * See 7.1.3.1
         * http://people.mozilla.org/~jorendorff/es6-draft.html#sec-tonumber-applied-to-the-string-type
         */
    } else if(type === 'symbol') {
        return NaN;
    } else if(type === 'object') {
        var primValue = ToPrimitive(argument, 'number');
        return ToNumber(primValue);
    }
}

function ToInteger(argument) {}
function ToInt32(argument) {}
function ToUint32(argument) {}
function ToInt16(argument) {}
function ToUint16(argument) {}
function ToInt8(argument) {}
function ToUint8(argument) {}
function ToUint8Clamp(argument) {}

function ToString(argument) {
    var type = Type(argument);
    if(type === 'completion record') {
        if(argument.[[type]] !== 'normal') { // abrupt completion
            return argument;
        } else {
            return ToString(argument.[[value]]);
        }
    } else if(type === 'undefine') {
        return 'undefine';
    } else if(type === 'null') {
        return 'null';
    } else if(type === 'boolean') {
        return argument ? 'true' : 'false';
    } else if(type === 'number') {
         /**
         * See 7.1.12.1
         * http://people.mozilla.org/~jorendorff/es6-draft.html#sec-tostring
         */
    } else if(type === 'string') {
       return argument;
    } else if(type === 'symbol') {
        throw new TypeError();
    } else if(type === 'object') {
        var primValue = ToPrimitive(argument, 'string');
        return ToString(primValue);
    }
}

function ToObject(argument) {}

function ToPropertyKey(argument) {
    ReturnIfAbrupt(argument);
    if(Type(argument) === 'symbol') {
        return argument;
    }
    return ToString(argument);
}

function ToLength(argument) {
    var len = ToInteger(argument);
    ReturnIfAbrupt(len);
    if(len <= +0) return +0;
    return min(len, Math.pow(2, 53) - 1);
}

/**
 * http://people.mozilla.org/~jorendorff/es6-draft.html#sec-testing-and-comparison-operations
 * Testing and Comparison Operations
 */

/**
 * If arugment cannot be converted to Object, this abstract operation must throws an TypeError.
 */
function CheckObjectCoercible(argument) {}

/**
 * if argument has a [[Call]] internal method, then return true, otherwise return false
 */
function IsCallable(argument) {}

function SameValue(x, y) {
    ReturnIfAbrupt(x);
    ReturnIfAbrupt(y);
    if(Type(x) !== Type(y)) return false;
    if(Type(x) === 'undefine') return true;
    if(Type(x) === 'null') return true;
    if(Type(x) === 'number') {
        if(x === NaN && y === NaN) return true;
        if(x === +0 && y === -0) return false;
        if(x === -0 && y === +0) return false;
        if(x === y) return true;
        return false;
    }
    if(Type(x) === 'string') {
        //x and y are the same sequence of code units
    }
    if(Type(x) === 'boolean') {
        //if return true, x and y must both be true or false, otherwise return false
    }
    //Symbol, Object
}
/**
 * SameValueZero treats +0 as the same as -0
 * This is the only diferrence with SameValue
 */
function SameValueZero(x, y) {}

function IsConstructor(argument) {
    ReturnIfAbrupt(argument);
    if(Type(argument) !=== 'object') return false;
    if(argument.[[Construct]]) return true;
    return false;
}

function IsPropertyKey(argument) {
    ReturnIfAbrupt(argument);
    if(Type(argument) === 'string') return true;
    if(Type(argument) === 'symbol') return true;
    return false;
}

function IsExtensible(O) {
    return O.[[IsExtensible]]();
}

/**
 * 7.2.9 Abstract Equality Comparison
 * x == y
 *
 * There is no such "AbstractEqualityComparison" method defined in this spec.
 */
function AbstractEqualityComparison(x, y) {
    if(Type(x) === Type(y)) {
        return StrictEqualityComparison(x, y); // x === y
    }
    if(x === null && y === undefined) return true;
    if(x === undefined && y === null) return true;

    if(Type(x) === 'number' && Type(y) === 'string') {
        return AbstractEqualityComparison(x, ToNumber(y));// x == ToNumber(y)
    }
    if(Type(x) === 'string' && Type(y) === 'number') {
        return AbstractEqualityComparison(ToNumber(x), y);// ToNumber(x) == y
    }

    if(Type(x) === 'boolean') {
        return AbstractEqualityComparison(ToNumber(x), y);
    }
    if(Type(y) === 'boolean') {
        return AbstractEqualityComparison(x, ToNumber(y));
    }

    if((Type(x) === 'string' || Type(x) === 'number') && Type(y) === 'object') {
        return AbstractEqualityComparison(x, ToPrimitive(y));
    }
    if((Type(y) === 'string' || Type(y) === 'number') && Type(x) === 'object') {
        return AbstractEqualityComparison(ToPrimitive(x), y);
    }

    return false;
}

/**
 * 7.2.10 Strict Equality Comparison
 * x === y
 */
function StrictEqualityComparison(x, y) {
    if(Type(x) !== Type(y)) return false;
    if(Type(x) === 'undefine') return true;
    if(Type(x) === 'null') return true;
    if(Type(x) === 'number') {
        if(x === NaN) return false;
        if(y === NaN) return false;
        if(x === +0 && y === -0) return true;
        if(x === -0 && y === +0) return true;
        if(x === y) return true;
        return false;
    }
    if(Type(x) === 'string') {
        //x and y are the same sequence of code units
    }
    if(Type(x) === 'boolean') {
        //if return true, x and y must both be true or false, otherwise return false
    }
    //Symbol, Object
    return false;
}

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