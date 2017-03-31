var xmlDoc = null;
var xslDoc = null;

var formContainer = null;
var nota = 0.0;
var numeroPreguntas = 10;

var preguntasSelect = [];
var respuestasSelect = [];
var valorRespuestaSelect = [];

var preguntasText = [];
var respuestasText = [];

var preguntasCheckBox = [];
var respuestasCheckBox = [];
var valorRespuestasCheckBox = [];

var preguntasRadio = [];
var respuestasRadio = [];
var valorRespuestaRadio = [];

var preguntasSelectMultiple = [];
var respuestasSelectMultiple = [];
var valorRespuestasSelectMultiple = [];


window.onload = function() {

    formContainer = document.getElementById('myform');
    formContainer.onsubmit = function() {
        if (comprobar()) {
            document.getElementById("myform").style.display = "none";
            document.getElementById("resultadosDiv")
            document.getElementById("menu").focus();
            ocultarDivRespuestas();
            corregirSelect();
            corregirText();
            corregirCheckBox();
            corregirRadio();
            corregirSelectMultiple();
            presentarNota();
            presentarTablaXSL();
        }
        return false;
    }

    //LEER 
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            gestionarXml(this);
        }
    };
    xhttp.open("GET", "xml/preguntas.xml", true);
    xhttp.send();

    //LEER 
    xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            xslDoc = this.responseXML;
        }
    };
    xhttp.open("GET", "xml/preguntas.xsl", true);
    xhttp.send();
}


function gestionarXml(dadesXml) {
    xmlDoc = dadesXml.responseXML; //XML to xmlDoc
    var tipo = "";
    var numeroCajaTexto = 0;
    divNota();
    for (i = 0; i < numeroPreguntas; i++) {
        tipo = xmlDoc.getElementsByTagName("type")[i].innerHTML;
        switch (tipo) {
            case "select":
                crearDivPregunta(i);
                crearDivCorreccion(i)
                imprimirTituloPregunta(i, xmlDoc);
                imprimirOpcionesSelect(i, xmlDoc);
                preguntasSelect.push(i);
                respuestasSelect.push(parseInt(xmlDoc.getElementsByTagName("question")[i].getElementsByTagName("answer")[0].innerHTML));
                valorRespuestaSelect.push(xmlDoc.getElementsByTagName("question")[i].getElementsByTagName("option")[respuestasSelect[i]].innerHTML);
                break;
            case "text":
                crearDivPregunta(i);
                crearDivCorreccion(i)
                imprimirTituloPregunta(i, xmlDoc);
                imprimirCajaText(numeroCajaTexto, xmlDoc);
                numeroCajaTexto++;
                preguntasText.push(i);
                respuestasText.push(parseInt(xmlDoc.getElementsByTagName("question")[i].getElementsByTagName("answer")[0].innerHTML));
                break;
            case "checkbox":
                crearDivPregunta(i);
                crearDivCorreccion(i)
                imprimirTituloPregunta(i, xmlDoc);
                imprimirCheckBox(i, xmlDoc);
                preguntasCheckBox.push(i);
                agregarRespuestas(i, xmlDoc, respuestasCheckBox, valorRespuestasCheckBox);
                break;
            case "radio":
                crearDivPregunta(i);
                crearDivCorreccion(i)
                imprimirTituloPregunta(i, xmlDoc);
                imprimirRadioButton(i, xmlDoc);
                preguntasRadio.push(i);
                agregarRespuestasRadio(i, xmlDoc, respuestasRadio, valorRespuestaRadio);
                break;
            case "select multiple":
                crearDivPregunta(i);
                crearDivCorreccion(i)
                imprimirTituloPregunta(i, xmlDoc);
                imprimirSelectMultiple(i, xmlDoc);
                preguntasSelectMultiple.push(i);
                agregarRespuestas(i, xmlDoc, respuestasSelectMultiple, valorRespuestasSelectMultiple);
                break;
        }
    }
    imprimirEspacios(2);
    imprimirBotonCorregir();
    imprimirEspacios(2);
}



