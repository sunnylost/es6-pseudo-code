/**
 * 9 Ordinary and Exotic Objects Behaviours
 * http://people.mozilla.org/~jorendorff/es6-draft.html#sec-ordinary-and-exotic-objects-behaviours
 */

Object.prototype.[[Prototype]]  = null;
Object.prototype.[[Extensible]] = true;

/**
 * 9.1.1
 */
Object.prototype.[[GetPrototypeOf]] = function() {
    return this.[[Prototype]];
};

/**
 * 9.1.2
 */
Object.prototype.[[SetPrototypeOf]] = function(V) {
    var O = this;
    var extensible = O.[[Extensible]];
    var current = O.[[Prototype]];
    if(SameValue(V, current)) return true;
    if(!extensible) return false;
    if(V !== null) {
        var p = V;
        while(p !== null) {
            if(SameValue(p, O)) return false;
            var nextp = p.[[GetPrototypeOf]]();
            ReturnIfAbrupt(nextp);
            p = nextp;
        }
    }
    O.[[Prototype]] = V;
    return true;
};

/**
 * 9.1.3
 */
Object.prototype.[[IsExtensible]] = function() {
    return this.[[Extensible]];
}; 

/**
 * 9.1.4
 */
Object.prototype.[[PreventExtensions]] = function() {
    this.[[Extensible]] = false;
    return true;
};

/**
 * 9.1.5.1
 */
Object.prototype.[[GetOwnProperty]] = function(P) {
    return OrdinaryGetOwnProperty(this, P);
}; 

function OrdinaryGetOwnProperty(O, P) {
    if(O[P] === undefined) return undefined;
    var D = new PropertyDescriptor();
    var X = O[P];
    if(IsDataDescriptor(X)) {
        D.[[Value]] = X.[[Value]];
        D.[[Writable]] = X.[[Writable]];
    } else {
        D.[[Get]] = X.[[Get]];
        D.[[Set]] = X.[[Set]];
    }
    D.[[Enumerable]] = X.[[Enumerable]];
    D.[[Configurable]] = X.[[Configurable]];
    return D;
}

/**
 * 9.1.6
 */
Object.prototype.[[DefineOwnProperty]] = function(P, Desc) {
};

/**
 * 9.1.7
 */
Object.prototype.[[HasProperty]] = function(P) {
    var hasOwn = this.[[GetOwnProperty]](P);
    ReturnIfAbrupt(hasOwn);
    if(hasOwn === undefined) {
        var parent = this.[[GetPrototypeOf]]();
        ReturnIfAbrupt(parent);
        if(parent !== null) {
            return parent.[[HasProperty]](P);
        }
    }
    return hasOwn;
};

/**
 * 9.1.8
 */
Object.prototype.[[Get]] = function(P, Receiver) {
    var desc = this.[[GetOwnProperty]](P);
    ReturnIfAbrupt(desc);
    if(desc === undefined) {
        var parent = this.[[GetPrototypeOf]]();
        ReturnIfAbrupt(parent);
        if(!parent) return undefined;
        return parent.[[Get]](P, Receiver);
    }
    if(IsDataDescriptor(desc)) return desc.[[Value]];
    var getter = desc.[[Get]];
    if(!getter) return undefined;
    return getter.[[Call]](Receiver, new List());
};

/**
 * 9.1.9
 */
Object.prototype.[[Set]] = function(P, V, Receiver) {

};

/**
 * 9.1.10
 */
Object.prototype.[[Delete]] = function(P) {
    var desc = this.[[GetOwnProperty]](P);
    if(!desc) return true;
    if(desc.[[Configurable]]) {
        //Remove the own property with the name P from O
        return true;
    }
    return false;
};

/**
 * 9.1.11
 */
Object.prototype.[[Enumerate]] = function() {

};

/**
 * 9.1.12
 */
Object.prototype.[[OwnPropertyKeys]] = function() {
    var keys = new List();
    for(var P in this) { // For each own property key P of O, may be not like this...
        keys.add(P);
    }
    return CreateListIterator(keys);
};

/**
 * 9.1.13
 */
function ObjectCreate(proto, internalDataList) {}

/**
 * 9.1.14
 */
function OrdinaryCreateFromConstructor(constructor, intrinsicDefaultProto, internalDataList) {}

/**
 * 9.2 ECMAScript Function Objects
 */

/**
 * Function has addition interal slots
 * http://people.mozilla.org/~jorendorff/es6-draft.html#table-26
 */
Function.prototype.[[Environment]] = new LexicalEnvironment();
Function.prototype.[[FormalParameters]]; //parse node
Function.prototype.[[FunctionKind]] = 'normal';//or 'generator'
Function.prototype.[[Code]];//parse node
Function.prototype.[[Realm]] = new Realm();
Function.prototype.[[ThisMode]]; //lexical, strict, global
Function.prototype.[[Strict]]     = false;
Function.prototype.[[NeedsSuper]] = false;
Function.prototype.[[HomeObject]] = null;
Function.prototype.[[MethodName]] = '';//or a symbol

