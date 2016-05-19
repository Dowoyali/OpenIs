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
};

var cheatMeal = [];

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
	col1.className = "col-xs-3";
	var col2 = document.createElement("div");
	col2.className = "col-xs-3";
  var col3 = document.createElement("div");
	col3.className = "col-xs-6";

	row.appendChild(col1);
	row.appendChild(col2);
  row.appendChild(col3);

	var butt = document.createElement("button");

	document.getElementById("exercises").appendChild(row);

	butt.appendChild(document.createTextNode(text));
	butt.className = "btn btn-info btn-lg";
	butt.setAttribute("data-toggle", "modal");
	butt.setAttribute("data-target", "#TheModal");
	butt.onclick = function(){updateModal(text);};
	col1.appendChild(butt);

  var exNumber = document.getElementById("exNumber").value;
  var exDuration = document.getElementById("exDuration").value;
  var typeEx;
  if(document.getElementById("cardioRadio").checked){typeEx = "cardio"}
    else{typeEx = "power"};
  var exMuscle = document.getElementById("exMuscle").value;
	var query = urlSport + "?query=" + queryBuilder(text,exNumber,exDuration,typeEx,exMuscle);

	doQuery(query,function(response){

		//create fancy list here
		//array = objects met calories.value en exname.value
		var array = response.results.bindings

    var list = document.createElement("ul");
    list.className = "list-group";

    var list2 = document.createElement("ul");
    list.className = "list-group";

    var tempCol2 = document.createElement("li");
    tempCol2.className = "list-group-item list-group-item-info";
    tempCol2.innerHTML = "Kcals to consume: " + array[0].cal.value;

    for (x in array){

      var tempCol3 = document.createElement("li");
      tempCol3.innerHTML = array[x].exname.value + " consuming: " + array[x].calories.value + "Kcal";

      if(array[x].prefered === undefined){
        tempCol3.className = "list-group-item list-group-item-warning";
      }
      else{
        tempCol3.className = "list-group-item list-group-item-success";
      }


      list.appendChild(tempCol2);
      list2.appendChild(tempCol3);
    }

    col2.appendChild(list);
    col3.appendChild(list2);

    enableAlert();

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

function enableCheatMeal(){
  document.getElementById("cheatMealBurner").style.display = 'none';
  document.getElementById("exercises").style.display = 'inline';
  document.getElementById("menu1").className = "";
  document.getElementById("menu2").className = "active";
};
function enableBurner(){
  document.getElementById("exercises").style.display = 'none';
  document.getElementById("cheatMealBurner").style.display = 'inline';
  document.getElementById("menu1").className = "active";
  document.getElementById("menu2").className = "";
};
function enableAlert(){
  var popUp = document.getElementById("popUp");
  popUp.style.display = 'inline';
  setTimeout(function(){
    popUp.style.display = 'none';
  }, 3000);
}

var muscleGroups = urlSport + "?query=" +
"PREFIX ex: <http://webprotege.stanford.edu/ontologies/ExerciseOntology%23> " +
"SELECT DISTINCT ?muscles " +
"WHERE { " +
 "?ex a ex:Exercise. " +
 "?ex ex:NumberOfCalories ?calories. " +
 "?ex ex:HasName ?exname. " +
 "?ex ex:HasMuscleGroup ?muscles. " +
"}";
doQuery(muscleGroups, function(response){
  var brol = document.getElementById("exMuscle");

  var res = response.results.bindings;
  for(x in res){
    var temp = document.createElement("option");
    temp.innerHTML = res[x].muscles.value;
    brol.appendChild(temp);
  }
});
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
