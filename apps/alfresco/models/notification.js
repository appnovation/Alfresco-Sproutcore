// ==========================================================================
// Project:   Alfresco.Notification
// Copyright: ©2011 My Company, Inc.
// ==========================================================================
/*globals Alfresco */

/** @class

  (Document your Model here)

  @extends SC.Record
  @version 0.1
*/
Alfresco.Notification = SC.Record.extend(
/** @scope Alfresco.Notification.prototype */ {

  primaryKey: "uuid",

  uuid: SC.Record.attr(String),
  name: SC.Record.attr(String),
  timestamp: SC.Record.attr(String),
  type: SC.Record.attr(String),
  mimetype: SC.Record.attr(String),
  isRead: SC.Record.attr(Boolean, { defaultValue: NO,  isRequired: YES })

}) ;
