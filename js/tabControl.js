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


let jsonData = [];
let errorData = [
    { error: 'China',         linea: 1379510000, columna: 1},
    { error: 'India',         linea: 1330780000, columna: 2},
    { error: 'United States', linea:  324788000, columna: 3},
    { error: 'Indonesia',     linea:  260581000, columna: 4},
    { error: 'Brazil',        linea:  206855000, columna: 5},
];


$(".analizarbutton").click(function () {
    $.post( "http://localhost:3000/input", { llave : document.getElementById(idGlobal).value}, function( data ) {

        errorData = [];
        document.getElementById("table").innerHTML = '<table id="table" class="table"></table>'
        updateTable();

        $('#jstree-tree').jstree("destroy");
        jsonData = data.tree;
        //console.log(data.tree);
    }, "json");

});

function load_tree()
{

    $('#jstree-tree')
        .on('changed.jstree', function (e, data) {
            var objNode = data.instance.get_node(data.selected);
            $('#jstree-result').html('Selected: <br/><strong>' + objNode.id+'-'+objNode.text+'</strong>');
        })
        .jstree({
            core: {
                data: jsonData
            }
        });
}

function load_errors(){
    errorData = [
        { error: 'China',         linea: 1379510000, columna: 1},
        { error: 'India',         linea: 1330780000, columna: 2},
    ];
    document.getElementById("table").innerHTML = '<table id="table" class="table"></table>'
    updateTable();
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

dom.$data.val(JSON.stringify(errorData));
json2table(errorData, dom.$table);

dom.$data.on('input', function () {
    json2table(JSON.parse(dom.$data.val()), dom.$table);
});

function updateTable() {
    dom.$data.val(JSON.stringify(errorData));
    json2table(errorData, dom.$table);

    dom.$data.on('input', function () {
        json2table(JSON.parse(dom.$data.val()), dom.$table);
    });
}


/*$(".addbutton").click(function(){
  $(".nav-tabs").append('<li><a href="#tab4" data-toggle="tab">Section 4</a></li>');
  $(".tab-content").append('<div class="tab-pane" id="tab4"><p>Im in Section 4.</p></div>')

})
*/