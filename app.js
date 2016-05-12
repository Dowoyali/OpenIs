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
			document.getElementById("test").innerHTML= xhttp.responseText;
		}

		else{
			console.log(xhttp.responseText)
		}
	}

	xhttp.open("GET",createFoodQuery('"'+(document.getElementById("input").value)+'"',true));
	xhttp.send();

}




