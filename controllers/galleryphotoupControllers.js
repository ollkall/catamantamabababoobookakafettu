const mysql = require("mysql2/promise");
const fs = require("fs").promises;
const sharp = require("sharp");
const dbInfo = require("../../../../oliver2025config.js");

const dbConf = {
	host: dbInfo.configdata.host,
	user: dbInfo.configdata.user,
	password: dbInfo.configdata.passWord,
	database: dbInfo.configdata.dataBase
};

// @desc Home Page for uploading gallery pictures
// @route GET /galleryphotoupload
// @access public

const galleryphotoupPage = (req, res)=>{
	res.render("galleryupload");
};

// @desc Page for uploading gallery pictures
// @route GET /galleryphotoupload
// @access public

const galleryphotoupPagePost = async (req, res)=>{
	let conn;
	console.log(req.body);
	console.log(req.file);
	
	try {
		const fileName = "ok_" + Date.now() + ".jpg";
		console.log(fileName);
		await fs.rename(req.file.path, req.file.destination + fileName);
		await sharp(req.file.destination + fileName).resize(800,600).jpeg({quality: 90}).toFile("./public/gallery/normal/" + fileName);
		await sharp(req.file.destination + fileName).resize(100,100).jpeg({quality: 90}).toFile("./public/gallery/thumbs/"+ fileName);
		let sqlReq = "INSERT INTO galleryphotos_oll (filename, origname, alttext, privacy, userid) VALUES(?,?,?,?,?)";
		// Kuna kasutajakontosid veel pole, siis kasutajaid 1
		const userId = 1;
		conn = await mysql.createConnection(dbConf);
		const [result] = await conn.execute(sqlReq, [fileName, req.file.origname, req.body.altInput, req.body.privacyInput, userId]);
		console.log("Salvestati foto id: " + result.insertId);
		res.render("galleryupload");
	} 
	catch(err) {
		console.log(err);
		res.render("galleryupload");
	}
	finally {
		if(conn) {
			await conn.end();
			console.log("Andmebaasiühendus suletud!");
			}
		}
};
	
	// let sqlReq = "INSERT INTO person (first_name, last_name, born, deceased) VALUES (?,?,?,?)";
	
	// if(!req.body.firstNameInput || !req.body.lastNameInput || !req.body.bornInput || req.body.bornInput > new Date()){
		// res.render("filmiinimesed_add", {notice: "Andmed on vigased! Vaata üle!" + req.body});
		// return;
	// }
	// else {
		// try {
			// conn = await mysql.createConnection(dbConf);
			// console.log("Andmebaasiühendus loodud!");
			// let deceasedDate = null;
			// if(req.body.deceasedInput != ""){
				// deceasedDate = req.body.deceasedInput
			// }
			// const [results] = await conn.execute(sqlReq, [req.body.firstNameInput, req.body.lastNameInput, req.body.bornInput, deceasedDate]);
			// console.log("Salvestati kirje id: " + result.insertId);
			// res.render("filmiinimesed_add", {notice: "Andmed on salvestatud!"});
		// }
		// catch(err) {
			// console.log("VIGA!: " + err)
		// }
		// finally {
			// if(conn) {
			// await conn.end();
			// console.log("Andmebaasiühendus suletud!")
			// }
		// }
	// }
// };

// const filmPositionAddPost = (req, res)=>{
	// console.log(req.body);
	//kas andmed on olemas?
	// if(!req.body.positionNameInput){
		// res.render("filmiametid_add", {notice: "Palun kirjuta ameti nimetus!"});
	// }
	// else {
		// let positionDescription = null;
		// if(req.body.positionDescriptionInput != ""){
			// positionDescription = req.body.positionDescriptionInput;
		// }
		// let sqlReq = "INSERT INTO `position` (position_name, description) VALUES (?,?)";
		// conn.execute(sqlReq, [req.body.positionNameInput, positionDescription], (err, sqlRes)=>{
			// if(err){
				// res.render("filmiametid_add", {notice: "Tekkis tehniline viga:" + err});
			// }
			// else {
			//	res.render("filmiametid_add", {notice: "Andmed on salvestatud!"});
				// res.redirect("/eestifilm/ametid");
			// }
		// });
	// }
//};

module.exports = {
	galleryphotoupPage,
	galleryphotoupPagePost
};