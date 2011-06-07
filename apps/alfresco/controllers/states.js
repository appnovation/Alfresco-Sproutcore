/*globals Alfresco, Ki, localStorage */

Alfresco.statechart = Ki.Statechart.create({

  rootState: Ki.State.design({
    
    initialSubstate: "loggedOut",
    
    loggedOut: Ki.State.design({
      enterState: function() {
        SC.Logger.info('enter LoggedOut');
        SC.routes.set('location', 'loginPage/loginPane');
      },
      exitState: function() {
        SC.Logger.info('exit LoggedOut');
        var pane;
        pane = Alfresco.getPath('loginPage.loginPane');
        pane.remove();
      },
      
      kiStatechartLogIn: function() {
        Alfresco.loginController.authenticate();
      }
      
    }),
  
    loggedIn: Ki.State.design({
      
      enterState: function() {
        Alfresco.sitesController.rootSiteUUIDSetup();
        Alfresco.configArrayController.buildTagsConfig();
        Alfresco.notificationsController.queryNotifications();
        SC.routes.set('location', 'mainPage/mainPane');
      },
      exitState: function() {
        SC.Logger.info('exit LoggedIn');
        //remove mainPane
        var pane;
        pane = Alfresco.getPath('mainPage.mainPane');
        pane.remove();
        //clear fields
        Alfresco.loginController.set('username', '');
        Alfresco.loginController.set('password', '');

        //delete cookie
        var authCookie = localStorage.getItem('loggedInTicket');
        if (authCookie !== null) {
          localStorage.removeItem('loggedInTicket');
          
          var request = '/alfresco/service/api/login/ticket/' + authCookie;
          
          if (SC.buildMode === 'debug') {
            SC.Request.deleteUrl(request);
          } else {
            $.ajax({
               type: "DELETE",
               url: Alfresco.server + request
             });
          } // END buildMode
          
        }
      },
      
      kiStatechartLogOut: function() {
        this.gotoState('loggedOut');
      }
      
    }) 
    
  })

}) ;