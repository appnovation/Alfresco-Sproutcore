// ==========================================================================
// Project:   Alfresco.filesController
// Copyright: ©2011 My Company, Inc.
// ==========================================================================
/*globals Alfresco, localStorage */

/** @class

  (Document Your Controller Here)

  @extends SC.Object
*/
Alfresco.filesController = SC.ArrayController.create(
/** @scope Alfresco.filesController.prototype */ {
  orderBy: "type",
  showButton: NO,
  lastUUID: null,
  currentFile: null,
  allowsMultipleSelection: NO,
  fileTrail: [],
  
  rebuildFiles: function(uuid) {
    //var authCookie = SC.Cookie.find('loggedInTicket');
    var authCookie = localStorage.getItem('loggedInTicket');
    var self = this;
    var request = '/alfresco/service/sproutcore/search?alf_ticket=' + authCookie + '&uuid=' + uuid;
      
    if (SC.buildMode === 'debug') { 
      SC.Request.getUrl(request)
        .set('isJSON', YES)
        .notify(this, this._didRebuildFiles)
        .send();
    } else {
      $.getJSON(Alfresco.server + request + '&alf_callback=?', null,
        function(data, textStatus, xhr) { 
          SC.run(function() { 
            var response = SC.Response.create({ request: null, body: data, status: textStatus }); 
            self._didRebuildFiles(response);
          });
        }
      );
    }
  },
  
  rebuildSubscriptions: function() {
    var subs = Alfresco.configArrayController.get('content');
    var subsQuery = [];
    subs = subs.toArray();

    var idx = 0;
    
    for (s in subs) {
      if (!isNaN(s) && (subs[s].get("isSubscribed") === true)) {
        subsQuery[idx] = subs[s].get("name");
        idx++;
      }
    }
    
    Alfresco.sitesController.selectObjects(null);
    Alfresco.siteController.set('content', null);
    
    var tagsList = subsQuery.join('|');
    var authCookie = localStorage.getItem('loggedInTicket');
    var self = this;
    var request = '/alfresco/service/sc/nodes/workspace/SpacesStore?tags='+ tagsList +'&alf_ticket=' + authCookie;
    
    if (SC.buildMode === 'debug') { 
      SC.Request.getUrl(request)
        .set('isJSON', YES)
        .notify(this, this._didRebuildFiles)
        .send();
    } else {
      $.getJSON(Alfresco.server + request + '&alf_callback=?', null,
        function(data, textStatus, xhr) { 
          SC.run(function() { 
            var response = SC.Response.create({ request: null, body: data, status: textStatus }); 
            self._didRebuildFiles(response);
          });
        }
      );
    }
  },
  
  goBack: function() {
    var trail = this.get('fileTrail');
    var uuid = trail.pop();
    
    this.set('lastUUID', uuid);
    
    if (uuid) {        
      if (trail.length === 0) {
        this.set('showButton', NO);
        trail.push(uuid); // Add it back, we always want the site root on here
        this.set('lastUUID', null); // Make sure it won't get readded
      }
      this.rebuildFiles(uuid);
    }
  },
  
  _didRebuildFiles: function(response, params) {
    if (SC.$ok(response)) {   
      var records = response.get('body').nodes;
      this.set('content', records);
    } else {
      SC.AlertPane.error("Could not load files", "Your internet connection may be unavailable or our servers may be down. Try again in a few minutes.");
    }
  },
  
  selectionDidChange: function() {
    if (this.hasSelection()) {
      // I feel like I'm violating SC's way of doing things here
      var selected = this.get('selection').get('firstObject');
      if (selected.type == 'folder') {        
        var last = this.get('lastUUID');
        if (last) {
          this.get('fileTrail').push(this.get('lastUUID'));
        }
        this.set('lastUUID', selected.uuid);
        this.set('showButton', YES);        
        this.rebuildFiles(selected.uuid);
      }
    }
  }.observes('selection')

}) ;
