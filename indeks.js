const express = require("express");
const dateET = require("./src/dateTimeET");
const fs = require("fs");
const bodyparser = require("body-parser");

// nüüd async jaoks kasutame mysql2 promise osa
//const mysql = require("mysql2/promise");
//const dbInfo = require("../../../oliver2025config.js");
const app = express();
app.set("view engine", "ejs");

// määrame kasutamiseks "avaliku" kataloogi
app.use(express.static("public"));
// päringu URL-i parsimine, eraldame POST osa. False, kui ainult tekst, true, kui ainult infot Ka

app.use(bodyparser.urlencoded({extended: false}));

//loon andmebaasiühenduse
/* const conn = mysql.createConnection({
	host: dbInfo.configdata.host,
	user: dbInfo.configdata.user,
	password: dbInfo.configdata.passWord,
	database: dbInfo.configdata.dataBase
}); */

/* const dbConf = {
	host: dbInfo.configdata.host,
	user: dbInfo.configdata.user,
	password: dbInfo.configdata.passWord,
	database: dbInfo.configdata.dataBase
}; */

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

// Eesti filmi marsruudid
const eestifilmRouter = require("./routes/eestifilmRoutes");
app.use("/eestifilm", eestifilmRouter);

app.get("/blackjack", (req, res)=>{
	res.render("blackjack");
});

app.listen(5204);

/* <select id="personSelect" name="personSelect">
	<option selected disabled>Vali isik</option>
	<option value="id_väärtus>Isiku nimi</option>
	................
	<option value="18">Maiken pius</option>
</select> */