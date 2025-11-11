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
		const [result] = await conn.execute(sqlReq, [fileName, req.file.originalname, req.body.altInput, req.body.privacyInput, userId]);
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

module.exports = {
	galleryphotoupPage,
	galleryphotoupPagePost
};