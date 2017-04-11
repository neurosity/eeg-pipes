
const { Observable } = require('rxjs/Rx');
const operators = require('../operators');

class BCIObservable extends Observable {
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

module.exports = BCIObservable;
