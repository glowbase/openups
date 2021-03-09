const toggles = document.getElementsByClassName('toggle-nav');
const nav = document.getElementsByClassName('left-nav')[0];


window.addEventListener('resize', () => {
    checkMobile();
});


window.addEventListener('load', async () => {
    checkMobile();
    await displayUPSStatus();

    setInterval(async () => {
        await displayUPSStatus();
    }, 1000);
});


Array.prototype.slice.call(toggles).forEach(toggle => {
    toggle.addEventListener('click', () => {
        nav.classList.toggle('hide-nav');
    });
});


function checkMobile() {
    if (isMobile()) {
        nav.classList.toggle('hide-nav');
        document.body.classList.toggle('mobile');
    }
}


//? -----------------------------------------------------------------------
//?     DASHBOARD UPS STATS
//? -----------------------------------------------------------------------
async function displayUPSStatus() {
    const {
        input,
        output,
        battery
    } = await getStatus();
    
    const {
        summaryNormalMsg:normalMsg,
        summaryWarningMsg:warningMsg
    } = await getSummary();

    setAlerts(normalMsg, warningMsg);

    setHeadingStates([
        [input.state, input.stateText],
        [output.state, output.stateText],
        [battery.state, battery.stateText],
    ]);

    setTextValues(input, output, battery);
    setProgressValues(output, battery);

    return;
    // Set Values
    const values = document.getElementsByClassName('value');

    const endRuntime = new Date(
        new Date(
            new Date().setSeconds(
                new Date().getSeconds() + batteryRemainingSeconds
            )
        )
    ).toISOString();

    const batteryEndRuntimeFormatted = endRuntime.substring(
        endRuntime.indexOf('T') + 1, endRuntime.indexOf('.')
    );

    const inputCurrent = calculateAmperage(inputVoltage[0], outputWattage[0], 2);
    const inputWattage = inputCurrent === 0 ? 0 : inputCurrent * inputVoltage;

    const data = [
        inputVoltage,
        inputCurrent,
        inputWattage,
        inputFrequency,
        outputVoltage,
        outputCurrent,
        outputWattage,
        outputFrequency,
        batteryVoltage,
        batteryRemainingFormatted,
        batteryEndRuntimeFormatted,
    ];

    const replaceMetrics = [
        ['V'],
        ['A'],
        ['Watts'],
        ['VA'],
        ['Hz'],
        ['hr.', 'h'],
        ['min.', 'm']
    ];

    for (i = 0; i < data.length; i++) {
        let currentData = data[i].length === 1 ? data[i][0] : data[i];

        replaceMetrics.forEach(metric => {
            if (!currentData.toString().includes(metric[0])) return;

            currentData = currentData.replace(metric[0], metric[1] || '');
        });

        values[i].innerHTML = currentData;
    }

    // Progress Bars
    const loadBar = document.getElementById('loadBar');
    const capacityBar = document.getElementById('capacityBar');

    const bars = [
        outputLoad[0].replace(' ', ''),
        batteryCapacity.replace(' ', '')
    ]
    
    loadBar.style.width = bars[0];
    loadBar.innerText = bars[0];

    capacityBar.style.width = bars[1];
    capacityBar.innerText = bars[1];
}


/**
 * Sets the heading colour and text reflecting the UPS state
 * 
 * @param {Object} states Input, output and battery states
 */
function setHeadingStates(states) {
    const row = document.querySelectorAll('.status-row')[0];

    // Set header state text
    const texts = row.querySelectorAll('.statetext');

    for (i = 0; i < states.length; i++) {
        if (texts[i].innerText !== states[i][1]) {
            texts[i].innerText = states[i][1];
        }
    }

    // Set header colours
    const headers = row.querySelectorAll('.card-header');
    const icons = row.querySelectorAll('.ph-check-circle-bold');

    for (i = 0; i < states.length; i++) {
        if (states[i][0] === 0 && states[i][1] === 'Unknown') {
            headers[i].classList.add('bg-secondary');
            icons[i].classList.add('ph-question');

        } else if (states[i][0] === 1 && !states[i][1].startsWith('Normal')) {
            headers[i].classList.add('bg-warning');
            icons[i].classList.add('ph-warning-bold');

        } else {
            headers[i].classList.remove('bg-warning');
            icons[i].classList.remove('ph-warning-bold');

        }
    }
}


function setTextValues(input, output, battery) {
    
}


/**
 * Updates the load and capacity progress bars
 * 
 * @param {Object} output UPS output values
 * @param {Object} battery UPS battery values
 */
function setProgressValues(output, battery) {
    const row = document.querySelectorAll('.status-row')[0];
    const bars = row.querySelectorAll('.bars');

    const values = [
        delLetters(output.loads[0]),
        delLetters(battery.capacity),
    ];

    for (i = 0; i < bars.length; i++) {
        bars[i].style.width = values[i] + '%';
        bars[i].innerText = values[i] + '%';
    }
}


/**
 * Displays alerts regarding the UPS's status
 * 
 * @param {Array} normalMsg Normal alert items
 * @param {Array} warningMsg Warning alert items
 */
async function setAlerts(normalMsg, warningMsg) {

    // Normal Messages
    const normalAlert = document.getElementById('normal-alerts');

    if (normalMsg.length) {
        normalAlert.classList.remove('hide');
        normalAlert.innerHTML = null;

        normalMsg.forEach(msg => {
            normalAlert.innerHTML += `<div>${msg}</div>`;
        });
    } else {
        normalAlert.classList.add('hide');
    }

    // Warning messages
    const warningAlert = document.getElementById('warning-alerts');

    if (warningMsg.length) {
        warningAlert.classList.remove('hide');
        warningAlert.innerHTML = null;

        warningMsg.forEach(msg => {
            warningAlert.innerHTML += `<div>${msg}</div>`;
        });
    } else {
        warningAlert.classList.add('hide');
    }
}