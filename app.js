//Url for the sport Fuseki
var urlSport = "http://localhost:3030/ds/query"
//Url for the food Fuseki
var urlFood = "http://localhost:3031/ds2/query"

function getIngredient(){return '"'+(document.getElementById("ingredientInput").value)+'"'};
var foodqueryBase = [
 "SELECT ?subject1 ?name",
 "WHERE {",
 "?subject1 a <http://www.semanticweb.org/joliendeclerck/ontologies/2016/3/OIS-food-ontology/Ingredient>.",
 "?subject1 <http://www.semanticweb.org/joliendeclerck/ontologies/2016/3/OIS-food-ontology/hasIngredientName> ?name.",
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

function search(){doQuery(createFoodQuery(getIngredient()), makeResults);};

function makeResults(response){
	createIngredients(response.results.bindings);
	showIngredientsRow();
};

var cheatMeal = [];
function addToMeal(foodName){cheatMeal.push(foodName);};

function showIngredientsRow(){document.getElementById("ingredientsRow").style.display = "inline";};
function createIngredients(ingredients){
	//console.log(ingredients);
	for(var i in ingredients)
		createButton(ingredients[i].name.value, search);
};

function createButton(text, callback){
	var resultsDiv = document.getElementById("resultsDiv");
	var butt = document.createElement("button");
	butt.appendChild(document.createTextNode(text));
	butt.className = "btn btn-success btn-lg";
	butt.onclick = callback;
	resultsDiv.appendChild(butt);
};

function tree(data) {    
	var html = "";
        html = html + '<ul>';
        for (var i in data) {
           var foodname = data[i].name.value;
           html = html + '<li>' + foodname;
           html = html + '<button type="button" onclick="addToMeal('+ "'" + data[i].name.value +"'" +')"> Add to cheat-meal </button>';          
        }
        html = html +'</ul>';
    return html
    	
}

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
