/*global $:false, prettyPrint:false */

$(function () {
  var zipUrl = 'docs/downloads/EpicEditor-v' + EpicEditor.version + '.zip';
  
  // TODO: Now that we have automatic ID creation, use element IDs instead of counting DOM elements
  $('#wrapper').before('<div id="toc"><h2><a href="#">EpicEditor</a></h2><ul id="toc-list"></ul></div>');
  
  $("h2, h3").each(function (idx, val) {
    var h = $(this)
      , title = h.text()
      , link = title.toLowerCase().replace(/(\,|\(|\)|\[|\]|\:|\.)/g, '').replace(/\s/g, '-')

    // The first h2 is always the EpicEditor TOC header injected above
    // Give them all IDs so there's something to hook into
    if (idx > 0) {
      h.attr("id", link);
    }
    if (idx > 1) {
      h.html('<a href="#' + link + '">' + title + '</a>');
      $("#toc-list").append('<li class="toc-' + this.nodeName.toLowerCase() + '"><a id="" href="#' + link + '">' + title + '</a></li>');
    }
  });

  $('#wrapper h1').append('<span>beta ' + EpicEditor.version + '</span>');
  $('#why').before('<h2 id="download">Download</h2><p class="btn"><a class="zip" href="' + zipUrl + '">EpicEditor v' + EpicEditor.version + '</a></p>')
  $('#quick-start').before('<p class="btn btn-small"><a id="try-it">Try it!</a></p><div id="epiceditor"></div>');
  $('#an-embeddable-javascript-markdown-editor + p').after('<div class="epiceditors" id="example-1"></div>');
  $('#step-1-download + p').html('<a href="#download">Download the latest release (' + EpicEditor.version + ')</a> or clone the repo:');
  $('tr:even').addClass('even');
 
  var opts =
      { container: 'example-1'
      , file: { defaultContent: "#EpicEditor\nThis is some default content. Go ahead, _change me_. " }
      , focusOnLoad: true
      , autogrow: {
          minHeight: 350
        }
      }
    , editor = new EpicEditor(opts).load()
    , example = new EpicEditor()
    , tryItStatus = false
    , tryItBtn = document.getElementById('try-it');
    
  // So people can play with it in their console
  window.editor = editor;
  window.example = example;
  
  tryItBtn.onclick = function () {
    if (!tryItStatus) {
      tryItStatus = true;
      tryItBtn.innerHTML = 'Unload';
      $('#epiceditor').addClass('epiceditors')
      example.load();
    }
    else {
      tryItStatus = false;
      tryItBtn.innerHTML = 'Try it!';
      $('#epiceditor').removeClass('epiceditors')
      example.unload();
      $('#epiceditor').height('auto');
    }
  }

  $('pre').addClass('prettyprint')
  prettyPrint()

  $(['OscarGodson', 'johnmdonahue', 'adam_bickford', 'sebnitu']).each(function (idx, val) {
    var twimg = 'http://twitter.com/api/users/profile_image?screen_name=' + val
      , twlink = 'http://twitter.com/' + val
      
    $('#avatars').append('<a href="' + twlink + '"><img class="avatar" src="' + twimg + '">')
  })
  
  $(window).resize(function () {
    $('#toc').height(window.innerHeight + 'px');
  }).trigger('resize');
});
