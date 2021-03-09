
/**
 * Calculates the amperage in a circuit using voltage and wattage
 * 
 * @param {Number} v Voltage
 * @param {Number} p Wattage
 */
function calculateAmperage(v, p) {
    v = delLetters(v);
    p = delLetters(p);

    return i = p / v;
}


/**
 * Calculates the power factor in a circuit
 * 
 * @param {Number} p Wattage
 * @param {Number} v Voltage
 * @param {Number} i Current
 */
function calculatePowerFactor(p, v, i) {
    p = delLetters(p);
    v = delLetters(v);
    i = delLetters(i);

    return p / (v * i);
}


/**
 * Calculates the single phase apparent power (VA) in a circuit
 * 
 * @param {Number} p Wattage
 * @param {Number} pf Power factor
 */
function calculateVA(p, pf) {
    p = delLetters(p);
    pf = delLetters(pf);

    return p / pf;
}