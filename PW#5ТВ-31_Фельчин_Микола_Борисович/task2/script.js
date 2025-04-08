function formatNumber(number) {
    return number.toLocaleString('uk-UA', { maximumFractionDigits: 2 });
}

function calculateLosses() {
    const zperA = parseFloat(document.getElementById('zper_a').value);
    const zperP = parseFloat(document.getElementById('zper_p').value);
    const omega = parseFloat(document.getElementById('omega').value);
    const tV = parseFloat(document.getElementById('t_v').value);
    const kP = parseFloat(document.getElementById('k_p').value);
    const PM = parseFloat(document.getElementById('P_m').value);
    const TM = parseFloat(document.getElementById('T_m').value);
   
    const MWnedA = omega * tV * PM * TM / 1000;
   
    const MWnedP = kP * PM * TM / 1000;
   
    const MZper = zperA * MWnedA + zperP * MWnedP;
   
    document.querySelector('#result_M_W_ned_a span').textContent = formatNumber(MWnedA);
    document.querySelector('#result_M_W_ned_p span').textContent = formatNumber(MWnedP);
    document.querySelector('#result_M_Z_per span').textContent = formatNumber(MZper);
}

window.onload = function() {
    calculateLosses();
};