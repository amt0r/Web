const EFFICIENCY_ASH_TRAPPING = 0.985;
const A_VYN = 0.8;

function resetToDefaults() {
    document.getElementById('coal-amount').value = "1096363";
    document.getElementById('coal-ash').value = "25.2";
    document.getElementById('coal-heat').value = "20.47";
    document.getElementById('coal-combustibles').value = "1.5";

    document.getElementById('mazut-amount').value = "70945";
    document.getElementById('mazut-ash-dry').value = "0.15";
    document.getElementById('mazut-heat').value = "39.48";
}

function reset() {
    document.getElementById('coal-amount').value = "";
    document.getElementById('coal-ash').value = "";
    document.getElementById('coal-heat').value = "";
    document.getElementById('coal-combustibles').value = "";

    document.getElementById('mazut-amount').value = "";
    document.getElementById('mazut-ash-dry').value = "";
    document.getElementById('mazut-heat').value = "";
}


function calculateResults() {
    const values = getInputValues();
    const results = calculateEmissions(values);
    updateResults(results);
}

function getInputValues() {
    return {
        coalAmount: parseFloat(document.getElementById('coal-amount').value),
        coalAsh: parseFloat(document.getElementById('coal-ash').value),
        coalHeat: parseFloat(document.getElementById('coal-heat').value),
        coalCombustibles: parseFloat(document.getElementById('coal-combustibles').value),

        mazutAmount: parseFloat(document.getElementById('mazut-amount').value),
        mazutAshDry: parseFloat(document.getElementById('mazut-ash-dry').value),
        mazutHeat: parseFloat(document.getElementById('mazut-heat').value),
    };
}

function calculateEmissions(values) {
    const coalEmission = calculateCoalEmission(values.coalAsh, values.coalHeat, values.coalCombustibles);
    const coalTotal = calculateCoalGrossEmission(coalEmission, values.coalAmount, values.coalHeat);

    const mazutEmission = calculateMazutEmission(values.mazutAshDry, values.mazutHeat);
    const mazutTotal = calculateMazutGrossEmission(mazutEmission, values.mazutHeat, values.mazutAmount);

    //При спалюванні природного газу тверді частинки відсутні.
    const gasEmission = 0;
    const gasTotal = 0;

    return {
        coalEmission,
        coalTotal,
        mazutEmission,
        mazutTotal,
        gasEmission,
        gasTotal,
        totalEmission: coalEmission + mazutEmission + gasEmission,
        totalGrossEmission: coalTotal + mazutTotal + gasTotal
    };
}

function calculateCoalEmission(ash, heatValue, combustibles) {
    const emission = (1e6 / heatValue) * A_VYN * (ash / (100 - combustibles)) * (1 - EFFICIENCY_ASH_TRAPPING);
    return emission;
}

function calculateCoalGrossEmission(emission, heatValue, amount) {
    const grossEmission = 1e-6 * emission * heatValue * amount;
    return grossEmission;
}

function calculateMazutEmission(ashDry, heatValue) {
    const emission = (1e6 / heatValue) * (ashDry / 100) * (1 - EFFICIENCY_ASH_TRAPPING);
    return emission;
}

function calculateMazutGrossEmission(emission, heatValue, amount) {
    const grossEmission = 1e-6 * emission * heatValue * amount;
    return grossEmission;
}

function updateResults(results) {
    document.getElementById('coal-emission').textContent = results.coalEmission.toFixed(0);
    document.getElementById('coal-total').textContent = results.coalTotal.toFixed(0);

    document.getElementById('mazut-emission').textContent = results.mazutEmission.toFixed(2);
    document.getElementById('mazut-total').textContent = results.mazutTotal.toFixed(2);

    document.getElementById('gas-emission').textContent = results.gasEmission.toFixed(0);
    document.getElementById('gas-total').textContent = results.gasTotal.toFixed(0);

    document.getElementById('total-emision').textContent = results.totalEmission.toFixed(2);
    document.getElementById('total-total').textContent = results.totalGrossEmission.toFixed(2);
}