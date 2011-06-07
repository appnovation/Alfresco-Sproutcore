// ==========================================================================
// Project:   Alfresco - mainPage
// Copyright: ©2011 My Company, Inc.
// ==========================================================================
/*globals Alfresco */

// This page describes the main user interface for your application.  
Alfresco.mainPage = SC.Page.design({  
  // The main pane is made visible on screen as soon as your app is loaded.
  // Add childViews to this pane for views to display immediately on page 
  // load.
  mainPane: SC.MainPane.design({
    defaultResponder: 'Alfresco.statechart',
    
    childViews: 'toolbar middleView'.w(),
    layout: { },
    
		// Toolbar (ToolbarView)
    toolbar: SC.ToolbarView.design({
    	childViews: 'backButton title logoutButton subscriptionPage config notificationButton'.w(),
    	
    	layout: { left: 0, right: 0, top: 0, height: 36 },
    	anchorLocation: SC.ANCHOR_TOP,
    	
    	backButton: SC.ButtonView.design({
    	  layout: { centerY: 0, left: 12, height: 24, width: 50 },
    	  title: 'Back',
    	  target: 'Alfresco.filesController',
        action: 'goBack',
        theme: 'point-left',
        isVisibleBinding: 'Alfresco.filesController.showButton'
    	}),
    	
    	title: SC.LabelView.design({
    		layout: { centerY: 0, centerX: 0, height: 18, width: 200 },
    		textAlign: SC.ALIGN_CENTER,
    		valueBinding: "Alfresco.siteController.name",
    		fontWeight: SC.BOLD_WEIGHT
    	}),
			
			subscriptionPage: SC.ButtonView.design({
				layout: {centerY: 0, right: 280, height:24, width: 110},
				title: "Subscriptions",
				target: "Alfresco.filesController",
				action: "rebuildSubscriptions"
			}),
			
			config: SC.ButtonView.design({
				layout: {centerY: 0, right: 110, height:24, width: 150},
				title: "Change Subscriptions",
				target: "Alfresco.configArrayController",
				action: "goToConfig"
			}),
    	
    	notificationButton: SC.ButtonView.design({
    	  layout: { centerY: 0, right: 400, height: 24, width: 25 },
    	  titleBinding: 'Alfresco.notificationsController.remaining',
    	  target: 'Alfresco.notificationsController',
    	  action: 'showNotificationsWindow'
    	}),
    	
    	logoutButton: SC.ButtonView.design({
    		layout: { centerY: 0, right: 12, height: 24, width: 80 },
    		title: "Logout",
  			action: 'kiStatechartLogOut'
    	})
    }),
    
		// Everything below the toolbar
		middleView: SC.View.design({
			childViews: 'bannerView sitesView filesView'.w(),
			
		  hasHorizontalScroller: NO,
		  layout: { top: 36, bottom: 0, left: 0, right: 0 },
		  
			// Banner (ContainerView)
			bannerView: SC.ContainerView.design({
				layout: {bottom: 0, left: 0, right: 0, height: 60},
				classNames: ['appno-header'],
				anchorLocation: SC.ANCHOR_BOTTOM
			}),
			
			// Left Sidebar (ListView)
		  sitesView: SC.ListView.design({
			  layout: { top: 0, bottom: 60, left: 0, width: 200 },
			  backgroundColor: '#f3f3f3',
			  classNames: ['mysites-list'],

			  contentBinding: 'Alfresco.sitesController.arrangedObjects',
			  selectionBinding: 'Alfresco.sitesController.selection',
			  contentValueKey: 'name',
			  actOnSelect: YES,
			  selectOnMouseDown: YES,
			  isSelectable: YES,
			  rowHeight: 50
		  }),
		
			filesView: SC.ScrollView.design({
				layout: {top: 0, bottom: 60, left: 200, right: 0},
				backgroundColor: '#f9f9f9',
				classNames: ['myfiles-list'],
				contentView: SC.GridView.design({
					layout: {top: 10, left: 10, right: 10, bottom: 10},
					rowHeight: 160,
					columnWidth: 125,
					contentBinding: 'Alfresco.filesController.arrangedObjects',
					selectionBinding: 'Alfresco.filesController.selection',
					exampleView: Alfresco.ItemView,
					classNames: ['type']
				})
			})

    })
    
  })

});
