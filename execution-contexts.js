/**
 * http://people.mozilla.org/~jorendorff/es6-draft.html#sec-executable-code-and-execution-contexts
 */

//class
function EnvironmentRecord() {}

EnvironmentRecord.prototype = {
    constructor: EnvironmentRecord,
    HasBinding: function(N) {},
    CreateMutableBinding: function(N, D) {},
    CreateImmutableBinding: function(N) {},
    InitialiseBinding: function(N,V) {},
    SetMutableBinding: function(N,V, S) {},
    GetBindingValue: function(N,S) {},
    DeleteBinding: function(N) {},
    HasThisBinding: function() {},
    HasSuperBinding: function() {},
    WithBaseObject: function() {}
};

function DeclarativeEnvironmentRecord() {
    EnvironmentRecord.call(this);
}

DeclarativeEnvironmentRecord.prototype = {
    constructor: DeclarativeEnvironmentRecord,

    HasBinding: function(N) {
        var envRec = this;
        //If envRec has a binding which name is N, then return true
        return false;
    },

    CreateMutableBinding: function(N, D) {
        var envRec = this;
        if(!envRec.HasBinding(N)) {
            //create a mutable binding in envRec for N and record that it is uninitialised.
            //If D is true record that the newly created binding may be deleted by a subsequent DeleteBinding call.
            return new NormalCompletion()
        }
    },

    CreateImmutableBinding: function(N) {
        var envRec = this;
        if(!envRec.HasBinding(N)) {
            //Create an immutable binding in envRec for N and record that it is unintialised.
        }
    },

    InitialiseBinding: function(N, V) {
        var envRec = this;
        //get an uninitialised binding
        if(envRec.HasBinding(N) && envRec.GetBindingValue(N) === undefined) {
            //Set the bound value for N in envRec to V
            //Record that the binding for N in envRec has been initialised.
        }
    },

    SetMutableBinding: function(N, V, S) {
        var envRec = this;
        if(envRec.HasBinding(N)) {
            //If the binding for N in envRec has not yet been initialised throw a ReferenceError exception.
            //Else if the binding for N in envRec is a mutable binding, change its bound value to V.
            //Else this must be an attempt to change the value of an immutable binding so if S is true throw a TypeError exception.
            //Return NormalCompletion(empty).
        }
    },

    GetBindingValue: function(N, S) {},

    DeleteBinding: function(N) {},

    HasThisBinding: function() {
        return false;
    },

    HasSuperBinding: function() {
        return false;
    },
    
    WithBaseObject: function() {
        return undefined;
    }
};

function ObjectEnvironmentRecord() {
    EnvironmentRecord.call(this);
    this.unscopables   = new List();
    this.bindingObject = {};
}

ObjectEnvironmentRecord.prototype = {
    constructor: ObjectEnvironmentRecord,

    HasBinding: function(N) {
        var envRec = this;
        if(N in envRec.unscopables) return false;
        var bindings = envRec.bindingObject;
        return HasProperty(bindings, N);
    },

    CreateMutableBinding: function(N, D) {
        var envRec = this;
        var bindings = envRec.bindingObject;
        var configValue = !!D;
        return DefinePropertyOrThrow(bindings, N, {
            [[Value]]: undefined,
            [[Writable]]: true,
            [[Enumerable]]: true,
            [[Configurable]]: configValue
        });
    },

    //Object Environment Record doesn't have a immutable binding.
    CreateImmutableBinding: function(N) {},

    InitialiseBinding: function(N, V) {},

    SetMutableBinding: function(N, V, S) {
        var envRec = this;
        var bindings = envRec.bindingObject;
        return Put(bindings, N, V, S);
    },

    GetBindingValue: function(N, S) {
        var envRec = this;
        var bindings = envRec.bindingObject;
        var value = HasProperty(bindings, N);
        ReturnIfAbrupt(value);
        if(!value) {
            if(!S) return undefined;
            throw new ReferenceError();
        }
        return Get(bindings, N);
    },

    DeleteBinding: function(N) {
        var envRec = this;
        var bindings = envRec.bindingObject;
        return bindings.__Delete__(N);
    },

    HasThisBinding: function() {
        return false;
    },

    HasSuperBinding: function() {
        return false;
    },
    
    WithBaseObject: function() {
        var envRec = this;
        if(envRec.withEnvironment) return envRec.bindingObject;
        return undefined;
    }
};

