// ==========================================================================
// Project:   Alfresco.notificationsController
// Copyright: ©2011 My Company, Inc.
// ==========================================================================
/*globals Alfresco, localStorage */

/** @class

  (Document Your Controller Here)

  @extends SC.Object
*/
Alfresco.notificationsController = SC.ArrayController.create(
/** @scope Alfresco.notificationsController.prototype */ {
  remainingCount: null,
  fileUUID: null,
  modalContent: null,

  updateCount: function(timer) {
    //alert('in updateCount()');
    var notifications = Alfresco.store.find(Alfresco.NOTIFICATIONS);
    notifications.refresh();
    Alfresco.notificationsController.set('content', notifications);
    this.invokeLater('updateCount', 60000);
  },

  remaining: function() {
    var temp = this.filterProperty('isRead', false).get('length');
    // NO === 0 :( Return it as a string instead
    if (this.get('remainingCount') != temp) this.set('remainingCount', temp); 
    return (temp === 0) ? '0' : temp;
  }.property('@each.isRead'),
  
  markAllAsRead: function() {
    this.setEach('isRead', YES);
  }.property('@each.isRead'),
  
  queryNotifications: function() {
    this.updateCount();
  },
  
  showNotificationsWindow: function() {
    // this.markAllAsRead();
    var anchor = Alfresco.getPath('mainPage.mainPane.toolbar.notificationButton');
    SC.PickerPane.create({
      theme: 'popover',
      layout: { width: 300, height: 400 },
      contentView: SC.WorkspaceView.extend({
        childViews: 'topToolbar contentView'.w(),
        topToolbar: SC.ToolbarView.extend({
          childViews: 'notificationTitle'.w(),
          notificationTitle: SC.LabelView.design({
            layout: { centerX: 0, centerY: 0, width: 100, height: 24 },
            value: 'Notifications'
          })
        }),
        
        contentView: SC.ListView.extend({
          backgroundColor: '#fff',
          rowHeight: 40,
          contentBinding: 'Alfresco.notificationsController.arrangedObjects',
          selectionBinding: 'Alfresco.notificationsController.selection',
          contentValueKey: 'name',
          contentCheckboxKey: 'isRead'
        })
      })
    }).popup(anchor, SC.PICKER_POINTER, [0]);
  },
  
  selectionDidChange: function() {
    if (this.hasSelection()) {
      // I feel like I'm violating SC's way of doing things here
      var selected = this.get('selection').toArray().shift();
      var file;
      var id;
      
      if (selected.get('type') == 'file') {
        var type = selected.get('mimetype');
        
        if (type && Alfresco.fileController.isVideoType(type) != -1) {
          file = this.get('selection').toArray().shift();
          id   = file.get('uuid').split('/').pop();
          Alfresco.fileController.displayVideoModal(file.get('name'), id);
        }
        else if (type && Alfresco.fileController.isImageType(type) != -1) {
          file = this.get('selection').toArray().shift();
          id   = file.get('uuid').split('/').pop();
          Alfresco.fileController.displayImageModal(file.get('name'), id);
        }
        else {      
          file = this.get('selection').toArray().shift();
          id   = file.get('uuid').split('/').pop();
          Alfresco.fileController.displayContentModal(file.get('name'), id);
        }
      }
    }
  }.observes('selection'),
  
  _didFetchContent:function(response, params) {
     if (SC.$ok(response)) {
      var filename = params.filename;
      var records = response.get('body');
      var authCookie = localStorage.getItem('loggedInTicket');
      
      SC.PanelPane.create({
        layout: { width: 600, height: 400, centerX: 0, centerY: 0 },
        contentView: SC.View.extend({
          childViews: 'toolbar textContent'.w(),
          
          toolbar: SC.ToolbarView.design({
            childViews: 'label button'.w(),
            
            label: SC.LabelView.design({
              layout: { top: 5, left: 5, height: 24, width: 100 },
              textAlign: SC.ALIGN_CENTER,
              value: filename
            }),
            
            button: SC.ButtonView.design({
              layout: { centerY: 0, right: 12, height: 24, width: 80 },
              title: "Close",
              target: 'parentView.parentView.parentView',
              action: 'remove'
            })
            
          }),
          
          textContent: SC.TextFieldView.design({
            layout: { top: 32, centerX: 0, width: 600},
            isEnabled: NO,
            isTextArea: YES,
            value: records
          })
          
        }) // PanelPane contentView
      }).append();

    // handle error case
    }
  },
  
  displayNotificationContentModal: function() {
    var file = this.get('selection').toArray().shift();
    var id   = file.get('uuid').split('/').pop();
    var authCookie = localStorage.getItem('loggedInTicket');
    var self = this;
    
    var request = '/alfresco/service/api/node/content/workspace/SpacesStore/' + id + '/' + file.get('name') + '?alf_ticket=' + authCookie;
    
    if (SC.buildMode === 'debug') { 
      SC.Request.getUrl(request)
        .notify(this, this._didFetchContent, {filename: file.get('name')})
        .send();
    } else {
      var req = $.getJSON(Alfresco.returnAuthedServer() + request + '&alf_callback=?', null,
        function(data, textStatus, xhr) { 
          SC.run(function() { 
            var response = SC.Response.create({ request: null, body: data, status: textStatus }); 
            self._didFetchContent(response, { filename: file.get('name') });
          });
        }
      );
    }
    
    
  },
  
  displayNotificationImageModal: function() {
    var file = this.get('selection').toArray().shift();
    var id   = file.get('uuid').split('/').pop();
    
    var authCookie = localStorage.getItem('loggedInTicket');
    
    SC.PanelPane.create({
      layout: { width: 600, height: 400, centerX: 0, centerY: 0 },
      contentView: SC.View.extend({
        childViews: 'toolbar textContent'.w(),
        
        toolbar: SC.ToolbarView.design({
          childViews: 'label button'.w(),
          
          label: SC.LabelView.design({
            layout: { top: 5, left: 5, height: 24, width: 100 },
            textAlign: SC.ALIGN_CENTER,
            value: file.get('name')
          }),
          
          button: SC.ButtonView.design({
            layout: { centerY: 0, right: 12, height: 24, width: 80 },
            title: "Close",
            target: 'parentView.parentView.parentView',
            action: 'remove'
          })
        }),
        
        textContent: SC.ImageView.design({
          useImageQueue: NO,
          value: Alfresco.returnAuthedServer() + '/share/proxy/alfresco/api/node/content/workspace/SpacesStore/'+ id +'/'+ file.get('name') +'?a=true&alf_ticket=' + authCookie
        })
        
      }) // PanelPane contentView
    }).append();
  }
}) ;
