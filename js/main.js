var gui = require('nw.gui');
var win = gui.Window.get();
var fs = require('fs');

$(function(){
  $('body').on('change', '#jsonFile', function(ev){
    handleFileSelect(this);
    $('.import.json.modal').modal('hide');
  });
  
  $('.bottom.sidebar')
    .sidebar('setting', 'transition', 'push')
    .sidebar('setting', 'onShow', function(){
      $('.bottom.sidebar .opener .icon').removeClass('up');
      $('.bottom.sidebar .opener .icon').addClass('down');
    }).sidebar('setting', 'onHidden', function(){
      $('.bottom.sidebar .opener .icon').removeClass('down');
      $('.bottom.sidebar .opener .icon').addClass('up');
    });
    
  $('.bottom.sidebar .opener').click(function(ev){
    ev.preventDefault();
    
    $('.bottom.sidebar').sidebar('toggle');
  });
  
  $('#sendButton').click(function(ev){
    ev.preventDefault();
    
    write_json($('form#result').serializeObject(), 'data.json');
  });
  
  $('.export.json').click(function(ev){
    ev.preventDefault();
    
    save_json($('form#result').serializeObject(), 'user_data.json');
  });
  
  $('.tabular.menu .item').tab();
  
  $('.import.json.modal')
    .modal('attach events', '.import.json.shower', 'show')
    .modal('setting', 'onShow', function(){
      $('#jsonFile').remove();
      $('#jsonFileHolder').append('<input id="jsonFile" type="file" />');
    });
  
  $('body').on('focus', '#result .input > input', function(ev) {
    $(this).parent().addClass('fluid');
  });
  $('body').on('blur', '#result .input > input', function(ev) {
    $(this).parent().removeClass('fluid');
  });
  
  $('.empty.json').click(function(){
    reset_result();
  });
  
  $('.error.modal').modal();
  
  reset_result();
});

function reset_result(){
  $('#result').html('(Click on "Import JSON" or "Input JSON Manually" to begin visualizing your data.)');
  $('#result').removeClass('resolved');
}

function inputs_from_result(obj, val, max_depth, depth, original, parent){
  if (typeof max_depth === 'undefined') var max_depth = 2;
  
  if (typeof depth === 'undefined'){
    var depth = 0;
  }else{
    depth += 1;
  }

  if (typeof original === 'undefined'){ 
    var original = obj;
    var original_skip = true;
  }

  var objKeys = Object.keys( obj ).filter(function( key ) {
    return ( Object.prototype.toString.call(obj[key]) === '[object Object]' );
  });
  
  var result_vals = [];
  
  var result_keys = Object.keys( obj ).filter(function( key ) {
    var fit = ( Object.prototype.toString.call(obj[key]) !== '[object Object]' );
    
    if (fit) result_vals.push(obj[key]);
    
    return fit;
  });
  
  var has_parent = typeof parent !== 'undefined';
  
  var result = '<div class="ui inverted segment">';
  
  for (var idx in result_keys){
    if ( has_parent ){
      result_keys[idx] = "[" + result_keys[idx] + "]";
      result_keys[idx] = parent + result_keys[idx];
    }
    result = result + '<div class="result-input-holder"><div class="ui inverted labeled input"><div class="ui label">' + result_keys[idx] + ': </div><input type="text" name="' + result_keys[idx] + '" value="' + result_vals[idx] + '" /></div></div>'
  }
  
  for ( var idx in objKeys ){
    var key = objKeys[idx];
    var parent_key = key;
    if ( has_parent ){
      parent_key = "[" + key + "]";
      parent_key = parent + parent_key;
    }
    
    if ( (obj != original || typeof original_skip !== 'undefined') && depth < max_depth ) 
      result = result + '<h4 class="ui inverted dividing header">' + parent_key + '</h4>' + inputs_from_result(obj[key], val, max_depth, depth, original, parent_key);
  }
  
  return result + '</div>';
}

function handleFileSelect(input){
  if (!window.File || !window.FileReader || !window.FileList || !window.Blob) {
    alert('The File APIs are not fully supported in this browser.');
    return;
  }   
  
  if (!input) {
    alert("Um, couldn't find the jsonFile element.");
  }
  else if (!input.files) {
    alert("This browser doesn't seem to support the `files` property of file inputs.");
  }
  else if (!input.files[0]) {
    alert("Please select a file before clicking 'Load'");               
  }
  else {
    file = input.files[0];
    fr = new FileReader();
    fr.onload = function(){
      $('#result').html(inputs_from_result(JSON.parse(this.result)));
      $('#result').addClass('resolved');
    };
    //fr.readAsText(file);
    fr.readAsText(file);
  }
}

function write_json(json, filename){
  fs.writeFile(filename, JSON.stringify(json), function (err) {
    if (err) throw err;
    console.log('It\'s saved!');
  });
}

function save_json(json, filename){
  var dl = new Downloader();
  
  if ($('#result').is('.resolved')){
    dl.save(JSON.stringify(json), filename, 'application/json');
  }else{
    $('.error.modal .header').html('No data!');
    $('.error.modal .description').html('<p>Currently there\'s no data available to export.</p><p>Import or input manually some JSON data before exporting.</p>');
    $('.error.modal').modal('show');
  }
}

var Downloader = function(){
    function click(node) {
        var ev = document.createEvent("MouseEvents");
        ev.initMouseEvent("click", true, false, self, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
        return node.dispatchEvent(ev);
    };
    
    function encode(data, contentType) {
        var blob = b64toBlob(btoa(data), contentType);
        return blob;
    };
    
    function link(data, name){
        var a = document.createElement('a');
        a.href = window.URL.createObjectURL(data);
        a.download = name;
        return a;
    };
    
    this.save = function(data, name, contentType){
        click(
            link(
                encode( data, contentType ),
                name
            )
        )
    };
};


function b64toBlob(b64Data, contentType, sliceSize) {
    contentType = contentType || '';
    sliceSize = sliceSize || 512;

    var byteCharacters = atob(b64Data);
    var byteArrays = [];

    for (var offset = 0; offset < byteCharacters.length; offset += sliceSize) {
        var slice = byteCharacters.slice(offset, offset + sliceSize);

        var byteNumbers = new Array(slice.length);
        for (var i = 0; i < slice.length; i++) {
            byteNumbers[i] = slice.charCodeAt(i);
        }

        var byteArray = new Uint8Array(byteNumbers);

        byteArrays.push(byteArray);
    }

    var blob = new Blob(byteArrays, {type: contentType});
    return blob;
}

/*
var fs = require('fs');
fs.readdir('.', function(err, files){
  console.log(files);
});
*/

/*
curl = require('ex-curl');

options = ['https://www.google.com']

curl.open(options, function(code){
  if (code == 0){ // 0 is success
    // what you want
    console.log(this);
  }else{
    console.log(this['error'].toString());
  }
});
*/