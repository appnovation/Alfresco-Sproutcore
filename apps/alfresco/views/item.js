// ==========================================================================
// Project:   Alfresco.ItemView
// Copyright: ©2011 My Company, Inc.
// ==========================================================================
/*globals Alfresco, localStorage */

/** @class

  (Document Your View Here)

  @extends SC.View
*/
Alfresco.ItemView = SC.View.extend(
/** @scope Alfresco.ItemView.prototype */ {

	contentDisplayProperties: 'name file'. w(),
	
	render: function(context, firstTime) {
		var fileType;
		var content = this.get('content');
		var name = content.name;
		var type = content.type;
		var typeClass = name.split('.');

		fileType = typeClass[1] ? typeClass[1] : type;
		/*
		var video_path;
		var isVideo = false;
		if (Alfresco.videoTypes.indexOf(fileType) != -1) {
		  var authCookie  = localStorage.getItem('loggedInTicket');
		  var id          = content.uuid.split('/').pop();
      video_path      = Alfresco.server + '/alfresco/service/api/node/content/workspace/SpacesStore/' + id + '/' + content.name + '?alf_ticket=' + authCookie;
		  isVideo         = true;
		}
		*/
		
		context = context.begin('div').addClass("container").push('');
		  //if (isVideo) context = context.push('<a href="' + video_path + '">');
			context = context.begin('div').addClass('browser-item item-'+fileType).end();
			context = context.begin('div').addClass('item-name').push(typeClass[0]).end();
			//if (isVideo) context = context.push('</a>');
		context = context.end();
		
		sc_super();
	}
});
