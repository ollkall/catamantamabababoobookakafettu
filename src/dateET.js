//exports.dateFormattedET = function(){
	//let timenow = new Date();
	//let DateNow = timenow.getDate();
	//let monthNow = timenow.getMonth();
	//let yearNow = timenow.getFullYear();
	//const monthNamesET = ["Jaanuar", "Veebruar", "Märts", "Aprill", "Mai", "Juuni", "Juuli", "August", "September", "Oktoober", "November", "Detsember"];
	//console.log(timenow);
	//console.log("Täna on " + DateNow + "." + (monthNow + 1) + "." + yearNow);
	//return(DateNow + ". " + monthNamesET[monthNow] + " " + yearNow);
//}	


exports.dateFormattedET = function(){
	let timeNow = new Date();
	const monthNamesET = ["Jaanuar", "Veebruar", "Märts", "Aprill", "Mai", "Juuni", "Juuli", "August", "September", "Oktoober", "November", "Detsember"];
	return timeNow.getDate() + ". " + monthNamesET[timeNow.getMonth()] + " " + timeNow.getFullYear();
}