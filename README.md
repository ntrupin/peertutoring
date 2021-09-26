# Peer Tutoring

Backup code for the Peer Tutoring automation system.

## Tutor Migration Instructions

1. Create a Google Sheet called peertutoring_XXXX-YYYY where XXXX-YYYY is the current school year
2. Organize peer tutor information in rows in a sheet called **Tutors** as follows with the header included\*:
 
| Name | Email | Day | Consult | Subjects |
| ---- | ----- | --- | ------- | -------- |
| Noah Trupin | ntrupin23@lawrenceville.org | Monday, Tuesday | TRUE | Math I-III, Honors Computer Programming |
| ... | ... | ... | ... | ... |

3. Organize head tutor information in rows in a sheet called **Heads** as follows with the header included \*\*:

| Name | Email |
| ---- | ----- |
| Sam Tang | stang22@lawrenceville.org |

\* *Noah Trupin is an example. The names of the headers don't matter. Data just needs to start in the second row.*

\*\* *Sam Tang is an example. See previous point about headers.*

## Code Migration Instructions

**Order of operations matters**. Doing these out of order may cause triggers to not fire or cause the script to not link to the spreadsheet.

1. Create a new Google Sheet
2. Select Tools -> Create a form
4. Select Tools -> Script editor
5. Copy contents of Code.gs to the new Code.gs
6. Run each function in the file to obtain OAuth permissions 
