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

var getIngredientsBegin =
"SELECT ?ingredient_name " +
"WHERE {" +
"?food <http://www.semanticweb.org/joliendeclerck/ontologies/2016/3/OIS-food-ontology/hasFoodName> " +
'"';
var getIngredientsLast =
'".' +
"?recipe <http://www.semanticweb.org/joliendeclerck/ontologies/2016/3/OIS-food-ontology/resultsIn> ?food. " +
"?recipe <http://www.semanticweb.org/joliendeclerck/ontologies/2016/3/OIS-food-ontology/requiresQuantityOfIngredient> ?ingredient_quantity. " +
"?ingredient_quantity <http://www.semanticweb.org/joliendeclerck/ontologies/2016/3/OIS-food-ontology/hasIngredient> ?ingredient. " +
"?ingredient <http://www.semanticweb.org/joliendeclerck/ontologies/2016/3/OIS-food-ontology/hasIngredientName> ?ingredient_name.} ";
function getIngredients(recipe){
	var query = urlFood + "?query=" + getIngredientsBegin + recipe + getIngredientsLast;
	doQuery(query, function(ingredients) {
		console.log(ingredients);
		var text = document.getElementById("modalText");

		while (text.firstChild) {text.removeChild(text.firstChild);};

		var res = ingredients.results.bindings;
		for (x in res) {
			console.log(x);
			var val = res[x].ingredient_name.value;
			var newEl = document.createElement("li");
			newEl.innerHTML = val;
			text.appendChild(newEl);

		}
	});
}

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

function queryBuilder(foodName,numberofEx,duration,type,muscles){
var query =
"PREFIX ex: <http://webprotege.stanford.edu/ontologies/ExerciseOntology%23> " +
"PREFIX food: <http://www.semanticweb.org/joliendeclerck/ontologies/2016/3/OIS-food-ontology/> " +
"PREFIX xsd: <http://www.w3.org/2001/XMLSchema%23> " +
"SELECT DISTINCT ?exname ?calories ?cal ?prefered " +
"WHERE { " +
"  ?ex a ex:Exercise. " +
"  ?ex ex:NumberOfCalories ?calories. " +
"  ?ex ex:HasName ?exname. " +
"  ?ex ex:HasMuscleGroup ?muscles. " +
"  ?ex ex:Duration ?duration. " +
"  ?ex ex:HasType ?type. " +
"  " +
"  FILTER (?calories > ?cal/ " + numberofEx + ") " +
"    OPTIONAL{ " +
"        FILTER (?duration > "+ duration + ") " +
' 		FILTER regex(?type,"' + type + '","i")'  +
'  		FILTER regex(?muscles,"' + muscles + '","i") ' +
"    values ?prefered {1} " +
"  	} " +
" " +
"  SERVICE <http://localhost:3031/ds/query> { " +
" " +
"	SELECT ?fname  (SUM (?nvqu) as ?cal) " +
"	WHERE { " +
"  		?food a food:Food . " +
'  		?food food:hasFoodName "' + foodName + '". ' +
"  		?recipe a food:Recipe. " +
"  		?recipe food:resultsIn ?food. " +
"  		?recipe food:requiresQuantityOfIngredient ?qi. " +
"  		 " +
"		?qi food:hasIngredientQuantity ?iq. " +
"		?qi food:hasIngredient ?ing. " +
" " +
"		?ing food:hasNutritiveValuesQuantity ?nvq. " +
"  		?nvq food:hasNutritiveQuantity ?nvqu. " +
"    	?nvq food:hasNutritiveValueQuantityUnit ?unit " +
'   FILTER regex(?unit,'+'"kCal"'+') ' +
"  		 " +
"} GROUP BY ?fname " +
"  } " +
"} ORDER BY ?calories";

	return query;
}

function search(){doQuery(createFoodQuery(stringify((document.getElementById("ingredientInput").value))), makeResults);};

function makeResults(response){
	while (resultsDiv.firstChild) {resultsDiv.removeChild(resultsDiv.firstChild);};
	createIngredients(response.results.bindings);
	//Should be deleted
	//showIngredientsRow();
};

var cheatMeal = [];

function clearCheatMeal(){
  cheatMeal = [];
  document.getElementById("exercises").innerHTML = '<h2 align="center"> Cheat-meal </h2>';
}

function addToMeal(foodName){
	console.log(foodName);
	cheatMeal.push(foodName);
	createIngredientsRow(foodName, cheatMeal.length);};

function calculateExercises(cheatMeal){
	for (meal in cheatMeal){
		createIngredientsRow(cheatMeal[meal],meal);
	}
};

function updateModal(recipe){
	var title = document.getElementById("modalTitle");
	title.innerHTML = recipe + " ingredients:";

	getIngredients(recipe);
};

function loadingModal(){
	var text = document.getElementById("modalText");
	while (text.firstChild) {text.removeChild(text.firstChild);};
	var newEl = document.createElement("li");
	newEl.innerHTML = "Loading ingredients";
	var newEll = document.createElement("li");
	newEll.innerHTML = "...";

	text.appendChild(newEl);
	text.appendChild(newEll);
}

function createIngredientsRow(text,id){
	var row = document.createElement("div");
	row.className = "row";
	var col1 = document.createElement("div");
	col1.className = "col-xs-6";
	var col2 = document.createElement("div");
	col2.className = "col-xs-6";
	col2.id = "col2"+id;

	row.appendChild(col1);
	row.appendChild(col2);

	var butt = document.createElement("button");

	document.getElementById("exercises").appendChild(row);

	butt.appendChild(document.createTextNode(text));
	butt.className = "btn btn-info btn-lg";
	butt.setAttribute("data-toggle", "modal");
	butt.setAttribute("data-target", "#TheModal");
	butt.onclick = function(){updateModal(text);};
	col1.appendChild(butt);


	var query = urlSport + "?query=" + queryBuilder(text,1,5,"power","Calves");

	doQuery(query,function(response){

		//create fancy list here
		//array = objects met calories.value en exname.value
		var array = response.results.bindings

		col2.appendChild();
	})
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
