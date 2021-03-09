/**
 * 
 */
async function getStatus() {
    return await (await axios.get(
        `${API}/ups/status?token=${TOKEN}`
    )).data;
}


/**
 * 
 */
async function getSummary() {
    return await (await axios.get(
        `${API}/ups/summary?token=${TOKEN}`
    )).data;
}


/**
 * 
 */
async function getSpecifications() {
    return await (await axios.get(
        `${API}/ups/specifications?token=${TOKEN}`
    )).data;
}


/**
 * 
 */
async function getLocalHost() {
    return await (await axios.get(
        `${API}/ups/host?token=${TOKEN}`
    )).data;
}


/**
 * 
 */
async function getDiagnostics() {
    return await (await axios.get(
        `${API}/diagnostics/status?token=${TOKEN}`
    )).data;
}


/**
 * 
 */
async function getRecentLogs() {
    return await (await axios.get(
        `${API}/logs/recent?token=${TOKEN}`
    )).data;
}


/**
 * 
 */
async function batteryTest() {
    return await (await axios.post(
        `${API}/logs/recent?token=${TOKEN}`
    )).data;
}


/**
 * 
 */
async function indicatorTest() {
    return await (await axios.post(
        `${API}/logs/recent?token=${TOKEN}`
    )).data;
}


/**
 * 
 */
async function alarmTest() {
    return await (await axios.post(
        `${API}/logs/recent?token=${TOKEN}`
    )).data;
}


/**
 * 
 */
async function runtimeCalibration() {
    return await (await axios.post(
        `${API}/logs/recent?token=${TOKEN}`
    )).data;
}