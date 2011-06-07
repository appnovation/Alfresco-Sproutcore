Alfresco.animationController = SC.ArrayController.create({
  start: function() {
    Alfresco.loginPage.loginPane.overlay.set("isVisible", true);
    Alfresco.loginPage.loginPane.logo.set("isVisible", true);
    
    Alfresco.loginPage.loginPane.overlay.adjust("opacity", 1).updateStyle();
    Alfresco.loginPage.loginPane.boxView.adjust("opacity", 0).updateStyle();
    Alfresco.loginPage.loginPane.boxView.invokeLater(this.set, 800, "isVisible", true);
    this.invokeLater(this.animate, 1500);
  },
  
  animate: function() {
    Alfresco.loginPage.loginPane.overlay.adjust("opacity", 0).updateStyle();
    Alfresco.loginPage.loginPane.boxView.adjust("opacity", 1).updateStyle();
    Alfresco.loginPage.loginPane.overlay.invokeLater(this.set, 1000, "isVisible", false);
  }
});