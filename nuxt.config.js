/* options */

const mode = 'spa'; // universal/spa
const serveFromSubFolder = false;

/* options end */

const pkg = require('./package');
const path = require('path');
const { options } = require('numeral');

let dist = '';
if(mode === 'universal') {
	dist = 'scutum-universal'
} else {
	dist = 'scutum-spa'
}

module.exports = {

	components: true,
	mode: mode,
	/*
	** Headers of the page
	*/
	head: {
		htmlAttrs: {
			lang: 'en'
		},
		title: 'Dukapal',
		meta: [
			{ charset: 'utf-8' },
			{
				name: 'viewport',
				content: 'width=device-width, initial-scale=1'
			},
			{
				hid: 'description',
				name: 'description',
				content: pkg.description
			}
		],
		script: [
			{ src: (process.env.NODE_ENV !== 'production' || !serveFromSubFolder ? '' : '/' + dist ) + '/vendor/uikit.min.js'}
		],
		link: [
			{ rel: 'icon', type: 'image/x-icon', href: (process.env.NODE_ENV !== 'production' || !serveFromSubFolder ? '' :  '/' + dist ) + '/favicon.ico'},
			{ rel: 'preload', href: (process.env.NODE_ENV !== 'production' || !serveFromSubFolder ? '' : '/' + dist) + '/vendor/uikit.min.js', as: 'script' },
			{ rel: 'preload', href: (process.env.NODE_ENV !== 'production' || !serveFromSubFolder ? '' : '/' + dist) + '/fonts/roboto_base64.css', as: 'style' },
			{ rel: 'preload', href: (process.env.NODE_ENV !== 'production' || !serveFromSubFolder ? '' : '/' + dist) + '/fonts/sourceCodePro_base64.css', as: 'style' },
			{ rel: 'preload', href: (process.env.NODE_ENV !== 'production' || !serveFromSubFolder ? '' : '/' + dist) + '/fonts/mdi/css/materialdesignicons.css', as: 'style' },
			{ rel: 'stylesheet', href: (process.env.NODE_ENV !== 'production' || !serveFromSubFolder ? '' : '/' + dist) + '/fonts/roboto_base64.css' },
			{ rel: 'stylesheet', href: (process.env.NODE_ENV !== 'production' || !serveFromSubFolder ? '' : '/' + dist) + '/fonts/sourceCodePro_base64.css' },
			{ rel: 'stylesheet', href: (process.env.NODE_ENV !== 'production' || !serveFromSubFolder ? '' : '/' + dist) + '/fonts/mdi/css/materialdesignicons.css' }
		]
	},
	/*
	** Customize the progress-bar
	*/
	loading: {
		color: 'rgba(0,0,0,.8)'
	},
	/*
	** Customize the loading-indicator
	** only in spa mode
	*/
	loadingIndicator: {
		color: '#00838f',
		background: 'white'
	},
	/*
	** Global CSS
	*/
	css: [
		'uikit/dist/css/uikit.css'
	],
	/*
	** Plugins to load before mounting the App
	*/
	plugins: [
		{ src: '~/plugins/components.global.js' },
		{ src: '~/plugins/directives.client.js' },
		{ src: '~/plugins/filters.js' },
		{ src: '~/plugins/mixins.client.js' },
		{ src: '~/plugins/waves.client.js' },
		{ src: '~/plugins/retina.client.js' },
		{ src: '~/plugins/vueVisible.client.js' },
		{ src: '~/plugins/axe.js' }
		// { src: '~/plugins/vuex-persist', ssr: false }
	],
	router: {
		middleware: ['auth-guard'],
		base: process.env.NODE_ENV !== 'production' || !serveFromSubFolder ? '/' : '/' + dist,
	},
	modules: [
		'@nuxtjs/axios',
		'@nuxtjs/google-analytics',
		'nuxt-sweetalert2',
		'@nuxtjs/google-fonts',
		'@nuxtjs/auth',
		'@nuxtjs/dotenv',
		// '@nuxtjs/auth-next',
		[
			'nuxt-i18n', {
				defaultLocale: 'en',
				locales: [
					{
						code: 'en',
						file: 'en-US.js',
						name: 'English'
					},
	
				],
				lazy: true,
				langDir: 'lang/',
				strategy: 'no_prefix',
				vueI18n: {
					fallbackLocale: 'en'
				},
				vuex: {
					syncLocale: true
				}
			}
		]
		// '@nuxtjs/webpack-profile'
	],
	googleFonts: {
		
			families: {
			  Condiment:true,
			  Abel:true,

			}
		  
	},

	googleAnalytics: {
		id: (mode === 'universal') ? 'UA-136690566-3' : 'UA-136690566-4',
		// disable for development
		dev: process.env.NODE_ENV !== 'production'
	},
	
	axios: {
		baseURL: 'http://www.api.com/api/v1', // Used as fallback if no runtime config is provided
	  },
	auth: {
		localStorage: false,
		strategies: {
		  local: {
			scheme: 'refresh',
			token: {
			  property: 'access_token',
			  maxAge: 60,
			  type: 'Bearer',
			  expiresIn: 'exp'
			},

			refreshToken: {
			  property: 'refresh_token',
			  data: 'refresh_token',
			  maxAge: 60 * 5,
			  expiresIn: 'exp'
			},
			user: {
			  property: 'user',
			  autoFetch: true
			 },
			endpoints: {
			  login: {
				url: '/login',
				method: 'post',
				propertyName: 'data.token'
			  },
			  logout: { 
				url: '/logout', 
			  },
			  batch: { 
				url: '/batch', 
				method: 'get', 
				propertyName: 'data' 
			  },
			  cheques: { 
				url: '/cheques', 
				method: 'get', 
				propertyName: 'data' 
			  },
			  user: { 
				url: '/me', 
				method: 'get', 
				propertyName: 'data',
			  }
			},
			tokenRequired: true,
			tokenType: 'Bearer',
			refreshToken:true
		  }
		},

		
	
	  },
	

	/*
	** Build configuration
	*/

	build: {
		// analyze: true,
		progress: true,
		babel: {
			plugins: [
				"@babel/plugin-syntax-dynamic-import",
				"@babel/plugin-transform-spread"
			],
			ignore: [
				"node_modules",
				"assets/js/vendor"
			]
		},
		extend (config, ctx) {
			if (ctx.isDev && ctx.isClient) {
				config.module.rules.push(
					// Run ESLint on save
					{
						enforce: 'pre',
						test: /\.(js|vue)$/,
						loader: 'eslint-loader',
						exclude: /(node_modules)/,
					
					options:{
						fix: true
					}
				}
				);
			}
			// aliases
			config.resolve.alias['scss'] = path.resolve(__dirname, './assets/scss');
			// adjust path when serving app from sub-folder
			if (!ctx.isDev && serveFromSubFolder) {
				config.output.publicPath = '/' + dist + '/_nuxt/';
			}
			return config;
		}
	}
};
