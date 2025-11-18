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
	res.redirect("/photogallery/1");
};

const photogalleryPage = async (req, res)=>{
	let conn;
	const photoLimit = 3;
	const privacy = 2;
	let page = parseInt(req.params.page);
	//console.log("Lehekülg: " + page);
	let skip = 0;
	
	try {
		conn = await mysql.createConnection(dbConf);
		// Vaatame palju ültse sobivaid fotosid on
		let sqlReq = "SELECT COUNT(id) AS photos FROM galleryphotos_oll WHERE privacy >= ? AND deleted IS NULL";
		const [countResult] = await conn.execute(sqlReq, [privacy]);
		const photoCount = countResult[0].photos;
		// kontrollime, et poleks liiga väike lehekülje Number
		if(page < 1 || isNaN(page)){
			page = 1;
		}
		// kui lehekülje number on liiga suur
		if((page - 1) * photoLimit >= photoCount){
			page = Math.max(1, Math.ceil(photoCount / photoLimit));
		}
		
		// Loome navigatsioonilingid	Eelmine leht	|	Järgmine leht
		// esimesena paneme paika eelmisele lehele liikumise
		let galleryLinks;
		if(page === 1){
			galleryLinks = "Eelmine leht &nbsp;&nbsp;&nbsp; | &nbsp;&nbsp;&nbsp;";
		} else {
			galleryLinks = `<a href="/photogallery/${page - 1}">Eelmine leht </a>&nbsp;&nbsp;&nbsp; | &nbsp;&nbsp;&nbsp;`;
		}
		// järgmisele lehele liikumiseks
		if(page * photoLimit >= photoCount){
			galleryLinks += "Järgmine leht";
		} else {
			galleryLinks += `<a href="/photogallery/${page + 1}">Järgmine leht </a>`;
		}
		// Loeme vajalikud photod
		
		sqlReq = "SELECT filename, alttext FROM galleryphotos_oll WHERE privacy >= ? AND deleted IS NULL LIMIT ?,?";
		
		skip = (page - 1) * photoLimit;
		const [rows, fields] = await conn.execute(sqlReq, [privacy, skip, photoLimit]);
		//console.log(rows);
		let galleryData = [];
		for (let i = 0; i < rows.length; i ++){
			let altText = "Galeriipilt";
			if(rows[i].alttext != ""){
				altText = rows[i].alttext;
			}
			galleryData.push({src: rows[i].filename, alt: altText});
		}
		res.render("photogallery", {galleryData: galleryData, imagehref: "/gallery/thumbs/", links: galleryLinks});
		
	} 
	catch(err) {
		console.log(err);
		res.render("photogallery", {galleryData: [], imagehref: "/gallery/thumbs/", links: ""});
	}
	finally {
		if(conn) {
			await conn.end();
			console.log("Andmebaasiühendus suletud!");
			}
		}
};

module.exports = {
	photogalleryHome,
	photogalleryPage
}