// ==========================================================================
// Project:   Alfresco.fileController
// Copyright: ©2011 My Company, Inc.
// ==========================================================================
/*globals Alfresco, localStorage */

/** @class

  (Document Your Controller Here)

  @extends SC.Object
*/
Alfresco.fileController = SC.ObjectController.create(
/** @scope Alfresco.fileController.prototype */ {
  currentFile: null,
  currentFileBinding: "Alfresco.filesController.selection",
  
  currentFileDidChange: function() {
    var file = this.get('currentFile').toArray().shift();
    if (file && file.type == 'file') {
      var type = file.name.split('.');
			var id = file.uuid.split('/').pop();
      
      if (type[1] && this.isVideoType(type[1]) != -1) {
        this.displayVideoModal(file.name, id);
      }
			else if (type[1] && this.isImageType(type[1]) != -1) {
				this.displayImageModal(file.name, id);
			}
			else {
				this.displayContentModal(file.name, id);
			}
    }
  }.observes('currentFile'),
  
  isVideoType: function(type) {
    return Alfresco.videoTypes.indexOf(type);
  },
	
	isImageType: function(type) {
    return Alfresco.imageTypes.indexOf(type);
  },
  
  displayVideoModal: function(filename, id) {
    //var file = this.get('currentFile').toArray().shift();
    //var id   = file.uuid.split('/').pop();
    var authCookie = localStorage.getItem('loggedInTicket');
    
    var video_path = Alfresco.server + '/alfresco/service/api/node/content/workspace/SpacesStore/' + id + '/' + filename + '?a=true&alf_ticket=' + authCookie; // Nononononononono
    
    SC.PanelPane.create({
      layout: { width: 600, height: 400, centerX: 0, centerY: 0 },
      contentView: SC.View.extend({
        childViews: 'toolbar video'.w(),
        
        toolbar: SC.ToolbarView.design({
          childViews: 'label button'.w(),
          
          label: SC.LabelView.design({
            layout: { top: 5, left: 5, height: 24, width: 300 },
        		textAlign: SC.ALIGN_LEFT,
            value: filename
          }),
          
          button: SC.ButtonView.design({
            layout: { centerY: 0, right: 12, height: 24, width: 80 },
        		title: "Close",
        		target: 'parentView.parentView.parentView',
        		action: 'remove'
          })
          
        }),
        
        video: Alfresco.VideoView.design({
          layout: { top: 32, centerX: 0, width: 600, height: 378 },
          //degradeList: ['html5', 'quicktime'],
          //value: video_path
          path: video_path
        })
        
      }) // PanelPane contentView
    }).append();
  },
  
  displayImageModal: function(filename, id) {
    var authCookie = localStorage.getItem('loggedInTicket');
		var imageURL = Alfresco.server + '/alfresco/service/api/node/content/workspace/SpacesStore/'+ id +'/'+ filename +'?alf_ticket=' + authCookie + '&a=true';
    
    SC.PanelPane.create({
      layout: { width: 600, height: 400, centerX: 0, centerY: 0 },
      contentView: SC.View.extend({
        childViews: 'toolbar textContent'.w(),
        
        toolbar: SC.ToolbarView.design({
          childViews: 'label button'.w(),
          
          label: SC.LabelView.design({
            layout: { top: 5, left: 5, height: 24, width: 300 },
            textAlign: SC.ALIGN_LEFT,
            value: filename
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
          value: imageURL
        })
        
      }) // PanelPane contentView
    }).append();
  },
  
  displayContentModal: function(filename, id) {
    var authCookie = localStorage.getItem('loggedInTicket');
    var self = this;
    var request = '/alfresco/service/api/node/content/workspace/SpacesStore/' + id + '/' + filename + '?alf_ticket=' + authCookie;

    if (SC.buildMode === 'debug') { 
      SC.Request.getUrl(request)
        .notify(this, this._didFetchContent, {filename: filename})
        .send();
    } else {
      $.get(Alfresco.returnAuthedServer() + request + '&alf_callback=?', null,
        function(data, textStatus, xhr) { 
          SC.run(function() { 
            var response = SC.Response.create({ request: null, body: data, status: textStatus }); 
            self._didFetchContent(response, { filename: filename });
          });
        }
      );
    }
  },
  
  _didFetchContent:function(response, params) {
     if (SC.$ok(response)) {
      var filename = params.filename;
      var textResponse = response.get('body');
      var authCookie = localStorage.getItem('loggedInTicket');
      
      SC.PanelPane.create({
        layout: { width: 600, height: 400, centerX: 0, centerY: 0 },
        contentView: SC.View.extend({
          childViews: 'toolbar textContent'.w(),
          
          toolbar: SC.ToolbarView.design({
            childViews: 'label button'.w(),
            
            label: SC.LabelView.design({
              layout: { top: 5, left: 5, height: 24, width: 300 },
              textAlign: SC.ALIGN_LEFT,
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
            value: textResponse
          })
          
        }) // PanelPane contentView
      }).append();

    // handle error case
    }
  }  
}) ;
