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
 *
 * Construct defined in 7.3.18
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
 *
 * kind: Normal, Method, Arrow
 */
function FunctionCreate(kind, ParameterList, Body, Scope, Strict, functionPrototype) {
    functionPrototype = functionPrototype || Realm.%FunctionPrototype%;
    var F = FunctionAllocate(functionPrototype, Strict);
    return FunctionInitialise(F, kind, ParameterList, Body, Scope);
}

/**
 * 9.2.7 GeneratorFunctionCreate Abstract Operation
 */
function GeneratorFunctionCreate(kind, ParameterList, Body, Scope, Strict, functionPrototype) {
    functionPrototype = = functionPrototype || Realm.%FunctionPrototype%;
    var F = FunctionAllocate(functionPrototype, Strict, 'generator');
    return FunctionInitialise(F, kind, ParameterList, Body, Scope);
}

/**
 * 9.2.8 AddRestrictedFunctionProperties Abstract Operation
 */
function AddRestrictedFunctionProperties(F) {
    var thrower = Realm.%ThrowTypeError%;
    var status = DefinePropertyOrThrow(F, 'caller', new PropertyDescriptor({
        [[Get]]: thrower,
        [[Set]]: thrower,
        [[Enumerable]]: false,
        [[Configurable]]: false
    }));
    ReturnIfAbrupt(status);
    return DefinePropertyOrThrow(F, 'arguments', new PropertyDescriptor({
        [[Get]]: thrower,
        [[Set]]: thrower,
        [[Enumerable]]: false,
        [[Configurable]]: false
    }));
}

/**
 * %ThrowTypeError% object is a unique function object that is defined once for each Reaml as follows:
 * Assert: %FunctionPrototype% for the current Realm has already been initialised.
 * Let functionPrototype be the intrinsic object %FunctionPrototype%.
 * Let scope be the Global Environment of the current Realm.
 * Let formalParameters be the syntactic production: FormalParameters : [empty] .
 * Let body be the syntactic production: FunctionBody : ThrowTypeError .
 * Let F be the result of performing FunctionAllocate with arguments functionPrototype and true.
 * Let %ThrowTypeError% be F.
 * Perform the abstract operation FunctionInitialise with arguments F, Normal, formalParameters, body, and scope.
 * Call the [[PreventExtensions]] internal method of F.
 * Return F.
 */


/**
 * 9.2.9 MakeConstructor Abstract Operation
 */
function MakeConstructor(F, writablePrototype, prototype) {
    var installNeeded = false;
    var status;

    if(!prototype) {
        installNeeded = true;
        prototype = Realm.%ObjectPrototype%;
    }
    if(!writablePrototype) {
        writablePrototype = true;
    }
    F.[[Construct]] = Function.prototype.[[Construct]];
    if(installNeeded) {
        status = DefinePropertyOrThrow(prototype, 'constructor', new PropertyDescriptor({
            [[Value]]: F,
            [[Writable]]: writablePrototype,
            [[Enumerable]]: false,
            [[Configurable]]: writablePrototype
        }));
        ReturnIfAbrupt(status);
    }
    status = DefinePropertyOrThrow(F, 'prototype', new PropertyDescriptor({
        [[Value]]: prototype,
        [[Writable]]: writablePrototype,
        [[Enumerable]]: false,
        [[Configurable]]: false
    }));
    ReturnIfAbrupt(status);
    return NormalCompletion(undefined);
}

/**
 * 9.2.10 MakeMethod ( F, methodName, homeObject) Abstract Operation
 */
function MakeMethod(F, methodName, homeObject) {
    F.[[NeedsSuper]] = true;
    F.[[HomeObject]] = homeObject;
    F.[[MethodName]] = methodName;
    return NormalCompletion(undefined);
}

/**
 * 9.2.11 SetFunctionName Abstract Operation
 */
function SetFunctionName(F, name, prefix) {
    var description;
    if(Type(name) === 'symbol') {
        description = name.[[description]];
        if(!description) {
            name = '';
        } else {
            name = '[' + description + ']';
        }
    }
    if(name !=== '' && prefix) {
        name = prefix + ' ' + name;
    }
    F.[[DefineOwnProperty]]('name', new PropertyDescriptor({
        [[Value]]: name,
        [[Writable]]: false,
        [[Enumerable]]: false,
        [[Configurable]]: true
    }));
    return NormalCompletion(undefined);
}

/**
 * 9.2.12 GetSuperBinding(obj) Abstract Operation
 */
function GetSuperBinding(obj) {
    if(Type(obj) !== 'object') return undefined;
    if(!obj.[[NeedsSuper]]) return undefined;
    return obj.[[HomeObject]];
}

/**
 * 9.2.13 CloneMethod(F, newHome, newName) Abstract Operation
 */
