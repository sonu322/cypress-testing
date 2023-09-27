module.exports = (on, config) => {
  on('before:browser:launch', (browser = {}, args) => {
    if (!!args.args) {
      // NOTE: ALLOW id.atlassian.com CORS LOGIN!
      args.args.push('--disable-features=CrossSiteDocumentBlockingIfIsolating,CrossSiteDocumentBlockingAlways,IsolateOrigins,site-per-process');
    }
    return args;
  });
};