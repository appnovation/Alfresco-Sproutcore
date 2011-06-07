// ==========================================================================
// Project:   Statechart - mainPage
// Copyright: ©2011 My Company, Inc.
// ==========================================================================
/*globals Alfresco, Statechart */

Alfresco.loginPage = SC.Page.design({
  
  loginPane: SC.MainPane.design({
    defaultResponder: 'Alfresco.statechart',
    
    classNames: ['login-pane'],
    childViews: 'boxView overlay logo'.w(),
    
    overlay: SC.View.design(SC.Animatable,{
      isVisible: NO,
      //transitions: {opacity: {duration: 3.0, timing: SC.Animatable.TRANSITION_CSS_EASE}},
      //backgroundColor: '#000000',
      layout: {centerX:0, centerY: 0, height:800 , width: 1280}
    }),
    
    logo: SC.ImageView.design({
      isVisible: NO,
      useImageQueue: NO,
      value: sc_static('images/alfresco_logo.png'),
      layout: {centerX: 0, centerY: -140, width: 215, height:61}
    }),
    
    boxView: SC.View.design(SC.Animatable,{
      isVisible: NO,
      layout: { width: 360, height: 185, centerX: 0, centerY: 0 },
      //backgroundColor: '#FFFFFF',
      transitions: {opacity: {duration: 3.0, timing: SC.Animatable.TRANSITION_CSS_EASE}},
      childViews: 'username password host port loginButton errorMessage'.w(),
      
      username: SC.View.design({
        layout: { left: 17, right: 14, top: 17, height: 26 },
        childViews: 'label field'.w(),
        
        label: SC.LabelView.design({
          layout: { left: 0, width: 77, height: 18, centerY: 0 },
          
          value: '_Username',
          localize: YES,
          textAlign: SC.ALIGN_RIGHT
        }),
        
        field: SC.TextFieldView.design({
          layout: { width: 230, height: 22, right: 3, centerY: 0 },
          valueBinding: 'Alfresco.loginController.username'
        })
      }),
      
      password: SC.View.design({
        layout: { left: 17, right: 14, top: 45, height:26 },
        childViews: 'label field'.w(),
        
        label: SC.LabelView.design({
          layout: { left: 0, width: 77, height: 18, centerY: 0 },
          
          value: '_Password',
          localize: YES,
          textAlign: SC.ALIGN_RIGHT
        }),
        
        field: SC.TextFieldView.design({
          layout: { width:230, height: 22, right: 3, centerY: 0 },
          
          isPassword: YES,
          valueBinding: 'Alfresco.loginController.password'
        })
      }),
      
      host: SC.View.design({
        layout: { left: 17, right: 14, top: 73, height:26 },
        childViews: 'label field'.w(),
        
        label: SC.LabelView.design({
          layout: { left: 0, width: 77, height: 18, centerY: 0 },
          
          value: '_Host',
          localize: YES,
          textAlign: SC.ALIGN_RIGHT
        }),
        
        field: SC.TextFieldView.design({
          layout: { width:230, height: 22, right: 3, centerY: 0 },
          valueBinding: 'Alfresco.loginController.host'
        })
      }),
      
      port: SC.View.design({
        layout: { left: 17, right: 14, top: 101, height:26 },
        childViews: 'label field'.w(),
        
        label: SC.LabelView.design({
          layout: { left: 0, width: 77, height: 18, centerY: 0 },
          
          value: '_Port',
          localize: YES,
          textAlign: SC.ALIGN_RIGHT
        }),
        
        field: SC.TextFieldView.design({
          layout: { width:230, height: 22, right: 3, centerY: 0 },
          valueBinding: 'Alfresco.loginController.port'
        })
      }),
      
      loginButton: SC.ButtonView.design({
        layout: { height: 24, width:80, bottom: 17, right: 17 },
        title: '_Login',
        localize: YES,
        isDefault: YES,
        action: 'kiStatechartLogIn'
      }),
      
      errorMessage: SC.LabelView.design({
        layout: { height: 40, width: 230, right:120, bottom:7 },
        classNames: ['error-message'],
        
        valueBinding: 'Alfresco.loginController.errorMessage'
      })
    })
  })
});
