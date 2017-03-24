
/**
 * @method voltsToMicrovolts
 * Takes an array of volts and returns an array of microvolts
 * 
 * @param {any} arrayOfVolts array of volts
 * @returns {any} arrayOfMicrovolts
 */
module.exports = (arrayOfVolts, log = false) => {

    const microvolts = arrayOfVolts.map(volt =>
        log
            ? Math.log10(Math.pow(10, 6) * volt)
            : Math.pow(10, 6) * volt
    );

    return microvolts;
};