/**
 * 9.2.1
 */
Function.prototype.[[Construct]] = function(argumentsList) {
    return Construct(this, argumentsList);
};

/**
 * 9.2.2
 * non-strict mode
 */
Function.prototype.[[GetOwnProperty]] = function(P) {
    var v = OrdinaryGetOwnProperty(this, P);
    ReturnIfAbrupt(v);
    if(IsDataDescriptor(v)) {
        //v.[[Value]] is a strict mode Function object
        if(P === 'caller' && v.[[Value]].[[Strict]]) {
            v.[[Value]] = null;
        }
    }
    return v;
}

/**
 * 9.2.3 FunctionAllocate Abstract Operation
 */
function FunctionAllocate(functionPrototype, strict, functionKind) {
    functionKind = functionKind || 'normal';
    var F = new Function();
    if(strict) {
        F.[[GetOwnProperty]] = Object.prototype.[[GetOwnProperty]];
    }
    F.[[Strict]] = strict;
    F.[[FunctionKind]] = functionKind;
    F.[[Prototype]] = functionPrototype;
    F.[[Extensible]] = true;
    F.[[Realm]] = RunningExecutionContext.Realm;
    return F;
}

/**
 * 9.2.4
 */
Function.prototype.[[Call]] = function(thisArgument, argumentsList) {
    if(F.[[Code]] === undefined) throw new TypeError();
    var callerContext = RunningExecutionContext;
    /**
     * NOTE:
     *     isSuspended and suspend() are not defined in this spec.
     */
    if(!callerContext.isSuspended) {
        callerContext.suspend();
    }
    var calleeContext = new ExecutionContext();
    var calleeRealm = F.[[Realm]];
    calleeContext.Realm = calleeRealm;
    var ThisMode = F.[[ThisMode]];

    var localEnv, thisValue;
    if(ThisMode === 'lexical') {
        localEnv = NewDeclarativeEnvironment(F.[[Environment]]);
    } else {
        if(ThisMode === 'strict') {
            thisValue = thisArgument;
        } else {
            if(!thisArgument) {
                thisValue = calleeRealm.[[globalThis]];
            } else if(Type(thisArgument) !== 'object') {
                thisValue = ToObject(thisArgument);
            } else {
                thisValue = thisArgument;
            }
        }
        localEnv = NewFunctionEnvironment(F, thisValue);
        ReturnIfAbrupt(localEnv);
    }
    calleeContext.LexicalEnvironment = localEnv;
    calleeContext.VariableEnvironment = localEnv;
    /**
     * push calleeContext onto the execution context stack
     */
    RunningExecutionContext = callerContext;
    var status = FunctionDeclarationInstantiation(F, argumentsList, localEnv);
    if(status.[[value]] !== 'normal') {
        /**
         * remove calleeContext from the execution context stack
         */
        RunningExecutionContext = callerContext;
        return status;
    }
    /**
     * Let result be the result of EvaluateBody of the production that is the value of F's [[Code]] internal slot passing F as the argument.
     * 
     * remove calleeContext from the execution context stack
     */
    RunningExecutionContext = callerContext;
    return result;
}

/**
 * 9.2.5 FunctionInitialise Abstract Operation
 */
function FunctionInitialise(F, kind, ParameterList, Body, Scope) {
    var len = ParameterList.ExpectedArgumentCount;
    var strict = F.[[Strict]];
    var status = DefinePropertyOrThrow(F, 'length', new PropertyDescriptor({
        [[Value]]: len,
        [[Writable]]: false,
        [[Enumerable]]: false,
        [[Configurable]]: true
    }));
    ReturnIfAbrupt(status);
    if(strict) {
        status = AddRestrictedFunctionProperties(F);
        ReturnIfAbrupt(status);
    }
    F.[[Environment]] = Scope;
    F.[[FormalParameters]] = ParameterList;
    F.[[Code]] = Body;
    if(kind === 'arrow') {
        F.[[ThisMode]] = 'lexical';
    } else if(strict) {
        F.[[ThisMode]] = 'strict';
    } else {
        F.[[ThisMode]] = 'global';
    }
    return F;
}

/**
 * 9.2.6 FunctionCreate Abstract Operation
 */

/**
 * 9.2.7 GeneratorFunctionCreate Abstract Operation
 */

/**
 * 9.2.8 AddRestrictedFunctionProperties Abstract Operation
 */

/**
 * 9.2.9 MakeConstructor Abstract Operation
 */

/**
 * 9.2.10 MakeMethod ( F, methodName, homeObject) Abstract Operation
 */

/**
 * 9.2.11 SetFunctionName Abstract Operation
 */

/**
 * 9.2.12 GetSuperBinding(obj) Abstract Operation
 */

/**
 * 9.2.13 CloneMethod(function, newHome, newName) Abstract Operation
 */

/**
 * 9.2.14 Function Declaration Instantiation
 * NOTE:
 *     this version is not update.
 */
function FunctionDeclarationInstantiation() {

}