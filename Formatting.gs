/**
 * Noah Trupin 2021
 * natrupin@gmail.com
 * ntrupin23@lawrenceville.org
 * 
 * Backed up at https://github.com/ntrupin/peertutoring
 * 
 * @fileoverview Google Sheets macros for fixing common Google Forms formatting errors.
 * @package
 */

/**
 * Removes time of day specifiers from dates.
 */
function formatDays() {
  let file = getRoster();
  let ss = SpreadsheetApp.open(file);
  let sheet = ss.getSheetByName("Tutors");
  let len = sheet.getLastRow()
  for(i=1;i<len+2;i++) {
    let n = sheet.getRange(i+1, 3)
    n.setValue(n.getValue().replace(" night", ""))
  }
}

/**
 * Converts Yes -> TRUE and No -> FALSE for consult availability.
 */
function formatConsults() {
  let file = getRoster();
  let ss = SpreadsheetApp.open(file);
  let sheet = ss.getSheetByName("Tutors");
  let len = sheet.getLastRow()
  for(i=1;i<len+2;i++) {
    let n = sheet.getRange(i+1, 4)
    n.setValue(n.getValue()
      .toString()
      .replace("Yes", "TRUE")
      .replace("No", "FALSE"))
  }
}
