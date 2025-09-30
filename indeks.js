const express = require("express");
const dateET = require("./src/dateTimeET");
const fs = require("fs");
const bodyparser = require("body-parser");

// me loome objekti, mis ongi epxress.js programm ja edasi kasutamegi seda

const app = express();
// määrame renderdajaks ejs

app.set("view engine", "ejs");
// määrame kasutamiseks "avaliku" kataloogi

app.use(express.static("public"));
// päringu URL-i parsimine, eraldame POST osa. False, kui ainult tekst, true, kui ainult infot Ka

app.use(bodyparser.urlencoded({extended: false}));

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

app.post("/reqvisit", (req, res)=>{
	console.log(req.body);
	//avan tekstifaili kirjutamiseks sellisel moel, et kui teda pole, luuakse (parameeter "a")
	fs.open("public/txt/visitlog.txt", "a", (err, file)=>{
		if(err){
			throw(err);
		}
		else {
			//faili senisele sisule lisamine
			fs.appendFile("public/txt/visitlog.txt", req.body.nameInput + "; ", (err)=>{
				if(err){
					throw(err);
				}
				else {
					console.log("Salvestatud!");
					res.render("reqvisit");
				}
			});
		}
	});
});

app.listen(5204);