Alfresco.Tags = SC.Record.extend(
/** @scope Alfresco.Site.prototype */ {
  propterties: 'name count isSubscribed'.w(),
  
  primaryKey: "name",
  
  name: SC.Record.attr(String, { isRequired: YES }),
  count: SC.Record.attr(Number),
  isSubscribed: SC.Record.attr(Boolean, { defaultValue: NO,  isRequired: YES })
}) ;
