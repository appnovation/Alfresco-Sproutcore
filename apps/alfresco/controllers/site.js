// ==========================================================================
// Project:   Alfresco.siteController
// Copyright: ©2011 My Company, Inc.
// ==========================================================================
/*globals Alfresco, localStorage */

/** @class

  (Document Your Controller Here)

  @extends SC.Object
*/
Alfresco.siteController = SC.ObjectController.create(
/** @scope Alfresco.siteController.prototype */ {

  contentBinding: SC.Binding.single('Alfresco.sitesController.selection'),
  
  selectionDidChange: function() {
    var authCookie = localStorage.getItem('loggedInTicket');
    if (authCookie === null) {
      Alfresco.statechart.gotoState('loggedOut');
    }
    else {
      var content = this.get('content');
      if (content) {
        Alfresco.filesController.set('fileTrail', [content.get('uuid')]);
        Alfresco.filesController.set('showButton', NO);
        Alfresco.filesController.rebuildFiles(content.get('uuid'));
      }
      //var layer = Alfresco.mainPage.getPath('mainPane.middleView').get('layer');
      //SC.Event.simulateEvent(layer, 'mousedown');
    }
  }.observes('content')
}) ;
