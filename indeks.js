const express = require("express");
const dateET = require("./src/dateTimeET");
const fs = require("fs");
const bodyparser = require("body-parser");
//lisan andmebaasiga suhtlemiseks mooduli
const mysql = require("mysql2");
//Lisan andmebaasi juurdepääsuinfo
const dbInfo = require("../../../oliver2025config.js");

// me loome objekti, mis ongi epxress.js programm ja edasi kasutamegi seda

const app = express();
// määrame renderdajaks ejs

app.set("view engine", "ejs");
// määrame kasutamiseks "avaliku" kataloogi

app.use(express.static("public"));
// päringu URL-i parsimine, eraldame POST osa. False, kui ainult tekst, true, kui ainult infot Ka

app.use(bodyparser.urlencoded({extended: false}));

//loon andmebaasiühenduse
const conn = mysql.createConnection({
	host: dbInfo.configdata.host,
	user: dbInfo.configdata.user,
	password: dbInfo.configdata.passWord,
	database: dbInfo.configdata.dataBase
});

app.get("/", (req, res)=>{
	//res.send("Express.js läks edukalt käima!!!");
	res.render("index");
});

app.get("/timenow", (req, res)=>{
	res.render("timenow", {nowDate: dateET.longDate(), nowWd:dateET.weekDay()});
});

app.get("/vanasonad", (req, res)=>{
	fs.readFile("public/txt/vanasonad.txt", "utf8", (err, data)=>{
		if(err){
			res.render("genericlist", {heading: "Valik Eesti tuntuid vanasõnasid", listData: ["Kahjuks vanasõnasid ei leidnud!"]});
		} else {
			folkWisdom = data.split(";");
			res.render("genericlist", {heading: "Valik Eesti tuntuid vanasõnasid", listData: folkWisdom});
		}
	});
});

app.get("/reqvisit", (req, res)=>{
	res.render("reqvisit");
});

app.post("/regvisit", (req, res)=>{
	console.log(req.body);
	//avan tekstifaili kirjutamiseks sellisel moel, et kui teda pole, luuakse (parameeter "a")
	fs.open("public/txt/visitlog.txt", "a", (err, file)=>{
		if(err){
			throw(err);
		}
		else {
			//faili senisele sisule lisamine
			fs.appendFile("public/txt/visitlog.txt", req.body.firstNameInput + " " + req.body.lastNameInput + ", " + dateEt.longDate() + " kell " + dateEt.time() + ";", (err)=>{
				if(err){
					throw(err);
				}
				else {
					console.log("Salvestatud!");
					res.render("visitregistered", {visitor: req.body.firstNameInput + " " + req.body.lastNameInput});
				}
			});
		}
	});
});

app.get("/visitlog", (req, res)=>{
	let listData = [];
	fs.readFile("public/txt/visitlog.txt", "utf8", (err, data)=>{
		if(err){
			//kui tuleb viga, siis ikka vأ¤ljastame veebilehe, liuhtsalt vanasأµnu pole أ¼htegi
			res.render("genericlist", {heading: "Registreeritud külastused", listData: ["Ei leidnud ühtegi külastust!"]});
		}
		else {
			let tempListData = data.split(";");
			for(let i = 0; i < tempListData.length - 1; i ++){
				listData.push(tempListData[I]);
			}
			res.render("genericlist", {heading: "Registreeritud külastused", listData: listData});
		}
	});
});

app.get("/eestifilm", (req, res)=>{
	res.render("eestifilm");
});

app.get("/eestifilm/filmiinimesed", (req, res)=>{
	const sqlReq = "SELECT * FROM person";
	conn.execute(sqlReq, (err, sqlRes)=>{
		if(err){
			console.log(err);
			res.render("filmiinimesed", {personList: []});
		}
		else {
			console.log(sqlRes);
			res.render("filmiinimesed", {personList: sqlRes});
		}
	})
	//res.render("filmiinimesed");
});

app.get("/eestifilm/filmiinimesed_add", (req, res)=>{
	res.render("filmiinimesed_add", {notice: "Ootan sisestust!"});
});

app.post("/eestifilm/filmiinimesed_add", (req, res)=>{
	console.log(req.body);
	// Kas andmed on olemas?
	if(!req.body.firstNameInput || !req.body.lastNameInput || !req.body.bornInput || req.body.bornInput > new Date()){
		res.render("filmiinimesed_add", {notice: "Andmed on vigased! Vaata üle!" + req.body});
	}
	else {
		let deceasedDate = null;
		if(req.body.deceasedInput != ""){
			deceasedDate = req.body.deceasedInput
		}
		let sqlReq = "INSERT INTO person (first_name, last_name, born, deceased) VALUES (?,?,?,?)";
		conn.execute(sqlReq, [req.body.firstNameInput, req.body.lastNameInput, req.body.bornInput, deceasedDate], (err, sqlRes)=>{
			if(err){
				res.render("filmiinimesed_add", {notice: "Tekkis tehniline viga:" + err});
			}
			else {
				res.render("filmiinimesed_add", {notice: "Andmed on salvestatud!"});
			}
		});
	}
	//res.render("filmiinimesed_add", {notice: "Andmed olemas!" + req.body});
});

app.listen(5204);