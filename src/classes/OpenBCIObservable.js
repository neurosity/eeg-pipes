
const { Observable } = require('rxjs/Rx');
const operators = require('../operators');

class OpenBCIObservable extends Observable {
    lift (operator) {
        const observable = new this();
        observable.source = this;
        observable.operator = operator;
        return observable;
    }
}

operators.forEach(operator => {
    Object.assign(Observable.prototype, {
        [operator.name]: operator
    });
});

module.exports = OpenBCIObservable;