function imprimirTituloPregunta(i, xmlDoc) {
    //se le pasa una pregunta del xml y busca su atributo title y lo plasma en un <h3> en el html
    var tituloPregunta = document.createElement("h3");
    tituloPregunta.innerHTML = xmlDoc.getElementsByTagName("title")[i].innerHTML;
    document.getElementById('pregunta' + i).appendChild(tituloPregunta);
}

function imprimirOpcionesSelect(i, xmlDoc) {
    var xpath = "/questions/question[" + (i + 1) + "]/option";
    var nodes = xmlDoc.evaluate(xpath, xmlDoc, null, XPathResult.ANY_TYPE, null);
    var result = nodes.iterateNext();
    var select = document.createElement("select");
    select.id = "select" + i;
    document.getElementById('pregunta' + i).appendChild(select);
    while (result) {
        var option = document.createElement("option");
        option.text = result.innerHTML;
        select.options.add(option);
        result = nodes.iterateNext();
    }
}

function imprimirCajaText(numeroCajaTexto, xmlDoc) {
    var cajaTexto = document.createElement("input");
    cajaTexto.type = "number";
    cajaTexto.id = "cajaTexto" + numeroCajaTexto;
    document.getElementById('pregunta' + i).appendChild(cajaTexto);
}


function imprimirCheckBox(i, xmlDoc) {
    var xpath = "/questions/question[" + (i + 1) + "]/option";
    var nodes = xmlDoc.evaluate(xpath, xmlDoc, null, XPathResult.ANY_TYPE, null);
    var result = nodes.iterateNext();
    var j = 0;
    while (result) {
        var label = document.createElement("label");
        var input = document.createElement("input");
        label.innerHTML = result.innerHTML;
        input.type = "checkbox";
        input.name = "preg" + i;
        input.id = "preg" + i + "ans" + j;
        input.setAttribute("class", "inputCheckBox");
        document.getElementById('pregunta' + i).appendChild(input);
        document.getElementById('pregunta' + i).appendChild(label);
        document.getElementById('pregunta' + i).appendChild(document.createElement("br"));
        result = nodes.iterateNext();
        j++
    }
}

function imprimirRadioButton(i, xmlDoc) {
    var xpath = "/questions/question[" + (i + 1) + "]/option";
    var nodes = xmlDoc.evaluate(xpath, xmlDoc, null, XPathResult.ANY_TYPE, null);
    var result = nodes.iterateNext();
    var j = 0;
    while (result) {
        var input = document.createElement("input");
        var answerTitle = result.innerHTML;
        var span = document.createElement("span");
        span.innerHTML = answerTitle;
        input.type = "radio";
        input.name = "preg" + i;
        input.id = "preg" + i + "ans" + j;
        input.setAttribute("class", "inputRadioButton");
        document.getElementById('pregunta' + i).appendChild(input);
        document.getElementById('pregunta' + i).appendChild(span);
        document.getElementById('pregunta' + i).appendChild(document.createElement("br"));
        result = nodes.iterateNext();
        j++;
    }
}

function imprimirSelectMultiple(i, xmlDoc) {
    var xpath = "/questions/question[" + (i + 1) + "]/option";
    var nodes = xmlDoc.evaluate(xpath, xmlDoc, null, XPathResult.ANY_TYPE, null);
    var result = nodes.iterateNext();
    var selectMultiple = document.createElement("select");
    selectMultiple.multiple = "true";
    while (result) {
        var answerTitle = result.innerHTML;
        var option = document.createElement("option");
        option.innerHTML = answerTitle;
        selectMultiple.appendChild(option);
        result = nodes.iterateNext();
    }
    document.getElementById('pregunta' + i).appendChild(selectMultiple);
}

function imprimirEspacios(numeroEspacios) {
    for (i = 0; i < numeroEspacios; i++) {
        var espacio = document.createElement("br");
        formContainer.appendChild(espacio);
    }
}