function GlobalEnvironmentRecord() {
    EnvironmentRecord.call(this);
    this.outerLexicalEnvironment = null;
    this.ObjectEnvironment       = new ObjectEnvironmentRecord();
    this.DeclarativeEnvironment  = new DeclarativeEnvironmentRecord();
    this.VarNames = new List();
}

GlobalEnvironmentRecord.prototype.CreateMutableBinding = function(N, D) {
    var envRec = this;
    var DclRec = envRec.DeclarativeEnvironment;
    if(!DclRec.HasBinding(N)) {
        return DclRec.CreateMutableBinding(N, D);
    }
};

GlobalEnvironmentRecord.prototype.CreateImmutableBinding = function(N) {
    var envRec = this;
    var DclRec = envRec.DeclarativeEnvironment;
    if(!DclRec.HasBinding(N)) {
        return DclRec.CreateImmutableBinding(N);
    }
};

GlobalEnvironmentRecord.prototype.InitialiseBinding = function(N, V) {
    var envRec = this;
    var DclRec = envRec.DeclarativeEnvironment;
    if(DclRec.HasBinding(N)) {
        return DclRec.InitialiseBinding(N, V);
    }

    var ObjRec = envRec.ObjectEnvironment;
    return ObjRec.InitialiseBinding(N, V);
};

GlobalEnvironmentRecord.prototype.SetMutableBinding  = function(N, V, S) {
    var envRec = this;
    var DclRec = envRec.DeclarativeEnvironment;
    if(DclRec.HasBinding(N)) {
        return DclRec.SetMutableBinding(N, V, S);
    }
    var ObjRec = envRec.ObjectEnvironment;
    return ObjRec.SetMutableBinding(N, V, S);
};

GlobalEnvironmentRecord.prototype.GetBindingValue = function(N, S) {
    var envRec = this;
    var DclRec = envRec.DeclarativeEnvironment;
    if(DclRec.HasBinding(N)) {
        return DclRec.GetBindingValue(N, S);
    }
    var ObjRec = envRec.ObjectEnvironment;
    return ObjRec.GetBindingValue(N, S);
};

GlobalEnvironmentRecord.prototype.DeleteBinding  = function(N) {
    var envRec = this;
    var DclRec = envRec.DeclarativeEnvironment;
    if(DclRec.HasBinding(N)) {
        return DclRec.DeleteBinding(N);
    }

    var ObjRec = envRec.ObjectEnvironment;
    if(ObjRec.HasBinding(N)) {
        var status = ObjRec.DeleteBinding(N);
        ReturnIfAbrupt(status);
        if(status === true) {
            var varNames = envRec.VarNames;
            /**
             * varNames is a List.
             * For right now, I don't know what methods does the List have...
             */
            if(varNames.contains(N)) {
                varNames.remove(N);
            }
        }
        return status;
    }
    return true;
};

GlobalEnvironmentRecord.prototype.HasThisBinding = function() {
    return true;
};

GlobalEnvironmentRecord.prototype.HasSuperBinding = function() {
    return false;
};

GlobalEnvironmentRecord.prototype.WithBaseObject = function() {
    return undefined;
};

GlobalEnvironmentRecord.prototype.GetThisBinding = function(N) {
    var envRec = this;
    var ObjRec = envRec.ObjectEnvironment;
    var bindings = ObjRec.bindingObject;
    return bindings;
};

GlobalEnvironmentRecord.prototype.HasVarDeclaration = function(N) {
    var envRec = this;
    var varDeclaraedNames = envRec.VarNames;
    if(varDeclaraedNames.contains(N)) return true;
    return false;
};

