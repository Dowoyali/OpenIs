//Url for the sport Fuseki
var urlSport = "http://localhost:3030/ds/query"
//Url for the food Fuseki
var urlFood = "http://localhost:3031/ds/query"

function stringify(value){return '"'+ value +'"'};
var foodqueryBase = [
 "SELECT ?subject1 ?name",
 "WHERE {",
 "?food a <http://www.semanticweb.org/joliendeclerck/ontologies/2016/3/OIS-food-ontology/Food> .",
 "?food <http://www.semanticweb.org/joliendeclerck/ontologies/2016/3/OIS-food-ontology/hasFoodName> ?name.",
 "FILTER regex(?name, "].join(" ");
var foodqueryEnd = ', "i").}';
function createFoodQuery(regex) {return urlFood + "?query=" + foodqueryBase + regex + foodqueryEnd};

function doQuery(query, callback){
	xhttp = new XMLHttpRequest();
	
	xhttp.onreadystatechange= function() {
		if(xhttp.readyState == 4 && xhttp.status == 200){
			var response = JSON.parse(xhttp.responseText);
			callback(response)
		}
		else{
		}
	}
	
	xhttp.open("GET",query,true);
	xhttp.send();
}

function search(){doQuery(createFoodQuery(stringify((document.getElementById("ingredientInput").value))), makeResults);};

function makeResults(response){
	while (resultsDiv.firstChild) {resultsDiv.removeChild(resultsDiv.firstChild);};
	createIngredients(response.results.bindings);
	//Should be deleted
	//showIngredientsRow();
};

var cheatMeal = [];

function removeFromMeal(id){
	cheatMeal.remove(id);
};
function addToMeal(foodName){
	console.log(foodName);
	cheatMeal.push(foodName);
	createIngredientsRow(foodName, cheatMeal.length);};

function calculateExercises(cheatMeal){
	for (meal in cheatMeal){
		createIngredientsRow(cheatMeal[meal],meal);
	}
};

function createIngredientsRow(text,id){
	var row = document.createElement("div");
	row.className = "row";
	var col1 = document.createElement("div");
	col1.className = "col-xs-6";
	var col2 = document.createElement("div");
	col2.className = "col-xs-6";

	row.appendChild(col1);
	row.appendChild(col2);

	var butt = document.createElement("button");

	document.getElementById("exercises").appendChild(row);
	butt.appendChild(document.createTextNode(text));
	butt.className = "btn btn-info btn-lg";
	butt.setAttribute("data-toggle", "modal");
	butt.setAttribute("data-target", "#TheModal");
	col1.appendChild(butt);
}

function createIngredients(ingredients){
	for(var i = 0; i < ingredients.length; i++){
		var temp = ingredients[i].name.value;
		createButtonPossibilities(temp, temp)
	};
};

function createButtonPossibilities(text, name){
	var resultsDiv = document.getElementById("resultsDiv");
	var butt = document.createElement("button");
	butt.appendChild(document.createTextNode(text));
	butt.className = "btn btn-success btn-lg";
	butt.onclick = function(){addToMeal(name);};
	resultsDiv.appendChild(butt);
};
//-----------------------------------AUTOCOMPLETE-------------------------------------//
window.onload = createAutoComplete;
function createAutoComplete(){
 new autoComplete({
    selector: document.getElementById('ingredientInput'),
    minChars: 1,
    source: function(term, response){
	console.log(term);
	doQuery(createFoodQuery(stringify(term)),function(data){
			 console.log(data.results.bindings);
			 var strings = (data.results.bindings).map(function(x){return x.name.value});
			 console.log(strings);
			 response(strings); });
    }
});
}
//------------------------------------------------------------------------------------//
//testing ------
var brolQuery = [
"@prefix food: <http://www.semanticweb.org/joliendeclerck/ontologies/2016/3/OIS-food-ontology/>.",
"@prefix ex: <http://example.org/exercise>",
"SELECT ?exercise_name ?food_name ?cal_food ?cal_ex",
"WHERE{",
"    ?exercise a ex:Exercise.",
"    ?exercise ex:HasName ?exercise_name.",
"    ?exercise ex:NumberOfCalories ?cal_ex.",
"    FILTER (?cal_ex >= ?cal_food).",
"    SERVICE <http://localhost:3031/ds2/query> {",
"      ?food_el a food:Ingredient.",
"      ?food_el food:hasIngredientName ?food_name.",
"      ?food_el food:hasNutritiveValueQuantity ?cal_food.",
"  }",
"}"
]
var brool = urlFood+"?query="+brolQuery; 
function brol(query){
	xhttp = new XMLHttpRequest();
	
	xhttp.onreadystatechange= function() {
		if(xhttp.readyState == 4 && xhttp.status == 200){

			var response = JSON.parse(xhttp.responseText);
			console.log(response);
		}

		else{
		}
	}
	
	xhttp.open("GET",query,true);
	xhttp.send();

}
