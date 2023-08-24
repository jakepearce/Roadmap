import { JiraData } from './csvParse';


// Calculates the difference in days between the start and end dates
export function calculateDaysBetweenDates(startDate: Date | null, dueDate: Date | null) {
  const pixelsPerDay = 16.66666666666;
  
  if (startDate === null || dueDate === null) {
   return 400; //Minimum width of the elements
  }
  
  const timeDifference = dueDate.getTime() - startDate.getTime();
  const daysDifference = Math.floor(timeDifference / (24 * 60 * 60 * 1000));
  return daysDifference * pixelsPerDay;
}


//Calculates the start position of the epic element based on the start date
export function calculateLeftMargin(startDate: Date | null, filteredEpicOutput: JiraData[]) {

  const pixelsPerDay = 16.6;
  const startOfTimelineValue = timelineStartValue(calculateLowestStartDate(filteredEpicOutput)); //Subtracting this amount from the total days is the start of the timeline
  
  if (startDate === null) {
    return 100;
  }
  
  if (startOfTimelineValue) {
    const millisecondsPerDay = 24 * 60 * 60 * 1000;
    const startTime = startDate.getTime();
    const days = Math.floor(startTime / millisecondsPerDay);
    return (days - startOfTimelineValue) * pixelsPerDay; 
  }
}


//Checks if two elements are overlapping or not
export function checkOverlap(element1: HTMLButtonElement, element2: HTMLButtonElement): boolean {
  const marginLeft1 = parseFloat(getComputedStyle(element1).marginLeft);
  const marginLeft2 = parseFloat(getComputedStyle(element2).marginLeft);
  const width1 = parseFloat(getComputedStyle(element1).width);
  const width2 = parseFloat(getComputedStyle(element2).width);

  const minimumWidth = 10; //Sets it so that elements cant be right next to each other vertically

  //Expression that calculates if they are overlapping
  if ((marginLeft2 < marginLeft1 + width1 + minimumWidth) && (minimumWidth + marginLeft2 + width2 > marginLeft1)) {
    return true;
  }
  return false;
}; 


//Truncates Title String
export function truncateTitle (title: string, maxLength: number): string {
  if (maxLength < 30) { //Minimum length is 30 characters
    maxLength = 30;
  }
  return (title.length > maxLength) ?
    title.slice(0, maxLength - 1) + '...' : title;
}


//Returns a readable version of the date, if date is not available it returns 'N/A'
export function extractDate(date: Date | null): string {
  if (date) {
    const day = date.getDate();
    const month = date.toLocaleString('default', { month: 'short' }); //Abbreviates the month
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  }
  return 'N/A';
}


//Automation of months array
export function calculateMonthEnds (outputArray: JiraData[]) {

  const lowestDate = calculateLowestStartDate(outputArray);
  const highestDate = calculateHighestDueDate(outputArray);

  if (lowestDate && highestDate) {
    return calculateMonthsArray(lowestDate, highestDate);
  }
};


//Function that returns the lowest start date
export function calculateLowestStartDate(outputArray: JiraData[]) {
  let lowestStartDate = outputArray[0].StartDate;
  outputArray.forEach(object => { 
    if (object.StartDate) {
      if (lowestStartDate === null) {
        lowestStartDate = object.StartDate;
      } else if (lowestStartDate) {
        if (object.StartDate < lowestStartDate) {
          lowestStartDate = object.StartDate;
        }
      }
    }
  })
  return lowestStartDate;
};


//Function that returns the highest due date
export function calculateHighestDueDate(outputArray: JiraData[]) {
  let highestDueDate = outputArray[0].DueDate;
  outputArray.forEach(object => { 
    if (object.DueDate) {
      if (highestDueDate === null) {
        highestDueDate = object.DueDate;
      } else if (highestDueDate) {
        if (object.DueDate > highestDueDate) {
          highestDueDate = object.DueDate;
        }
      }
    }
  })
  return highestDueDate;
};


export function calculateMonthsArray(startDate: Date, endDate: Date) {
  let months = [];
  let color;

  const currentDate = new Date();

  const startValueDate = new Date(startDate);
  const endValueDate = new Date(endDate);
  const monthsAhead = 2;
  const monthsPrior = 1;
  startValueDate.setMonth(startDate.getMonth() - monthsPrior - 1);
  endValueDate.setMonth(startDate.getMonth() + monthsAhead);

  while (startValueDate <= endValueDate) {
    if (currentDate.getMonth() === startValueDate.getMonth() && currentDate.getFullYear() === startValueDate.getFullYear()) {
      color = 'var(--bright-blue-500, #6CACE4'
    } else if (currentDate > startValueDate) {
      color = 'var(--green-500, #00993B)'
    } else {
      color = 'var(--grey-200, #6F7376)'
    }
    const formattedMonth = `${startValueDate.toLocaleString('default', { month: 'long' })} ${startValueDate.getFullYear()}`;
    months.push([formattedMonth, color]);
    
    // Move to the next month
    startValueDate.setMonth(startValueDate.getMonth() + 1);
  }

  return months;
}


//Calculates the value that corresponds to the start of the timeline
export function timelineStartValue(startDate: Date | null) {
  if (startDate) {
    const startValueDate = new Date(startDate);
    startValueDate.setMonth(startValueDate.getMonth() - 1);
    const millisecondsPerDay = 24 * 60 * 60 * 1000;
    const startTime = startValueDate.getTime();
    const days = Math.floor(startTime / millisecondsPerDay);
    return (days - 13);
  }
}