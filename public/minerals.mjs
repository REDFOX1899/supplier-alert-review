export const reviews = {
  water: 'Water & pollution',
  permits: 'Permits & oversight',
  trace: 'Supply-chain origin'
};

export const sites = [
  {
    id: 'thacker', name: 'Thacker Pass', region: 'Nevada, USA', operator: 'Lithium Americas project',
    route: ['Claystone', 'On-site processing', 'Lithium carbonate'],
    evidence: 'U.S. Bureau of Land Management', type: 'Regulator',
    url: 'https://eplanning.blm.gov/documents/?id=cf906eb4-a7f2-f011-8406-001dd8008d46&spid=66f3c672-a8f2-f011-8407-001dd803d7d3',
    review: {
      water: ['Impact assessment available', 'The environmental review includes an assessment of water quantity and quality. It describes projected impacts.', 'Request recent groundwater monitoring results and the limits they are measured against.'],
      permits: ['Federal decision available', 'BLM publishes a Record of Decision and its environmental review for the project.', 'Check applicable permit conditions and the latest inspections before qualifying the site.'],
      trace: ['Project route documented', 'The environmental review describes a mine and processing facility. Buyer-specific shipment evidence is pending.', 'Request a facility identifier and evidence linking the proposed supply to this site.']
    }
  },
  {
    id: 'rincon', name: 'Rincon', region: 'Salta, Argentina', operator: 'Rio Tinto',
    route: ['Lithium brine', 'Direct extraction', 'Lithium carbonate'],
    evidence: 'Rio Tinto project profile', type: 'Operator disclosure',
    url: 'https://www.riotinto.com/operations/south-america/rincon',
    review: {
      water: ['Operator claim', 'Rio Tinto describes direct lithium extraction and says the process supports water conservation.', 'Request a site water balance and regulator or independent monitoring data to test the claim.'],
      permits: ['Regulator evidence needed', 'The linked project profile describes the operation and expansion.', 'Locate the provincial environmental approval, water authorizations, and monitoring obligations.'],
      trace: ['Output described by operator', 'The company identifies battery-grade lithium carbonate as the planned output of its expansion.', 'Request a facility declaration and shipment documents naming the processor.']
    }
  },
  {
    id: 'greenbushes', name: 'Greenbushes', region: 'Western Australia', operator: 'Talison Lithium',
    route: ['Hard-rock ore', 'Concentration', 'Spodumene concentrate'],
    evidence: 'Western Australia EPA', type: 'Regulator',
    url: 'https://www.epa.wa.gov.au/proposals/greenbushes-lithium-mine-expansion',
    review: {
      water: ['Environmental review available', 'The regulator publishes environmental assessment materials for the mine expansion.', 'Check the current water licence and measured discharge or monitoring results for the relevant period.'],
      permits: ['Assessment record available', 'The EPA page describes the expansion proposal and lists assessment documents.', 'Confirm which approval and licence cover the specific facility and activity in the offer.'],
      trace: ['Downstream refiner needed', 'The EPA identifies spodumene concentrate as an output. A battery buyer still needs to identify where it is converted to lithium chemicals.', 'Request shipment and refinery records before treating two sources as independent.']
    }
  }
];

export const discovery = {
  extraction: 'lithium mine brine extraction spodumene project producer official operator site lithium production facility',
  refining: 'battery grade lithium carbonate hydroxide conversion refinery official company operating facility supplier',
  recycling: 'lithium battery recycling material recovery lithium carbonate commercial facility official company'
};
