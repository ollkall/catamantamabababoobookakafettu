const mysql = require("mysql2/promise");
const dbInfo = require("../../../../oliver2025config.js");

const dbConf = {
	host: dbInfo.configdata.host,
	user: dbInfo.configdata.user,
	password: dbInfo.configdata.passWord,
	database: dbInfo.configdata.dataBase
};

// @desc Home Page for Estonian film section
// @route GET /eestifilm
// @access public

const filmHomePage = (req, res)=>{
	res.render("eestifilm");
};

// @desc Page for list of people involved in Estonian film industry
// @route GET /eestifilm/inimesed
// @access public

const filmPeople = async (req, res)=>{
	let conn;
	const sqlReq = "SELECT * FROM person";
	try {
		conn = await mysql.createConnection(dbConf);
		console.log("Andmebaasiühendus loodud!");
		const [rows, fields] = await conn.execute(sqlReq);
		res.render("filmiinimesed", {personList: rows});
	}
	catch(err) {
		console.log("VIGA!: " + err);
		res.render("filmiinimesed", {personList: []});
	}
	finally {
		if(conn) {
			await conn.end();
			console.log("Andmebaasiühendus suletud!")
		}
	}
};

// @desc Page for adding people involved in Estonian film industry
// @route GET /eestifilm/inimesed_add
// @access public

const filmPeopleAdd = async (req, res)=>{
	res.render("filmiinimesed_add", {notice: "Ootan sisestust!"});
};

// @desc Page for adding people involved in Estonian film industry
// @route POST /eestifilm/inimesed_add
// @access public

const filmPeopleAddPost = async (req, res)=>{
	let conn;
	let sqlReq = "INSERT INTO person (first_name, last_name, born, deceased) VALUES (?,?,?,?)";
	
	if(!req.body.firstNameInput || !req.body.lastNameInput || !req.body.bornInput || req.body.bornInput > new Date()){
		res.render("filmiinimesed_add", {notice: "Andmed on vigased! Vaata üle!" + req.body});
		return;
	}
	else {
		try {
			conn = await mysql.createConnection(dbConf);
			console.log("Andmebaasiühendus loodud!");
			let deceasedDate = null;
			if(req.body.deceasedInput != ""){
				deceasedDate = req.body.deceasedInput
			}
			const [results] = await conn.execute(sqlReq, [req.body.firstNameInput, req.body.lastNameInput, req.body.bornInput, deceasedDate]);
			console.log("Salvestati kirje id: " + result.insertId);
			res.render("filmiinimesed_add", {notice: "Andmed on salvestatud!"});
		}
		catch(err) {
			console.log("VIGA!: " + err)
		}
		finally {
			if(conn) {
			await conn.end();
			console.log("Andmebaasiühendus suletud!")
			}
		}
	}
};

// @desc Page for list of positions involved in Estonian film industry
// @route GET /eestifilm/ametid
// @access public

const filmPosition = (req, res)=>{
	const sqlReq = "SELECT * FROM position";
	conn.execute(sqlReq, (err, sqlRes)=>{
		if(err){
			console.log(err);
			res.render("filmiametid", {positionList: []});
		}
		else {
			console.log(sqlRes);
			res.render("filmiametid", {positionList: sqlRes});
		}
		
	});
};

// @desc Page for adding postions involved in Estonian film industry
// @route GET /eestifilm/aemtid_add
// @access public

const filmPositionAdd = (req, res)=>{
	res.render("filmiametid_add", {notice: "Ootan sisestust!"});
}

// @desc Page for adding postions involved in Estonian film industry
// @route POST /eestifilm/aemtid_add
// @access public

const filmPositionAddPost = (req, res)=>{
	console.log(req.body);
	//kas andmed on olemas?
	if(!req.body.positionNameInput){
		res.render("filmiametid_add", {notice: "Palun kirjuta ameti nimetus!"});
	}
	else {
		let positionDescription = null;
		if(req.body.positionDescriptionInput != ""){
			positionDescription = req.body.positionDescriptionInput;
		}
		let sqlReq = "INSERT INTO `position` (position_name, description) VALUES (?,?)";
		conn.execute(sqlReq, [req.body.positionNameInput, positionDescription], (err, sqlRes)=>{
			if(err){
				res.render("filmiametid_add", {notice: "Tekkis tehniline viga:" + err});
			}
			else {
				//res.render("filmiametid_add", {notice: "Andmed on salvestatud!"});
				res.redirect("/eestifilm/ametid");
			}
		});
	}
};

module.exports = {
	filmHomePage,
	filmPeople,
	filmPeopleAdd,
	filmPeopleAddPost,
	filmPosition,
	filmPositionAdd,
	filmPositionAddPost
};