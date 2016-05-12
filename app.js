var foodquery = [
 "SELECT ?subject1 ?name",
 "WHERE {",
 "?subject1 a <http://www.semanticweb.org/joliendeclerck/ontologies/2016/3/OIS-food-ontology/Ingredient>.",
 "?subject1 <http://www.semanticweb.org/joliendeclerck/ontologies/2016/3/OIS-food-ontology/hasIngredientName> ?name.",
 'FILTER regex(?name, "Ch.","i").'
].join(" ");

var url = "http://localhost:3030/ds/query"

function encodeQuery(query){
 return url+"?query="+ encodeURIComponent(foodquery)
}


function doQuery(query){

	xhttp = new XMLHttpRequest();

	xhttp.onreadystatechange= function() {
		if(xhttp.readyState == 4 && xhttp.status == 200){
			document.getElementById("test").innerHTML= xhttp.responseText;
		}
	}

	xhttp.open("GET",encodeQuery(query),true);
	xhttp.send();

}




