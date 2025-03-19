function openTab(evt, tabName) {
    var i, tabcontent, tablinks;
    tabcontent = document.getElementsByClassName("tabcontent");
    for (i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = "none";
    }
    tablinks = document.getElementsByClassName("tablinks");
    for (i = 0; i < tablinks.length; i++) {
        tablinks[i].className = tablinks[i].className.replace(" active", "");
    }
    document.getElementById(tabName).style.display = "block";
    evt.currentTarget.className += " active";
}

function normalDistribution(x, pc, sigma) {
    return (1 / (sigma * Math.sqrt(2 * Math.PI))) * 
           Math.exp(-Math.pow(x - pc, 2) / (2 * Math.pow(sigma, 2)));
}

function integrateNormalDistribution(pc, sigma, lowerBound, upperBound, steps = 10000) {
    const step = (upperBound - lowerBound) / steps;
    let sum = 0;

    for (let i = 0; i < steps; i++) {
        // метод середніх прямокутників щоб це не значило
        const x = lowerBound + (i + 0.5) * step; 
        sum += normalDistribution(x, pc, sigma) * step;
    }

    return sum;
}

function calculateResults() {
    const pc = parseFloat(document.getElementById('pc').value);
    const sigma1 = parseFloat(document.getElementById('sigma1').value);
    const sigma2 = parseFloat(document.getElementById('sigma2').value);
    const price = parseFloat(document.getElementById('price').value);
    
    const maxMistake = pc * 0.05
    const lowerBound = pc - maxMistake;
    const upperBound = pc + maxMistake;
    
    const deltaInit = integrateNormalDistribution(pc, sigma1, lowerBound, upperBound) * 100;
    document.getElementById('initialPercentage').innerHTML = 
        `Частка енергії без небалансу (δₘₜ₁): <strong>${deltaInit.toFixed(1)}%</strong>`;
    
    const w1 = pc * 24 * (deltaInit / 100);
    document.getElementById('initialEnergy').innerHTML = 
        `Енергія без небалансу (W₁): <strong>${w1.toFixed(1)} МВт·год</strong>`;
    
    const p1 = w1 * price;
    document.getElementById('initialProfit').innerHTML = 
        `Прибуток (П₁): <strong>${p1.toFixed(1)} тис. грн</strong>`;
    
    const w2 = pc * 24 * (1 - deltaInit / 100);
    document.getElementById('initialImbalancedEnergy').innerHTML = 
        `Енергія з небалансом (W₂): <strong>${w2.toFixed(1)} МВт·год</strong>`;
    
    const penalty1 = w2 * price;
    document.getElementById('initialPenalty').innerHTML = 
        `Штраф (Шт₁): <strong>${penalty1.toFixed(1)} тис. грн</strong>`;
    
    const totalProfit1 = p1 - penalty1;
    document.getElementById('initialTotalProfit').innerHTML = 
        `Загальний результат: <strong>${totalProfit1.toFixed(1)} тис. грн</strong>`;
    
    const deltaImproved = integrateNormalDistribution(pc, sigma2, lowerBound, upperBound) * 100;
    document.getElementById('improvedPercentage').innerHTML = 
        `Частка енергії без небалансу (δₘₜ₂): <strong>${deltaImproved.toFixed(1)}%</strong>`;
    
    const w3 = pc * 24 * (deltaImproved / 100);
    document.getElementById('improvedEnergy').innerHTML = 
        `Енергія без небалансу (W₃): <strong>${w3.toFixed(1)} МВт·год</strong>`;
    
    const p2 = w3 * price;
    document.getElementById('improvedProfit').innerHTML = 
        `Прибуток (П₂): <strong>${p2.toFixed(1)} тис. грн</strong>`;
    
    const w4 = pc * 24 * (1 - deltaImproved / 100);
    document.getElementById('improvedImbalancedEnergy').innerHTML = 
        `Енергія з небалансом (W₄): <strong>${w4.toFixed(1)} МВт·год</strong>`;
    
    const penalty2 = w4 * price;
    document.getElementById('improvedPenalty').innerHTML = 
        `Штраф (Шт₂): <strong>${penalty2.toFixed(1)} тис. грн</strong>`;
    
    const totalProfit2 = p2 - penalty2;
    document.getElementById('improvedTotalProfit').innerHTML = 
        `Загальний результат: <strong>${totalProfit2.toFixed(1)} тис. грн</strong>`;
    
    const profitImprovement = totalProfit2 - totalProfit1;
    document.getElementById('profitImprovement').innerHTML = 
        `Приріст прибутку після вдосконалення: <strong>${profitImprovement.toFixed(1)} тис. грн</strong>`;
}

document.getElementById('calculate').addEventListener('click', calculateResults);

document.addEventListener('DOMContentLoaded', function() {
    calculateResults();
});