Alfresco.routes = SC.Object.create({
  //keep track of the current page
  currentPagePane: null,
  
  /**
   *  @param routeParams
   */
  gotoRoute: function(routeParams) {
    var pageName = routeParams.pageName;
    if (pageName == undefined || pageName == '') {
      pageName = 'loginPage';
    }
    
    var paneName = routeParams.paneName;
    if (paneName == undefined || paneName == '') {
      paneName = 'loginPane';
    }
    
    if (pageName != 'loginPage' && paneName != 'loginPane') {
      //var authCookie = SC.Cookie.find('loggedInTicket');
      var authCookie = localStorage.getItem('loggedInTicket');
      if (authCookie == null) {
        SC.Logger.info('authCookie not available.');
        Alfresco.loginController.set('username', '');
        Alfresco.loginController.set('password', '');
        Alfresco.statechart.gotoState('loggedOut');
        return;
      }
    }
    
    if (this.currentPagePane != null) {
      this.currentPagePane.remove();
    }
    
    var pagePanePath = pageName + '.' + paneName;
    var pagePane = Alfresco.getPath(pagePanePath);
    pagePane.append();
    
    this.currentPagePane = pagePane;
  }
});
