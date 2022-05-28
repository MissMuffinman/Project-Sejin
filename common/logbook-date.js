module.exports = class DateValidator {
    // Validates that the input string is a valid date formatted as "mm/dd/yyyy"
    isValidDate(dateString) {
        // First check for the pattern
        if(!/^\d{4}\/\d{1,2}\/\d{1,2}$/.test(dateString)) {return false;}

        // Parse the date parts to integers
        const parts = dateString.split('/');
        const day = parseInt(parts[2], 10);
        const month = parseInt(parts[1], 10);
        const year = parseInt(parts[0], 10);

        // Check the ranges of month and year
        if(year < 1000 || year > 3000 || month === 0 || month > 12) {return false;}

        const monthLength = [ 31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31 ];

        // Adjust for leap years
        if(year % 400 === 0 || (year % 100 !== 0 && year % 4 === 0)) {monthLength[1] = 29;}

        // Check the range of the day
        return day > 0 && day <= monthLength[month - 1];
    }

    isValidTime(timeString) {
        const isValid = /^([0-1]?\d|2[0-4]):([0-5]\d)(:[0-5]\d)?$/.test(timeString);
        return isValid;
    }

    adaptFormatOfDays(startTime, startDay, endTime, endDay) {
        startTime = startTime.split(':');
        endTime = endTime.split(':');
        const startHour = startTime[0];
        const startMinutes = startTime[1];
        const endHour = endTime[0];
        const endMinutes = endTime[1];

        startDay = new Date(new Date(startDay).setHours(startHour));
        startDay.setMinutes(startMinutes);
        startDay = JSON.stringify(startDay.getTime());
        endDay = new Date(new Date(endDay).setHours(endHour));
        endDay.setMinutes(endMinutes);
        endDay = JSON.stringify(endDay.getTime());

        return [startDay, endDay];
    }
};