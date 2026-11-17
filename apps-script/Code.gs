/**
 * RSVP receiver for the Abdullah & Momina wedding invitation.
 *
 * Setup (see README → "RSVP: Google Sheet + Apps Script"):
 *  1. Create a Google Sheet. Extensions → Apps Script. Paste this file.
 *  2. Deploy → New deployment → Web app. Execute as: Me. Who has access: Anyone.
 *  3. Copy the /exec URL into VITE_RSVP_ENDPOINT and rebuild the site.
 *
 * The sheet tab "RSVPs" and its header row are created automatically.
 * Duplicate submissions (same submissionId) are ignored.
 */

var SHEET_NAME = 'RSVPs';
var HEADERS = [
  'Received at', 'Name', 'Attendance', 'Guests', 'Adults', 'Children',
  'Message', 'Personal link name', 'Submission ID', 'Client time', 'User agent'
];
var LIMITS = { name: 80, message: 500, guests: 15 };

function doPost(e) {
  var lock = LockService.getScriptLock();
  try {
    lock.waitLock(10000);
    var data = JSON.parse((e && e.postData && e.postData.contents) || '{}');
    var clean = validate_(data);
    if (clean.error) return json_({ ok: false, error: clean.error });

    var sheet = getSheet_();
    if (isDuplicate_(sheet, clean.submissionId)) return json_({ ok: true, duplicate: true });

    sheet.appendRow([
      new Date(), clean.name, clean.attendance, clean.guests, clean.adults, clean.children,
      clean.message, clean.guestParam, clean.submissionId, clean.submittedAt, clean.userAgent
    ]);
    return json_({ ok: true });
  } catch (err) {
    return json_({ ok: false, error: 'Server error. Please try again.' });
  } finally {
    try { lock.releaseLock(); } catch (ignore) {}
  }
}

/** Visiting the /exec URL in a browser confirms the deployment is live. */
function doGet() {
  return json_({ ok: true, service: 'wedding-rsvp' });
}

function validate_(d) {
  var str = function (v, max) { return String(v == null ? '' : v).replace(/[\u0000-\u001F\u007F]/g, ' ').trim().slice(0, max); };
  var int = function (v) { var n = Number(v); return Number.isInteger(n) && n >= 0 ? n : -1; };
  var name = str(d.name, LIMITS.name);
  var attendance = d.attendance === 'attending' || d.attendance === 'declined' ? d.attendance : '';
  var submissionId = str(d.submissionId, 64);
  if (name.length < 2) return { error: 'Please enter your name.' };
  if (!attendance) return { error: 'Please choose whether you can attend.' };
  if (!submissionId) return { error: 'Missing submission id.' };

  var guests = 0, adults = 0, children = 0;
  if (attendance === 'attending') {
    guests = int(d.guests); adults = int(d.adults); children = int(d.children);
    if (guests < 1 || guests > LIMITS.guests) return { error: 'Please check the number of guests.' };
    if (adults < 1 || children < 0 || adults + children !== guests) return { error: 'Adults and children should add up to the number of guests.' };
  }
  // Formula-injection guard: text starting with = + - @ is stored as plain text.
  var safe = function (s) { return /^[=+\-@]/.test(s) ? "'" + s : s; };
  return {
    name: safe(name),
    attendance: attendance === 'attending' ? 'Attending' : 'Unable to attend',
    guests: guests, adults: adults, children: children,
    message: safe(str(d.message, LIMITS.message)),
    guestParam: safe(str(d.guestParam, 40)),
    submissionId: submissionId,
    submittedAt: str(d.submittedAt, 40),
    userAgent: str(d.userAgent, 200)
  };
}

function getSheet_() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(SHEET_NAME) || ss.insertSheet(SHEET_NAME);
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(HEADERS);
    sheet.setFrozenRows(1);
    sheet.getRange(1, 1, 1, HEADERS.length).setFontWeight('bold');
  }
  return sheet;
}

function isDuplicate_(sheet, id) {
  var last = sheet.getLastRow();
  if (last < 2) return false;
  var col = HEADERS.indexOf('Submission ID') + 1;
  var found = sheet.getRange(2, col, last - 1, 1).createTextFinder(id).matchEntireCell(true).findNext();
  return found !== null;
}

function json_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}
