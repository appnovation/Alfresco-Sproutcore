# ===========================================================================
# Project:   Alfresco
# Copyright: ©2011 My Company, Inc.
# ===========================================================================

# This is your Buildfile, which sets build settings for your project.
# For example, this tells SproutCore's build tools that your requires
# the SproutCore framework.
config :all, :required => [:sproutcore, :ki, :"sproutcore/animation", :"sproutcore/media"]

# In addition to this Buildfile, which gives settings for your entire project,
# each of your apps has its own Buildfile with settings specific to that app.
proxy '/alfresco', :to => '10.10.1.145:8081' 
# proxy '/alfresco', :to => 'david-w7j.appnovation.net:8080' 
