//Decleration for JiraData Type

type JiraData = {
    Hierachy: string;
    Title: string;
    Project: string;
    Releases: string;
    Team: string;
    Assignee: string;
    Reporter: string;
    Sprint: string;
    TargetStartDate: Date | null;
    TargetEndDate: Date | null;
    DueDate: Date | null;
    Estimates: string;
    Parent: string;
    Priority: string;
    Labels: string;
    Components: string;
    IssueKey: string;
    IssueStatus: string;
    Progress: string;
    ProgressCompleted: string;
    ProgressRemaining: string;
    ProgressIssueCount: string;
    ToDoIC: string;
    InProgressIC: string;
    DoneIC: string;
    TotalIC: string;
    StartDateRollUp: string;
    StartDate: Date | null;
};


// const csvFilePath = '/JiraData.csv';
const newCsvFilePath = '/cleanJira - Sheet1.csv';

// pulling in the csv
async function fetchLocalFile(url: string): Promise<string> {
    try {
        const response = await fetch(url);
        return response.text();
    } catch (error: any) {
        throw new Error('Failed to fetch local file: ' + error.message);
    }
}

// const oldData = await fetchLocalFile(csvFilePath);
const newData = await fetchLocalFile(newCsvFilePath);

//Handling the conversion of Dates in String format to Date types
function parseDate(dateString: string): Date | null {

    const monthMap: {[key: string]: number } = {
        jan: 0, feb: 1, mar: 2, apr: 3, may: 4, jun: 5, jul: 6, aug: 7, sep: 8, oct: 9, nov: 10, dec: 11
    }

    const trimmedDateString = dateString.trim();
    const dateParts = trimmedDateString.split('/');

    if (dateParts.length !== 3) {
        return null;
    }
    const day = parseInt(dateParts[0], 10);
    const month = monthMap[dateParts[1].toLowerCase()]
    const year = parseInt(dateParts[2], 10);

    return new Date(year + 2000, month, day);
}

//Correctly splits the rows into data items
function parseCSVLine(line: string): string[] {
    const fields = [];
    let currentField = '';
    let insideQuotes = false;

    for (const char of line) {
        if (char === '"') {
            insideQuotes = !insideQuotes;
        } else if (char === ',' && !insideQuotes) {
            fields.push(currentField);
            currentField = '';
        } else {
            currentField += char;
        }
    }

    fields.push(currentField);

    return fields;
}


//Converts the String of Data into an array of Objects of JiraData type
const rows = newData.split('\n');

const output: JiraData[] = rows.slice(1).map((row) => {
    const values = parseCSVLine(row);

    return {
        Hierachy: values[0],
        Title: values[1],
        Project: values[2],
        Releases: values[3],
        Team: values[4],
        Assignee: values[5],
        Reporter: values[6],
        Sprint: values[7],
        TargetStartDate: parseDate(values[8]),
        TargetEndDate: parseDate(values[9]),
        DueDate: parseDate(values[10]),
        Estimates: values[11],
        Parent: values[12],
        Priority: values[13],
        Labels: values[14],
        Components: values[15],
        IssueKey: values[16],
        IssueStatus: values[17],
        Progress: values[21],
        ProgressCompleted: values[19],
        ProgressRemaining: values[20],
        ProgressIssueCount: values[18],
        ToDoIC: values[22],
        InProgressIC: values[23],
        DoneIC: values[24],
        TotalIC: values[25],
        StartDateRollUp: values[26],
        StartDate: parseDate(values[27]),
    };
})

export { output };
export type { JiraData };



