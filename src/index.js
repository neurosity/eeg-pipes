
const OpenBCIRx = require('./classes/OpenBCIRx');

module.exports = new Proxy(OpenBCIRx, {
    apply(target, context, args) {
        return new target(...args)
            .toObservable();
    }
});
