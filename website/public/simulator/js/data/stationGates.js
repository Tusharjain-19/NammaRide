// ============================================================
// NammaRide — Station Exit Gates & Landmark Directory
// Bengaluru Metro (BMRCL) Gate Guidance
// ============================================================

export const stationGatesData = {
    // PURPLE LINE
    "P01": [ // Whitefield (Kadugodi)
        { gate: "A", name: "Kadugodi Bus Stand Side", destination: "Kadugodi Bus Stand, Whitefield Railway Station, Kadugodi Main Rd", landmark: "Kadugodi BMTC Hub", icon: "bus" },
        { gate: "B", name: "ITPL / Hope Farm Side", destination: "ITPL Main Road, Hope Farm Junction, Auto & Cab Stand", landmark: "ITPL Tech Corridor", icon: "building-2" }
    ],
    "P02": [ // Hopefarm Channasandra
        { gate: "A", name: "Channasandra Main Rd", destination: "Channasandra Village, BMTC Feeder Stop", landmark: "Channasandra Junction", icon: "map-pin" },
        { gate: "B", name: "Hope Farm Circle", destination: "Hope Farm Signal, Whitefield Main Road", landmark: "Hope Farm Circle", icon: "compass" }
    ],
    "P04": [ // Pattanduru Agrahara
        { gate: "A", name: "ITPL Main Gate", destination: "International Tech Park Bangalore (ITPL), Park Square Mall", landmark: "ITPL Campus", icon: "building-2" },
        { gate: "B", name: "Pattanduru Village Rd", destination: "Pattanduru Agrahara, Residential Layouts, Auto Stand", landmark: "Residential Sector", icon: "home" }
    ],
    "P05": [ // Sri Sathya Sai Hospital
        { gate: "A", name: "Hospital Main Entrance", destination: "Sri Sathya Sai Super Speciality Hospital, EPIP Zone", landmark: "SSSIHMS Hospital", icon: "cross" },
        { gate: "B", name: "Export Promotion Industrial Park", destination: "EPIP Industrial Area, SAP Labs, TCS IT Hub", landmark: "EPIP Tech Zone", icon: "building-2" }
    ],
    "P07": [ // Kundalahalli
        { gate: "A", name: "Kundalahalli Gate", destination: "Kundalahalli Main Road, Brookefield, AECS Layout", landmark: "Brookefield Mall", icon: "navigation" },
        { gate: "B", name: "ITPL Road North", destination: "Graphite India Road, Auto Stand, Tech Park Access", landmark: "Commercial Corridor", icon: "map-pin" }
    ],
    "P12": [ // Krishnarajapura (KR Pura)
        { gate: "A", name: "KR Puram Railway Station", destination: "KSRTC / Indian Railways Foot-Over-Bridge, Old Madras Road", landmark: "KR Puram Railway Junction", icon: "train" },
        { gate: "B", name: "Outer Ring Road (ORR) Side", destination: "Tin Factory, BMTC Bus Bay, Mahadevapura / Silk Board ORR", landmark: "ORR IT Corridor Access", icon: "bus" }
    ],
    "P14": [ // Baiyappanahalli
        { gate: "A", name: "Old Madras Road Side", destination: "Old Madras Road, BMTC Bus Bay, Metro Car Shed", landmark: "OMR Commercial Hub", icon: "bus" },
        { gate: "B", name: "SMVT Railway Station Side", destination: "Sir M. Visvesvaraya Terminal (SMVT Railway Station Auto/Cab Access)", landmark: "SMVT Terminal Access", icon: "train" }
    ],
    "P15": [ // Swami Vivekananda Road
        { gate: "A", name: "SV Road / Old Madras Rd", destination: "SV Road BMTC Depot, Ulsoor Lake East", landmark: "BMTC Depot 6", icon: "bus" },
        { gate: "B", name: "Indiranagar 1st Stage", destination: "CMH Road, Indiranagar Residential, Defence Colony", landmark: "Indiranagar North", icon: "home" }
    ],
    "P16": [ // Indiranagar
        { gate: "A", name: "100 Feet Road Junction", destination: "100 Feet Road, KFC / Starbucks side, Retail & Dining Hub", landmark: "100 Feet Road Retail", icon: "utensils" },
        { gate: "B", name: "CMH Road & Hospital Side", destination: "Chinmaya Mission Hospital (CMH) Road, BDA Complex, Auto Stand", landmark: "CMH Hospital & BDA", icon: "cross" }
    ],
    "P17": [ // Halasuru
        { gate: "A", name: "Ulsoor Police Station Side", destination: "Old Madras Road, Ulsoor Police Station, Someshwara Temple", landmark: "Someshwara Temple", icon: "landmark" },
        { gate: "B", name: "Cambridge Layout Side", destination: "Cambridge Road, Trinity Woods, Ulsoor Market", landmark: "Cambridge Layout", icon: "home" }
    ],
    "P18": [ // Trinity
        { gate: "A", name: "Trinity Circle / MG Road", destination: "Trinity Circle, Taj MG Road, 1 MG-Lido Mall, Lido Cinema", landmark: "1 MG-Lido Mall", icon: "shopping-bag" },
        { gate: "B", name: "Victoria Road / Richmond", destination: "Hosur Road, ASC Centre, D'Souza Circle, Richmond Town", landmark: "Richmond Town Road", icon: "navigation" }
    ],
    "P19": [ // Mahatma Gandhi Road
        { gate: "A", name: "Brigade Road / Church Street", destination: "Church Street, Brigade Road, Metro Art Boulevard, Rangoli Art Centre", landmark: "Church Street & Brigade Road", icon: "sparkles" },
        { gate: "B", name: "Anil Kumble Circle / Cauvery", destination: "Cauvery Arts & Crafts, Chinnaswamy Stadium South, Commercial Street access", landmark: "Cauvery Handicrafts", icon: "landmark" }
    ],
    "P20": [ // Cubbon Park
        { gate: "A", name: "Chinnaswamy Stadium / GPO", destination: "M. Chinnaswamy Cricket Stadium, General Post Office (GPO), Queens Road", landmark: "Chinnaswamy Stadium", icon: "trophy" },
        { gate: "B", name: "Cubbon Park / High Court", destination: "Cubbon Park Main Entrance, Press Club, Bal Bhavan, Kasturba Road", landmark: "Cubbon Park Entrance", icon: "trees" }
    ],
    "P21": [ // Dr. B.R. Ambedkar Stn., Vidhana Soudha
        { gate: "A", name: "Vidhana Soudha Side", destination: "Vidhana Soudha Secretariat, Vikasa Soudha, High Court of Karnataka", landmark: "Karnataka State Secretariat", icon: "landmark" },
        { gate: "B", name: "GPO & Raj Bhavan Side", destination: "Raj Bhavan, Police Commissioner Office, Ambedkar Veedhi GPO", landmark: "Raj Bhavan Road", icon: "building" }
    ],
    "P22": [ // Sir M. Visveswaraya Stn., Central College
        { gate: "A", name: "Central College / UVCE", destination: "Bangalore University Central College Campus, UVCE Engineering College", landmark: "Central College Campus", icon: "graduation-cap" },
        { gate: "B", name: "K.R. Circle / District Court", destination: "K.R. Circle, City Civil Court Complex, Mysore Bank Colony", landmark: "K.R. Circle", icon: "landmark" }
    ],
    "P23": [ // Nadaprabhu Kempegowda Stn., Majestic (Interchange)
        { gate: "A", name: "BMTC City Bus Station", destination: "Kempegowda Bus Station (BMTC Majestic Hub), Subhash Nagar", landmark: "BMTC Majestic Terminal", icon: "bus" },
        { gate: "B", name: "KSR Railway Station (SBC)", destination: "KSR Bengaluru City Railway Station (Platform 1 Concourse FOB)", landmark: "KSR City Railway Station", icon: "train" },
        { gate: "C", name: "Dhanvanthri Road", destination: "Upparpet Police Station, Anand Rao Circle, Cottonpet Main Road", landmark: "Upparpet Circle", icon: "shield" },
        { gate: "D", name: "City Market & Tank Bund", destination: "KR Market access, Shantala Silk, Chickpet West entrance", landmark: "Shantala Silk & Market", icon: "shopping-bag" }
    ],
    "P24": [ // KSR City Railway Station
        { gate: "A", name: "Railway Station Main Porch", destination: "KSR Bengaluru Station Entry, Reservation Counter, IRCTC Food Plaza", landmark: "Station Main Porch", icon: "train" },
        { gate: "B", name: "Okalipuram Side", destination: "Okalipuram Main Road, Rajajinagar Link Road", landmark: "Okalipuram", icon: "navigation" }
    ],
    "P27": [ // Vijayanagar
        { gate: "A", name: "Vijayanagar BDA Complex", destination: "BDA Complex, Vijayanagar Club, Cordial Market", landmark: "BDA Shopping Complex", icon: "shopping-bag" },
        { gate: "B", name: "Magadi Chord Road", destination: "MC Road, Maruti Mandir, Auto & Feeder Bus Stand", landmark: "Maruti Mandir", icon: "bus" }
    ],
    "P30": [ // Mysuru Road
        { gate: "A", name: "Satellite Bus Station", destination: "KSRTC Satellite Bus Station (MCTC), Bapujinagar", landmark: "MCTC Satellite Bus Terminal", icon: "bus" },
        { gate: "B", name: "Mysuru Road West", destination: "Timber Yard Layout, Nayandahalli Flyover access", landmark: "Nayandahalli Junction", icon: "navigation" }
    ],
    "P32": [ // Rajarajeshwari Nagar
        { gate: "A", name: "RR Nagar Arch / Gate", destination: "Rajarajeshwari Nagar Arch, Mysore Road Highway", landmark: "RR Nagar Arch", icon: "landmark" },
        { gate: "B", name: "BEML Layout", destination: "BEML Layout 5th Stage, Global Village Tech Park Auto Bay", landmark: "Global Village Access", icon: "building-2" }
    ],
    "P35": [ // Kengeri Bus Terminal
        { gate: "A", name: "Kengeri TTMC Bus Station", destination: "BMTC Kengeri Traffic Transit Management Centre, KSRTC Stop", landmark: "Kengeri TTMC Bus Bay", icon: "bus" },
        { gate: "B", name: "Kengeri Satellite Town", destination: "Satellite Town 1st Main, Shirke Apartments", landmark: "Kengeri Satellite Town", icon: "home" }
    ],

    // GREEN LINE
    "G04": [ // Nagasandra
        { gate: "A", name: "Tumkur Road NH4", destination: "Tumkur Road Highway, Parle-G Factory, Auto Bay", landmark: "Tumkur Highway NH4", icon: "navigation" },
        { gate: "B", name: "IKEA Bengaluru Side", destination: "IKEA Store Nagasandra, Bagalakunte Residential Layout", landmark: "IKEA Store (5 min walk)", icon: "shopping-bag" }
    ],
    "G08": [ // Peenya
        { gate: "A", name: "Peenya Industrial Area", destination: "Peenya Industrial Area 1st Stage, Small Scale Industries Hub", landmark: "Peenya Industrial Estate", icon: "building" },
        { gate: "B", name: "1st Cross Road", destination: "Peenya Village, BMTC Feeder Stop", landmark: "BMTC Feeder Stop", icon: "bus" }
    ],
    "G10": [ // Yeshwanthpur
        { gate: "A", name: "Yeshwanthpur Railway Station", destination: "Yeshwanthpur Junction Railway Station (PF 1 & PF 6 Footbridge)", landmark: "Yeshwanthpur Railway Station", icon: "train" },
        { gate: "B", name: "APMC Yard / Market Side", destination: "Yeshwanthpur APMC Market, BMTC Bus Stand, Orion Mall auto", landmark: "APMC Market Yard", icon: "shopping-bag" }
    ],
    "G11": [ // Sandal Soap Factory
        { gate: "A", name: "KSDL Mysore Sandal Factory", destination: "Karnataka Soaps & Detergents Ltd (Mysore Sandal Soap Factory)", landmark: "Mysore Sandal Factory", icon: "building-2" },
        { gate: "B", name: "Subramanyanagar Side", destination: "Subramanyanagar Police Station, Dr. Rajkumar Road", landmark: "Dr. Rajkumar Road", icon: "navigation" }
    ],
    "G12": [ // Mahalakshmi
        { gate: "A", name: "ISKCON Temple Side", destination: "Sri Radha Krishna ISKCON Temple, Mahalakshmi Layout Main Rd", landmark: "ISKCON Temple (7 min walk)", icon: "landmark" },
        { gate: "B", name: "West of Chord Road", destination: "Modi Hospital Road, Shankar Math Circle, Auto Stand", landmark: "Modi Hospital Road", icon: "cross" }
    ],
    "G13": [ // Rajajinagar
        { gate: "A", name: "Dr. Rajkumar Road", destination: "Dr. Rajkumar Road, Navrang Theatre Circle, Brigade Gateway", landmark: "Navrang Theatre Junction", icon: "film" },
        { gate: "B", name: "Rajajinagar 1st Block", destination: "Rajajinagar 1st Block, Ram Mandir, ESI Hospital access", landmark: "ESI Hospital Area", icon: "cross" }
    ],
    "G16": [ // Mantri Square Sampige Road
        { gate: "A", name: "Mantri Square Mall Bridge", destination: "Direct pedestrian bridge into Mantri Square Mall (1st Floor)", landmark: "Mantri Square Mall", icon: "shopping-bag" },
        { gate: "B", name: "Sampige Road / Malleswaram", destination: "Sampige Road Malleswaram, 8th Cross Market, Margosa Road", landmark: "Malleswaram 8th Cross", icon: "shopping-bag" }
    ],
    "G17": [ // Majestic (Green Line Level)
        { gate: "A", name: "BMTC Kempegowda Bus Station", destination: "City Bus Station, Platforms 1-30, Subhash Nagar", landmark: "BMTC Majestic Terminal", icon: "bus" },
        { gate: "B", name: "KSR City Railway Station", destination: "Indian Railways SBC Station (Platform 1 Concourse FOB)", landmark: "KSR Station Direct Link", icon: "train" }
    ],
    "G18": [ // Chickpete
        { gate: "A", name: "Chickpet Saree Market", destination: "Chickpet Main Road, BVK Iyengar Road, Silk & Jewelry Market", landmark: "Chickpet Silk Bazaar", icon: "shopping-bag" },
        { gate: "B", name: "Avenue Road / Balepet", destination: "Avenue Road Book Market, Raja Market, City Market North", landmark: "Avenue Road Market", icon: "book-open" }
    ],
    "G19": [ // Krishna Rajendra Market
        { gate: "A", name: "KR Flower & Vegetable Market", destination: "KR Market Complex, Kalasipalya Bus Stand, Tipu Sultan Summer Palace", landmark: "KR Flower Market & Palace", icon: "landmark" },
        { gate: "B", name: "Victoria Hospital Gate", destination: "Victoria Hospital, Bangalore Medical College, Vani Vilas Hospital", landmark: "Victoria Hospital Medical Campus", icon: "cross" }
    ],
    "G20": [ // National College
        { gate: "A", name: "National College Basavanagudi", destination: "National College Grounds, Pampa Mahakavi Road, Gandhi Bazaar", landmark: "National College Grounds", icon: "graduation-cap" },
        { gate: "B", name: "V.V. Puram Food Street", destination: "Old Hospital Road, Sajjan Rao Circle, VV Puram Thindi Beedi (Food Street)", landmark: "VV Puram Food Street (5 min)", icon: "utensils" }
    ],
    "G21": [ // Lalbagh Botanical Garden
        { gate: "A", name: "Lalbagh West Gate", destination: "Lalbagh Botanical Garden West Gate entrance, Glass House path", landmark: "Lalbagh Botanical Garden", icon: "trees" },
        { gate: "B", name: "Rashtriya Vidyalaya Road", destination: "RV Teachers College, Ashoka Pillar junction, Auto Stand", landmark: "Ashoka Pillar Road", icon: "navigation" }
    ],
    "G23": [ // Jayanagar
        { gate: "A", name: "Jayanagar 4th Block Complex", destination: "Jayanagar 4th Block BDA Shopping Complex, 11th Main Road", landmark: "Jayanagar 4th Block BDA", icon: "shopping-bag" },
        { gate: "B", name: "Jayanagar Bus Stand Side", destination: "BMTC Jayanagar TTMC Bus Station, 8th Block, Cool Joint side", landmark: "Jayanagar TTMC", icon: "bus" }
    ],
    "G24": [ // Rashtreeya Vidyalaya Road (RV Road Interchange)
        { gate: "A", name: "Lakshman Rao Park Side", destination: "Lakshman Rao Boulevard, Jayanagar 7th Block, Green Line entry", landmark: "Lakshman Rao Park", icon: "trees" },
        { gate: "B", name: "Yellow Line Concourse", destination: "Interchange concourse to Electronic City & Bommasandra trains", landmark: "Yellow Line Interchange", icon: "arrow-right-left" }
    ],
    "G25": [ // Banashankari
        { gate: "A", name: "Banashankari Temple", destination: "Sri Banashankari Amma Temple, Kanakapura Main Road", landmark: "Banashankari Temple", icon: "landmark" },
        { gate: "B", name: "Banashankari TTMC Bus Stand", destination: "BMTC Banashankari Bus Terminal, KSRTC Kanakapura buses", landmark: "Banashankari TTMC Hub", icon: "bus" }
    ],
    "G26": [ // Jaya Prakash Nagar (JP Nagar)
        { gate: "A", name: "JP Nagar 2nd Phase", destination: "Ring Road junction, 24th Main Road, Brigade Palm Springs", landmark: "JP Nagar 2nd Phase", icon: "navigation" },
        { gate: "B", name: "Sarakki Lake Side", destination: "Sarakki Market, Outer Ring Road South, Auto Stand", landmark: "Sarakki Market", icon: "shopping-bag" }
    ],
    "G31": [ // Silk Institute
        { gate: "A", name: "Silk Institute / CSTRI", destination: "Central Silk Technological Research Institute, Kanakapura Road", landmark: "CSTRI Silk Campus", icon: "landmark" },
        { gate: "B", name: "NICE Ring Road Access", destination: "NICE Road Cloverleaf Junction, BMTC Feeder Bay, Taxi Stand", landmark: "NICE Corridor Junction", icon: "car" }
    ],

    // YELLOW LINE
    "Y01": [ // Rashtreeya Vidyalaya Road
        { gate: "A", name: "Green Line Transfer Gate", destination: "Platform 1 & 2 Green Line interchange concourse", landmark: "Green Line Transfer", icon: "arrow-right-left" },
        { gate: "B", name: "RV Road East Concourse", destination: "Jayanagar 8th Block, Outer Ring Road feeder auto bay", landmark: "Jayanagar South", icon: "map-pin" }
    ],
    "Y02": [ // Ragigudda
        { gate: "A", name: "Ragigudda Temple", destination: "Sri Prasanna Anjaneya Swami Ragigudda Temple, 9th Block", landmark: "Ragigudda Temple", icon: "landmark" },
        { gate: "B", name: "100 Feet Ring Road", destination: "Marenahalli Road, Delmia Circle access", landmark: "100 Ft Ring Road", icon: "navigation" }
    ],
    "Y03": [ // Jayadeva Hospital
        { gate: "A", name: "Jayadeva Hospital Porch", destination: "Sri Jayadeva Institute of Cardiovascular Sciences, Bannerghatta Rd", landmark: "Jayadeva Cardiology Institute", icon: "cross" },
        { gate: "B", name: "Pink Line Concourse (Underground)", destination: "Interchange concourse to Dairy Circle & MG Road Pink Line", landmark: "Pink Line Interchange Hub", icon: "arrow-right-left" }
    ],
    "Y06": [ // Central Silk Board
        { gate: "A", name: "Silk Board Junction / Flyover", destination: "Central Silk Board Junction, Hosur Road, HSR Layout Sector 1", landmark: "Silk Board Junction", icon: "navigation" },
        { gate: "B", name: "BMRCL Blue Line Airport Concourse", destination: "Future Blue Line Airport interchange, BMTC Silk Board Bus Bay", landmark: "Airport Metro Interchange", icon: "plane" }
    ],
    "Y07": [ // Bommanahalli
        { gate: "A", name: "Hosur Road North", destination: "Bommanahalli Junction, Begur Road, Auto Stand", landmark: "Bommanahalli Market", icon: "map-pin" },
        { gate: "B", name: "Kodi Chikkanahalli Rd", destination: "Oxford Dental & Engineering College, Residential Area", landmark: "Oxford College Campus", icon: "graduation-cap" }
    ],
    "Y09": [ // Electronic City Phase 1
        { gate: "A", name: "Infosys & Wipro Campuses", destination: "Infosys Gate 1 & 6, Wipro Technologies, Electronics City Toll Plaza", landmark: "Infosys Main Campus", icon: "building-2" },
        { gate: "B", name: "Velankani Drive & BMTC Feeder", destination: "Velankani Tech Park, HP Avenue, BMTC E-City Feeder Terminal", landmark: "Velankani & HP Hub", icon: "bus" }
    ],
    "Y10": [ // Electronic City Phase 2
        { gate: "A", name: "Tech Mahindra & Siemens", destination: "Tech Mahindra, Siemens Healthineers, TCS Think Campus", landmark: "Phase 2 IT Zone", icon: "building-2" },
        { gate: "B", name: "Hosur Highway East", destination: "Hebbagodi Road, Elevated Highway Ramp, Auto Bay", landmark: "Hebbagodi Junction", icon: "car" }
    ],
    "Y16": [ // Bommasandra
        { gate: "A", name: "Narayana Health City", destination: "Narayana Hrudayalaya Hospital, Mazumdar Shaw Cancer Centre", landmark: "Narayana Health City (5 min)", icon: "cross" },
        { gate: "B", name: "Bommasandra Industrial Area", destination: "Bommasandra Industrial Area 1st Phase, BMTC Depot 38", landmark: "Bommasandra Industrial Hub", icon: "building" }
    ]
};

/**
 * Returns exit gates for any station.
 * If specific gate mapping doesn't exist, generates clean North/South concourse gates.
 */
export function getStationGates(stationId, stationName = '', stationType = 'Elevated') {
    if (stationGatesData[stationId]) {
        return stationGatesData[stationId];
    }
    // Generic fallback for smaller stations
    return [
        { 
            gate: "A", 
            name: "Concourse North / East", 
            destination: `Main Entrance, ${stationName} BMTC Bus Bay & Auto Stand`, 
            landmark: "Street Level Access (North)", 
            icon: "map-pin" 
        },
        { 
            gate: "B", 
            name: "Concourse South / West", 
            destination: `Opposite Side Access, Pedestrian Crossing & Feeder Pickup`, 
            landmark: "Street Level Access (South)", 
            icon: "navigation" 
        }
    ];
}