function CloneMethod(F, newHome, newName) {
    var newF = new Function();
    if(F.[[NeedsSuper]]) {
        newF.[[HomeObject]] = newHome;
        newF.[[MethodName]] = newName || F.[[MethodName]];
    }
    return newF;
}

/**
 * 9.2.14 Function Declaration Instantiation
 *
 * NOTE When an execution context is established for evaluating function code a new
 * Declarative Environment Record is created and bindings for each formal parameter, 
 * and each function level variable, constant, or function declarated in the function 
 * are instantiated in the environment record. Formal parameters and functions are
 * initialised as part of this process. All other bindings are initialised during 
 * execution of the function code.
 * 
 * NOTE:
 *     this version is not update.
 */
function FunctionDeclarationInstantiation(func, argumentsList, env) {
    var code = func.[[Code]];
    var strict = func.[[Strict]];
    var formals = func.[[FormalParameters]];
    var parameterNames = formals.BoundNames;
    var varDeclaratons = code.VarScopedDeclarations;
    var functionsToInitialise = new List();
    var argumentsObjectNeeded = func.[[ThisMode]] === 'lexical' ? false : true;

    var len = varDeclaratons.length;
    while(len--) {
        var d = varDeclaratons[len];
        if(d is FunctionDeclaration) {
            /**
             * NOTE: If there are multiple FunctionDeclarations for the same name,
             * the last declaration is used.
             *
             * I think I should use env.VarNames to get d's BoundNames.
             */
            var fn = d.BoundNames;
            if(fn === 'arguments') {
                argumentsObjectNeeded = false;
            }
            var alreadyDeclared = env.HasBinding(fn);
            if(!alreadyDeclared) {
                var status = env.CreateMutableBinding(fn);
                functionsToInitialise.append(d);
            }
        }
    }
    for(var paramName of parameterNames) {
        var alreadyDeclared = env.HasBinding(paramName);
        /**
         * NOTE: Duplicate parameter names can only occur in non-strict functions. 
         * Parameter names that are the same as function declaration names do not 
         * get initialised to undefined.
         */
        if(!alreadyDeclared) {
            if(paramName === 'arguments') {
                argumentsObjectNeeded = false;
            }
            var status = env.CreateMutableBinding(paramName);
            env.InitialiseBinding(paramName, undefined);
        }
    }
    /**
     * NOTE: If there is a function declaration or formal parameter with the name
     * 'arguments' then an argument object is not created.
     */
    if(argumentsObjectNeeded) {
        if(strict) {
            env.CreateImmutableBinding('arguments');
        } else {
            var status = env.CreateMutableBinding('arguments');
        }
    }
    varNames = code.VarDeclaredNames;
    for(var varName of varNames) {
        alreadyDeclared = env.HasBinding(varName);
        /**
         * NOTE: A VarDeclaredNames is only instantiated and initialised here
         * if it is not also the name of a formal parameter or a FunctionDeclarations.
         */
        if(!alreadyDeclared) {
            status = env.CreateMutableBinding(varName);
        }
    }
    var lexDeclarations = code.LexicalDeclarations;
    for(var d of lexDeclarations) {
        /**
         * NOTE: A lexically declared name cannot be the same as a function declaration, 
         * formal parameter, or a var name. Lexically declarated names are only 
         * instantiated here but not initialised.
         */
        for(var dn of d.BoundNames) {
            if(IsConstantDeclaration(d)) {
                env.CreateImmutableBinding(dn);
            } else {
                status = env.CreateMutableBinding(dn, false);
            }
        }
        if(d is GeneratorDeclaration) {
            functionsToInitialise.append(d);
        }
    }
    for(var f of functionsToInitialise) {
        var fn = f.BoundNames;
        var fo = f.InstantiateFunctionObject(env);
        status = env.SetMutableBinding(fn, fo, false);
    }
    /**
     * NOTE: Function declaration are initialised prior to parameter initialisation 
     * so that default value expressions may reference them. "arguments" is not 
     * initialised until after parameter initialisation.
     */
    var formalStatus = formals.IteratorBindingInitialisation(CreateListIterator(argumentsList), undefined);
    ReturnIfAbrupt(formalStatus);
    if(argumentsObjectNeeded) {
        var ao = InstantiateArgumentsObject(argumentsList);
        if(strict) {
            CompleteStrictArgumentsObject(ao);
        } else {
            CompleteMappedArgumentsObject(ao, func, formals, env);
        }
        env.InitialiseBinding('arguments', ao);
    }
    return NormalCompletion(empty);
}
/**
 * 9.3 Built-in Function Objects
 */
/**
 * 9.4 Built-in Exotic Object Internal Methods and Data Fields
 */
/**
 * 9.5 Proxy Object Internal Methods and Internal Slots
 */