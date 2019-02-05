export default function(date) {
    // Switch date format from 'dd/mm/yy' to 'mm/dd/yy'

    const dd = date.slice(0, 3);
    const mm = date.slice(3, 6);
    const yy = date.slice(6);
    return mm.concat(dd, yy);
}