
const CytonRx = require('./classes/CytonRx');
const GanglionRx = require('./classes/GanglionRx');

const getProxy = proxy => new Proxy(proxy, {
    apply(target, context, args) {
        return new target(...args)
            .toObservable();
    }
});

const Cyton = getProxy(CytonRx);
const Ganglion = getProxy(GanglionRx);

module.exports = {
    Cyton,
    Ganglion
};
