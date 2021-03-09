/**
 * 
 * @param {Object} o Object containing key/value pairs
 */
function convertObjectToQuery(o) {
    const k = Object.keys(o);

    let q = `?${k[0]}=${o[k[0]]}`;

    delete(k[0]);

    k.forEach(i => {
        q += `&${i}=${o[i]}`;
    });

    return q;
}


/**
 * 
 */
function isMobile() {
    return [
        /Android/i,
        /webOS/i,
        /iPhone/i,
        /iPad/i,
        /iPod/i,
        /BlackBerry/i,
        /Windows Phone/i
    ].some(m => {
        return navigator.userAgent.match(m)
    });
}


/**
 * 
 * @param {String} text
 */
function delLetters(text) {
    return parseFloat(
        text.toString().replace(/[^\d.-]/g, '')
    );
}