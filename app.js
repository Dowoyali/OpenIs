var url = "http://localhost:3030/ds/query"

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
			document.getElementById("test").innerHTML= tree(response.results.bindings);
		}

		else{
		}
	}
	
	xhttp.open("GET",query,true);
	xhttp.send();
}

function search(){
	doQuery(createFoodQuery('"'+(document.getElementById("input").value)+'"'))	
}

function tree(data) {    

	var html = "";
    if (typeof(data) == 'object') {
        html = html + '<ul>';
        for (var i in data) {
           html = html + '<li>' + i;
            tree(data[i]);            
        }
        html = html +'</ul>';
    } else {
        html = html + ' => ' + data;
    }
    return html
}