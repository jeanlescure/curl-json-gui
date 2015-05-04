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
      $('#result pre').append(this.result);
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