GlobalEnvironmentRecord.prototype.HasLexicalDeclaration = function(N) {
    var envRec = this;
    var DclRec = envRec.DeclarativeEnvironment;
    return DclRec.HasBinding(N);
};

GlobalEnvironmentRecord.prototype.CanDeclareGlobalVar = function(N) {
    var envRec = this;
    var ObjRec = envRec.ObjectEnvironment;
    if(ObjRec.HasBinding(N)) return true;
    var bindings = ObjRec.bindingObject;
    var extensible = IsExtensible(bindings);
    return extensible;
};

GlobalEnvironmentRecord.prototype.CanDeclareGlobalFunction  = function(N) {
    var envRec = this;
    var ObjRec = envRec.ObjectEnvironment;
    var globalObject = ObjRec.bindingObject;
    var extensible = IsExtensible(globalObject);
    ReturnIfAbrupt(extensible);
    if(!ObjRec.HasBinding(N)) return extensible;
    var existingProp = globalObject.__GetOwnProperty__(N);
    if(existingProp === undefined) return extensible;
    if(existingProp.__Configurable__) return true;
    if(IsDataDescriptor(existingProp) && existingProp.__Writable__ === true && existingProp.__Enumerable__ === true) return true;
    return false;
};

GlobalEnvironmentRecord.prototype.CreateGlobalVarBinding = function(N, D) {
    var envRec = this;
    var ObjRec = envRec.ObjectEnvironment;
    if(!ObjRec.HasBinding(N)) {
        var status = ObjRec.CreateMutableBinding(N, D);
        ReturnIfAbrupt(status);
    }
    var varDeclaraedNames = envRec.VarNames;
    if(!varDeclaraedNames.contains(N)) {
        varDeclaraedNames.add(N);
    }
    return NormalCompletion();
};

GlobalEnvironmentRecord.prototype.CreateGlobalFunctionBinding = function(N, V, D) {
    var envRec = this;
    var ObjRec = envRec.ObjectEnvironment;
    var globalObject = ObjRec.bindingObject;
    var existingProp = globalObject.__GetOwnProperty__(N);
    if(existingProp === undefined || existingProp.__Configurable__ === true) {
        var desc = new PropertyDescriptior({
            [[Value]]: V,
            [[Writable]]:true,
            [[Enumerable]]: true,
            [Configurable]]: D
        })
    } else {
        var desc = PropertyDescriptior({
            [[Value]]: V
        })
    }
    var status = DefinePropertyOrThrow(globalObject, N, Desc);
    ReturnIfAbrupt(status);
    var varDeclaraedNames = envRec.varNames;
    if(!varDeclaraedNames.contains(N) {
        varDeclaraedNames.add(N);
    }
    return NormalCompletion();
};


function FunctionEnvironmentRecord() {
    DeclarativeEnvironmentRecord.call(this);
}

FunctionEnvironmentRecord.prototype.HasThisBinding = function() {
    return true;
};

FunctionEnvironmentRecord.prototype.HasSuperBinding = function() {
    return !!this.HomeObject;
};

FunctionEnvironmentRecord.prototype.GetThisBinding = function() {
    return this.thisValue;
};

FunctionEnvironmentRecord.prototype.GetSuperBase = function() {
    var home = this.HomeObject;
    if(!home) return undefined;
    if(Type(O) === 'object') {
        home.__GetPrototypeOf__();
    }
};

FunctionEnvironmentRecord.prototype.GetMethodName = function() {
    return this.MethodName;
};

/**
 * Lexical Environment Operations
 */
function LexicalEnvironment() {
    //this.EnvironmentRecord;
    //this.outerLexicalEnvironment;
}

