/**
 * Noah Trupin 2021
 * natrupin@gmail.com
 * ntrupin23@lawrenceville.org
 * 
 * Backed up at https://github.com/ntrupin/peertutoring
 * 
 * @fileoverview Google Sheets macro and support functions for automated Peer Tutor scheduling.
 * @package
 */

/**
 * Sends an email to addrs containing a formatted version of data.
 * @param {!Array<string>} addrs "to" email addresses
 * @param {!Array<string>} heads "cc" email addresses
 * @param {!Object} data Request data
 */
const sendEmail = (addrs, heads, data = undefined) => {
  let quota = MailApp.getRemainingDailyQuota();
  if (quota <= 0) {
    Logger.log(`Reached daily email quota.`);
    return;
  } else {
    Logger.log(`Emails remaining today: ${quota}`);
  }
  MailApp.sendEmail({
    to: addrs.join(","),
    cc: heads.join(","),
    subject: `PEER TUTORING REQUEST: ${data.subject}`,
    htmlBody: data !== undefined ? `
<b>From</b>: ${data.name} (${data.email})
<br /><br />
<b>Subject</b>: ${data.subject}
<br /><br />
<b>Description</b>: ${data.desc}
<br /><br />
<b>Attachments</b>: ${!data.files.length ? "None" : data.files.join(", ")}
<br /><br /><br />
<b>Contacted Tutors</b>: ${addrs.map((a)=>a.split("@")[0]).join(", ")}
<br /><br />
<b>Copied Heads</b>: ${heads.map((a)=>a.split("@")[0]).join(", ")}
<br /><br /><br />
If you are available to help, please <b>REPLY ALL</b> to this email to the copied head tutors to claim this assignment.
<br /><br /><br />
<i>This is an automated message.</i> 
    ` : `This message has no body.`
  })
}

/**
 * Format parameters as a data object for sendEmail.
 * @param {string} name Requester name
 * @param {string} email Requester email
 * @param {string} subject Request subject
 * @param {string} desc Request description
 * @param {string} files Request files
 * @return {!Object}
 */
const formatEmail = (
  name, email, subject = "None", desc = "None", files = []
) => {
  return {
    name: name,
    email: email,
    subject: subject,
    desc: desc,
    files: files
  };
}

/**
 * Returns the roster of peer tutors from the data spreadsheet.
 * @return {!Object}
 */
const getRoster = () => {
  let today = new Date()
  let month = today.getMonth()
  let year = today.getFullYear()
  let fname = `peertutoring_` + (month >= 8.0 
    ? `${year}-${year+1}`
    : `${year-1}-${year}`);
  files = DriveApp.getFilesByName(fname)
  const findFile = (files) => {
    while (files.hasNext()) {
      let file = files.next();
      let type = file.getMimeType();
      if (
        file.getName() == fname && 
        type == "application/vnd.google-apps.spreadsheet"
      ) {
        return file;
      }
    }
  }
  let file = findFile(files);
  return file;
}

/**
 * Returns the available tutors from a roster.
 * @param {!Object} roster Roster spreadsheet
 * @return {!Object}
 */
const getTutors = (roster) => {
  let ss = SpreadsheetApp.open(roster);
  let sheet = ss.getSheetByName("Form Responses 1");
  let data = sheet
    .getDataRange()
    .getValues()
    .slice(1)
    .map((d) => {
    return {
      email: d[1],
      subjects: d[2].split(", ")
    }
  });
  return data;
}

/**
 * Returns the current head tutors from a roster.
 * @param {!Object} roster Roster spreadsheet
 * @return {!Object}
 */
const getHeads = (roster) => {
  let ss = SpreadsheetApp.open(roster);
  let sheet = ss.getSheetByName("Heads");
  let data = sheet
    .getDataRange()
    .getValues()
    .slice(1)
    .map((d) => {
    return {
      email: d[1]
    }
  });
  return data;
}

/**
 * Filters roster for which tutors are available for a specific date and subject.
 * @param {!Date} date Date to search
 * @param {string} subject Subject to search
 * @return {!Object}
 */
const checkAvailability = (roster, date, subject) => {
  // Uncomment to test a specific day.
  // date = new Date(2021, 8, 28);
  let avail = getTutors(roster).filter((d) => {
    return d.subjects.includes(subject)/* && 
    (d.days.includes(new Intl.DateTimeFormat(
      "en-US", { weekday: 'long'
      }).format(date)) || d.consult)*/
  });
  return avail;
}

/**
 * Fires on Google Form submission, finds available tutors for date and subject, and sends email.
 * @param {!Object} e Edited sheet object
 */
const onFormSubmit = (e) => {
  let data = e.range.getValues()[0];
  let obj = {
    date: new Date(data[0]),
    email: data[7],
    name: data[3],
    desc: data[4],
    files: [data[5]],
    subject: data[8]
  };
  let roster = getRoster();
  let avail = checkAvailability(roster, obj.date, obj.subject);
  let addrs = avail.map((a) => {
    return a.email
  });
  let heads = getHeads(roster).map((a) => {
    return a.email
  });
  if (addrs.length != 0) {
    sendEmail(addrs, heads, formatEmail(
      obj.name,
      obj.email,
      obj.subject,
      obj.desc,
      obj.files
    ));
  } else {
    Logger.log("Nobody available.");
  }
}