function imprimirBotonCorregir() {
    var botonCorregir = document.createElement("input");
    botonCorregir.type = "submit";
    botonCorregir.value = "Corregir";
    botonCorregir.id = "btnCorregir";
    formContainer.appendChild(botonCorregir);
}

//CORRECIONES 

function corregirSelect() {

    for (i = 0; i < preguntasSelect.length; i++) {
        var sel = document.getElementById("pregunta" + preguntasSelect[i]).getElementsByTagName("select")[0];
        var respuesta = respuestasSelect[i];
        if (sel.selectedIndex == respuesta) {
            darRespuestaHtml(preguntasSelect[i], "P" + (preguntasSelect[i] + 1) + ": Correcto");
            nota += 1;
        } else {
            darRespuestaHtml(preguntasSelect[i], "P" + (preguntasSelect[i] + 1) + ": Incorrecto");
            darRespuestaHtml(preguntasSelect[i], "La respuesta correcta es: " + valorRespuestaSelect[i]);
        }
        var useranswer = xmlDoc.createElement("useranswer");
        useranswer.innerHTML = sel.selectedIndex;
        xmlDoc.getElementsByTagName("question")[preguntasSelect[i]].appendChild(useranswer);
    }
}

function corregirText() {
    for (i = 0; i < preguntasText.length; i++) {
        var input = document.getElementById("pregunta" + preguntasText[i]).getElementsByTagName("input")[0];
        var respuesta = respuestasText[i];
        if (input.value == respuesta) {
            darRespuestaHtml(preguntasText[i], "P" + (preguntasText[i] + 1) + ": Correcto");
            nota += 1;
        } else {
            darRespuestaHtml(preguntasText[i], "P" + (preguntasText[i] + 1) + ": Incorrecto");
            darRespuestaHtml(preguntasText[i], "La respuesta correcta es: " + respuestasText[i]);
        }
        var useranswer = xmlDoc.createElement("useranswer");
        useranswer.innerHTML = input.value;
        xmlDoc.getElementsByTagName("question")[preguntasText[i]].appendChild(useranswer);
    }
}

function corregirCheckBox() {
    for (i = 0; i < preguntasCheckBox.length; i++) {
        var inputs = document.getElementById("pregunta" + preguntasCheckBox[i]).getElementsByTagName("input");
        var bandera = 0;
        var hayFallo = false;
        for (j = 0; j < inputs.length; j++) {
            var encontrado = false;
            if (inputs[j].checked) {
                var useranswer = xmlDoc.createElement("useranswer");
                useranswer.innerHTML = j;
                xmlDoc.getElementsByTagName("question")[preguntasCheckBox[i]].appendChild(useranswer);

                bandera = 1;
                for (k = 0; k < respuestasCheckBox[i].length; k++) {
                    if (j == respuestasCheckBox[i][k]) {
                        nota += 1.0 / respuestasCheckBox[i].length;
                        darRespuestaHtml(preguntasCheckBox[i], "P" + (preguntasCheckBox[i] + 1) + " opcion " + (j + 1) + ": correcta");
                        encontrado = true;
                        break;
                    }
                }
                if (!encontrado) {
                    hayFallo = true;
                    nota -= 1.0 / respuestasCheckBox[i].length;
                    darRespuestaHtml(preguntasCheckBox[i], "P" + (preguntasCheckBox[i] + 1) + " opcion " + (j + 1) + ": incorrecta");
                }

            }
        }
        if (hayFallo) {
            if (valorRespuestasCheckBox[i].length == 1) {
                darRespuestaHtml(preguntasCheckBox[i], "La respuesta correcta es: " + valorRespuestasCheckBox[i]);
            } else {
                darRespuestaHtml(preguntasCheckBox[i], "Las respuestas correctas son: " + valorRespuestasCheckBox[i].join(', '));
            }
        }
        if (bandera == 0) {
            darRespuestaHtml(preguntasCheckBox[i], "P" + (preguntasCheckBox[i] + 1) + ": No has seleccionado ninguna respuesta");
        }
    }
}

