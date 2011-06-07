// ==========================================================================
// Project:   Alfresco.File
// Copyright: ©2011 My Company, Inc.
// ==========================================================================
/*globals Alfresco */

/** @class

  (Document your Model here)

  @extends SC.Record
  @version 0.1
*/
Alfresco.File = SC.Record.extend(
/** @scope Alfresco.File.prototype */ {

  primaryKey: "uuid",
  
  site: SC.Record.toOne("Alfresco.Site", {
    inverse: "files", isMaster: NO 
  })

}) ;
