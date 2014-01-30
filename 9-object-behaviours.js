/**
 * 9 Ordinary and Exotic Objects Behaviours
 * http://people.mozilla.org/~jorendorff/es6-draft.html#sec-ordinary-and-exotic-objects-behaviours
 */

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

};