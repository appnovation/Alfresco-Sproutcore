// ==========================================================================
// Project:   Alfresco.DataSource
// Copyright: ©2009 My Company, Inc.
// ==========================================================================
/*globals Alfresco, localStorage */

Alfresco.DataSource = SC.DataSource.extend({
  
  fetch: function(store, query) {
    var authCookie = localStorage.getItem('loggedInTicket');
    var self = this;
    var request = '';
    
    if (query === Alfresco.SITE_FILES) {
      request = '/alfresco/service/sproutcore/search?uuid=' + Alfresco.sitesController.get('rootSiteUUID') + '&alf_ticket=' + authCookie;
      
      if (SC.buildMode === 'debug') { 
        SC.Request.getUrl(request)
          .set('isJSON', YES)
          .notify(this, this._didFetchSiteFiles, { query: query, store: store })
          .send();
      } else {
        $.getJSON(Alfresco.server + request + '&alf_callback=?', null,
          function(data, textStatus, xhr) { 
            SC.run(function() {
              console.log(data);
              var response = SC.Response.create({ request: null, body: data, status: textStatus }); 
              self._didFetchSiteFiles(response, { query: query, store: store });
            });
          }
        );
      } // END: buildMode
    }
    else if (query === Alfresco.FILE_CONTENTS) {
      request = '/alfresco/service/sproutcore/search?uuid=' + Alfresco.siteController.content.get('uuid') + '&alf_ticket=' + authCookie;

      if (SC.buildMode === 'debug') { 
        SC.Request.getUrl(request)
          .set('isJSON', YES)
          .notify(this, this._didFetchFiles, { query: query, store: store })
          .send();
      } else {
        $.getJSON(Alfresco.server + request + '&alf_callback=?', null,
          function(data, textStatus, xhr) { 
            SC.run(function() { 
              var response = SC.Response.create({ request: null, body: data, status: textStatus }); 
              self._didFetchFiles(response, { query: query, store: store });
            });
          }
        );
      } // END: buildMode
    }
    else if (query === Alfresco.TAGS) {
      request = '/alfresco/service/api/tags/workspace/SpacesStore?alf_ticket=' + authCookie;
      if (SC.buildMode === 'debug') { 
        SC.Request.getUrl(request)
          .notify(this, this._didFetchTags, { query: query, store: store })
          .send();
      } else {
        $.get(Alfresco.server + request + '&alf_callback=?', null,
          function(data, textStatus, xhr) { 
            SC.run(function() { 
              var response = SC.Response.create({ request: null, body: data, status: textStatus }); 
              self._didFetchTags(response, { query: query, store: store });
            });
          }
        );
      } // END: buildMode
    }
    else if (query === Alfresco.SUBS) {
      request = '/config/admin';
      if (SC.buildMode === 'debug') { 
        SC.Request.getUrl(request)
          .set('isJSON', YES)
          .notify(this, this._didFetchConfig, { query: query, store: store })
          .send();
      } else {
        $.getJSON(Alfresco.server + request + '&alf_callback=?', null,
          function(data, textStatus, xhr) { 
            SC.run(function() { 
              var response = SC.Response.create({ request: null, body: data, status: textStatus }); 
              self._didFetchConfig(response, { query: query, store: store });
            });
          }
        );
      } // END: buildMode 
    }
    else if (query === Alfresco.NOTIFICATIONS) {
      request = '/alfresco/service/notification?username=admin&alf_ticket=' + authCookie;
      if (SC.buildMode === 'debug') { 
        SC.Request.getUrl(request)
          .set('isJSON', YES)
          .notify(this, this._didFetchNotificationFile, { query: query, store: store })
          .send();
      } else {
        $.getJSON(Alfresco.server + request + '&alf_callback=?', null,
          function(data, textStatus, xhr) { 
            SC.run(function() { 
              var response = SC.Response.create({ request: null, body: data, status: textStatus }); 
              self._didFetchNotificationFile(response, { query: query, store: store });
            });
          }
        );
      } // END: buildMode
    }
    
    return YES;
  },
  
  updateRecord: function(store, storeKey) {
    var request;
    var self = this;
    var authCookie = localStorage.getItem('loggedInTicket');
    var userCookie = localStorage.getItem('loggedInUser');
    
    if (SC.kindOf(store.recordTypeFor(storeKey), Alfresco.Tags)) {
      var output = '';
      var temp = Alfresco.configArrayController.get('content').toArray();
      var i;
     
      
      for (i in temp) {
        if (!isNaN(i)) {
          if (temp[i].get('isSubscribed')) {
            output += temp[i].get('name');
            if (i != (temp.get('length') - 1)) output += ',';
          }
        }
      }
      
      request = '/alfresco/service/setusertags?username='+ userCookie +'&tags='+ output + '&alf_ticket='+authCookie;
      
      if (SC.buildMode === 'debug') {
        SC.Request.putUrl(request)
          .header({'Accept': 'application/json'})
          .json()
          .notify(this, this.didUpdateTask, store, storeKey)
          .send(store.readDataHash(storeKey));
      } else {
        $.ajax({
           type: "PUT",
           url: Alfresco.server + request,
           data: store.readDataHash(storeKey),
           success: function(data, textStatus, xhr) {
             SC.run(function() { 
               var response = SC.Response.create({ request: null, body: data, status: textStatus }); 
               self.didUpdateTask(response, store, storeKey);
             });
           }
         });
      }
    }
    else if (SC.kindOf(store.recordTypeFor(storeKey), Alfresco.Notification)) {
      request = '/alfresco/service/resetnotification?username=admin&alf_ticket=' + authCookie;
      
      if (SC.buildMode === 'debug') {
        SC.Request.getUrl(request)
          .header({'Accept': 'application/json'})
          .json()
          .notify(this, this.didUpdateNotification, store, storeKey)
          .send(store.readDataHash(storeKey));
      } else {
        $.ajax({
           type: "GET",
           url: Alfresco.returnAuthedServer() + request,
           data: store.readDataHash(storeKey),
           success: function(data, textStatus, xhr) {
             SC.run(function() { 
               var response = SC.Response.create({ request: null, body: data, status: textStatus }); 
               self.didUpdateNotification(response, store, storeKey);
             });
           }
         });
      }
    }
  },
  
  didUpdateNotification: function(response, store, storeKey) {
    if (SC.ok(response)) {
      
      store.dataSourceDidComplete(storeKey) ;
      
      store.destroyRecord('', '', storeKey);
      
    } else store.dataSourceDidError(storeKey); 
  },
  
  didUpdateTask: function(response, store, storeKey) {
    if (SC.ok(response)) {
      store.dataSourceDidComplete(storeKey) ;
      
    } else store.dataSourceDidError(storeKey); 
  },
    
  _didFetchFiles: function(response, params) {
    var store = params.store;
    var query = params.query;
    
    if (SC.$ok(response)) {      
      var records = response.get('body').nodes;
      
      store.loadRecords(Alfresco.File, records);
          
      // notify store that we handled the fetch
      store.dataSourceDidFetchQuery(query);

    // handle error case
    } else store.dataSourceDidErrorQuery(query, response);
  },
  
  _didFetchSiteFiles: function(response, params) {
    var store = params.store;
    var query = params.query;
    
    if (SC.$ok(response)) {      
      var records = response.get('body').nodes;
      
      var toRemove = [];
      var removed  = 0;
      
      for (var i in records) {
        if (!isNaN(i) && records[i] && records[i].uuid && records[i].type === 'file') {
          toRemove.push(i);
        }
      }
      
      for (var j in toRemove) {
        if (!isNaN(j)) {
          console.log('Removing element: ' + (j - removed));
          records.splice(j - removed, 1);
          removed++;
        }
      }
      
      store.loadRecords(Alfresco.Site, records);
          
      // notify store that we handled the fetch
      store.dataSourceDidFetchQuery(query);

    // handle error case
    } else store.dataSourceDidErrorQuery(query, response);
  },
  
  _didFetchTags: function(response, params) {
    var store = params.store;
    var query = params.query;
    if (SC.$ok(response)) {
      var authCookie = localStorage.getItem('loggedInTicket');
      var userCookie = localStorage.getItem('loggedInUser');
      var records = response.get('body');
      records = records.replace("[", "");
      records = records.replace("]", "");
      records = records.replace("?", "");
      records = records.replace("(", "");
      records = records.replace(")", "");
      records = records.replace(/\r\n\s\s*/g, "");
      
      var request = '/alfresco/service/getusertags?username='+userCookie + '&alf_ticket='+authCookie;
      var self = this;
      
      if (SC.buildMode === 'debug') { 
        SC.Request.getUrl(request)
          .set('isJSON', YES)
          .notify(this, this._didFetchSubs, { query: query, store: store, tagRecords: records })
          .send();
      } else {
        $.getJSON(Alfresco.server + request + '&alf_callback=?', null,
          function(data, textStatus, xhr) { 
            SC.run(function() { 
              var response = SC.Response.create({ request: null, body: data, status: textStatus }); 
              self._didFetchSubs(response, { query: query, store: store, tagRecords: records });
            });
          }
        );
      } // END: buildMode
  
    // handle error case
    } else store.dataSourceDidErrorQuery(query, response);
  },
  
  _didFetchSubs: function(response, params) {
    var store = params.store;
    var query = params.query;
    
    if (SC.$ok(response)) {
      console.log(params);
      var subsriptions = response.get('body').tags.split(',');
      var temp = params.tagRecords.split(',');
      var tagRecords = [];
      
      for (var i = 0; i < temp.length; i++) {
        tagRecords[i] = {
          name:temp[i],
          count: 1,
          isSubscribed: false
        };
      }
      
      for (s in subsriptions) {
        var t;
        for (t in tagRecords) {
          if (subsriptions[s] == tagRecords[t]['name']) {
            tagRecords[t]['isSubscribed'] = true;
          }
        }
      }
      
      store.loadRecords(Alfresco.Tags, tagRecords);
          
      // notify store that we handled the fetch
      store.dataSourceDidFetchQuery(query);
  
    // handle error case
    } else store.dataSourceDidErrorQuery(query, response);
  },
  
  _didFetchNotificationFile: function(response, params) {
    var store = params.store;
    var query = params.query;
    if (SC.$ok(response)) {
      var notifications = response.get('body').nodes;

      var storeKeys = store.loadRecords(Alfresco.Notification, notifications);
      store.loadQueryResults(query, storeKeys);
      
      // notify store that we handled the fetch
      store.dataSourceDidFetchQuery(query);

    // handle error case
    } else store.dataSourceDidErrorQuery(query, response);
  }
  
});