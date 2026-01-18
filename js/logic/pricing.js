export const FARE_SLABS = [
    { max: 2.00, fare: 10 },
    { max: 4.00, fare: 20 },
    { max: 6.00, fare: 30 },
    { max: 8.00, fare: 40 },
    { max: 10.00, fare: 50 },
    { max: 15.00, fare: 60 },
    { max: 20.00, fare: 70 },
    { max: 25.00, fare: 80 },
    { max: Infinity, fare: 90 }
];

export function calculateFare(distanceKm, travelTime, ticketType) {
    if (!travelTime) travelTime = new Date();

    // Step 1: Base Fare
    let baseFare = 0;
    const slab = FARE_SLABS.find(s => distanceKm <= s.max);
    baseFare = slab ? slab.fare : 90;

    // Step 3: Apply Discounts
    let finalFare = baseFare;
    let discountApplied = 0;

    const typeUpper = ticketType ? ticketType.toUpperCase() : 'TOKEN';

    if (typeUpper === "CARD" || typeUpper === "QR" || typeUpper === "NCMC") {
        let discountRate = 0.05; // Standard 5% discount

        // Check for Off-Peak / Holiday Bonus
        if (isHoliday(travelTime) || isOffPeak(travelTime)) {
            discountRate = 0.10; // Total 10% discount
        }

        // Calculate discounted fare
        const discounted = baseFare * (1 - discountRate);

        // BMRCL Rounding Rule: Round to nearest whole Rupee
        finalFare = Math.round(discounted);
        discountApplied = baseFare - finalFare;
    }

    return {
        distanceKm: Number(distanceKm).toFixed(2),
        baseFare: baseFare,
        finalFare: finalFare,
        appliedDiscount: discountApplied
    };
}

function isOffPeak(date) {
    const hour = date.getHours();
    const day = date.getDay(); // 0 is Sunday

    // Sundays are always Off-Peak pricing
    if (day === 0) return true;

    // Weekday Peak Windows: 08:00 AM – 12:00 PM; 04:00 PM – 09:00 PM.
    // Off-Peak: Start-8am, 12pm-4pm, 9pm-Close

    if (hour < 8) return true; // Before 8 AM
    if (hour >= 12 && hour < 16) return true; // 12 PM to 4 PM
    if (hour >= 21) return true; // After 9 PM

    return false; // It is Peak time
}

function isHoliday(date) {
    // Check fixed holidays: Jan 26, Aug 15, Oct 2
    const d = date.getDate();
    const m = date.getMonth(); // 0-11

    if ((d === 26 && m === 0) || // Jan 26
        (d === 15 && m === 7) || // Aug 15
        (d === 2 && m === 9)) {  // Oct 2
        return true;
    }
    return false;
}
