// ==========================================================================
// Project:   Alfresco.sitesController
// Copyright: ©2011 My Company, Inc.
// ==========================================================================
/*globals Alfresco, localStorage */

/** @class

  (Document Your Controller Here)

  @extends SC.Object
*/
Alfresco.sitesController = SC.ArrayController.create(
/** @scope Alfresco.sitesController.prototype */ {

  content: [],
  allowsMultipleSelection: NO,
  rootSiteUUID: null,
  
  rootSiteUUIDSetup: function() {
    var authCookie = localStorage.getItem('loggedInTicket');
    var self = this;
    var request = '/alfresco/service/sproutcore/search?alf_ticket=' + authCookie; 

      
    if (SC.buildMode === 'debug') { 
      SC.Request.getUrl(request)
        .set('isJSON', YES)
        .notify(this, this._didFetchRootUUID)
        .send();
    } else {
      $.getJSON(Alfresco.server + request + '&alf_callback=?', null,
        function(data, textStatus, xhr) { 
          SC.run(function() { 
            var response = SC.Response.create({ request: null, body: data, status: textStatus }); 
            self._didFetchRootUUID(response);
          });
        }
      );
    } // END: buildMode
  },
  
  _didFetchRootUUID: function(response, params) {
    if (SC.$ok(response)) {
      var records = response.get('body').nodes;
      for (var idx in records) {
        if (records[idx].name == 'Sites') {
          this.set('rootSiteUUID', records[idx].uuid);
        }
      }
    } else {
      SC.AlertPane.error("Could not load sites", "Your internet connection may be unavailable or our servers may be down. Try again in a few minutes.");
    }
  },
  
  rootSiteUUIDDidChange: function() {
    var files = Alfresco.store.find(Alfresco.SITE_FILES);
    this.set('content', files);
  }.observes('rootSiteUUID')
  
  /*
  notificationsUUIDDidChange: function() {    
    //var notifications = Alfresco.fixtureStore.find(Alfresco.Notification);
    var notifications = Alfresco.store.find(Alfresco.NOTIFICATIONS);
    Alfresco.notificationsController.set('content', notifications);
  }.observes('notificationsUUID'),*/
  
}) ;
