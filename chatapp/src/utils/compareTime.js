export default function(prev, curr) {
    // Checks if messages are withing 4 min range
    
    const prevMins = parseInt(prev.substr(15));
    const mins = parseInt(curr.substr(15));

    if (prev.substr(0, 15) === curr.substr(0, 15) &&
      mins <= prevMins + 2 &&
      mins >= prevMins - 2) {
        return true;
    }
    return false;
}