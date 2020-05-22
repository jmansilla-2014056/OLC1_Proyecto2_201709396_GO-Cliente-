$('[data-toggle=tab]').click(function(){
    if ($(this).parent().hasClass('active')){
        $($(this).attr("href")).toggleClass('active');
    }
});

let tabCount = 1;
const labelName = "Codigo";
$(".addbutton").click(function(){
    $(".nav-tabs").append('<li><a '+
        'href="#tab' + tabCount +'"' +
        'id="codigo' + tabCount + '"' +
        'onClick="reply_click(this.id)"'+
        'data-toggle="tab">' + labelName + tabCount+ '</a></li>');
    $(".tab-content").append('<div class="tab-pane" id="tab' + tabCount + '"' +
        '><textarea '+'id=texto'+ tabCount+'>Im in Section '+ tabCount +'</textarea></div>');
    tabCount++;

});

$(".savebutton").click(function () {
    const content = document.getElementById(idGlobal).value;
    const blob = new Blob([content], {type: "text/plain;charset=utf-8"});
    saveAs(blob,idGlobal+".txt");
});

var idGlobal = "texto0";
function reply_click(clicked_id)
{
    idGlobal = clicked_id;
    idGlobal = idGlobal.replace("codigo","texto")
}

function load_file(){
    const file = document.getElementById("file").files[0];
    const fileReader = new FileReader();
    fileReader.onload = function (fileLoadEvent) {
        document.getElementById(idGlobal).value = fileLoadEvent.target.result;
    };
    fileReader.readAsText(file, "UTF-8")
}

//GLOBALES
let astData = [];
let globalTable = [{descripcion:"",lexema:"",linea:null, columna:null}];

//INDIVIDUALES
let tableError1 = [];
let tableError2 = [];

let ast1 = [];
let ast2 = [];

let tableClases = [];


$(".analizarbutton").click(function () {
    var comparador = document.getElementById("code").value

    $.post( "http://localhost:3000/input", { llave1 : document.getElementById(idGlobal).value,  llave2 : document.getElementById(comparador).value }, function( data ) {

        globalTable = [{descripcion:"",lexema:"",linea:null, columna:null}];
        document.getElementById("table").innerHTML = '<table id="table" class="table"></table>'
        updateTable();

        $('#jstree-tree').jstree("destroy");

        ast1 = JSON.parse(data.tree1);
        ast2 = JSON.parse(data.tree2);

        tableError1 = JSON.parse(data.errores1);
        tableError2 = JSON.parse(data.errores2);

        tableClases = JSON.parse(data.clases);

    }, "json");

});

function load_tree1() {
    $('#jstree-tree').jstree("destroy");
    astData = ast1;
    load_tree();
}

function load_tree2() {
    $('#jstree-tree').jstree("destroy");
    astData = ast2;
    load_tree();
}

function load_errors1(){
    globalTable = tableError1;
    document.getElementById("table").innerHTML = '<table id="table" class="table"></table>'
    updateTable();
}

function load_errors2(){
    globalTable = tableError2;
    document.getElementById("table").innerHTML = '<table id="table" class="table"></table>'
    updateTable();
}

function load_reportC() {
        globalTable = tableClases;
        document.getElementById("table").innerHTML = '<table id="table" class="table"></table>'
    updateTable();
}


function load_tree()
{
    $('#jstree-tree')
        .on('changed.jstree', function (e, data) {
            var objNode = data.instance.get_node(data.selected);
            $('#jstree-result').html('Selected: <br/><strong>' + objNode.id+'-'+objNode.text+'</strong>');
        })
        .jstree({
            core: {
                data: astData
            }
        });
}


var dom = {
    $data: $('#data'),
    $table: $('#table'),
};

function json2table(json, $table) {
    var cols = Object.keys(json[0]);

    var headerRow = '';
    var bodyRows = '';

    function capitalizeFirstLetter(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }

    $table.html('<thead><tr></tr></thead><tbody></tbody>');

    cols.map(function(col) {
        headerRow += '<th>' + capitalizeFirstLetter(col) + '</th>';
    });

    json.map(function(row) {
        bodyRows += '<tr>';

        cols.map(function(colName) {
            bodyRows += '<td>' + row[colName] + '</td>';
        })

        bodyRows += '</tr>';
    });

    $table.find('thead tr').append(headerRow);
    $table.find('tbody').append(bodyRows);
}

dom.$data.val(JSON.stringify(globalTable));
json2table(globalTable, dom.$table);

dom.$data.on('input', function () {
    json2table(JSON.parse(dom.$data.val()), dom.$table);
});

function updateTable() {
    dom.$data.val(JSON.stringify(globalTable));
    json2table(globalTable, dom.$table);

    dom.$data.on('input', function () {
        json2table(JSON.parse(dom.$data.val()), dom.$table);
    });
}


/*$(".addbutton").click(function(){
  $(".nav-tabs").append('<li><a href="#tab4" data-toggle="tab">Section 4</a></li>');
  $(".tab-content").append('<div class="tab-pane" id="tab4"><p>Im in Section 4.</p></div>')

})
*/