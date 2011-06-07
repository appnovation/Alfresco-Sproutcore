/*globals Alfresco */

Alfresco.configPage = SC.Page.design({
  configPane: SC.MainPane.design({
    childViews: 'topBar middleView'.w(),
    //layout: { width: 1024},
    
    topBar: SC.ToolbarView.design({
      childViews: 'back logout'.w(),
      anchorLocation: SC.ANCHOR_TOP,
      layout: { left: 0, right: 0, top: 0, height: 36 },
      
      back: SC.ButtonView.design({
        layout: { centerY: 0, left: 12, height: 24, width: 60 },
    	  title: 'Back',
    	  target: 'Alfresco.configArrayController',
        action: 'goToMain',
        theme: 'point-left'
      }),
      
      logout: SC.ButtonView.design({
        layout: { centerY: 0, right: 12, height: 24, width: 120 },
    		title: "Logout",
        target: "Alfresco.statechart",
  			action: "kiStatechartLogOut"
      })
    }),
		
		middleView: SC.ScrollView.design({
			layout: { top: 36, right: 0, bottom: 0, left: 0 },
			contentView: SC.GridView.design({
				exampleView: SC.ListItemView,
				columnWidth: 500,
				rowHeight: 40,
				contentCheckboxKey: 'isSubscribed',
				contentValueKey: 'name',
				insertionOrientation: SC.VERTICAL_ORIENTATION,
				contentBinding: 'Alfresco.configArrayController.arrangedObjects',
				selectionBinding: 'Alfresco.configArrayController.selection',
				target: 'Alfresco.configArrayController',
				action: 'toggleSubscription',
				classNames: ['subscription-item-select']
			})
		})
  })
});