// ==========================================================================
// Project:   Alfresco.VideoView
// Copyright: ©2011 My Company, Inc.
// ==========================================================================
/*globals Alfresco */

/** @class

  (Document Your View Here)

  @extends SC.View
*/
Alfresco.VideoView = SC.View.extend(
/** @scope Alfresco.VideoView.prototype */

{
  tagName: 'div',
  classNames: 'video-view',
  //path: '',

  displayProperties: ['path'],

  render: function(ctx) {
    var path = this.get('path');
    
    ctx.push('<video id="movie" height="374" width="600" preload controls><source src="' + path + '" /></video>');
    ctx.push('<script>var v = document.getElementById("movie");v.onclick = function() {if (v.paused) {v.play();} else {v.pause();}};</script>');
    //ctx.push('<script>window.location.href="' + path + '";</script>');
    
    sc_super();
  }

});