var config = require('../config')

// Adds routing for test environment(s)
exports.setupTestRoutes = function (app) {
  app.get('/api/cancel/long-running', (req, res) => {
    setTimeout(() => {
      res.json([
        {foo: 'bar1'},
        {foo: 'bar2'},
        {foo: 'bar3'},
      ]);
    }, config.dev.longRunningTaskTimeout);
  })
}
