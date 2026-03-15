// ============================================================
// NammaRide — Bengaluru Metro Timing Data
// Source: BMRCL Official Schedule (2025-26)
// ============================================================

export const timingsData = {
  purple: {
    name: "Purple Line",
    color: "#8B5CF6",
    route: "Challaghatta ↔ Whitefield (Kadugodi)",
    stations: 37,
    notes: [
      "Additional trains from select intermediate stations (Garudacharapalya, Mysore Road, Majestic) operate during surge demand.",
      "Morning & Evening short loops operate between Majestic ↔ Whitefield/Baiyappanahalli/Pattandur Agrahara and Mysore Road ↔ Garudacharapalya.",
      "Train timings may vary subject to planned maintenance activities."
    ],
    schedules: {
      monday: {
        title: "Monday Timetable",
        from_start: [ // From Whitefield
          { range: "05:00 - 05:20", frequency: "20 mins" },
          { range: "05:20 - 10:57", frequency: "10 mins" },
          { range: "10:57 - 15:21", frequency: "8 mins" },
          { range: "15:21 - 22:01", frequency: "10 mins" },
          { range: "22:01 - 22:45", frequency: "15 mins" }
        ],
        from_end: [ // From Challaghatta
          { range: "05:00 - 05:20", frequency: "20 mins" },
          { range: "05:20 - 06:00", frequency: "15 mins" },
          { range: "06:00 - 06:54", frequency: "11 mins" },
          { range: "06:54 - 12:20", frequency: "10 mins" },
          { range: "12:20 - 16:02", frequency: "8 mins" },
          { range: "16:02 - 23:05", frequency: "10 mins" }
        ]
      },
      tue_fri: {
        title: "Tuesday to Friday",
        from_start: [ // Image 1
          { range: "05:00 - 05:20", frequency: "20 mins" },
          { range: "05:20 - 10:57", frequency: "10 mins" },
          { range: "10:57 - 15:21", frequency: "8 mins" },
          { range: "15:21 - 22:01", frequency: "10 mins" },
          { range: "22:01 - 22:45", frequency: "15 mins" }
        ],
        from_end: [ // Image 1
          { range: "05:00 - 05:20", frequency: "20 mins" },
          { range: "05:20 - 06:00", frequency: "15 mins" },
          { range: "06:00 - 06:54", frequency: "11 mins" },
          { range: "06:54 - 12:20", frequency: "10 mins" },
          { range: "12:20 - 16:02", frequency: "8 mins" },
          { range: "16:02 - 23:05", frequency: "10 mins" }
        ]
      },
      saturday: {
        title: "Saturday Timetable",
        from_start: [
          { range: "05:00 - 08:00", frequency: "10-12 mins" },
          { range: "08:00 - 20:00", frequency: "6-8 mins" },
          { range: "20:00 - 22:45", frequency: "12-15 mins" }
        ],
        from_end: [
          { range: "05:00 - 08:00", frequency: "10-12 mins" },
          { range: "08:00 - 20:30", frequency: "6-8 mins" },
          { range: "20:30 - 23:05", frequency: "12-15 mins" }
        ]
      },
      sunday: {
        title: "Sunday Timetable",
        from_start: [ // Image 2
          { range: "07:00 - 10:33", frequency: "10 mins" },
          { range: "10:33 - 20:01", frequency: "8 mins" },
          { range: "20:01 - 22:31", frequency: "10 mins" },
          { range: "22:31 - 22:45", frequency: "14 mins" }
        ],
        from_end: [ // Image 2
          { range: "07:00 - 07:50", frequency: "15 mins" },
          { range: "07:50 - 12:00", frequency: "10 mins" },
          { range: "12:00 - 21:28", frequency: "8 mins" },
          { range: "21:28 - 23:05", frequency: "10 mins" }
        ]
      }
    },
    weekday: { firstTrain: { from_start: "05:00", from_end: "05:00" }, lastTrain: { from_start: "22:45", from_end: "23:05" }, peakFrequency: "5-8 min", offPeakFrequency: "10-15 min", peakHours: "08:00-11:00 & 16:00-20:00" },
    weekend: { firstTrain: { from_start: "07:00", from_end: "07:00" }, lastTrain: { from_start: "22:45", from_end: "23:05" }, frequency: "8-12 min" },
    holiday: { firstTrain: { from_start: "07:00", from_end: "07:00" }, lastTrain: { from_start: "22:45", from_end: "23:05" }, frequency: "12 min" }
  },
  green: {
    name: "Green Line",
    color: "#22C55E",
    route: "Madavara ↔ Silk Institute",
    stations: 32,
    notes: [
      "Additional trains from select intermediate stations will be operated in case of any surge in the travel demand.",
      "Train timings may vary subject to planned activities."
    ],
    schedules: {
      monday: {
        title: "Monday Timetable",
        from_start: [
          { range: "05:00 - 06:15", frequency: "15 mins" },
          { range: "06:15 - 10:25", frequency: "11 mins" },
          { range: "10:25 - 10:39", frequency: "7-8 mins" },
          { range: "10:39 - 15:51", frequency: "10 mins" },
          { range: "15:51 - 19:44", frequency: "9 mins" },
          { range: "19:44 - 20:24", frequency: "8 mins" },
          { range: "20:24 - 22:40", frequency: "10-12 mins" },
          { range: "22:40 - 22:57", frequency: "15 mins" }
        ],
        from_end: [
          { range: "05:00 - 07:00", frequency: "15 mins" },
          { range: "07:00 - 11:09", frequency: "11 mins" },
          { range: "11:09 - 16:48", frequency: "8 mins" },
          { range: "16:48 - 20:29", frequency: "10 mins" },
          { range: "20:29 - 21:30", frequency: "8 mins" },
          { range: "21:30 - 22:40", frequency: "10 mins" },
          { range: "22:40 - 23:05", frequency: "12-15 mins" }
        ]
      },
      tue_fri: {
        title: "Tue - Fri",
        from_start: [
          { range: "05:00 - 06:15", frequency: "15 mins" },
          { range: "06:15 - 10:25", frequency: "11 mins" },
          { range: "10:25 - 10:39", frequency: "7-8 mins" },
          { range: "10:39 - 15:51", frequency: "10 mins" },
          { range: "15:51 - 19:44", frequency: "9 mins" },
          { range: "19:44 - 20:24", frequency: "8 mins" },
          { range: "20:24 - 22:40", frequency: "10-12 mins" },
          { range: "22:40 - 22:57", frequency: "15 mins" }
        ],
        from_end: [
          { range: "05:00 - 07:00", frequency: "15 mins" },
          { range: "07:00 - 11:09", frequency: "11 mins" },
          { range: "11:09 - 16:48", frequency: "8 mins" },
          { range: "16:48 - 20:29", frequency: "10 mins" },
          { range: "20:29 - 21:30", frequency: "8 mins" },
          { range: "21:30 - 22:40", frequency: "10 mins" },
          { range: "22:40 - 23:05", frequency: "12-15 mins" }
        ]
      },
      saturday: {
        title: "Saturday Timetable",
        from_start: [
          { range: "05:00 - 08:00", frequency: "12-15 mins" },
          { range: "08:00 - 20:00", frequency: "8-10 mins" },
          { range: "20:00 - 22:57", frequency: "15 mins" }
        ],
        from_end: [
          { range: "05:00 - 08:00", frequency: "12-15 mins" },
          { range: "08:00 - 20:30", frequency: "8-10 mins" },
          { range: "20:30 - 23:05", frequency: "15 mins" }
        ]
      },
      sunday: {
        title: "Sunday Timetable",
        from_start: [
          { range: "07:00 - 11:00", frequency: "12 mins" },
          { range: "11:00 - 20:00", frequency: "8-10 mins" },
          { range: "20:00 - 23:00", frequency: "15 mins" }
        ],
        from_end: [
          { range: "07:00 - 11:00", frequency: "12 mins" },
          { range: "11:00 - 20:30", frequency: "8-10 mins" },
          { range: "20:30 - 23:05", frequency: "15 mins" }
        ]
      }
    },
    weekday: { firstTrain: { from_start: "05:00", from_end: "05:00" }, lastTrain: { from_start: "22:57", from_end: "23:05" }, peakFrequency: "5-10 min", offPeakFrequency: "10-15 min", peakHours: "08:00-11:00 & 16:00-20:00" },
    weekend: { firstTrain: { from_start: "07:00", from_end: "07:00" }, lastTrain: { from_start: "22:57", from_end: "23:05" }, frequency: "10-12 min" },
    holiday: { firstTrain: { from_start: "07:00", from_end: "07:00" }, lastTrain: { from_start: "22:57", from_end: "23:05" }, frequency: "15 min" }
  },
  yellow: {
    name: "Yellow Line",
    color: "#FBBF24",
    route: "RV Road ↔ Bommasandra",
    stations: 16,
    notes: [
      "Yellow Line schedule reflects 2026 operations.",
      "Train timings may vary subject to planned activities."
    ],
    schedules: {
      monday: {
        title: "Monday", // Image 3
        from_start: [ // From RV Road
          { range: "05:05 - 06:40", frequency: "20-30 mins" },
          { range: "06:40 - 07:37", frequency: "10-16 mins" },
          { range: "07:37 - 10:55", frequency: "09 mins" },
          { range: "10:55 - 16:42", frequency: "11-14 mins" },
          { range: "16:42 - 22:06", frequency: "09 mins" },
          { range: "22:06 - 23:55", frequency: "12-20 mins" }
        ],
        from_end: [ // From Bommasandra
          { range: "05:05 - 06:20", frequency: "25-30 mins" },
          { range: "06:20 - 07:00", frequency: "10-20 mins" },
          { range: "07:00 - 10:18", frequency: "09 mins" },
          { range: "10:18 - 16:06", frequency: "12-14 mins" },
          { range: "16:06 - 22:42", frequency: "09 mins" }
        ]
      },
      tue_sat: {
        title: "Tue - Sat", // Image 4
        from_start: [ // From RV Road
          { range: "06:00 - 07:36", frequency: "13-25 mins" },
          { range: "07:36 - 08:08", frequency: "10-11 mins" },
          { range: "08:08 - 10:59", frequency: "09 mins" },
          { range: "10:59 - 16:47", frequency: "12-14 mins" },
          { range: "16:47 - 22:11", frequency: "09 mins" },
          { range: "22:11 - 23:55", frequency: "14-20 mins" }
        ],
        from_end: [ // From Bommasandra
          { range: "06:00 - 07:23", frequency: "12-20 mins" },
          { range: "07:23 - 07:32", frequency: "11 mins" },
          { range: "07:32 - 10:49", frequency: "09 mins" },
          { range: "10:49 - 16:11", frequency: "12-14 mins" },
          { range: "16:11 - 22:20", frequency: "09 mins" },
          { range: "22:20 - 22:42", frequency: "10-12 mins" }
        ]
      },
      sunday: {
        title: "Sunday", // Image 5
        from_start: [ // From RV Road
          { range: "07:00 - 11:48", frequency: "18 mins" },
          { range: "11:48 - 21:08", frequency: "14 mins" },
          { range: "21:08 - 23:55", frequency: "18-25 mins" }
        ],
        from_end: [ // From Bommasandra
          { range: "07:00 - 11:12", frequency: "18 mins" },
          { range: "11:12 - 22:24", frequency: "14 mins" },
          { range: "22:24 - 22:42", frequency: "18 mins" }
        ]
      }
    },
    weekday: { firstTrain: { from_start: "05:05", from_end: "05:05" }, lastTrain: { from_start: "23:55", from_end: "22:42" }, peakFrequency: "9 min", offPeakFrequency: "15 min", peakHours: "08:00-12:00 & 16:00-21:00" },
    weekend: { firstTrain: { from_start: "07:00", from_end: "07:00" }, lastTrain: { from_start: "23:55", from_end: "22:42" }, frequency: "14-18 min" },
    holiday: { firstTrain: { from_start: "07:00", from_end: "07:00" }, lastTrain: { from_start: "23:55", from_end: "22:42" }, frequency: "20 min" }
  }
};