function GetIdentifierRefrence(lex, name, strict) {
    if(lex === null) {
        return new Reference(undefined, name, strict);
    }
    var envRec = lex.EnvironmentRecord;
    var exists = envRec.HasBinding(N);
    ReturnIfAbrupt(exists);
    if(exists) {
        return new Reference(envRec, name, strict);
    } else {
        var outer = lex.outerLexicalEnvironment;
        return GetIdentifierRefrence(outer, name, strict);
    }
}

function NewDeclarativeEnvironment(E) {
    var env = new LexicalEnvironment();
    var envRec = new DeclarativeEnvironmentRecord();
    env.EnvironmentRecord = envRec;
    env.outerLexicalEnvironment = E;
    return env;
}

function NewObjectEnvironment(O, E) {
    var env = new LexicalEnvironment();
    var envRec = new ObjectEnvironmentRecord();
    envRec.bindingObject = O;
    envRec.unscopables = new List();
    env.EnvironmentRecord = envRec;
    env.outerLexicalEnvironment = E;
    return env;
}

function NewFunctionEnvironment(F, T) {
    //Assert: The value of F's [[ThisMode]] internal slot is not lexical
    var env = new LexicalEnvironment();
    var envRec = new FunctionEnvironmentRecord();
    envRec.thisValue = T;
    if(F.__NeedSuper__) {
        var home = F.__HomeOjbect__;
        if(home === undefined) throw new ReferenceError();
        envRec.HomeObject = home;
        envRec.MethodName = F.__MethodName__;
    } else {
        envRec.HomeObject = Empty;
    }
    env.EnvironmentRecord = envRec;
    env.outerLexicalEnvironment = F.__Environment__;
    return env;
}

/**
 * 8.2 Code Realms
 * http://people.mozilla.org/~jorendorff/es6-draft.html#sec-code-realms
 */
function CreateRealm() {
    var realmRec = new Record();
    var intrinsics = new Record();
    /**
     * http://people.mozilla.org/~jorendorff/es6-draft.html#table-7
     * initialized intrinsics with the value listed in Table 7.
     */
    realmRec.[[intrinsics]] = intrinsics;
    var newGlobal = ObjectCreate(null);//ObjectCreate is defined in 9.1.13
    //
    realmRec.[[globalThis]] = newGlobal;
    var newGlobalEnv = NewGlobalEnvironment(newGlobal, intrinsics); //I don't know where is NewGlobalEnvironment defined.
    realmRec.[[globalEnv]] = newGlobalEnv;
    realmRec.[[directEvalTranslate]] = undefined;
    realmRec.[[directEvalFallback]] = undefined;
    realmRec.[[indirectEval]] = undefined;
    realmRec.[[Function]] = undefined;
    return realmRec;
}

/**
 * 8.3 Execution Contexts
 * http://people.mozilla.org/~jorendorff/es6-draft.html#sec-execution-contexts
 */
function ResolveBinding(name) {
    var env = RunningExecutionContext.LexicalEnvironment;
    var strict = true; //or false
    return GetIdentifierRefrence(env, name, strict);
}

/**
 * The loop in step 2 will always terminate because the list of environments always ends with the global environment which has a this binding.
 */
function GetThisEnvironment() {
    var lex = RunningExecutionContext.LexicalEnvironment;
    while(1) {
        var envRec = lex.EnvironmentRecord;
        var exists = envRec.HasThisBinding();
        if(exists) return envRec;
        var outer = lex.outerLexicalEnvironment;
        lex = outer;
    }
}

function ResolveThisBinding() {
    var env = GetThisEnvironment();
    return env.GetThisBinding();
}

function GetGlobalObject() {
    var ctx = RunningExecutionContext;
    var currentRealm = ctx.Realm;
    return currentRealm.[[globalThis]];
}

/**
 * 8.4 Tasks and Task Queues
 * http://people.mozilla.org/~jorendorff/es6-draft.html#sec-tasks-and-task-queues
 */
function Task(task, arguments, reaml) {
    this.[[Task]] = task;
    this.[[Arguments]] = arguments;
    this.[[Realm]] = reaml;
}
//TODO