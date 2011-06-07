// ==========================================================================
// Project:   Alfresco
// Copyright: ©2011 My Company, Inc.
// ==========================================================================
/*globals Alfresco, localStorage */

// This is the function that will start your app running.  The default
// implementation will load any fixtures you have created then instantiate
// your controllers and awake the elements on your page.
//
// As you develop your application you will probably want to override this.
// See comments for some pointers on what to do next.
//
Alfresco.main = function main() {
  //var authCookie = SC.Cookie.find('loggedInTicket');
  var authCookie = localStorage.getItem('loggedInTicket');
  
  sc_require('models/site');
  Alfresco.SITE_FILES = SC.Query.local(Alfresco.Site);
  
  sc_require('models/file');
  Alfresco.FILE_CONTENTS = SC.Query.remote(Alfresco.File);
  
  sc_require('models/tags');
  Alfresco.TAGS = SC.Query.local(Alfresco.Tags);
  
  sc_require('models/notification');
  Alfresco.NOTIFICATIONS = SC.Query.remote(Alfresco.Notification);
  
  //initialize states
  Alfresco.statechart.initStatechart();
  
  //add routing
  SC.routes.add(':pageName/:paneName', Alfresco.routes, 'gotoRoute');
  
  //start on loginPane
  if (authCookie === null) {
    Alfresco.getPath('loginPage.loginPane').append();
    Alfresco.animationController.start();
  }
  else {
    Alfresco.statechart.gotoState('loggedIn');
  }

  // Step 1: Instantiate Your Views
  // The default code here will make the mainPane for your application visible
  // on screen.  If you app gets any level of complexity, you will probably 
  // create multiple pages and panes.
  
  //Alfresco.getPath('mainPage.mainPane').append() ;

  // Step 2. Set the content property on your primary controller.
  // This will make your app come alive!'


  // TODO: Set the content property on your primary controller
  // ex: Alfresco.contactsController.set('content',Alfresco.contacts);
//  Alfresco.sitesController.rootSiteUUIDSetup();

} ;

function main() { Alfresco.main(); }
