(function (foounit){

  // Set __dirname if it doesn't exist (like in the browser)
  __dirname = typeof __dirname !== 'undefined' ?
                __dirname : foounit.browser.dirname(/suite.js$/);
  
  // Change this to be a reference to your primary source directory
  foounit.mount('src',  __dirname + '/../');
  foounit.mount('spec', __dirname);

  foounit.browser.setLoaderStrategy(new foounit.browser.XhrLoaderStrategy());
  foounit.getSuite().addFile('spec');
  foounit.getSuite().run();
})(foounit);
