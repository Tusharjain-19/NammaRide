const fs = require('fs');
const path = require('path');

const timingsPath = path.join(__dirname, '../website/src/data/timingsData.js');
let content = fs.readFileSync(timingsPath, 'utf8');

const pinkReplacement = `export const timingsData = {
  pink: {
    name: "Pink Line",
    color: "#EC4899",
    route: "Kalena Agrahara <-> Tavarekere",
    stations: 6,
    notes: [
      "Inaugurated on November 13, 2026 by Hon'ble Prime Minister Narendra Modi.",
      "Phase 1 elevated corridor operating between Kalena Agrahara and Tavarekere.",
      "Direct two-level interchange with Yellow Line at Jayadeva Hospital station.",
      "CBTC modern signalling with 6-coach train sets."
    ],
    schedules: {
      mon_sat: {
        title: "Monday - Saturday",
        from_start: [ // From Kalena Agrahara
          { range: "05:00 - 06:00", frequency: "15 mins" },
          { range: "06:00 - 08:30", frequency: "10 mins" },
          { range: "08:30 - 11:30", frequency: "8-10 mins" },
          { range: "11:30 - 16:30", frequency: "12 mins" },
          { range: "16:30 - 20:30", frequency: "8-10 mins" },
          { range: "20:30 - 23:00", frequency: "12-15 mins" }
        ],
        from_end: [ // From Tavarekere
          { range: "05:05 - 06:00", frequency: "15 mins" },
          { range: "06:00 - 08:30", frequency: "10 mins" },
          { range: "08:30 - 11:30", frequency: "8-10 mins" },
          { range: "11:30 - 16:30", frequency: "12 mins" },
          { range: "16:30 - 20:30", frequency: "8-10 mins" },
          { range: "20:30 - 23:05", frequency: "12-15 mins" }
        ]
      },
      sunday: {
        title: "Sunday & Public Holidays",
        from_start: [ // From Kalena Agrahara
          { range: "07:00 - 10:00", frequency: "15 mins" },
          { range: "10:00 - 20:30", frequency: "10-12 mins" },
          { range: "20:30 - 23:00", frequency: "15 mins" }
        ],
        from_end: [ // From Tavarekere
          { range: "07:05 - 10:00", frequency: "15 mins" },
          { range: "10:00 - 20:30", frequency: "10-12 mins" },
          { range: "20:30 - 23:05", frequency: "15 mins" }
        ]
      }
    },
    weekday: { firstTrain: { from_start: "05:00 AM", from_end: "05:05 AM" }, lastTrain: { from_start: "11:00 PM", from_end: "11:05 PM" }, peakFrequency: "8-10 min", offPeakFrequency: "12-15 min", peakHours: "08:30-11:30 & 16:30-20:30" },
    weekend: { firstTrain: { from_start: "07:00 AM", from_end: "07:05 AM" }, lastTrain: { from_start: "11:00 PM", from_end: "11:05 PM" }, frequency: "10-12 min" },
    holiday: { firstTrain: { from_start: "07:00 AM", from_end: "07:05 AM" }, lastTrain: { from_start: "11:00 PM", from_end: "11:05 PM" }, frequency: "15 min" }
  },`;

// Replace from export const timingsData = { pink: { ... } up to purple:
const purpleIdx = content.indexOf('purple: {');
if (purpleIdx !== -1) {
    content = pinkReplacement + '\n\n  ' + content.substring(purpleIdx);
    fs.writeFileSync(timingsPath, content, 'utf8');
    console.log('Successfully updated website/src/data/timingsData.js!');
} else {
    console.error('Could not find purple: in timingsData.js');
}
