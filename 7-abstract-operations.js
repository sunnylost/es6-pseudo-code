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

/**
 * 7.3.1 Get a property P from object O
 * @param {[type]} O [Object]
 * @param {[type]} P [Property]
 */
function Get(O, P) {
    return O.[[Get]](P, O);
}

/**
 * 7.3.2 Set the value of a specific property of an object.
 * @param {[type]} O     [Object]
 * @param {[type]} P     [Property]
 * @param {[type]} V     [Any ECMAScript type]
 * @param {[type]} Throw [Boolean]
 */
function Put(O, P, V, Throw) {
    var success = O.[[Set]](P, V, O);
    ReturnIfAbrupt(success);
    if(!success && Throw) throw new TypeError();
    return success;
}

/**
 * 7.3.3 create a new own property of an object.
 * @param {[type]} O [Object]
 * @param {[type]} P [Property]
 * @param {[type]} V [Any ECMAScript type]
 */
function CreateDataProperty(O, P, V) {
    var newDesc = new PropertyDescriptor({
        [[Value]]: V,
        [[Writable]]: true,
        [[Enumerable]]: true,
        [[Configurable]]: true
    });
    return O.[[DefineOwnProperty]](P, newDesc);
}

/**
 * 7.3.4 create a new own property of an object.
 * @param {[type]} O [Object]
 * @param {[type]} P [Property]
 * @param {[type]} V [Any ECMAScript type]
 */
function CreateDataPropertyOrThrow(O, P, V) {
    var success = CreateDataProperty(O, P, V);
    ReturnIfAbrupt(success);
    if(!success) throw new TypeError();
    return success;
}

/**
 * 7.3.5 
 * @param {[type]} O    [Object]
 * @param {[type]} P    [Property]
 * @param {[type]} desc [Property Descriptor]
 */
function DefinePropertyOrThrow(O, P, desc) {
    var success = O.[[DefineOwnProperty]](P, desc);
    ReturnIfAbrupt(success);
    if(!success) throw new TypeError();
    return success;
}

/**
 * 7.3.6 
 * @param {[type]} O [Object]
 * @param {[type]} P [Property]
 */
function DeletePropertyOrThrow(O, P) {
    var success = O.[[Delete]](P);
    ReturnIfAbrupt(success);
    if(!success) throw new TypeError();
    return success;
}

/**
 * 7.3.7 get the value of a specific property of an object.
 * @param {[type]} O [description]
 * @param {[type]} P [description]
 */
function GetMethod(O, P) {
    var func = O.[[Get]](P, O);
    ReturnIfAbrupt(func);
    if(func === undefined) return undefined;
    if(!IsCallable(func)) throw new TypeError();
    return func;
}

/**
 * 7.3.8 determine whether an object has a property with the specified property key.
 * @param {[type]} O [Object]
 * @param {[type]} P [Property]
 */
function HasProperty(O, P) {
    return O.[[HasProperty]](P);
}

/**
 * 7.3.9 determine whether an object has an own property with the specified property key.
 * @param {[type]} O [Object]
 * @param {[type]} P [Property]
 */
function HasOwnProperty(O, P) {
    var desc = O.[[GetOwnProperty]](P);
    ReturnIfAbrupt(desc);
    if(desc === undefined) return false;
    return true;
}

/**
 * 7.3.10 call a method property of an object.
 * @param {[type]} O      [Object]
 * @param {[type]} P      [Property]
 * @param {[type]} args   [List]
 */
function Invoke(O, P, args) {
    args = args || new List();
    var obj = ToObject(O);
    ReturnIfAbrupt(obj);
    var func = obj.[[Get]](P, O);
    if(!IsCallable(func)) throw new TypeError();
    ReturnIfAbrupt(func);
    return func.[[Call]](O, args);
}

/**
 * 7.3.11 
 * level will be either "sealed" or "frozen"
 * @param {[type]} O     [Object]
 * @param {[type]} level [String]
 */
