const elements = ["H", "C", "S", "N", "O", "W", "A"];
const inputContainer = document.getElementById("inputs");

elements.forEach(el => {
    inputContainer.innerHTML += `<label>${el}ᴿ, %:</label><input type="number" id="${el}" step="0.01"><br>`;
});

function calculateResults() {
    const values = {};
    elements.forEach(el => {
        values[el] = parseFloat(document.getElementById(el).value);
    });

    const KRC = (100 / (100 - values.W));
    const KRG = (100 / (100 - values.W - values.A));
    const QRN = (339 * values.C + 1030 * values.H - 108.8 * (values.O - values.S) - 25 * values.W)/1000;
    const QDN = (QRN + 0.025 * values.W) * KRC;
    const QDAFN = (QRN + 0.025 * values.W) * KRG;

    const dryMassCompositionResult = {};
    const combustibleMassCompositionResult = {};

    elements.forEach(el => {
        dryMassCompositionResult[el] = (values[el] * KRC);
        combustibleMassCompositionResult[el] = (values[el] * KRG);
    });

    document.getElementById("results").innerHTML = `
        <h3>Results</h3>
        <p>Raw to Dry: ${KRC.toFixed(2)}</p>
        <p>Raw to Combustible: ${KRG.toFixed(2)}</p>
        <h4>Lower Heating Values (MJ/kg)</h4>
        <p>Raw Mass (Qn): ${(QRN).toFixed(4)}</p>
        <p>Dry Mass (Qn): ${(QDN).toFixed(2)}</p>
        <p>Combustible Mass (Qn): ${(QDAFN).toFixed(2)}</p>

        <h4>Dry Mass Composition</h4>
        <p>H<sub>C</sub>: ${dryMassCompositionResult.H.toFixed(2)}%</p>
        <p>C<sub>C</sub>: ${dryMassCompositionResult.C.toFixed(2)}%</p>
        <p>S<sub>C</sub>: ${dryMassCompositionResult.S.toFixed(2)}%</p>
        <p>N<sub>C</sub>: ${dryMassCompositionResult.N.toFixed(2)}%</p>
        <p>O<sub>C</sub>: ${dryMassCompositionResult.O.toFixed(2)}%</p>
        <p>A<sub>C</sub>: ${dryMassCompositionResult.A.toFixed(2)}%</p>

        <h4>Combustible Mass Composition</h4>
        <p>H<sub>G</sub>: ${combustibleMassCompositionResult.H.toFixed(2)}%</p>
        <p>C<sub>G</sub>: ${combustibleMassCompositionResult.C.toFixed(2)}%</p>
        <p>S<sub>G</sub>: ${combustibleMassCompositionResult.S.toFixed(2)}%</p>
        <p>N<sub>G</sub>: ${combustibleMassCompositionResult.N.toFixed(2)}%</p>
        <p>O<sub>G</sub>: ${combustibleMassCompositionResult.O.toFixed(2)}%</p>
    `;
}
