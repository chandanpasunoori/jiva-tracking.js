requirejs.config({
  paths: {
    'jiva-tracking': '../../../dist/jiva-tracking.js'
  }
});

require([
    'jiva-tracking'
  ], function(JivaAMD) {

    var client = new JivaAMD({
      projectId: "123",
      writeKey: "456"
    });

    console.log(JivaAMD, client);

});