function corregirRadio() {
    for (i = 0; i < preguntasRadio.length; i++) {
        var preguntaRadio = document.getElementById('pregunta' + preguntasRadio[i]);
        var bandera = 0;
        for (j = 0; j < preguntaRadio.getElementsByTagName('input').length; j++) {
            if (preguntaRadio.getElementsByTagName('input')[j].checked) {
                var useranswer = xmlDoc.createElement("useranswer");
                useranswer.innerHTML = j;
                xmlDoc.getElementsByTagName("question")[preguntasRadio[i]].appendChild(useranswer);

                bandera = 1;
                if (j == respuestasRadio[i]) {
                    nota += 1.0;
                    darRespuestaHtml(preguntasRadio[i], "P" + (preguntasRadio[i] + 1) + " opcion " + (j + 1) + ": correcta");
                } else {
                    nota -= 1.0;
                    darRespuestaHtml(preguntasRadio[i], "P" + (preguntasRadio[i] + 1) + " opcion " + (j + 1) + ": incorrecta");
                    darRespuestaHtml(preguntasRadio[i], "La respuesta correcta es: " + valorRespuestaRadio[i]);
                }
            }
        }
        if (bandera == 0) {
            darRespuestaHtml(preguntasRadio[i], "P" + (preguntasRadio[i] + 1) + ": No has seleccionado ninguna respuesta");
        }
    }
}

function corregirSelectMultiple() {
    for (i = 0; i < preguntasSelectMultiple.length; i++) {
        var sel = document.getElementById("pregunta" + preguntasSelectMultiple[i]).getElementsByTagName("select")[0];
        var bandera = 0;
        var hayFallo = false;
        for (j = 0; j < sel.length; j++) {
            var encontrado = false;
            if (sel[j].selected) {
                var useranswer = xmlDoc.createElement("useranswer");
                useranswer.innerHTML = j;
                xmlDoc.getElementsByTagName("question")[preguntasSelectMultiple[i]].appendChild(useranswer);
                bandera = 1;
                for (k = 0; k < respuestasSelectMultiple[i].length; k++) {
                    if (j == respuestasSelectMultiple[i][k]) {
                        nota += 1.0 / respuestasSelectMultiple[i].length;
                        darRespuestaHtml(preguntasSelectMultiple[i], "P" + (preguntasSelectMultiple[i] + 1) + " opcion " + (j + 1) + ": correcta");
                        encontrado = true;
                        break;
                    }
                }
                if (!encontrado) {
                    hayFallo = true;
                    nota -= 1.0 / respuestasSelectMultiple[i].length;
                    darRespuestaHtml(preguntasSelectMultiple[i], "P" + (preguntasSelectMultiple[i] + 1) + " opcion " + (j + 1) + ": incorrecta");
                }
            }
        }
        if (hayFallo) {
            if (valorRespuestasSelectMultiple[i].length == 1) {
                darRespuestaHtml(preguntasSelectMultiple[i], "La respuesta correcta es: " + valorRespuestasSelectMultiple[i]);
            } else {
                darRespuestaHtml(preguntasSelectMultiple[i], "Las respuestas correctas son: " + valorRespuestasSelectMultiple[i].join(', '));
            }
        }
        if (bandera == 0) {
            darRespuestaHtml(preguntasSelectMultiple[i], "P" + (preguntasSelectMultiple[i] + 1) + ": No has seleccionado ninguna respuesta");
        }
    }
}

