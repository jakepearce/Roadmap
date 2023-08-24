import { calculateDaysBetweenDates,  truncateTitle, extractDate, timelineStartValue, calculateHighestDueDate  } from './calculationFunctions';
import { filteredEpicOutput } from './main';



/* ------ Test Suites that test the calculation functions from the calculationFunctions file ------ */


//Test Suite for calculateDaysBetweenDates function
describe ('calculate the days between dates in pixels', () => {

  const date1 = new Date(2022, 5, 14);
  const date2 = new Date(2023, 5, 14);
  const date3 = new Date(2023, 5, 15);
  const nullDate = null;

  test('days between a year in pixels = 6083.3333333309', () => {
    const result = calculateDaysBetweenDates(date1, date2);
    expect(result).toBe(365 * 16.66666666666);
  });

  test('if date are one day apart, the result should be 16.6 recurring', () => {
    const result = calculateDaysBetweenDates(date2, date3);
    expect(result).toBe(16.66666666666);
  })

  test('if due date is null, then 400 should be returned', () => {
    const result = calculateDaysBetweenDates(date1, nullDate);
    expect(result).toBe(400);
  })

  test('if start date is null, then 400 should be returned', () => {
    const result = calculateDaysBetweenDates(nullDate, date2);
    expect(result).toBe(400);
  })

  test('if both dates are null then 400 should be returned', () => {
    const result = calculateDaysBetweenDates(nullDate, nullDate);
    expect(result).toBe(400);
  })
});


//Test Suite for TruncateTitle function
describe('truncates the length of the title based on the length of the element', () => {

  test('if the amount of characters in the title is less than the max length specified, then the title is returned', () => {
    const title = 'This is the test title';
    const result = truncateTitle(title, 30);
    expect(result).toBe('This is the test title');
  })

  test('if the amount of characters in the title is more than the max length specified, then the title is returned up to the max length of characters with an ellipses added', () => {
    const title = 'This is the test title, very bad test title';
    const result = truncateTitle(title, 30);
    expect(result).toBe('This is the test title, very ...');
  })

  test('same situation as the prior test but if the maxLength is < than 30, then it is adjusted to 30, the maxLength is 10 so the result should be the same as the prior test', () => {
    const title = 'This is the test title, very bad test title';
    const result = truncateTitle(title, 10);
    expect(result).toBe('This is the test title, very ...');
  })

  test('this test has exactly 30 characters so it should return the string exactly', () => {
    const title = '123456789012345678901234567890';
    const result = truncateTitle(title, 10);
    expect(result).toBe('123456789012345678901234567890');
  })

  test('this test has exactly 31 characters so it should return the string with an ellipses after the 29th character', () => {
    const title = '1234567890123456789012345678901';
    const result = truncateTitle(title, 10);
    expect(result).toBe('12345678901234567890123456789...');
  })
});


//Test Suite for extractDate function
describe('returns an abbreviated version of the date from a Date type', () => {

  test('this date type should return the abbreviated date', () => {
    const date = new Date(2023, 5, 14);
    expect(extractDate(date)).toBe('14/Jun/2023');
  })

  test('if the date is null, then N/A is returned', () => {
    const date = null;
    expect(extractDate(date)).toBe('N/A');
  })
});


//Test Suite for timelineStartValue function
describe('returns an integer that is used to align elements correctly onto the timeline', () => {

  test('this date shopuld return a value that in pixels refers to the start of the timeline', () => {
    const date = new Date(2023, 5, 14);
    expect(timelineStartValue(date)).toBe(19477);
  })
});


//Test Suite for calculateHighestDate function
describe('returns the highest date in a dataset', () => {

  test('this data should return ... as it is the highest date in the dataset', () => {
    expect(calculateHighestDueDate(filteredEpicOutput)).toBe('14/Jun/2023');
  })
});