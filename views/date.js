exports.getDate= function getDate(){
    const today = new Date();
    var option = {
        weekday:"long",
        day:"numeric",
        month:"long"
    }
    return today.toLocaleDateString("en-US",option);
    
}
exports.getDay= function getDay(){
    const today = new Date();
    var option = {
        weekday:"long"
    }
    return today.toLocaleDateString("en-US",option);
    
}