function agregarRespuestas(i, xmlDoc, arrayRespuestas, arrayValoresRespuestas) {
    var respuestasPregunta = [];
    var valorRespuestasPregunta = [];
    for (j = 0; j < xmlDoc.getElementsByTagName("question")[i].getElementsByTagName("answer").length; j++) {
        respuestasPregunta.push(parseInt(xmlDoc.getElementsByTagName("question")[i].getElementsByTagName("answer")[j].innerHTML));
    }
    for (j = 0; j < respuestasPregunta.length; j++) {
        valorRespuestasPregunta.push(xmlDoc.getElementsByTagName("question")[i].getElementsByTagName("option")[respuestasPregunta[j]].innerHTML);
    }
    arrayRespuestas.push(respuestasPregunta);
    arrayValoresRespuestas.push(valorRespuestasPregunta);
}

function agregarRespuestasRadio(i, xmlDoc, arrayRespuestas, arrayValoresRespuestas) {
    arrayRespuestas.push(parseInt(xmlDoc.getElementsByTagName("question")[i].getElementsByTagName("answer")[0].innerHTML));
    arrayValoresRespuestas.push(xmlDoc.getElementsByTagName('question')[i].getElementsByTagName('option')[arrayRespuestas[arrayRespuestas.length - 1]].innerHTML);
}

//**********************************************************************************************
//UTILIDADES
//**********************************************************************************************
function crearDivPregunta(i) {
    var div = document.createElement('div');
    div.id = "pregunta" + i;
    formContainer.appendChild(div);
}

function crearDivCorreccion(i) {
    var div = document.createElement('div');
    div.id = "correccion" + i;
    document.getElementById("resultadosDiv").appendChild(div);
}

function darRespuestaHtml(numPregunta, r) {
    var p = document.createElement("p");
    var node = document.createTextNode(r);
    p.appendChild(node);
    document.getElementById("correccion" + numPregunta).appendChild(p);
}

function presentarNota() {
    var p = document.createElement("p");
    var node = document.createTextNode("Nota: " + nota.toFixed(2) + " punts sobre 10");
    p.appendChild(node);
    document.getElementById("nota").appendChild(p);
    if (nota < 5.0) {
        document.getElementById("nota").style.color = "#333333";
    } else {
        document.getElementById("nota").style.color = "green";
    }
}

function presentarTablaXSL() {
    document.getElementById('tablaResultados').style.display = "block";
    //Código de transformación XSLT con xmlDoc y xslDoc
    if (document.implementation && document.implementation.createDocument) {
        xsltProcessor = new XSLTProcessor();
        xsltProcessor.importStylesheet(xslDoc);
        resultDocument = xsltProcessor.transformToFragment(xmlDoc, document);
        document.getElementById('tablaResultados').appendChild(resultDocument);
    }
    var f = formContainer;
    var e = f.elements;
    for (var i = 0, len = e.length; i < len; ++i) {
        e[i].disabled = true;
    }
}

function divNota() {
    var div = document.createElement('div');
    div.id = "nota";
    document.getElementById("resultadosDiv").appendChild(div);
}

//funcion para hacer que el select multiple se pueda aplicar sin la tecla Ctrl
window.onmousedown = function(e) {
    var el = e.target;
    if (el.tagName.toLowerCase() == 'option' && el.parentNode.hasAttribute('multiple')) {
        e.preventDefault();

        // toggle selection
        if (el.hasAttribute('selected')) el.removeAttribute('selected');
        else el.setAttribute('selected', '');

        // hack to correct buggy behavior
        var select = el.parentNode.cloneNode(true);
        el.parentNode.parentNode.replaceChild(select, el.parentNode);
    }
}

function ocultarDivRespuestas() {
    for (i = 0; i < numeroPreguntas; i++) {
        document.getElementById("correccion" + i).style.display = "none";
    }
}

function comprobar() {
    for (i = 0; i < preguntasText.length; i++) {
        var input = document.getElementById("pregunta" + preguntasText[i]).getElementsByTagName("input")[0];
        if (input.value == "") {
            input.focus();
            alert("Escribe un numero en la pregunta " + preguntasText[i]);
            return false;
        }
    }
    document.getElementById("resultadosDiv").style.display = "block";
    return true;
}