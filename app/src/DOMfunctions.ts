import { JiraData } from "./csvParse";
import { calculateMonthEnds, checkOverlap, calculateLeftMargin, calculateDaysBetweenDates, truncateTitle } from "./calculationFunctions";
import { appDiv, filteredEpicOutput } from "./main";



//Inserts epic element into the DOM
export function createDOM(filteredOutput: JiraData[]) {
  for (let i = 0; i < filteredOutput.length; i++) {

    //Creates the buttons that contain the elements
    const button = document.createElement('button');
    button.classList.add('elements');
    button.setAttribute('data-index', i.toString());
    button.innerHTML = `
      <h1 class="title">${filteredOutput[i].Title}<h1>
      <h2>test text<h2>
      <div class="progress-bar"></div>
      <div class="progress-completed-bar"></div>
      <p>medium</p>
      `; 

      //Assigns the completedness of the Progress Bar
      const progressCompletedBar = button.querySelector('.progress-completed-bar') as HTMLDivElement;
      progressCompletedBar.style.width = `${filteredOutput[i].Progress}px`;
      
      //Adds the button to the DOM
      appDiv.appendChild(button);

      //Extracting the constanst required for the styling of the elements
      const app = document.querySelector<HTMLDivElement>('#app')!
      const elementContainer =  app?.querySelectorAll<HTMLButtonElement>('.elements')!;
      const progressHeading = button.querySelector('h2') as HTMLHeadingElement;
      const progressEmptyBar = button.querySelector('.progress-bar') as HTMLHeadingElement;

      //Assigns width and starting location of the element container
      let marginLeft = calculateLeftMargin(filteredOutput[i].StartDate, filteredEpicOutput);

      if (filteredOutput[i].StartDate !== null && filteredOutput[i].DueDate !== null) {
        let width = calculateDaysBetweenDates(filteredOutput[i].StartDate, filteredOutput[i].DueDate); //Calculates width of the button
        elementContainer[elementContainer.length - 1].style.width = `${width}px`; //Sets width of the button
        elementContainer[elementContainer.length - 1].style.marginLeft = `${marginLeft}px`; //Sets starting position of the button

      } else if (filteredOutput[i].StartDate !== null) {
        elementContainer[elementContainer.length - 1].style.width = `400px`;
        elementContainer[elementContainer.length - 1].style.marginLeft = `${marginLeft}px`;
      }  

      //Assigns the correct colour to the elements and adjusts the location of the progress bar
      const elementProgress = parseFloat(filteredOutput[i].Progress);
      const progressBarLeftValue = parseFloat(getComputedStyle(progressCompletedBar).left);
      let backgroundColor, progressText, progressBarOffset;

      switch (true) {
        case elementProgress === 0:
          backgroundColor = `var(--grey-200, #6F7376)`;
          progressText = 'Planned';
          progressBarOffset = 0;
          button.setAttribute('id', 'planned');
          button.setAttribute('original-color', `var(--grey-200, #6F7376)`)
          break;

        case elementProgress > 0 && elementProgress < 100:
          backgroundColor = `var(--bright-blue-400, #578AB7)`;
          progressText = `${elementProgress}% Done`;
          progressBarOffset = 18;
          button.setAttribute('id', 'in-progress');
          button.setAttribute('original-color', `var(--bright-blue-400, #578AB7)`)
          break;

        case elementProgress === 100:
          backgroundColor = `var(--green-500, #00993B)`;
          progressText = 'Done';
          progressBarOffset = -20;
          button.setAttribute('id', 'done');
          button.setAttribute('original-color', `var(--green-500, #00993B)`)
          break;

        default:
          backgroundColor = ''; 
          progressText = ''; 
          progressBarOffset = 0;
          break;
      }

      elementContainer[elementContainer.length - 1].style.backgroundColor = backgroundColor;
      progressHeading.innerText = progressText;

      if (progressBarOffset !== undefined) { //If the Progress is > than 0
        progressCompletedBar.style.left = `${progressBarLeftValue + progressBarOffset}px`;
        progressEmptyBar.style.left = `${progressBarLeftValue + progressBarOffset}px`;
      }

      //Assigns fading effect on elements without a due date
      if (filteredOutput[i].DueDate === null) {
        const currentBackground = elementContainer[elementContainer.length - 1].style.backgroundColor;
        const fadedBackground = `linear-gradient(to right, ${currentBackground}, ${currentBackground}, ${currentBackground} ,rgba(0, 0, 0, 0) 100%)`;
        elementContainer[elementContainer.length - 1].style.background = fadedBackground;
      }
    
      //Assigns the Title to the element
      const titleHeading = button.querySelector('h1') as HTMLHeadingElement;
      titleHeading.innerText = truncateTitle(`${filteredOutput[i].IssueKey} --- ${filteredOutput[i].Title}`, ((parseInt(elementContainer[elementContainer.length - 1].style.width)) / 10) - 10)
  }
}


