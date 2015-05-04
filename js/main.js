var gui = require('nw.gui');
var win = gui.Window.get();

$(function(){
  $('#jsonFile').change(function(ev){
    handleFileSelect(this);
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
});

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
      result = result + '<h4 class="ui dividing header">' + parent_key + '</h4>' + inputs_from_result(obj[key], val, max_depth, depth, original, parent_key);
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
      $('#result').append(inputs_from_result(JSON.parse(this.result)));
    };
    //fr.readAsText(file);
    fr.readAsText(file);
  }
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