import { currentState, filteredEpicOutput, filteredInitiativeOutput, appDiv } from "./main";
import { JiraData } from "./csvParse";
import { truncateTitle, extractDate } from "./calculationFunctions";


//importing all constant elements required

//Banner section
const overlay = document.getElementById('overlay') as HTMLDivElement;
const modalContainer = document.getElementById('modal-container') as HTMLDivElement;
const modalAnchor = document.getElementById('jira-link') as HTMLAnchorElement;
const closeButton = document.getElementById('close') as HTMLDivElement;
const modalElement = modalContainer.querySelector('.modal-element') as HTMLDivElement;
const modalTitle = modalContainer.querySelector('.title') as HTMLButtonElement;
const progressCompletedBar = modalContainer.querySelector('.progress-completed-bar') as HTMLDivElement;
const progressBar = modalContainer.querySelector('.progress-bar') as HTMLDivElement;
const modalPercent = modalElement.querySelector('h2') as HTMLHeadingElement;

//1st Section of information
const modalIssueKey = document.getElementById('issue-key') as HTMLHeadingElement;
const modalHierarchy = document.getElementById('hierarchy') as HTMLHeadingElement;
const modalParent = document.getElementById('parent') as HTMLHeadingElement;
const modalDueDate = document.getElementById('due-date') as HTMLHeadingElement;
const modalStartDate = document.getElementById('start-date') as HTMLHeadingElement;
const modalTeam = document.getElementById('team') as HTMLHeadingElement;
const modalStatus = document.getElementById('status') as HTMLHeadingElement;

//2nd Section of information
const modalAssignee = document.getElementById('assignee') as HTMLHeadingElement;
const modalReporter = document.getElementById('reporter') as HTMLHeadingElement;
const modalLabels = document.getElementById('labels') as HTMLHeadingElement;


//For each element currently on screen it adds the functionality for it to display the corresponding modal
export function toggleModals(elements: NodeListOf<HTMLButtonElement>) {
  elements.forEach(element => {
    element.addEventListener('click', () => {
      const dataIndex = element.getAttribute('data-index');
      const originalColor = element.getAttribute('original-color');
      if (dataIndex !== null) {
        const parsedIndex = parseInt(dataIndex);
        if (currentState === 'epics') {
          updateModal(parsedIndex, filteredEpicOutput, originalColor);
        } else {
          updateModal(parsedIndex, filteredInitiativeOutput, originalColor);
        }
      }
    })
  });
}


//Updates the modal to match the element selected
export function updateModal(index: number, hierarchyOutput: JiraData[], originalColor: string | null) {

  let elements =  appDiv.querySelectorAll<HTMLButtonElement>('.elements')!;

  //Classes from the element to be copied
  const percentHeading = elements[index].querySelector('h2') as HTMLHeadingElement;
  const elementProgressBar = elements[index].querySelector('.progress-bar') as HTMLHeadingElement;

  //All styling/content for the banner of the modal 
  if (hierarchyOutput[index].DueDate === null && originalColor !== null) {
    modalElement.style.background = originalColor;
  } else {
    modalElement.style.background = '';
    modalElement.style.backgroundColor = elements[index].style.backgroundColor;
  }
  //When Title is clicked, the corresponding ticket on Atlassian will be loaded
  modalAnchor.href = `https://infosum.atlassian.net/browse/${hierarchyOutput[index].IssueKey}`;
  modalTitle.textContent = truncateTitle(`${hierarchyOutput[index].IssueKey} --- ${hierarchyOutput[index].Title}`, 40);
  progressCompletedBar.style.width = `${hierarchyOutput[index].Progress}px`;
  progressCompletedBar.style.left = `${parseFloat(elementProgressBar.style.left) + 10}px`;
  progressBar.style.left = `${parseFloat(elementProgressBar.style.left) + 10}px`;
  modalPercent.textContent = percentHeading.textContent;

  //All content for the 1st section of information
  modalIssueKey.textContent = hierarchyOutput[index].IssueKey;
  modalHierarchy.textContent = hierarchyOutput[index].Hierachy;
  modalParent.textContent = truncateTitle(hierarchyOutput[index].Parent, 70);
  modalDueDate.textContent = extractDate(hierarchyOutput[index].DueDate);
  modalStartDate.textContent = extractDate(hierarchyOutput[index].StartDate);
  modalTeam.textContent = hierarchyOutput[index].Team;
  modalStatus.textContent = hierarchyOutput[index].IssueStatus;

  //All the content for the 2nd section
  modalAssignee.textContent = hierarchyOutput[index].Assignee;
  modalReporter.textContent = hierarchyOutput[index].Reporter;
  modalLabels.textContent = hierarchyOutput[index].Labels;

  //Show the modal
  event?.stopPropagation();
  overlay.style.display = 'block';

  modalContainer.style.position = 'fixed';
  modalContainer.style.display = 'block';

  //If elsewhere on the window is clicked aside the modal it will dissapear
  window.addEventListener('click', (event) => {
    if (event.target !== modalContainer && !modalContainer.contains(event.target as Node)) {
      modalContainer.style.display = 'none';
      overlay.style.display = 'none';
    }
  })

  closeButton?.addEventListener('click', () => {
    if (closeButton) {
      modalContainer.style.display = 'none';
      overlay.style.display = 'none';
    }
  });
};