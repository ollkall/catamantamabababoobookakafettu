const mysql = require("mysql2/promise");
//const fs = require("fs").promises;
const dbInfo = require("../../../../oliver2025config.js");

const dbConf = {
	host: dbInfo.configdata.host,
	user: dbInfo.configdata.user,
	password: dbInfo.configdata.passWord,
	database: dbInfo.configdata.dataBase
};

// @desc Home Page for viewing gallery pictures, photogallery
// @route GET /photogallery
// @access public

const photogalleryHome = async (req, res)=>{
	let conn;
	
	try {
		conn = await mysql.createConnection(dbConf);
		let sqlReq = "SELECT filename, alttext FROM galleryphotos_oll WHERE privacy >= ? AND deleted IS NULL";
		const privacy = 2;
		const [rows, fields] = await conn.execute(sqlReq, [privacy]);
		console.log(rows);
		let galleryData = [];
		for (let i = 0; i < rows.length; i ++){
			let altText = "Galeriipilt";
			if(rows[i].alttext != ""){
				altText = rows[i].alttext;
			}
			galleryData.push({src: rows[i].filename, alt: altText});
		}
		res.render("photogallery", {galleryData: galleryData, imagehref: "/gallery/thumbs/"});
		
	} 
	catch(err) {
		console.log(err);
		res.render("photogallery", {galleryData: [], imagehref: "/gallery/thumbs/"});
	}
	finally {
		if(conn) {
			await conn.end();
			console.log("Andmebaasiühendus suletud!");
			}
		}
};

module.exports = {photogalleryHome};