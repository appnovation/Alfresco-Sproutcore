// ==========================================================================
// Project:   Alfresco.config
// Copyright: ©2011 My Company, Inc.
// ==========================================================================
/*globals Alfresco */

/** @class

  (Document Your Controller Here)

  @extends SC.Object
*/
Alfresco.configArrayController = SC.ArrayController.create({
  //nestedStore: null,
  //emptyContent: SC.Object.create(),
  //tempContent: this.emptyContent,
  
  goToMain: function() {
    Alfresco.filesController.rebuildSubscriptions();
    
    Alfresco.sitesController.selectObjects(null);
    Alfresco.siteController.set('content', null);
    
    //Alfresco.sitesController.rootSiteUUIDSetup();
    SC.routes.set('location', 'mainPage/mainPane');
  },
  
  buildTagsConfig: function() {
    var tags = Alfresco.store.find(Alfresco.TAGS);
    Alfresco.configArrayController.set('content', tags);
  },
  
  goToConfig: function() {
    SC.routes.set('location', 'configPage/configPane');
  },
  
  toggleSubscription: function() {
    var sel = this.get('selection');
    //var ns = Alfresco.store.chain();
    //var pk = Alfresco.configController.get('name');
    //var nsTagRecord = ns.find(Alfresco.Subs, pk);
    //this.set('nestedStore', ns);
    //this.set('tempContent', nsTagRecord);
    
    sel.setEach('isSubscribed', !sel.everyProperty('isSubscribed'));
    return YES;
  }
});

Alfresco.configController = SC.ObjectController.create(
/** @scope Alfresco.config.prototype */ {
  contentBinding: SC.Binding.single('Alfresco.configArrayController.selection')
}) ;
