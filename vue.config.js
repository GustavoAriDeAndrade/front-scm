module.exports = {
    css: {
		loaderOptions: {
			sass: {
				additionalData: '@import "@/assets/scss/style.scss";'
			}
		}
	},

	pluginOptions: {
		s3Deploy: {
		  registry: undefined,
		  overrideEndpoint: false,
		  region: 'sa-east-1',
		  bucket: 'sistemas-finer',
		  createBucket: false,
		  staticHosting: false,
		  staticIndexPage: 'index.html',
		  staticErrorPage: 'error.html',
		  assetPath: 'dist',
		  assetMatch: '**',
		  deployPath: 'okagenda/pasta_build',
		  acl: 'public-read',
		  pwa: true,
		  enableCloudfront: true,
		  cloudfrontId: 'E6LZWI13CY3YE',
		  cloudfrontMatchers: '/*',
		  pluginVersion: '4.0.0-rc3',
		  uploadConcurrency: 5,
		  pwaFiles: 'index.html,service-worker.js,manifest.json'
		}
	  }
};
