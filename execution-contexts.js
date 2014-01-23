/**
 * http://people.mozilla.org/~jorendorff/es6-draft.html#sec-executable-code-and-execution-contexts
 */

//class
function EnvironmentRecord() {}

function DeclarativeEnvironmentRecord() {
    EnvironmentRecord.call(this);
}

function ObjectEnvironmentRecord() {
    EnvironmentRecord.call(this);
}

function GlobalEnvironmentRecord() {
    EnvironmentRecord.call(this);
    this.outerLexicalEnvironment = null;
}

function FunctionEnvironmentRecord() {
    DeclarativeEnvironmentRecord.call(this);
}

function LexicalEnvironment() {
    this.record;
    this.outerLexicalEnvironment;
}

