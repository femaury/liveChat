export default function(date1, date2) {
    // Gives number of days between two dates
    
    const utc1 = Date.UTC(date1.getFullYear(), date1.getMonth(), date1.getDate());
    const utc2 = Date.UTC(date2.getFullYear(), date2.getMonth(), date2.getDate());
  
    return Math.floor((utc2 - utc1) / (1000 * 3600 * 24));
}