function SetIntegrityLevel(O, level) {
    var keys = O.[[OwnPropertyKeys]]();
    ReturnIfAbrupt(keys);
    var pendingException = undefined;
    if(level === 'sealed') {
        for(var k of keys) {
            var status = DefinePropertyOrThrow(O, k, new PropertyDescriptor({ [[Configurable]]: false }));
            if(status.[[type]] !=== 'normal') { // status is an abrupt completion
                if(pendingException === undefined) {
                    pendingException = status;
                }
            }
        }
    } else if(level === 'frozen') {
        for(var k of keys) {
            var status = O.[[GetOwnProperty]](k);
            if(status.[[type]] !=== 'normal') {
                if(pendingException === undefined) {
                    pendingException = status;
                }
            } else {
                var currentDesc = status.[[value]];
                if(currentDesc !== undefined) {
                    if(IsAccessorDescriptor(currentDesc)) {
                        var desc = new PropertyDescriptor({
                            [[Configurable]]: false
                        });
                    } else {
                        var desc = new PropertyDescriptor({
                            [[Configurable]]: false,
                            [[Writable]]: false
                        });
                    }
                    var status = DefinePropertyOrThrow(O, k, desc);
                    if(status.[[type]] !=== 'normal') {
                        if(pendingException === undefined) {
                            pendingException = status;
                        }
                    }
                } 
            }
        }
    }
    if(pendingException !== undefined) return pendingException;
    return O.[[PreventExtensions]]();
}


function TestIntegrityLevel(O, level) {}

/**
 * 7.3.13 create an Array object whose elements are provided by a List.
 * @param {[type]} elements [List]
 */
function CreateArrayFromList(elements) {
    var array = ArrayCreate(0);
    var n = 0;
    for(var e of elements) {
        var status = CreateDataProperty(array, ToString(n), e);
        n++;
    }
    return array;
}

/**
 * 7.3.14 create a List whose values are provided by a array-like object.
 * @param {[type]} obj [description]
 */
function CreateListFromArrayLike(obj) {
    if(Type(obj) !== 'object') throw new TypeError();
    var len = Get(obj, 'length');
    var n = ToLength(len);
    ReturnIfAbrupt(n);
    var list = new List();
    var index = 0;
    while(index < n) {
        var indexName = ToString(index);
        var next = Get(objm indexName);
        ReturnIfAbrupt(next);
        list.push(next);
        index++;
    }
    return list;
}

/**
 * 7.3.15 determining if an object O inherits from the instance object inheritance path provided by constructor C
 * @param {[type]} C [description]
 * @param {[type]} O [description]
 */
function OrdinaryHasInstance(C, O) {
    if(!IsCallable(C)) return false;
    if('[[BoundTargetFunction]]' in C) {
        var BC = C.[[BoundTargetFunction]];
        return InstanceofOperator(O, BC);
    }
    if(Type(O) !== 'object') return false;
    var P = Get(C, 'prototype');
    ReturnIfAbrupt(P);
    if(Type(P) !== 'object') throw new TypeError();
    while(true) {
        O = O.[[GetPrototypeOf]]();
        ReturnIfAbrupt(O);
        if(O === null) return false;
        if(SameValue(P, O)) return true;
    }
}

/**
 * 7.3.16
 * @param {[type]} constructor           [Object]
 * @param {[type]} intrinsicDefaultProto [String]
 */
function GetPrototypeFromConstructor(constructor, intrinsicDefaultProto) {
    if(!IsConstructor(constructor)) throw new TypeError();
    var proto = Get(constructor, 'prototype');
    ReturnIfAbrupt(proto);
    if(Type(proto) !== 'object') {
        if('[[Realm]]' in constructor) {
            var realm = constructor.[[Realm]];
        } else {
            var ctx = RunningExecutionContext;
            var realm = ctx.Realm;
        }
        proto = realm[intrinsicDefaultProto];
    }
    return proto;
}

/**
 * 7.3.17
 * @param {[type]} F [Object]
 */
function CreateFromConstructor(F) {
    var creator = Get(F, @@create);
    ReturnIfAbrupt(creator);
    if(creator === undefined) return undefined;
    if(!IsCallable(creator)) throw new TypeError();
    var obj = creator.[[Call]](F, new List());
    ReturnIfAbrupt(obj);
    if(Type(obj) !== 'object') throw new TypeError();
    return obj;
}

/**
 * 7.3.18 
 * @param {[type]} F             [description]
 * @param {[type]} argumentsList [description]
 */
function Construct(F, argumentsList) {
    var obj = CreateFromConstructor(F);
    ReturnIfAbrupt(obj);
    if(obj === undefined) {
        obj = OrdinaryCreateFromConstructor(F, '%ObjectPrototype%');
        ReturnIfAbrupt(obj);
        if(Type(obj) !== 'object') throw new TypeError();
    }
    var result = F.[[Call]](obj, argumentsList);
    ReturnIfAbrupt(result);
    if(Type(result) === 'object') return result;
    return obj;
}

/**
 * 7.3.19 retrieve the value of a specified property of an object
 * @param {[type]} options [Object]
 * @param {[type]} P       [Property]
 */
function GetOption(options, P) {
    if(options === undefined) return undefined;
    if(Type(options) !== 'object') throw new TypeError();
    return options.[[Get]](P, O);
}

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