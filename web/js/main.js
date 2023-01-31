window.onload = initialize;

function initialize() {
    downloadAllLands();
    document.getElementById("form-land").addEventListener("submit", createLand);
}

function validatedLand(event) {
    let municipality = event.target.municipality.value;
    let province = event.target.province.value;
    let surface = event.target.surface.value;


    let error = false;
    document.getElementById("error-municipality-name").style.display = "none";
    document.getElementById("error-province-name").style.display = "none";
    document.getElementById("error-surface").style.display = "none";

    if (!municipality) {
        document.getElementById("error-municipality-name").style.display = "block";
        error = true;
    }

    if (!province) {
        document.getElementById("error-province-name").style.display = "block";
        error = true;
    }


    if (!surface) {
        document.getElementById("error-surface").style.display = "block";
        error = true;
    }

    return !error;
}

function createLand(event) {
    event.preventDefault();

    if (validatedLand(event)) {
        var request = new XMLHttpRequest();
        request.open('POST', 'http://localhost:3000/lands', true);
        request.onreadystatechange =  () => {
            if (request.readyState == 4 && request.status == 200) {
                downloadAllLands();
            }
        };
        request.setRequestHeader('Content-Type', 'text/xml');
        request.send('<?xml version="1.0" encoding="UTF-8"?>' +
            '<lands>' +
            '<land>' +
            '<municipality>' + event.target.municipality.value + '</municipality>' +
            '<province>' + event.target.province.value + '</province>' +
            '<surface>' + event.target.surface.value + '</surface>' +
            '</land>' +
            '</lands>'
        );
        event.target.reset();
    }
}

function downloadAllLands() {
    var request = new XMLHttpRequest();
    request.open('GET', 'http://localhost:3000/lands', true);
    request.onload = function () {

        console.log(this.response);

        showAllLands(this.response);
        document.getElementById("show_all").click();
    }
    request.send();
}

function showAllLands(data) {

    parser = new DOMParser();
    xmlData = parser.parseFromString(data, "text/xml");

    let xmlLands = xmlData.getElementsByTagName("land");

    let result = "";

    for (var i = 0; i < xmlLands.length; i++) {
        result +=
            '<div class="card mt-2">' +
            '<div class="card-head">' +
            '<h5>Municipio: ' + xmlLands[i].childNodes[0].childNodes[0].data + '</h5>' +
            '<h5>Provincia: ' + xmlLands[i].childNodes[1].childNodes[0].data + '</h5>' +
            '<h6><p>Superficie: ' + xmlLands[i].childNodes[2].childNodes[0].data + '</p></h6>' +
            '</div>' +
            '</div>';
    }

    document.getElementById("lands_show").innerHTML = result;
}