// ==========================================================================
// Project:   Alfresco
// Copyright: ©2011 My Company, Inc.
// ==========================================================================
/*globals Alfresco, localStorage */

/** @namespace

  My cool new app.  Describe your application.
  
  @extends SC.Object
*/
Alfresco = SC.Application.create(
  /** @scope Alfresco.prototype */ {

  NAMESPACE: 'Alfresco',
  VERSION: '0.1.0',

  // This is your application store.  You will use this store to access all
  // of your model data.  You can also set a data source on this store to
  // connect to a backend server.  The default setup below connects the store
  // to any fixtures you define.
  store: SC.Store.create({ 
    commitRecordsAutomatically: YES
  }).from('Alfresco.DataSource'),
  
  fixtureStore: SC.Store.create().from(SC.Record.fixtures),
  
  videoTypes: ['video/m4v', 'video/mp4', 'video/3gp', 'm4v', 'mp4', '3gp'],
  imageTypes: ['image/png', 'image/jpg', 'png', 'jpg'],
  
  server: 'http://10.10.1.145:8081',
  authedServer: 'http://|*|username|*|:|*|password|*|@10.10.1.145:8081',
  returnAuthedServer: function() {
    var string = Alfresco.authedServer;
    string = string.replace('|*|username|*|', localStorage.getItem('loggedInUser'));
    string = string.replace('|*|password|*|', localStorage.getItem('loggedInPassword'));
    
    return string;
  }
  //authedServer: 'http://' + localStorage.getItem('loggedInUser') + '@' + localStorage.getItem('loggedInPassword') + '10.10.1.145:8081'
  
  //server: 'http://david-w7j.appnovation.net:8080'
  
}) ;

