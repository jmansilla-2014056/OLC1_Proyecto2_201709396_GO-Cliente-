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

$(".analizarbutton").click(function () {
    $.post( "http://localhost:3000/input", { llave : document.getElementById(idGlobal).value}, function( data ) {
        alert(data.mensaje);
        console.log(data.mensaje);
    }, "json");

});




/*$(".addbutton").click(function(){
  $(".nav-tabs").append('<li><a href="#tab4" data-toggle="tab">Section 4</a></li>');
  $(".tab-content").append('<div class="tab-pane" id="tab4"><p>Im in Section 4.</p></div>')

})
*/