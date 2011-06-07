// ==========================================================================
// Project:   Alfresco.Site
// Copyright: ©2011 My Company, Inc.
// ==========================================================================
/*globals Alfresco */

/** @class

  (Document your Model here)

  @extends SC.Record
  @version 0.1
*/
Alfresco.Site = SC.Record.extend(
/** @scope Alfresco.Site.prototype */ {

  primaryKey: "uuid",
  
  files: SC.Record.toMany("Alfresco.File", {
    inverse: "site", isMaster: YES
  })

}) ;
