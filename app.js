var url = "http://localhost:3031/ds2/query"

var foodqueryBase = [
 "SELECT ?subject1 ?name",
 "WHERE {",
 "?subject1 a <http://www.semanticweb.org/joliendeclerck/ontologies/2016/3/OIS-food-ontology/Ingredient>.",
 "?subject1 <http://www.semanticweb.org/joliendeclerck/ontologies/2016/3/OIS-food-ontology/hasIngredientName> ?name.",
 "FILTER regex(?name, "].join(" ");
var foodqueryEnd = ', "i").}';

function createFoodQuery(regex) {return url+"?query=" + foodqueryBase + regex + foodqueryEnd};

function doQuery(query){
	xhttp = new XMLHttpRequest();
	
	xhttp.onreadystatechange= function() {
		if(xhttp.readyState == 4 && xhttp.status == 200){

			var response = JSON.parse(xhttp.responseText);
			document.getElementById("resultsDiv").innerHTML= tree(response.results.bindings);
		}

		else{
		}
	}
	
	xhttp.open("GET",query,true);
	xhttp.send();
}

function search(){
	doQuery(createFoodQuery('"'+(document.getElementById("ingredientInput").value)+'"'))	
}


var cheatMeal = [];

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

function addToMeal(foodName){
	cheatMeal.push(foodName);
	console.log(cheatMeal);

}

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
var brool = url+"?query="+brolQuery; 
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