//creates the month seperation lines
export function createMonthBars(filteredEpicOutput: JiraData[]) {
  const monthDiv = document.querySelector<HTMLDivElement>('.months')!;
  const monthArray = calculateMonthEnds(filteredEpicOutput);

  //Inserts the month seperation line into the DOM
  if (monthArray) {
    for (let i = 0; i < monthArray.length; i ++) {
      const div = document.createElement('div');
      div.classList.add('version-month');
      div.innerHTML = `
        <div class="version-title">
          <h5>V 2.${i + 1}.0</h5>
          <h6>end of ${monthArray[i][0]}</h6>
        </div>

        <div class="version-month-line"></div>
        `;

        //Correctly alligns the text of the month seperation lines
        const pixelsPerMonth = 500;

        const versionTitleDiv = div.querySelector('.version-title') as HTMLDivElement;
        const monthlyTitle = versionTitleDiv.querySelector('h5') as HTMLHeadingElement;

        //Assigns the correct colour to the text
        versionTitleDiv.style.left = `${(i + 100) + (pixelsPerMonth * i)}px`;
        versionTitleDiv.style.color = monthArray[i][1];
        if (monthArray[i][1] === 'var(--bright-blue-500, #6CACE4') {
          monthlyTitle.textContent = 'NOW'; //Replaces the V with NOW on the current month
        }

        const versionLineDiv = div.querySelector('.version-month-line') as HTMLDivElement;
        versionLineDiv.style.left = `${(i + 210) + (pixelsPerMonth * i)}px`;

        monthDiv.appendChild(div);
    } 
  }
}

//Array that contains the elements to be stacked
const rowArray: Array<Array<HTMLButtonElement>> = [];
  
for (let i = 0; i < 100; i++) {
  rowArray.push([]);
}

//Function that organises the positions of the elements on the window
export function adjustElements() {

  rowArray.forEach(subArray => subArray.length = 0);

  let elements =  appDiv.querySelectorAll<HTMLButtonElement>('.elements')!;

  //Adjusts the width of the elements if they are too small
  for (let element of elements) {
    if (parseFloat(getComputedStyle(element).width) < 400) {
      element.style.setProperty('width', `400px`);
    }
  }


  //Allows stacking of elements
  for (let i = 0; i < elements.length; i++) {
    ArrayLoop: for (let j = 0; j < rowArray.length; j++) { //Checks each array
  
      if (rowArray[j].length === 0) { //If the array is empty, the element is added
        rowArray[j].push(elements[i]);
        break ArrayLoop;
      }
  
      let noOverlap = true; 
  
      rowLoop: for (let k = 0; k < rowArray[j].length; k++) { //Checks each element in the array
  
        if (checkOverlap(elements[i], rowArray[j][k])) { //If there is an overlap, the vertical position of the element is lowered
          noOverlap = false;
          const topValue = parseFloat(getComputedStyle(elements[i]).top);
          elements[i].style.setProperty('top', `${topValue + 88}px`);
          break rowLoop;
        }
      } 
  
      if (noOverlap) { //If there is no overlap on the array, the element is added
        rowArray[j].push(elements[i]);
        break ArrayLoop;
      }
    } 
  }
  

  //Assigns each elements size type and the position of that div on epic element
  elements.forEach((element) => {
    const projectSizeType = element.querySelector('p');
    const epicWidthValue = parseFloat(getComputedStyle(element).width);
    if (projectSizeType) {
      projectSizeType.textContent = ('test?');
      projectSizeType.style.setProperty('left', `${epicWidthValue -82}px`);
    }
  });
}

//Calculate DOM Height
export function monthLineHeight() {
  for (let i = 0; i < rowArray.length; i++) {
    if (rowArray[i].length === 0) {
      if (i * 100 > window.innerHeight) {
        return i * 93;
      }
      return window.innerHeight - 103;
    } 
  } 

}