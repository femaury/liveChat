export default function(hours) {
    // returns string 'dd/mm/yy' + hours ? 'at hh:mm' 
    
    var d = new Date();

    var dd = ('0' + d.getDate()).slice(-2);
    var mm = ('0' + (d.getMonth() + 1)).slice(-2);
    var yy = ('' + d.getFullYear()).slice(2);

    if (hours) {
        var hh = ('0' + d.getHours()).slice(-2);
        var min = ('0' + d.getMinutes()).slice(-2);
        var today = dd + '/' + mm + '/' + yy + ' at ' + hh + ':' + min;
    } else {
        var today = dd + '/' + mm + '/' + yy;
    }
    return today;
}