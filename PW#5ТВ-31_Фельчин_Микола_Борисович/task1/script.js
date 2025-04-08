const elements = [
    { id: 'T-110kV', name: 'T-110 кВ', omega: 0.015, tB: 100, mu: 1, tP: 43 },
    { id: 'T-35kV', name: 'T-35 кВ', omega: 0.02, tB: 80, mu: 1, tP: 28 },
    { id: 'T-10kV-cable', name: 'T-10 кВ (кабельна мережа 10 кВ)', omega: 0.005, tB: 60, mu: 0.5, tP: 20 },
    { id: 'T-10kV-air', name: 'T-10 кВ (повітряна мережа 10 кВ)', omega: 0.05, tB: 60, mu: 0.5, tP: 10 },
    { id: 'V-110kV', name: 'В-110 кВ (елегазовий)', omega: 0.01, tB: 30, mu: 0.1, tP: 30 },
    { id: 'V-10kV-oil', name: 'В-10 кВ (малооливний)', omega: 0.02, tB: 15, mu: 0.33, tP: 15 },
    { id: 'V-10kV-vacuum', name: 'В-10 кВ (вакуумний)', omega: 0.01, tB: 15, mu: 0.33, tP: 15 },
    { id: 'BB-10kV', name: 'Збірні шини 10 кВ на 1 приєднання', omega: 0.03, tB: 2, mu: 0.167, tP: 5 },
    { id: 'AV-038kV', name: 'АВ-0.38 кВ', omega: 0.05, tB: 4, mu: 0.33, tP: 10 },
    { id: 'ED-10kV', name: 'ЕД 6, 10 кВ', omega: 0.1, tB: 160, mu: 0.5, tP: null },
    { id: 'ED-038kV', name: 'ЕД 0.38 кВ', omega: 0.1, tB: 50, mu: 0.5, tP: null },
    { id: 'PL-110kV', name: 'ПЛ-110 кВ', omega: 0.07, tB: 10, mu: 0.167, tP: 35 },
    { id: 'PL-35kV', name: 'ПЛ-35 кВ', omega: 0.02, tB: 8, mu: 0.167, tP: 35 },
    { id: 'PL-10kV', name: 'ПЛ-10 кВ', omega: 0.02, tB: 10, mu: 0.167, tP: 35 },
    { id: 'KL-10kV-transit', name: 'КЛ-10 кВ (транзит)', omega: 0.03, tB: 44, mu: 0.167, tP: 9 },
    { id: 'KL-10kV-cable', name: 'КЛ-10 кВ (кабельний канал)', omega: 0.005, tB: 17.5, mu: 1, tP: 9 }
  ];
  
  const sectionalSwitches = [
    { id: 'none', name: 'Без секційного вимикача', omega: 0 },
    { id: 'V-110kV', name: 'В-110 кВ (елегазовий)', omega: 0.01 },
    { id: 'V-10kV-oil', name: 'В-10 кВ (малооливний)', omega: 0.02 },
    { id: 'V-10kV-vacuum', name: 'В-10 кВ (вакуумний)', omega: 0.01 }
  ];
  
  let selectedElements = [];
  let sectionalSwitch = 'none';
  
  const elementSelect = document.getElementById('elementSelect');
  const sectionalSwitchSelect = document.getElementById('sectionalSwitchSelect');
  const addElementBtn = document.getElementById('addElementBtn');
  const elementsTableContainer = document.getElementById('elementsTableContainer');
  const elementsTableBody = document.getElementById('elementsTableBody');
  const resultsContainer = document.getElementById('resultsContainer');
  
  function initApp() {
    populateElementsDropdown();
    populateSectionalSwitchDropdown();
    bindEventListeners();
  }
  
  function populateElementsDropdown() {
    elements.forEach(element => {
      const option = document.createElement('option');
      option.value = element.id;
      option.textContent = element.name;
      elementSelect.appendChild(option);
    });
  }
  
  function populateSectionalSwitchDropdown() {
    sectionalSwitches.forEach(sw => {
      const option = document.createElement('option');
      option.value = sw.id;
      option.textContent = `${sw.name}`;
      sectionalSwitchSelect.appendChild(option);
    });
  }
  
  function bindEventListeners() {
    addElementBtn.addEventListener('click', addElement);
    sectionalSwitchSelect.addEventListener('change', event => {
      sectionalSwitch = event.target.value;
      calculateReliability();
    });
  }
  
  function addElement() {
    const selectedElementId = elementSelect.value;
    
    if (selectedElementId) {
      const elementToAdd = elements.find(el => el.id === selectedElementId);
      if (elementToAdd) {
        selectedElements.push({ ...elementToAdd, quantity: 1 });
        renderElementsTable();
        calculateReliability();
        
        elementSelect.value = '';
      }
    }
  }
  
  function removeElement(index) {
    selectedElements.splice(index, 1);
    renderElementsTable();
    calculateReliability();
  }
  
  function updateQuantity(index, event) {
    const quantity = parseInt(event.target.value) || 1;
    selectedElements[index].quantity = quantity;
    calculateReliability();
  }
  
  function renderElementsTable() {
    elementsTableBody.innerHTML = '';
    
    if (selectedElements.length === 0) {
      elementsTableContainer.classList.add('hidden');
      resultsContainer.classList.add('hidden');
      return;
    }
    
    elementsTableContainer.classList.remove('hidden');
    
    selectedElements.forEach((element, index) => {
      const row = document.createElement('tr');
      
      const nameCell = document.createElement('td');
      nameCell.textContent = element.name;
      row.appendChild(nameCell);
      
      const omegaCell = document.createElement('td');
      omegaCell.className = 'center';
      omegaCell.textContent = element.omega;
      row.appendChild(omegaCell);
      
      const tBCell = document.createElement('td');
      tBCell.className = 'center';
      tBCell.textContent = element.tB;
      row.appendChild(tBCell);
      
      const quantityCell = document.createElement('td');
      quantityCell.className = 'center';
      const quantityInput = document.createElement('input');
      quantityInput.type = 'number';
      quantityInput.min = '1';
      quantityInput.value = element.quantity;
      quantityInput.className = 'quantity-input';
      quantityInput.addEventListener('change', event => updateQuantity(index, event));
      quantityCell.appendChild(quantityInput);
      row.appendChild(quantityCell);
      
      const actionCell = document.createElement('td');
      actionCell.className = 'center';
      const removeButton = document.createElement('button');
      removeButton.className = 'remove-button';
      removeButton.textContent = 'Видалити';
      removeButton.addEventListener('click', () => removeElement(index));
      actionCell.appendChild(removeButton);
      row.appendChild(actionCell);
      
      elementsTableBody.appendChild(row);
    });
  }
  
  function calculateReliability() {
    if (selectedElements.length === 0) {
      resultsContainer.classList.add('hidden');
      return;
    }
    
    let omegaOC = selectedElements.reduce((sum, element) => {
      return sum + element.omega * element.quantity;
    }, 0);
    
    let numerator = selectedElements.reduce((sum, element) => {
      return sum + element.tB * element.omega * element.quantity;
    }, 0);
    let tB_OC = numerator / omegaOC;
    
    let ka_OC = (omegaOC * tB_OC) / 8760;
    
    let tP_max = Math.max(...selectedElements.filter(e => e.tP !== null).map(e => e.tP));
    
    let kp_OC = 1.2 * tP_max / 8760;
    
    let omegaAK = 2 * omegaOC * (ka_OC + kp_OC);
    
    const selectedSwitchOmega = sectionalSwitches.find(sw => sw.id === sectionalSwitch)?.omega || 0;
    
    let omegaAK_with_section = omegaAK + selectedSwitchOmega;
    
    document.getElementById('omegaOC').textContent = omegaOC.toFixed(4);
    document.getElementById('tB_OC').textContent = tB_OC.toFixed(2);
    document.getElementById('ka_OC').textContent = (ka_OC * 10000).toFixed(2);
    document.getElementById('kp_OC').textContent = (kp_OC * 10000).toFixed(2);
    document.getElementById('omegaAK').textContent = (omegaAK * 10000).toFixed(2);
    document.getElementById('omegaAK_with_section').textContent = omegaAK_with_section.toFixed(4);
    
    const extraSwitchFailureRate = document.getElementById('extraSwitchFailureRate');
    if (sectionalSwitch !== 'none') {
      extraSwitchFailureRate.classList.remove('hidden');
      document.getElementById('selectedSwitchOmega').textContent = selectedSwitchOmega.toFixed(4);
      document.getElementById('withSwitchText').textContent = 'з секційним вимикачем';
    } else {
      extraSwitchFailureRate.classList.add('hidden');
      document.getElementById('withSwitchText').textContent = '';
    }
    
    const moreReliable = omegaAK_with_section < omegaOC ? 'double' : 'single';
    document.getElementById('conclusionText').textContent = 
      moreReliable === 'double' 
      ? 'Надійність двоколової системи електропередачі є значно вищою ніж одноколової.'
      : 'Надійність одноколової системи електропередачі є вищою ніж двоколової.';
    
    resultsContainer.classList.remove('hidden');
  }
  
  document.addEventListener('DOMContentLoaded', initApp);