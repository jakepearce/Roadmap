import { JiraData, output } from './csvParse';
import { toggleModals } from './modalFunctionality';
import { createMonthBars, adjustElements, createDOM, monthLineHeight } from './DOMfunctions';
import './style.css';


/* ---------- Loads up the Starting look of the timeline ---------- */

export let currentState = 'initiatives'; // Loads the intiatives first

export let appDiv = document.querySelector<HTMLDivElement>('#app')!;


//Initial Filtered array that removes past projects and data without a start date
const initialFilter = output.filter(object => {
  return object.Project !== 'Psyduck' && object.Hierachy !== 'Spike' && 
  (object.StartDate !== null) && object.IssueKey !== 'PMB-145'
});

//Creates Epics specific Array
export const filteredEpicOutput = initialFilter.filter(object => {
  return object.Hierachy !== 'Initiative';
});

//Creates Initiatives specific Array
export const filteredInitiativeOutput = initialFilter.filter(object => {
  return object.Hierachy !== 'Epic'
});


//Collects the toggle buttons from the DOM
const showEpicsButton = document.getElementById('epic-btn') as HTMLButtonElement | null;
const showInitiativesButton = document.getElementById('initiative-btn') as HTMLButtonElement | null;

//Updates elements to be epics when button clicked
showEpicsButton?.addEventListener('click', () => {
  if (showInitiativesButton) {
    toggleAdjustment('epics', showEpicsButton, showInitiativesButton, filteredEpicOutput);
  }
});

//Updates elements to be initiatives when button clicked
showInitiativesButton?.addEventListener('click', () => {
  if (showEpicsButton) {
    toggleAdjustment('initiatives', showInitiativesButton, showEpicsButton, filteredInitiativeOutput);
  }
});

//When a toggle button is clicked, this function readjusts the page to appear correctly
function toggleAdjustment(hierarchy: string, activeButton: HTMLButtonElement, inactiveButton: HTMLButtonElement, toggledOutput: JiraData[]) {
  currentState = hierarchy;
  appDiv.innerHTML = '';
  createDOM(toggledOutput);
  adjustElements();
  activeButton.style.backgroundColor = 'var(--bright-blue-500, #6CACE4)';
  if (inactiveButton) {
    inactiveButton.style.backgroundColor = 'var(--black-300, #424548)';
  }
  let elements =  appDiv.querySelectorAll<HTMLButtonElement>('.elements')!;
  toggleModals(elements);

  const test = `${monthLineHeight()?.toString()}px`;

  console.log(test);

  let monthLines = document.querySelectorAll<HTMLDivElement>('.version-month-line')!;
  for (let month of monthLines) {
    month.style.height = test; //Adjusts the height of the page for the intiatives
  }
}


//Page intially loaded to be on Initiatives
createMonthBars(filteredEpicOutput); //Initially Creates the month bars
createDOM(filteredInitiativeOutput); 
let elements =  appDiv.querySelectorAll<HTMLButtonElement>('.elements')!;
toggleModals(elements);
if (showInitiativesButton) {
  adjustElements();
  showInitiativesButton.style.backgroundColor = 'var(--bright-blue-500, #6CACE4)';
}

/* -----------------------------------------------------------------------------------------------------*/



/* ---------- Shift and Scroll Functionality ---------- */

// Event listener for the keydown event
document.addEventListener('keydown', (event) => {
  if (event.shiftKey) {
    document.addEventListener('wheel', handleShiftScroll); // Add a temporary event listener for the wheel event while Shift is held down
  }
});

// Event listener for the keyup event to remove the wheel event listener
document.addEventListener('keyup', () => {
  document.removeEventListener('wheel', handleShiftScroll);
});

// Function to handle the scrolling while Shift is held down
function handleShiftScroll(event: WheelEvent) {
  event.preventDefault();
  window.scrollBy(event.deltaX, 0); // Scroll the page vertically, can't scroll vertically
}

// Automatically positions the window to the current time in the timeline
const pixelsToNOW = 4970; //How many pixels across is the NOW month on the timeline

window.scrollTo({
  top: 0,
  left: pixelsToNOW,
  behavior: 'smooth' 
});