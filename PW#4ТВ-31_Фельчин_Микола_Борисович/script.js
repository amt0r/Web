document.addEventListener('DOMContentLoaded', function() {
  const tabButtons = document.querySelectorAll('.tab-button');
  const tabPanes = document.querySelectorAll('.tab-pane');
  
  tabButtons.forEach(button => {
    button.addEventListener('click', () => {
      tabButtons.forEach(btn => btn.classList.remove('active'));
      
      document.querySelector('.tab-content').classList.remove('active');
      
      tabPanes.forEach(pane => pane.style.display = 'none');
      
      button.classList.add('active');
      
      const tabId = button.getAttribute('data-tab');
      const tabPane = document.getElementById(tabId);
      if (tabPane) {
        tabPane.style.display = 'block';
        document.querySelector('.tab-content').classList.add('active');
      }
    });
  });
  
  if (tabButtons.length > 0 && tabPanes.length > 0) {
    tabButtons[0].classList.add('active');
    tabPanes[0].style.display = 'block';
    document.querySelector('.tab-content').classList.add('active');
  }

  const economicDensityTable = {
      "bare": {
          "copper": {
              "1000-3000": 2.5,
              "3000-5000": 2.1,
              "5000+": 1.8
          },
          "aluminum": {
              "1000-3000": 1.3,
              "3000-5000": 1.1,
              "5000+": 1.0
          }
      },
      "paper": {
          "copper": {
              "1000-3000": 3.0,
              "3000-5000": 2.5,
              "5000+": 2.0
          },
          "aluminum": {
              "1000-3000": 1.6,
              "3000-5000": 1.4,
              "5000+": 1.2
          }
      },
      "rubber": {
          "copper": {
              "1000-3000": 3.5,
              "3000-5000": 3.1,
              "5000+": 2.7
          },
          "aluminum": {
              "1000-3000": 1.9,
              "3000-5000": 1.7,
              "5000+": 1.6
          }
      }
  };

  function getThermalCoefficient(cableType) {
      if (cableType === "paper") {
          return 92;
      } else if (cableType === "rubber") {
          return 65;
      } else {
          return 75;
      }
  }

  function determineCableModel(cableType, conductorType) {
      if (cableType === "paper") {
          if (conductorType === "aluminum") {
              return "ААБ";
          } else {
              return "СБ";
          }
      } else if (cableType === "rubber") {
          return "ВВГ";
      } else {
          return "Шина";
      }
  }

  function getOperatingHoursCategory(operatingHours) {
      if (operatingHours > 1000 && operatingHours <= 3000) {
          return "1000-3000";
      } else if (operatingHours > 3000 && operatingHours <= 5000) {
          return "3000-5000";
      } else if (operatingHours > 5000) {
          return "5000+";
      } else {
          return "1000-3000";
      }
  }

  const standardSizes = [16, 25, 35, 50, 70, 95, 120, 150, 185, 240];

  function calculateShortCircuit() {
      const mode = document.getElementById('operatingMode').value;
      const transformerUkmax = parseFloat(document.getElementById('transformerUkmax').value);
      const highVoltage = parseFloat(document.getElementById('highVoltage').value);
      const lowVoltage = parseFloat(document.getElementById('lowVoltage').value);
      const Snom = parseFloat(document.getElementById('Snom').value);
      
      let Rc, Xc;
      if (mode === 'normal') {
          Rc = parseFloat(document.getElementById('resistanceNormal').value);
          Xc = parseFloat(document.getElementById('reactanceNormal').value);
      } else {
          Rc = parseFloat(document.getElementById('resistanceMinimal').value);
          Xc = parseFloat(document.getElementById('reactanceMinimal').value);
      }
      
      const Xt = (transformerUkmax * Math.pow(highVoltage, 2)) / (100 * Snom);
      
      const Xsh = Xc + Xt;
      const Rsh = Rc;
      const Zsh = Math.sqrt(Math.pow(Rsh, 2) + Math.pow(Xsh, 2));
      
      const I3sh = (highVoltage * 1000) / (Math.sqrt(3) * Zsh);
      const I2sh = I3sh * Math.sqrt(3) / 2;
      
      const kpr = Math.pow(lowVoltage, 2) / Math.pow(highVoltage, 2);
      
      const Rsh_n = Rsh * kpr;
      const Xsh_n = Xsh * kpr;
      const Zsh_n = Math.sqrt(Math.pow(Rsh_n, 2) + Math.pow(Xsh_n, 2));
      const I3sh_n = (lowVoltage * 1000) / (Math.sqrt(3) * Zsh_n);
      const I2sh_n = I3sh_n * Math.sqrt(3) / 2;
      
      const R10 = 7.91;
      const X10 = 4.49;
      
      const R10_n = R10 + Rsh_n;
      const X10_n = X10 + Xsh_n;
      const Z10_n = Math.sqrt(Math.pow(R10_n, 2) + Math.pow(X10_n, 2));
      
      const I3_10 = (lowVoltage * 1000) / (Math.sqrt(3) * Z10_n);
      const I2_10 = I3_10 * Math.sqrt(3) / 2;
      
      document.getElementById('threePhaseShortCircuit').textContent = I3sh.toFixed(0) + ' А';
      document.getElementById('twoPhaseShortCircuit').textContent = I2sh.toFixed(0) + ' А';
      document.getElementById('actualThreePhaseShortCircuit').textContent = I3sh_n.toFixed(0) + ' А';
      document.getElementById('actualTwoPhaseShortCircuit').textContent = I2sh_n.toFixed(0) + ' А';
      
      document.getElementById('point10ThreePhaseShortCircuit').textContent = I3_10.toFixed(0) + ' А';
      document.getElementById('point10TwoPhaseShortCircuit').textContent = I2_10.toFixed(0) + ' А';
  }

  function calculateCableCrossSection() {
      const voltage = parseFloat(document.getElementById('cableVoltage').value);
      const shortCircuitCurrent = parseFloat(document.getElementById('shortCircuitCurrent').value) * 1000;
      const shortCircuitTime = parseFloat(document.getElementById('shortCircuitTime').value);
      const calculatedLoad = parseFloat(document.getElementById('calculatedLoad').value);
      const operatingHours = parseFloat(document.getElementById('operatingHours').value);
      
      const cableType = document.getElementById('cableType').value;
      const conductorType = document.getElementById('conductorType').value;
      
      let cableModel = determineCableModel(cableType, conductorType);
      
      const hoursCategory = getOperatingHoursCategory(operatingHours);
      
      const economicDensity = economicDensityTable[cableType][conductorType][hoursCategory];
      const thermalCoef = getThermalCoefficient(cableType);
      
      const normalCurrent = (calculatedLoad / 2) / (Math.sqrt(3) * voltage);
      
      const economicCrossSection = normalCurrent / economicDensity;
      
      const thermalCrossSection = (shortCircuitCurrent * Math.sqrt(shortCircuitTime)) / thermalCoef;
      
      const requiredCrossSection = Math.max(economicCrossSection, thermalCrossSection);
      
      let standardCrossSection = standardSizes[0];
      
      for (let i = 0; i < standardSizes.length; i++) {
          if (standardSizes[i] >= requiredCrossSection) {
              standardCrossSection = standardSizes[i];
              break;
          }
          
          if (i === standardSizes.length - 1) {
              standardCrossSection = standardSizes[i];
          }
      }
      
      const cableResultContent = document.getElementById('cableResultContent');
      cableResultContent.innerHTML = `
          <p>Необхідний переріз кабелю: ${requiredCrossSection.toFixed(0)} мм²</p>
          <p>Рекомендований стандартний переріз: ${standardCrossSection} мм²</p>
          <p>Рекомендується використовувати кабель ${cableModel} ${voltage} кВ 3×${standardCrossSection} мм²</p>
      `;
  }

  function calculateThreePhaseShortCircuit() {
      const voltage = parseFloat(document.getElementById('threePhaseVoltage').value);
      const power = parseFloat(document.getElementById('power').value);
      const transformerPower = parseFloat(document.getElementById('threePhaseTransformerPower').value);
      
      const xc = (voltage * voltage) / power;
      
      const ukPercent = 10.5;
      const xt = (ukPercent * voltage * voltage) / (100 * transformerPower);
      
      const xk = xc + xt;
      
      const current = voltage / (Math.sqrt(3) * xk);
      
      document.getElementById('currentValue').textContent = current.toFixed(1);
  }

  document.getElementById('calculateShortCircuit').addEventListener('click', calculateShortCircuit);
  document.getElementById('calculateCable').addEventListener('click', calculateCableCrossSection);
  document.getElementById('calculateThreePhase').addEventListener('click', calculateThreePhaseShortCircuit);

  calculateShortCircuit();
  calculateCableCrossSection();
  calculateThreePhaseShortCircuit();
});