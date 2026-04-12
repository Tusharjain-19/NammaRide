// ============================================================
// NammaRide — Station Metadata for Bengaluru Metro
// Purple Line: 37 stations | Green Line: 32 stations | Yellow Line: 16 stations
// ============================================================

export const stationsMeta = [
  // ═══════════════════════════════════════
  // PURPLE LINE STATIONS (P01 - P37)
  // ═══════════════════════════════════════
  { id:"P01", name:"Whitefield (Kadugodi)", name_kn:"ವೈಟ್‌ಫೀಲ್ಡ್ (ಕಾಡುಗೋಡಿ)", code:"WFD", line:"Purple Line", type:"Elevated", platforms:"2", metroInfo:{operator:"BMRCL",opened:2023}, 
    accessibility: { wheelchair: true, elevator: true, lifts: "Standard BMRCL lift parameters compliant with ADA", escalators: true, escalatorInfo: "Concourse to platform level" },
    facilities:["Toilets","Escalator","Elevator","Ticket Counter","Smart Card Recharge","Wheelchair Access","Parking"], 
    connectivity:["BMTC Bus Stop","Auto rickshaw stand","Taxi / Cab pickup","Whitefield IT Hub access"], location:{lat:12.9938,lon:77.7577}},

  { id:"P02", name:"Hopefarm Channasandra", name_kn:"ಹೋಪ್‌ಫಾರ್ಮ್ ಚನ್ನಸಂದ್ರ", code:"HFC", line:"Purple Line", type:"Elevated", platforms:"2", metroInfo:{operator:"BMRCL",opened:2023}, 
    accessibility: { wheelchair: true, elevator: true, lifts: "Standard BMRCL lift parameters compliant with ADA", escalators: true, escalatorInfo: "Concourse to platform level" },
    facilities:["Toilets","Escalator","Ticket Counter","Wheelchair Access"], 
    connectivity:["BMTC Bus Stop","Auto rickshaw stand"], location:{lat:12.9897,lon:77.7479}},

  { id:"P03", name:"Kadugodi Tree Park", name_kn:"ಕಾಡುಗೋಡಿ ಟ್ರೀ ಪಾರ್ಕ್", code:"P03", line:"Purple Line", type:"Elevated", platforms:"2", metroInfo:{operator:"BMRCL",opened:2023}, 
    accessibility: { wheelchair: true, elevator: true, lifts: "Wheelchair accessible, tactile flooring approaches", escalators: true, escalatorInfo: "Available for both up and down transit" },
    facilities:["Toilets","Escalator","Ticket Counter","Wheelchair Access"], 
    connectivity:["BMTC Bus Stop","Auto rickshaw stand"], location:{lat:12.9863,lon:77.7397}},

  { id:"P04", name:"Pattanduru Agrahara", name_kn:"ಪಟ್ಟಂದೂರು ಅಗ್ರಹಾರ", code:"PTDA", line:"Purple Line", type:"Elevated", platforms:"2", metroInfo:{operator:"BMRCL",opened:2023}, 
    accessibility: { wheelchair: true, elevator: true, lifts: "Standard BMRCL layout with braille panels", escalators: true, escalatorInfo: "Operational from concourse to street" },
    facilities:["Toilets","Escalator","Ticket Counter"], 
    connectivity:["BMTC Bus Stop","Auto rickshaw stand"], location:{lat:12.9829,lon:77.7324}},

  { id:"P05", name:"Sri Sathya Sai Hospital", name_kn:"ಶ್ರೀ ಸತ್ಯ ಸಾಯಿ ಆಸ್ಪತ್ರೆ", code:"SSSH", line:"Purple Line", type:"Elevated", platforms:"2", metroInfo:{operator:"BMRCL",opened:2023}, 
    accessibility: { wheelchair: true, elevator: true, lifts: "Wide capacity optimized for stretchers and wheelchairs", escalators: true, escalatorInfo: "Operational at both gates" },
    facilities:["Toilets","Escalator","Ticket Counter","Wheelchair Access"], 
    connectivity:["BMTC Bus Stop","Auto rickshaw stand","Hospital access"], location:{lat:12.9806,lon:77.7248}},

  { id:"P06", name:"Nallurhalli", name_kn:"ನಲ್ಲೂರಹಳ್ಳಿ", code:"VDHP", line:"Purple Line", type:"Elevated", platforms:"2", metroInfo:{operator:"BMRCL",opened:2023}, 
    accessibility: { wheelchair: true, elevator: true, lifts: "Fully ADA compliant", escalators: true, escalatorInfo: "Available from street to platform" },
    facilities:["Toilets","Escalator","Ticket Counter"], 
    connectivity:["BMTC Bus Stop","Auto rickshaw stand"], location:{lat:12.9765,lon:77.7175}},

  { id:"P07", name:"Kundalahalli", name_kn:"ಕುಂಡಲಹಳ್ಳಿ", code:"KNDL", line:"Purple Line", type:"Elevated", platforms:"2", metroInfo:{operator:"BMRCL",opened:2023}, 
    accessibility: { wheelchair: true, elevator: true, lifts: "Wheelchair accessible, tactile flooring", escalators: true, escalatorInfo: "Concourse to street level" },
    facilities:["Toilets","Escalator","Ticket Counter","Wheelchair Access"], 
    connectivity:["BMTC Bus Stop","Auto rickshaw stand","ITPL Road access"], location:{lat:12.9715,lon:77.7126}},

  { id:"P08", name:"Seetharamapalya", name_kn:"ಸೀತಾರಾಮಪಾಳ್ಯ", code:"SRPL", line:"Purple Line", type:"Elevated", platforms:"2", metroInfo:{operator:"BMRCL",opened:2023}, 
    accessibility: { wheelchair: true, elevator: true, lifts: "Functional and compliant", escalators: true, escalatorInfo: "Functional at main entries" },
    facilities:["Toilets","Escalator","Ticket Counter"], 
    connectivity:["BMTC Bus Stop","Auto rickshaw stand"], location:{lat:12.9768,lon:77.7027}},

  { id:"P09", name:"Hoodi", name_kn:"ಹೂಡಿ", code:"DKIA", line:"Purple Line", type:"Elevated", platforms:"2", metroInfo:{operator:"BMRCL",opened:2023}, 
    accessibility: { wheelchair: true, elevator: true, lifts: "Available", escalators: true, escalatorInfo: "Available" },
    facilities:["Toilets","Escalator","Elevator","Ticket Counter","Wheelchair Access"], 
    connectivity:["BMTC Bus Stop","Auto rickshaw stand","Taxi"], location:{lat:12.9845,lon:77.6963}},

  { id:"P10", name:"Garudacharapalya", name_kn:"ಗರುಡಾಚಾರಪಾಳ್ಯ", code:"GDCP", line:"Purple Line", type:"Elevated", platforms:"2", metroInfo:{operator:"BMRCL",opened:2023}, 
    accessibility: { wheelchair: true, elevator: true, lifts: "Available", escalators: true, escalatorInfo: "Available" },
    facilities:["Toilets","Escalator","Ticket Counter"], 
    connectivity:["BMTC Bus Stop","Auto rickshaw stand"], location:{lat:12.9907,lon:77.6917}},

  { id:"P11", name:"Singayyanapalya", name_kn:"ಸಿಂಗಯ್ಯನಪಾಳ್ಯ", code:"SGYP", line:"Purple Line", type:"Elevated", platforms:"2", metroInfo:{operator:"BMRCL",opened:2023}, 
    accessibility: { wheelchair: true, elevator: true, lifts: "Designated areas for differently-abled", escalators: true, escalatorInfo: "Operational" },
    facilities:["Toilets","Escalator","Ticket Counter"], 
    connectivity:["BMTC Bus Stop","Auto rickshaw stand"], location:{lat:12.9936,lon:77.6828}},

  { id:"P12", name:"Krishnarajapura (KR Pura)", name_kn:"ಕೃಷ್ಣರಾಜಪುರ (ಕೆ.ಆರ್. ಪುರ)", code:"KRP", line:"Purple Line", type:"Elevated", platforms:"2", metroInfo:{operator:"BMRCL",opened:2023}, 
    accessibility: { wheelchair: true, elevator: true, lifts: "Heavy duty lifts to handle future interchange traffic", escalators: true, escalatorInfo: "Multiple escalators available" },
    facilities:["Toilets","Escalator","Elevator","Ticket Counter","Smart Card Recharge","Wheelchair Access","Parking"], 
    connectivity:["BMTC Bus Stop","Auto rickshaw stand","Taxi","KR Pura Railway Station nearby"], location:{lat:12.9959,lon:77.6718}},

  { id:"P13", name:"Benniganahalli", name_kn:"ಬೆನ್ನಿಗಾನಹಳ್ಳಿ", code:"JTPM", line:"Purple Line", type:"Elevated", platforms:"2", metroInfo:{operator:"BMRCL",opened:2023}, 
    accessibility: { wheelchair: true, elevator: true, lifts: "Available", escalators: true, escalatorInfo: "Available" },
    facilities:["Toilets","Escalator","Ticket Counter"], 
    connectivity:["BMTC Bus Stop","Auto rickshaw stand"], location:{lat:12.9964,lon:77.6683}},

  { id:"P14", name:"Baiyappanahalli", name_kn:"ಬೈಯಪ್ಪನಹಳ್ಳಿ", code:"BYPL", line:"Purple Line", type:"Elevated", platforms:"2", metroInfo:{operator:"BMRCL",opened:2011}, 
    accessibility: { wheelchair: true, elevator: true, lifts: "Available from ground to platform", escalators: true, escalatorInfo: "Available" },
    facilities:["Toilets","Escalator","Elevator","Ticket Counter","Smart Card Recharge","Wheelchair Access","Parking (large)","EV Battery Swapping"], 
    connectivity:["BMTC Bus Stop","Auto rickshaw stand","Taxi","Baiyappanahalli Railway Station","Taxi Kiosks"], location:{lat:12.9908,lon:77.6525}},

  { id:"P15", name:"Swami Vivekananda Road", name_kn:"ಸ್ವಾಮಿ ವಿವೇಕಾನಂದ ರಸ್ತೆ", code:"SVRD", line:"Purple Line", type:"Elevated", platforms:"2", metroInfo:{operator:"BMRCL",opened:2011}, 
    accessibility: { wheelchair: true, elevator: true, lifts: "Available", escalators: true, escalatorInfo: "Available" },
    facilities:["Toilets","Escalator","Elevator","Ticket Counter","Wheelchair Access"], 
    connectivity:["BMTC Bus Stop","Auto rickshaw stand"], location:{lat:12.9918,lon:77.6393}},

  { id:"P16", name:"Indiranagar", name_kn:"ಇಂದಿರಾನಗರ", code:"IDN", line:"Purple Line", type:"Elevated", platforms:"2", metroInfo:{operator:"BMRCL",opened:2011}, 
    accessibility: { wheelchair: true, elevator: true, lifts: "Available", escalators: true, escalatorInfo: "Available" },
    facilities:["Toilets","Escalator","Elevator","Ticket Counter","Smart Card Recharge","Wheelchair Access"], 
    connectivity:["BMTC Bus Stop","Auto rickshaw stand","Taxi","100 Feet Road access","Bike Rentals (Royal Brothers)"], location:{lat:12.9781,lon:77.6406}},

  { id:"P17", name:"Halasuru", name_kn:"ಹಲಸೂರು", code:"HLRU", line:"Purple Line", type:"Elevated", platforms:"2", metroInfo:{operator:"BMRCL",opened:2011}, 
    accessibility: { wheelchair: true, elevator: true, lifts: "Available", escalators: true, escalatorInfo: "Available" },
    facilities:["Toilets","Escalator","Elevator","Ticket Counter","Wheelchair Access"], 
    connectivity:["BMTC Bus Stop","Auto rickshaw stand"], location:{lat:12.9781,lon:77.6276}},

  { id:"P18", name:"Trinity", name_kn:"ಟ್ರಿನಿಟಿ", code:"TRY", line:"Purple Line", type:"Elevated", platforms:"2", metroInfo:{operator:"BMRCL",opened:2011}, 
    accessibility: { wheelchair: true, elevator: true, lifts: "Available", escalators: true, escalatorInfo: "Available" },
    facilities:["Toilets","Escalator","Elevator","Ticket Counter","Smart Card Recharge","Wheelchair Access"], 
    connectivity:["BMTC Bus Stop","Auto rickshaw stand","Taxi","Trinity Circle access"], location:{lat:12.9733,lon:77.6181}},

  { id:"P19", name:"Mahatma Gandhi Road", name_kn:"ಮಹಾತ್ಮ ಗಾಂಧಿ ರಸ್ತೆ", code:"MAGR", line:"Purple Line", type:"Elevated", platforms:"2", metroInfo:{operator:"BMRCL",opened:2011}, 
    accessibility: { wheelchair: true, elevator: true, lifts: "Available", escalators: true, escalatorInfo: "Available" },
    facilities:["Toilets","Escalator","Elevator","Ticket Counter","Smart Card Recharge","Wheelchair Access"], 
    connectivity:["BMTC Bus Stop","Auto rickshaw stand","Taxi","MG Road shopping area"], location:{lat:12.9756,lon:77.6083}},

  { id:"P20", name:"Cubbon Park", name_kn:"ಕಬ್ಬನ್ ಪಾರ್ಕ್", code:"CBPK", line:"Purple Line", type:"Underground", platforms:"2", metroInfo:{operator:"BMRCL",opened:2016}, 
    accessibility: { wheelchair: true, elevator: true, lifts: "Surface to concourse, concourse to platform lifts available", escalators: true, escalatorInfo: "Deep underground escalators" },
    facilities:["Toilets","Escalator","Elevator","Ticket Counter","Wheelchair Access"], 
    connectivity:["BMTC Bus Stop","Auto rickshaw stand","Cubbon Park entrance"], location:{lat:12.9794,lon:77.5959}},

  { id:"P21", name:"Dr. B.R. Ambedkar Stn., Vidhana Soudha", name_kn:"ಡಾ. ಬಿ.ಆರ್. ಅಂಬೇಡ್ಕರ್ ನಿಲ್ದಾಣ, ವಿಧಾನ ಸೌಧ", code:"VDSA", line:"Purple Line", type:"Underground", platforms:"2", metroInfo:{operator:"BMRCL",opened:2016}, 
    accessibility: { wheelchair: false, elevator: false, lifts: "Missing lift at High Court exit, requiring ascent of 71 steps", escalators: true, escalatorInfo: "Available at specific gates only" },
    facilities:["Toilets","Escalator","Elevator","Ticket Counter","Wheelchair Access"], 
    connectivity:["BMTC Bus Stop","Auto rickshaw stand","Vidhana Soudha access"], location:{lat:12.9797,lon:77.5907}},

  { id:"P22", name:"Sir M. Visveswaraya Stn., Central College", name_kn:"ಸರ್ ಎಂ. ವಿಶ್ವೇಶ್ವರಯ್ಯ ನಿಲ್ದಾಣ, ಸೆಂಟ್ರಲ್ ಕಾಲೇಜು", code:"CC", line:"Purple Line", type:"Underground", platforms:"2", metroInfo:{operator:"BMRCL",opened:2016}, 
    accessibility: { wheelchair: true, elevator: true, lifts: "Available", escalators: true, escalatorInfo: "Available" },
    facilities:["Toilets","Escalator","Elevator","Ticket Counter","Wheelchair Access"], 
    connectivity:["BMTC Bus Stop","Auto rickshaw stand","Central College campus"], location:{lat:12.9742,lon:77.5839}},

  { id:"P23", name:"Nadaprabhu Kempegowda Stn., Majestic", name_kn:"ನಾಡಪ್ರಭು ಕೆಂಪೇಗೌಡ ನಿ., ಮೆಜೆಸ್ಟಿಕ್", code:"KGWA", line:"Purple Line", type:"Underground", platforms:"2", metroInfo:{operator:"BMRCL",opened:2016}, 
    accessibility: { wheelchair: true, elevator: true, lifts: "Multiple lifts connecting all 3 interchange levels", escalators: true, escalatorInfo: "Heavy duty escalators designed for mass transit" },
    facilities:["Toilets","Escalator","Elevator","Ticket Counter","Smart Card Recharge","Wheelchair Access","Interchange to Green Line","EV Battery Swapping"], 
    connectivity:["BMTC Bus Stop","Kempegowda Bus Station","Auto rickshaw stand","Taxi","City Railway Station nearby","Pre-paid Taxi Kiosk"], location:{lat:12.9761,lon:77.5731}},

  { id:"P24", name:"KSR City Railway Station", name_kn:"ಕ್ರಾಂತಿವೀರ ಸಂಗೊಳ್ಳಿ ರಾಯಣ್ಣ ರೈಲ್ವೆ ನಿಲ್ದಾಣ", code:"SBC", line:"Purple Line", type:"Underground", platforms:"2", metroInfo:{operator:"BMRCL",opened:2016}, 
    accessibility: { wheelchair: true, elevator: true, lifts: "Available", escalators: true, escalatorInfo: "Available" },
    facilities:["Toilets","Escalator","Elevator","Ticket Counter","Smart Card Recharge","Wheelchair Access","Large Parking"], 
    connectivity:["Bengaluru City Railway Station","BMTC Bus Stop","Prepaid taxi counters","Auto rickshaw stand"], location:{lat:12.9718,lon:77.5670}},

  { id:"P25", name:"Magadi Road", name_kn:"ಮಾಗಡಿ ರಸ್ತೆ", code:"MADI", line:"Purple Line", type:"Elevated", platforms:"2", metroInfo:{operator:"BMRCL",opened:2015}, 
    accessibility: { wheelchair: true, elevator: true, lifts: "Available", escalators: true, escalatorInfo: "Available" },
    facilities:["Toilets","Escalator","Ticket Counter","Wheelchair Access"], 
    connectivity:["BMTC Bus Stop","Auto rickshaw stand"], location:{lat:12.9782,lon:77.5542}},

  { id:"P26", name:"Sri Balagangadharanatha Swamiji Stn., Hosahalli", name_kn:"ಶ್ರೀ ಬಾಲಗಂಗಾಧರನಾಥ ಸ್ವಾಮೀಜಿ ನಿಲ್ದಾಣ, ಹೊಸಹಳ್ಳಿ", code:"HSH", line:"Purple Line", type:"Elevated", platforms:"2", metroInfo:{operator:"BMRCL",opened:2015}, 
    accessibility: { wheelchair: false, elevator: false, lifts: "Missing lifts at entrances requiring commuters to climb 60+ steps", escalators: false, escalatorInfo: "Space earmarked but equipment not installed" },
    facilities:["Toilets","Escalator","Ticket Counter","Wheelchair Access"], 
    connectivity:["BMTC Bus Stop","Auto rickshaw stand"], location:{lat:12.9701,lon:77.5459}},

  { id:"P27", name:"Vijayanagar", name_kn:"ವಿಜಯನಗರ", code:"VJY", line:"Purple Line", type:"Elevated", platforms:"2", metroInfo:{operator:"BMRCL",opened:2015}, 
    accessibility: { wheelchair: true, elevator: true, lifts: "Available", escalators: true, escalatorInfo: "Available" },
    facilities:["Toilets","Escalator","Elevator","Ticket Counter","Wheelchair Access"], 
    connectivity:["BMTC Bus Stop","Auto rickshaw stand","Taxi"], location:{lat:12.9613,lon:77.5372}},

  { id:"P28", name:"Attiguppe", name_kn:"ಅತ್ತಿಗುಪ್ಪೆ", code:"AGPP", line:"Purple Line", type:"Elevated", platforms:"2", metroInfo:{operator:"BMRCL",opened:2015}, 
    accessibility: { wheelchair: true, elevator: true, lifts: "Available", escalators: true, escalatorInfo: "Available" },
    facilities:["Toilets","Escalator","Ticket Counter"], 
    connectivity:["BMTC Bus Stop","Auto rickshaw stand"], location:{lat:12.9567,lon:77.5298}},

  { id:"P29", name:"Deepanjali Nagar", name_kn:"ದೀಪಾಂಜಲಿ ನಗರ", code:"DJNR", line:"Purple Line", type:"Elevated", platforms:"2", metroInfo:{operator:"BMRCL",opened:2015}, 
    accessibility: { wheelchair: true, elevator: true, lifts: "Available", escalators: true, escalatorInfo: "Available" },
    facilities:["Toilets","Escalator","Ticket Counter"], 
    connectivity:["BMTC Bus Stop","Auto rickshaw stand"], location:{lat:12.9496,lon:77.5262}},

  { id:"P30", name:"Mysuru Road", name_kn:"ಮೈಸೂರು ರಸ್ತೆ", code:"MYRD", line:"Purple Line", type:"Elevated", platforms:"2", metroInfo:{operator:"BMRCL",opened:2015}, 
    accessibility: { wheelchair: true, elevator: true, lifts: "Available", escalators: true, escalatorInfo: "Available" },
    facilities:["Toilets","Escalator","Elevator","Ticket Counter","Smart Card Recharge","Wheelchair Access","Parking"], 
    connectivity:["BMTC Bus Stop","Auto rickshaw stand","Taxi","Mysore Road access"], location:{lat:12.9442,lon:77.5212}},

  { id:"P31", name:"Pantharapalya-Nayandahalli", name_kn:"ಪಂತರಪಾಳ್ಯ-ನಾಯಂಡಹಳ್ಳಿ", code:"NYDH", line:"Purple Line", type:"Elevated", platforms:"2", metroInfo:{operator:"BMRCL",opened:2021}, 
    accessibility: { wheelchair: true, elevator: true, lifts: "Available", escalators: true, escalatorInfo: "Available" },
    facilities:["Toilets","Escalator","Ticket Counter","Wheelchair Access"], 
    connectivity:["BMTC Bus Stop","Auto rickshaw stand"], location:{lat:12.9348,lon:77.5147}},

  { id:"P32", name:"Rajarajeshwari Nagar", name_kn:"ರಾಜರಾಜೇಶ್ವರಿ ನಗರ", code:"RRNR", line:"Purple Line", type:"Elevated", platforms:"2", metroInfo:{operator:"BMRCL",opened:2021}, 
    accessibility: { wheelchair: true, elevator: true, lifts: "Available", escalators: true, escalatorInfo: "Available" },
    facilities:["Toilets","Escalator","Elevator","Ticket Counter","Wheelchair Access","Parking"], 
    connectivity:["BMTC Bus Stop","Auto rickshaw stand","Taxi"], location:{lat:12.9269,lon:77.5104}},

  { id:"P33", name:"Jnanabharathi", name_kn:"ಜ್ಞಾನಭಾರತಿ", code:"JNBR", line:"Purple Line", type:"Elevated", platforms:"2", metroInfo:{operator:"BMRCL",opened:2021}, 
    accessibility: { wheelchair: true, elevator: true, lifts: "Available", escalators: true, escalatorInfo: "Available" },
    facilities:["Toilets","Escalator","Ticket Counter","Wheelchair Access"], 
    connectivity:["BMTC Bus Stop","Auto rickshaw stand","Bangalore University campus"], location:{lat:12.9213,lon:77.5015}},

  { id:"P34", name:"Pattanagere", name_kn:"ಪಟ್ಟಣಗೆರೆ", code:"PTGE", line:"Purple Line", type:"Elevated", platforms:"2", metroInfo:{operator:"BMRCL",opened:2021}, 
    accessibility: { wheelchair: true, elevator: true, lifts: "Available", escalators: true, escalatorInfo: "Available" },
    facilities:["Toilets","Escalator","Ticket Counter"], 
    connectivity:["BMTC Bus Stop","Auto rickshaw stand"], location:{lat:12.9108,lon:77.4975}},

  { id:"P35", name:"Kengeri Bus Terminal", name_kn:"ಕೆಂಗೇರಿ ಬಸ್ ಟರ್ಮಿನಲ್", code:"KGBT", line:"Purple Line", type:"Elevated", platforms:"2", metroInfo:{operator:"BMRCL",opened:2021}, 
    accessibility: { wheelchair: true, elevator: true, lifts: "Available", escalators: true, escalatorInfo: "Available" },
    facilities:["Toilets","Escalator","Elevator","Ticket Counter","Smart Card Recharge","Wheelchair Access","Parking"], 
    connectivity:["BMTC Bus Terminal","Auto rickshaw stand","Taxi","Interstate bus services"], location:{lat:12.9034,lon:77.4878}},

  { id:"P36", name:"Kengeri", name_kn:"ಕೆಂಗೇರಿ", code:"KGRI", line:"Purple Line", type:"Elevated", platforms:"2", metroInfo:{operator:"BMRCL",opened:2021}, 
    accessibility: { wheelchair: true, elevator: true, lifts: "Available", escalators: true, escalatorInfo: "Available" },
    facilities:["Toilets","Escalator","Ticket Counter","Wheelchair Access"], 
    connectivity:["BMTC Bus Stop","Auto rickshaw stand"], location:{lat:12.9064,lon:77.4767}},

  { id:"P37", name:"Challaghatta", name_kn:"ಚಲ್ಲಘಟ್ಟ", code:"CLGA", line:"Purple Line", type:"Elevated", platforms:"2", metroInfo:{operator:"BMRCL",opened:2023}, 
    accessibility: { wheelchair: true, elevator: true, lifts: "Available", escalators: true, escalatorInfo: "Available" },
    facilities:["Toilets","Escalator","Elevator","Ticket Counter","Smart Card Recharge","Wheelchair Access","Parking (large)"], 
    connectivity:["BMTC Bus Stop","Auto rickshaw stand","Taxi"], location:{lat:12.9056,lon:77.4619}},

  // ═══════════════════════════════════════
  // GREEN LINE STATIONS (G01 - G32)
  // ═══════════════════════════════════════
  { id:"G01", name:"Madavara", name_kn:"ಮಾದಾವರ", code:"G01", line:"Green Line", type:"Elevated", platforms:"2", metroInfo:{operator:"BMRCL",opened:"2024"}, facilities:["Toilets","Escalator","Ticket Counter","Wheelchair Access","Parking"], connectivity:["BMTC Bus Stop","Auto rickshaw stand"], location:{lat:13.0574,lon:77.4728}},
  { id:"G02", name:"Chikkabidarakallu", name_kn:"ಚಿಕ್ಕಬಿದರಕಲ್ಲು", code:"G02", line:"Green Line", type:"Elevated", platforms:"2", metroInfo:{operator:"BMRCL",opened:"2024"}, facilities:["Toilets","Escalator","Ticket Counter"], connectivity:["BMTC Bus Stop","Auto rickshaw stand"], location:{lat:13.0542,lon:77.4830}},
  { id:"G03", name:"Manjunath Nagar", name_kn:"ಮಂಜುನಾಥ ನಗರ", code:"G03", line:"Green Line", type:"Elevated", platforms:"2", metroInfo:{operator:"BMRCL",opened:"2024"}, facilities:["Toilets","Escalator","Ticket Counter","Wheelchair Access"], connectivity:["BMTC Bus Stop","Auto rickshaw stand"], location:{lat:13.0513,lon:77.4914}},
  { id:"G04", name:"Nagasandra", name_kn:"ನಾಗಸಂದ್ರ", code:"G04", line:"Green Line", type:"Elevated", platforms:"2", metroInfo:{operator:"BMRCL",opened:"2014"}, facilities:["Toilets","Escalator","Elevator","Ticket Counter","Smart Card Recharge","Wheelchair Access","Parking (large)"], connectivity:["BMTC Bus Stop","Auto rickshaw stand","Taxi"], location:{lat:13.0480,lon:77.5001}},
  { id:"G05", name:"Dasarahalli", name_kn:"ದಾಸರಹಳ್ಳಿ", code:"G05", line:"Green Line", type:"Elevated", platforms:"2", metroInfo:{operator:"BMRCL",opened:"2014"}, facilities:["Toilets","Escalator","Ticket Counter","Wheelchair Access"], connectivity:["BMTC Bus Stop","Auto rickshaw stand"], location:{lat:13.0435,lon:77.5135}},
  { id:"G06", name:"Jalahalli", name_kn:"ಜಾಲಹಳ್ಳಿ", code:"G06", line:"Green Line", type:"Elevated", platforms:"2", metroInfo:{operator:"BMRCL",opened:"2014"}, facilities:["Toilets","Escalator","Ticket Counter","Wheelchair Access"], connectivity:["BMTC Bus Stop","Auto rickshaw stand","IAF Station nearby"], location:{lat:13.0401,lon:77.5191}},
  { id:"G07", name:"Peenya Industry", name_kn:"ಪೀಣ್ಯಾ ಕೈಗಾರಿಕೆ", code:"G07", line:"Green Line", type:"Elevated", platforms:"2", metroInfo:{operator:"BMRCL",opened:"2014"}, facilities:["Toilets","Escalator","Ticket Counter"], connectivity:["BMTC Bus Stop","Auto rickshaw stand","Peenya Industrial Area"], location:{lat:13.0336,lon:77.5297}},
  { id:"G08", name:"Peenya", name_kn:"ಪೀಣ್ಯಾ", code:"G08", line:"Green Line", type:"Elevated", platforms:"2", metroInfo:{operator:"BMRCL",opened:"2014"}, facilities:["Toilets","Escalator","Elevator","Ticket Counter","Wheelchair Access"], connectivity:["BMTC Bus Stop","Auto rickshaw stand"], location:{lat:13.0298,lon:77.5492}},
  { id:"G09", name:"Goraguntepalya", name_kn:"ಗೊರಗುಂಟೆಪಾಳ್ಯ", code:"G09", line:"Green Line", type:"Elevated", platforms:"2", metroInfo:{operator:"BMRCL",opened:"2014"}, facilities:["Toilets","Escalator","Ticket Counter"], connectivity:["BMTC Bus Stop","Auto rickshaw stand"], location:{lat:13.0169,lon:77.5539}},
  { id:"G10", name:"Yeshwanthpur", name_kn:"ಯಶವಂತಪುರ", code:"G10", line:"Green Line", type:"Elevated", platforms:"2", metroInfo:{operator:"BMRCL",opened:"2014"}, facilities:["Toilets","Escalator","Elevator","Ticket Counter","Smart Card Recharge","Wheelchair Access","Parking"], connectivity:["BMTC Bus Stop","Yeshwanthpur Railway Station","Auto rickshaw stand","Taxi"], location:{lat:13.0232,lon:77.5499}},
  { id:"G11", name:"Sandal Soap Factory", name_kn:"ಸ್ಯಾಂಡಲ್ ಸೋಪ್ ಕಾರ್ಖಾನೆ", code:"G11", line:"Green Line", type:"Elevated", platforms:"2", metroInfo:{operator:"BMRCL",opened:"2014"}, facilities:["Toilets","Escalator","Ticket Counter"], connectivity:["BMTC Bus Stop","Auto rickshaw stand"], location:{lat:13.0118,lon:77.5516}},
  { id:"G12", name:"Mahalakshmi", name_kn:"ಮಹಾಲಕ್ಷ್ಮಿ", code:"G12", line:"Green Line", type:"Elevated", platforms:"2", metroInfo:{operator:"BMRCL",opened:"2014"}, facilities:["Toilets","Escalator","Ticket Counter","Wheelchair Access"], connectivity:["BMTC Bus Stop","Auto rickshaw stand"], location:{lat:13.0031,lon:77.5508}},
  { id:"G13", name:"Rajajinagar", name_kn:"ರಾಜಾಜಿನಗರ", code:"G13", line:"Green Line", type:"Elevated", platforms:"2", metroInfo:{operator:"BMRCL",opened:"2014"}, facilities:["Toilets","Escalator","Elevator","Ticket Counter","Wheelchair Access"], connectivity:["BMTC Bus Stop","Auto rickshaw stand","Taxi"], location:{lat:12.9961,lon:77.5518}},
  { id:"G14", name:"Mahakavi Kuvempu Road", name_kn:"ಮಹಾಕವಿ ಕುವೆಂಪು ರಸ್ತೆ", code:"G14", line:"Green Line", type:"Elevated", platforms:"2", metroInfo:{operator:"BMRCL",opened:"2015"}, facilities:["Toilets","Escalator","Elevator","Ticket Counter","Wheelchair Access"], connectivity:["BMTC Bus Stop","Auto rickshaw stand"], location:{lat:12.9922,lon:77.5583}},
  { id:"G15", name:"Srirampura", name_kn:"ಶ್ರೀರಾಮಪುರ", code:"G15", line:"Green Line", type:"Elevated", platforms:"2", metroInfo:{operator:"BMRCL",opened:"2015"}, facilities:["Toilets","Escalator","Ticket Counter","Wheelchair Access"], connectivity:["BMTC Bus Stop","Auto rickshaw stand"], location:{lat:12.9868,lon:77.5621}},
  { id:"G16", name:"Mantri Square Sampige Road", name_kn:"ಮಂತ್ರಿ ಸ್ಕ್ವೇರ್ ಸಂಪಿಗೆ ರಸ್ತೆ", code:"G16", line:"Green Line", type:"Elevated", platforms:"2", metroInfo:{operator:"BMRCL",opened:"2015"}, facilities:["Toilets","Escalator","Elevator","Ticket Counter","Smart Card Recharge","Wheelchair Access"], connectivity:["BMTC Bus Stop","Auto rickshaw stand","Mantri Square Mall access"], location:{lat:12.9904,lon:77.5714}},
  { id:"G17", name:"Nadaprabhu Kempegowda Stn., Majestic", name_kn:"ನಾಡಪ್ರಭು ಕೆಂಪೇಗೌಡ ನಿ., ಮೆಜೆಸ್ಟಿಕ್", code:"G17", line:"Green Line", type:"Underground", platforms:"4", metroInfo:{operator:"BMRCL",opened:"2014"}, facilities:["Toilets","Escalator","Elevator","Ticket Counter","Smart Card Recharge","Wheelchair Access","Interchange to Purple Line"], connectivity:["Kempegowda Bus Station","BMTC Bus Stop","City Railway Station","Auto rickshaw stand","Taxi"], location:{lat:12.9757,lon:77.5730}},
  { id:"G18", name:"Chickpete", name_kn:"ಚಿಕ್ಕಪೇಟೆ", code:"G18", line:"Green Line", type:"Underground", platforms:"2", metroInfo:{operator:"BMRCL",opened:"2015"}, facilities:["Toilets","Escalator","Ticket Counter","Wheelchair Access"], connectivity:["BMTC Bus Stop","Auto rickshaw stand","Chickpete market area"], location:{lat:12.9698,lon:77.5756}},
  { id:"G19", name:"Krishna Rajendra Market", name_kn:"ಕೃಷ್ಣ ರಾಜೇಂದ್ರ ಮಾರುಕಟ್ಟೆ", code:"G19", line:"Green Line", type:"Underground", platforms:"2", metroInfo:{operator:"BMRCL",opened:"2015"}, facilities:["Toilets","Escalator","Elevator","Ticket Counter","Wheelchair Access","EV Battery Swapping"], connectivity:["BMTC Bus Stop","Auto rickshaw stand","KR Market access","Victoria Hospital access"], location:{lat:12.9625,lon:77.5784}},
  { id:"G20", name:"National College", name_kn:"ನ್ಯಾಷನಲ್ ಕಾಲೇಜು", code:"G20", line:"Green Line", type:"Elevated", platforms:"2", metroInfo:{operator:"BMRCL",opened:"2016"}, facilities:["Toilets","Escalator","Ticket Counter","Wheelchair Access"], connectivity:["BMTC Bus Stop","Auto rickshaw stand"], location:{lat:12.9506,lon:77.5737}},
  { id:"G21", name:"Lalbagh Botanical Garden", name_kn:"ಲಾಲ್ ಬಾಗ್ ಬೊಟಾನಿಕಲ್ ಗಾರ್ಡನ್", code:"G21", line:"Green Line", type:"Elevated", platforms:"2", metroInfo:{operator:"BMRCL",opened:"2016"}, facilities:["Toilets","Escalator","Elevator","Ticket Counter","Wheelchair Access"], connectivity:["BMTC Bus Stop","Auto rickshaw stand","Lalbagh Botanical Garden entrance"], location:{lat:12.9497,lon:77.5796}},
  { id:"G22", name:"South End Circle", name_kn:"ಸೌತ್ ಎಂಡ್ ಸರ್ಕಲ್", code:"G22", line:"Green Line", type:"Elevated", platforms:"2", metroInfo:{operator:"BMRCL",opened:"2016"}, facilities:["Toilets","Escalator","Ticket Counter","Wheelchair Access"], connectivity:["BMTC Bus Stop","Auto rickshaw stand"], location:{lat:12.9398,lon:77.5815}},
  { id:"G23", name:"Jayanagar", name_kn:"ಜಯನಗರ", code:"G23", line:"Green Line", type:"Elevated", platforms:"2", metroInfo:{operator:"BMRCL",opened:"2017"}, facilities:["Toilets","Escalator","Elevator","Ticket Counter","Smart Card Recharge","Wheelchair Access"], connectivity:["BMTC Bus Stop","Auto rickshaw stand","Taxi","Jayanagar 4th Block market"], location:{lat:12.9308,lon:77.5808}},
  { id:"G24", name:"Rashtreeya Vidyalaya Road", name_kn:"ರಾಷ್ಟ್ರೀಯ ವಿದ್ಯಾಲಯ ರಸ್ತೆ", code:"G24", line:"Green Line", type:"Elevated", platforms:"2", metroInfo:{operator:"BMRCL",opened:"2017"}, facilities:["Toilets","Escalator","Elevator","Ticket Counter","Smart Card Recharge","Wheelchair Access","Interchange to Yellow Line"], connectivity:["BMTC Bus Stop","Auto rickshaw stand","Taxi"], location:{lat:12.9215,lon:77.5801}},
  { id:"G25", name:"Banashankari", name_kn:"ಬನಶಂಕರಿ", code:"G25", line:"Green Line", type:"Elevated", platforms:"2", metroInfo:{operator:"BMRCL",opened:"2017"}, facilities:["Toilets","Escalator","Elevator","Ticket Counter","Smart Card Recharge","Wheelchair Access","Parking","EV Battery Swapping"], connectivity:["BMTC Bus Stop","Auto rickshaw stand","Taxi","Banashankari Bus Station"], location:{lat:12.9158,lon:77.5727}},
  { id:"G26", name:"Jayaprakash Nagar", name_kn:"ಜಯಪ್ರಕಾಶ ನಗರ", code:"G26", line:"Green Line", type:"Elevated", platforms:"2", metroInfo:{operator:"BMRCL",opened:"2017"}, facilities:["Toilets","Escalator","Ticket Counter","Wheelchair Access"], connectivity:["BMTC Bus Stop","Auto rickshaw stand"], location:{lat:12.9069,lon:77.5714}},
  { id:"G27", name:"Yelachenahalli", name_kn:"ಯಲಚೇನಹಳ್ಳಿ", code:"G27", line:"Green Line", type:"Elevated", platforms:"2", metroInfo:{operator:"BMRCL",opened:"2017"}, facilities:["Toilets","Escalator","Elevator","Ticket Counter","Smart Card Recharge","Wheelchair Access","Parking"], connectivity:["BMTC Bus Stop","Auto rickshaw stand","Taxi"], location:{lat:12.8960,lon:77.5702}},
  { id:"G28", name:"Konankunte Cross", name_kn:"ಕೋನನಕುಂಟೆ ಕ್ರಾಸ್", code:"G28", line:"Green Line", type:"Elevated", platforms:"2", metroInfo:{operator:"BMRCL",opened:"2021"}, facilities:["Toilets","Escalator","Ticket Counter","Wheelchair Access"], connectivity:["BMTC Bus Stop","Auto rickshaw stand"], location:{lat:12.8893,lon:77.5663}},
  { id:"G29", name:"Doddakallasandra", name_kn:"ದೊಡ್ಡಕಲ್ಲಸಂದ್ರ", code:"G29", line:"Green Line", type:"Elevated", platforms:"2", metroInfo:{operator:"BMRCL",opened:"2021"}, facilities:["Toilets","Escalator","Ticket Counter"], connectivity:["BMTC Bus Stop","Auto rickshaw stand"], location:{lat:12.8801,lon:77.5638}},
  { id:"G30", name:"Vajarahalli", name_kn:"ವಜ್ರಹಳ್ಳಿ", code:"G30", line:"Green Line", type:"Elevated", platforms:"2", metroInfo:{operator:"BMRCL",opened:"2021"}, facilities:["Toilets","Escalator","Ticket Counter"], connectivity:["BMTC Bus Stop","Auto rickshaw stand"], location:{lat:12.8775,lon:77.5447}},
  { id:"G31", name:"Talaghattapura", name_kn:"ತಲಘಟ್ಟಪುರ", code:"G31", line:"Green Line", type:"Elevated", platforms:"2", metroInfo:{operator:"BMRCL",opened:"2021"}, facilities:["Toilets","Escalator","Ticket Counter","Wheelchair Access"], connectivity:["BMTC Bus Stop","Auto rickshaw stand"], location:{lat:12.8714,lon:77.5384}},
  { id:"G32", name:"Silk Institute", name_kn:"ಸಿಲ್ಕ್ ಇನ್‌ಸ್ಟಿಟ್ಯೂಟ್", code:"G32", line:"Green Line", type:"Elevated", platforms:"2", metroInfo:{operator:"BMRCL",opened:"2021"}, facilities:["Toilets","Escalator","Elevator","Ticket Counter","Smart Card Recharge","Wheelchair Access","Parking (large)"], connectivity:["BMTC Bus Stop","Auto rickshaw stand","Taxi"], location:{lat:12.8618,lon:77.5299}},

  // ═══════════════════════════════════════
  // YELLOW LINE STATIONS (Y01 - Y16)
  // ═══════════════════════════════════════
  { id:"Y01", name:"Rashtreeya Vidyalaya Road", name_kn:"ರಾಷ್ಟ್ರೀಯ ವಿದ್ಯಾಲಯ ರಸ್ತೆ", code:"Y01", line:"Yellow Line", type:"Elevated", platforms:"3", metroInfo:{operator:"BMRCL",opened:"2024"}, facilities:["Toilets","Escalator","Elevator","Ticket Counter","Smart Card Recharge","Wheelchair Access","Interchange to Green Line"], connectivity:["BMTC Bus Stop","Auto rickshaw stand","Taxi"], location:{lat:12.9215,lon:77.5801}},
  { id:"Y02", name:"Ragigudda", name_kn:"ರಾಗಿಗುಡ್ಡ", code:"Y02", line:"Yellow Line", type:"Elevated", platforms:"2", metroInfo:{operator:"BMRCL",opened:"2024"}, facilities:["Toilets","Escalator","Elevator","Ticket Counter","Wheelchair Access"], connectivity:["BMTC Bus Stop","Auto rickshaw stand","Ragigudda Temple nearby"], location:{lat:12.9172,lon:77.5883}},
  { id:"Y03", name:"Jayadeva Hospital", name_kn:"ಜಯದೇವ ಆಸ್ಪತ್ರೆ", code:"Y03", line:"Yellow Line", type:"Elevated", platforms:"2", metroInfo:{operator:"BMRCL",opened:"2024"}, facilities:["Toilets","Escalator","Elevator","Ticket Counter","Wheelchair Access"], connectivity:["BMTC Bus Stop","Auto rickshaw stand","Jayadeva Hospital access"], location:{lat:12.9168,lon:77.6000}},
  { id:"Y04", name:"BTM Layout", name_kn:"ಬಿಟಿಎಂ ಲೇಔಟ್", code:"Y04", line:"Yellow Line", type:"Elevated", platforms:"2", metroInfo:{operator:"BMRCL",opened:"2024"}, facilities:["Toilets","Escalator","Ticket Counter","Wheelchair Access"], connectivity:["BMTC Bus Stop","Auto rickshaw stand","BTM Layout market"], location:{lat:12.9166,lon:77.6082}},
  { id:"Y05", name:"Central Silk Board", name_kn:"ಸೆಂಟ್ರಲ್ ಸಿಲ್ಕ್ ಬೋರ್ಡ್", code:"Y05", line:"Yellow Line", type:"Elevated", platforms:"2", metroInfo:{operator:"BMRCL",opened:"2024"}, facilities:["Toilets","Escalator","Elevator","Ticket Counter","Smart Card Recharge","Wheelchair Access","Parking"], connectivity:["BMTC Bus Stop","Auto rickshaw stand","Taxi","Silk Board Junction"], location:{lat:12.9110,lon:77.6264}},
  { id:"Y06", name:"Bommanahalli", name_kn:"ಬೊಮ್ಮನಹಳ್ಳಿ", code:"Y06", line:"Yellow Line", type:"Elevated", platforms:"2", metroInfo:{operator:"BMRCL",opened:"2024"}, facilities:["Toilets","Escalator","Ticket Counter","Wheelchair Access"], connectivity:["BMTC Bus Stop","Auto rickshaw stand"], location:{lat:12.9016,lon:77.6320}},
  { id:"Y07", name:"Hongasandra", name_kn:"ಹೊಂಗಸಂದ್ರ", code:"Y07", line:"Yellow Line", type:"Elevated", platforms:"2", metroInfo:{operator:"BMRCL",opened:"2024"}, facilities:["Toilets","Escalator","Ticket Counter"], connectivity:["BMTC Bus Stop","Auto rickshaw stand"], location:{lat:12.8899,lon:77.6392}},
  { id:"Y08", name:"Kudlu Gate", name_kn:"ಕುಡ್ಲು ಗೇಟ್", code:"Y08", line:"Yellow Line", type:"Elevated", platforms:"2", metroInfo:{operator:"BMRCL",opened:"2024"}, facilities:["Toilets","Escalator","Ticket Counter","Wheelchair Access"], connectivity:["BMTC Bus Stop","Auto rickshaw stand"], location:{lat:12.8801,lon:77.6453}},
  { id:"Y09", name:"Singasandra", name_kn:"ಸಿಂಗಸಂದ್ರ", code:"Y09", line:"Yellow Line", type:"Elevated", platforms:"2", metroInfo:{operator:"BMRCL",opened:"2024"}, facilities:["Toilets","Escalator","Ticket Counter"], connectivity:["BMTC Bus Stop","Auto rickshaw stand"], location:{lat:12.8708,lon:77.6525}},
  { id:"Y10", name:"Hosa Road", name_kn:"ಹೋಸ ರಸ್ತೆ", code:"Y10", line:"Yellow Line", type:"Elevated", platforms:"2", metroInfo:{operator:"BMRCL",opened:"2024"}, facilities:["Toilets","Escalator","Ticket Counter","Wheelchair Access"], connectivity:["BMTC Bus Stop","Auto rickshaw stand"], location:{lat:12.8632,lon:77.6584}},
  { id:"Y11", name:"Beratena Agrahara", name_kn:"ಬೇರಟೆನಾ ಅಗ್ರಹಾರ", code:"Y11", line:"Yellow Line", type:"Elevated", platforms:"2", metroInfo:{operator:"BMRCL",opened:"2024"}, facilities:["Toilets","Escalator","Ticket Counter"], connectivity:["BMTC Bus Stop","Auto rickshaw stand"], location:{lat:12.8540,lon:77.6635}},
  { id:"Y12", name:"Electronic City", name_kn:"ಎಲೆಕ್ಟ್ರಾನಿಕ್ ಸಿಟಿ", code:"Y12", line:"Yellow Line", type:"Elevated", platforms:"2", metroInfo:{operator:"BMRCL",opened:"2024"}, facilities:["Toilets","Escalator","Elevator","Ticket Counter","Smart Card Recharge","Wheelchair Access","Parking"], connectivity:["BMTC Bus Stop","Auto rickshaw stand","Taxi","Electronic City IT Hub"], location:{lat:12.8468,lon:77.6711}},
  { id:"Y13", name:"Infosys Foundation Konappana Agrahara", name_kn:"ಇನ್ಫೋಸಿಸ್ ಫೌಂಡೇಶನ್ ಕೊನಪ್ಪನ ಅಗ್ರಹಾರ", code:"Y13", line:"Yellow Line", type:"Elevated", platforms:"2", metroInfo:{operator:"BMRCL",opened:"2024"}, facilities:["Toilets","Escalator","Ticket Counter","Wheelchair Access"], connectivity:["BMTC Bus Stop","Auto rickshaw stand","Infosys Campus access"], location:{lat:12.8431,lon:77.6743}},
  { id:"Y14", name:"Huskur Road", name_kn:"ಹುಸ್ಕೂರು ರಸ್ತೆ", code:"Y14", line:"Yellow Line", type:"Elevated", platforms:"2", metroInfo:{operator:"BMRCL",opened:"2024"}, facilities:["Toilets","Escalator","Ticket Counter"], connectivity:["BMTC Bus Stop","Auto rickshaw stand"], location:{lat:12.8390,lon:77.6775}},
  { id:"Y15", name:"Hebbagodi", name_kn:"ಹೆಬ್ಬಗೋಡಿ", code:"Y15", line:"Yellow Line", type:"Elevated", platforms:"2", metroInfo:{operator:"BMRCL",opened:"2024"}, facilities:["Toilets","Escalator","Ticket Counter","Wheelchair Access"], connectivity:["BMTC Bus Stop","Auto rickshaw stand"], location:{lat:12.8291,lon:77.6813}},
  { id:"Y16", name:"Bommasandra", name_kn:"ಬೊಮ್ಮಸಂದ್ರ", code:"Y16", line:"Yellow Line", type:"Elevated", platforms:"2", metroInfo:{operator:"BMRCL",opened:"2024"}, facilities:["Toilets","Escalator","Elevator","Ticket Counter","Smart Card Recharge","Wheelchair Access","Parking (large)"], connectivity:["BMTC Bus Stop","Auto rickshaw stand","Taxi"], location:{lat:12.8204,lon:77.6875}}
];
