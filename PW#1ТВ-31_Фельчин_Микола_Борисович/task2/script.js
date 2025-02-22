const elements = ["H", "C", "S", "O", "V", "W", "A", "Q"];
const inputContainer = document.getElementById("inputs");

elements.forEach(el => {
    inputContainer.innerHTML += `<label>${el}:</label><input type="number" id="${el}" step="0.01"><br>`;
});

function calculateResults() {
    const values = {};
    elements.forEach(el => {
        values[el] = parseFloat(document.getElementById(el).value) || 0;
    });

    const conversionFactor = (100 - values.W - values.A) / 100;
    const carbonWorking = values.C * conversionFactor;
    const hydrogenWorking = values.H * conversionFactor;
    const oxygenWorking = values.O * conversionFactor;
    const sulfurWorking = values.S * conversionFactor;
    const ashWorking = values.A * (100 - values.W) / 100;
    const vanadiumWorking = values.V * (100 - values.W) / 100;
    const heatValueWorking = values.Q * (100 - values.W - values.A) / 100;

    const results = `
        <h3>Results (Working Mass)</h3>
        <p>Hydrogen: ${hydrogenWorking.toFixed(2)}%</p>
        <p>Carbon: ${carbonWorking.toFixed(2)}%</p>
        <p>Sulfur: ${sulfurWorking.toFixed(2)}%</p>
        <p>Oxygen: ${oxygenWorking.toFixed(2)}%</p>
        <p>Vanadium: ${vanadiumWorking.toFixed(2)} mg/kg</p>
        <p>Ash: ${ashWorking.toFixed(2)}%</p>
        <p>Heat Value: ${heatValueWorking.toFixed(2)} MJ/kg</p>
    `;
    
    document.getElementById("results").innerHTML = results;
}
