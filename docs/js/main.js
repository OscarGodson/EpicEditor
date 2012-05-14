$(function () {
  var zipUrl = 'docs/downloads/EpicEditor-v' + EpicEditor.version + '.zip';
  
  $('#wrapper').before('<div id="toc"><h2><a href="#">EpicEditor</a></h2><ul id="toc-list"></ul></div>');
  $($('h1')[0]).append('<span>beta ' + EpicEditor.version + '</span>');
  $($('h1')[0]).after('<div id="download"><a href="' + zipUrl + '">Download the .zip</a></div>');
  $($('h3')[0]).next().html('<a href="' + zipUrl + '">Download the .zip</a> or clone the repo:');
  $($('h2')[3]).before('<button id="try-it">Try it!</button><div id="epiceditor"></div>');
  $($('h2')[2]).before('<div id="example-1"></div>');
  $('tr:even').addClass('even');
  
  var opts = {
      container: 'example-1'
    , file:{
        defaultContent:"#EpicEditor\nThis is some default content. Go ahead, _change me_. "
      }
      , focusOnLoad:true
      }
    , editor = new EpicEditor(opts).load()
    , example = new EpicEditor()
    , tryItStatus = false
    , tryItBtn = document.getElementById('try-it');
    
  // So people can play with it in their console
  window.editor = editor;
  
  tryItBtn.onclick = function () {
    if(!tryItStatus){
      tryItStatus = true;
      tryItBtn.innerHTML = 'Undo';
      example.load();
    }
    else {
      tryItStatus = false;
      tryItBtn.innerHTML = 'Try it again';
      example.unload();
    }
  }

  $('pre').addClass('prettyprint')
  prettyPrint()

  $("h2, h3").each(function (idx, val) {
    var h = $(this)
      , title = h.text()
      , link = title.toLowerCase().replace(/(\,|\(|\)|\[|\]|\:|\.)/g, '').replace(/\s/g, '-')

    if (idx > 1) {
      h.attr("id", link);
      h.html('<a href="#' + link + '">' + title + '</a>');
      $("#toc-list").append('<li class="toc-' + this.nodeName.toLowerCase() + '"><a id="" href="#' + link + '">' + title + '</a></li>');
    }
  });
  
  $(['OscarGodson', 'johnmdonahue', 'adam_bickford', 'sebnitu']).each(function (idx, val) {
    var twimg = 'http://twitter.com/api/users/profile_image?screen_name=' + val
      , twlink = 'http://twitter.com/' + val
      
    $('#avatars').append('<a href="' + twlink + '"><img class="avatar" src="' + twimg + '">')
  })
  
  $(window).resize(function () {
    $('#toc').height(window.innerHeight + 'px');
  }).trigger('resize');
});
