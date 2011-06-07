// ==========================================================================
// Project:   Statechart.statechart
// Copyright: ©2011 My Company, Inc.
// ==========================================================================
/*globals Alfresco, Statechart, localStorage */

/** @class

  (Document Your Controller Here)

  @extends SC.Object
*/
Alfresco.loginController = SC.ObjectController.create({
  username: '',
  password: '',
  host: '',
  port: '',
  ticket: '',
  errorMessage: '',
  
  authenticate: function() {
    //initialize variables
    var user = this.get('username');
    var pass = this.get('password');
    //var host = this.get('host');
    //var port = this.get('port');
    var self = this;
    
    //build request string
    var request =
      //host + ':' + port +
      '/alfresco/service/api/login.json?'
      + 'u=' + user
      + '&pw=' + pass;
    
    var authCookie = localStorage.getItem('loggedInTicket');
    if (authCookie === null) {
      
      if (SC.buildMode === 'debug') { 
        SC.Request.getUrl(request)
          .set('isJSON', YES)
          .notify(this, 'endLogin')
          .send();
      } else {
        $.getJSON(Alfresco.server + request + '&alf_callback=?', null,
          function(data, textStatus, xhr) { 
            SC.run(function() { 
              var response = SC.Response.create({ request: null, body: data, status: textStatus }); 
              self.endLogin(response);
            });
          }
        );
      }
      
    } else {
      Alfresco.statechart.gotoState('loggedIn');
    }
    
    return YES;
  },
  
  endLogin: function(response) {
    try {
      this.set('isLoggingIn', NO);
      if (!SC.ok(response)) {
        throw SC.Error.desc('Invalid username or password.  Try admin/admin');
      }
      
      this.set('errorMessage', '');
      
      //create cookie
      localStorage.setItem('loggedInTicket', response.get('body').data.ticket);
      localStorage.setItem('loggedInUser', this.get('username'));
      localStorage.setItem('loggedInPassword', this.get('password'));
      
      //route to main page
      Alfresco.statechart.gotoState('loggedIn');
    }
    catch (err) {
      this.set('errorMessage', err.message);
    }
  }  
});
