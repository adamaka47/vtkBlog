let userFeed = new Instafeed({
  get: 'user',
  userId: '8780719327',
  limit: 12,
  resolution: 'standard_resolution',
  template: '<a href="{{link}}" class="inst-img" target="_blank" style="background-image:url({{image}})"></a>',
  accessToken: '8780719327.1677ed0.44bf9b50260f460e994f0f97422b9dfe'
});


userFeed.run();