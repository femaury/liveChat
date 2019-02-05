import daysDiff from './daysDiff';
import invertDayMonth from './invertDDMM';

export default function(date) {
    /*
        Today: 'hh:mm'
        Yesterday: 'Yesterday at hh:mm'
        2 - 6 days ago: 'Last weekday at hh:mm'
        After: 'dd/mm/yy'
    */
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    let today = new Date();
    let otherDay = invertDayMonth(date.substr(0, 8));
    const dayOfWeek = today.getDay();

    const diff = Math.abs(daysDiff(new Date(otherDay), today));

    switch (diff) {
        case 0:
            return date.substr(12);
        case 1:
            return "Yesterday " + date.substr(9);
        case 2:
        case 3:
        case 4:
        case 5:
        case 6:
            return "Last " + days[(((dayOfWeek - diff) % 7) + 7) % 7] + date.substr(9);
        default:
            return date.substr(0, 8); 
    }
}