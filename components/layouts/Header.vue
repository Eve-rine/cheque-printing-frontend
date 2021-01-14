<template>
	<header id="sc-header" ref="header" style="position:sticky">
		<nav class="uk-navbar uk-navbar-container" data-uk-navbar="mode: click; duration: 360">
			<div class="uk-navbar-left nav-overlay-small uk-margin-right uk-navbar-aside">
				<a v-if="!vxTopMenuActive && !vxSidebarMiniActive" id="sc-sidebar-main-toggle" href="javascript:void(0)" @click.stop="toggleMainSidebar">
					<i v-if="sidebarMainExpanded" class="mdi mdi-backburger" />
					<i v-if="!sidebarMainExpanded" class="mdi mdi-menu" />
				</a>
				<div class="sc-brand uk-visible@l ">
					<nuxt-link to="/">
						<img v-rjs="require('~/assets/img/duka.png')" :src="logo" alt="">
					</nuxt-link>
				</div>
				<div class="sc-brand uk-hidden@l ">
					<nuxt-link to="/">
						<img v-rjs="require('~/assets/img/duka5.png')" :src="logo2" alt="">
					</nuxt-link>
				</div>
			</div>
			<!-- <div class="sc-brand uk-visible@l">
					<div style=" font-size: 25px">
						<b>
							<span style="float:left; color:#FFBD08; font-family:Condiment; font-weight:900;  font-size: 32px"><i>
								d<i>
								</i></i></span> <span style="float:left; color:white;display:inline;font-family:Abel; "><i>
								uka</i>
							</span><span style="float:left; color:#FFBD08; font-family:Condiment; font-weight:900;  font-size: 32px "><i>
								p</i>
							</span><span style="float:left;display:inline; color:white; font-family:Abel; "><i>
								al</i>
							</span></b>
					</div>
				</div>
				<div class="uk-navbar-toggle uk-hidden@l" href="javascript:void(0)">
					<div style=" font-size: 25px">
						<b>
							<span style="float:left; color:#FFBD08; font-family:Condiment; font-weight:900;  font-size: 32px">
								d
							</span> <span style="float:left; color:white;display:inline;font-family:Abel; "><i>
								uka</i>
							</span><span style="float:left; color:#FFBD08; font-family:Condiment; font-weight:900;  font-size: 32px">
								p
							</span><span style="float:left;display:inline; color:white; font-family:Abel;"><i>
								al</i>
							</span></b>
					</div>
				</div>
			</div> -->
			<div v-if="!vxTopMenuActive" class="uk-navbar-left nav-overlay uk-margin-right uk-visible@m">
				<ul class="uk-navbar-nav">
					<li>
						<a href="javascript:void(0)" class="md-color-white sc-padding-remove-left"><i class="mdi mdi-apps" style="font-size:30*30"></i></a>
						<div class="uk-navbar-dropdown sc-padding-medium">
							<li>
								<div>
									<nuxt-link to="/pages/user_profile" class="uk-flex  uk-flex-middle uk-box-shadow-hover-small sc-round sc-padding-small">
										<span class="uk-text-medium sc-color-primary">Administration</span>
									</nuxt-link>
								</div>
								<div>
									<nuxt-link to="/plugins/charts" class="uk-flex  uk-flex-middle uk-box-shadow-hover-small sc-round sc-padding-small">
										<span class="uk-text-medium sc-color-primary">Accounts</span>
									</nuxt-link>
								</div>
								<div>
									<nuxt-link to="/plugins/charts" class="uk-flex  uk-flex-middle uk-box-shadow-hover-small sc-round sc-padding-small">
										<span class="uk-text-medium sc-color-primary">Point Of Sale</span>
									</nuxt-link>
								</div>
								<div>
									<nuxt-link to="/plugins/charts" class="uk-flex  uk-flex-middle uk-box-shadow-hover-small sc-round sc-padding-small">
										<span class="uk-text-medium sc-color-primary">Dispatch</span>
									</nuxt-link>
								</div>
							</li>
						</div>
					</li>
				</ul>
			</div>
			<div class="nav-overlay nav-overlay-small uk-navbar-right">
				<ul class="uk-navbar-nav">
					<li class="uk-visible@l">
						<ScFullscreen id="sc-js-fullscreen-toggle" />
					</li>
					<li>
						<a href="javascript:void(0)">
							<span class="mdi mdi-bell uk-display-inline-block">
								<span v-show="!alertsEmpty" class="sc-indicator md-bg-color-red-600"></span>
							</span>
						</a>
						<div class="uk-navbar-dropdown md-bg-grey-100">
							<div class="sc-padding sc-padding-small-ends">
								<ul id="sc-header-alerts" class="uk-list uk-margin-remove">
									<li v-for="(alert, index) in users.alerts" :key="alert.id" :style="{'--index': index}" class="uk-margin-small-top sc-border sc-round md-bg-white">
										<div class="uk-flex uk-flex-middle">
											<div class="uk-margin-right uk-margin-small-left">
												<i class="mdi" :class="[alert.icon, alert.color]"></i>
											</div>
											<div class="uk-flex-1 uk-text-small">
												{{ alert.text }}
											</div>
										</div>
									</li>
								</ul>
							</div>
						</div>
					</li>
					<li>
						<a href="javascript:void(0)">
							<img v-rjs="require('~/assets/img/avatars/avatar_default_sm@2x.png')" :src="users.avatar" alt="">
						</a>
						<div class="uk-navbar-dropdown uk-dropdown-small">
							<ul class="uk-nav uk-nav-navbar">
								<li>
									<a style="border-bottom: 1px solid black;">
										<strong>Hello  {{ loggedInUser.username }}</strong>
									</a>
								</li>
								<li>
									<nuxt-link to="/pages/user_profile">
										Profile
									</nuxt-link>
								</li>
								<li>
									<nuxt-link to="/pages/settings">
										Change Password
									</nuxt-link>
								</li>
								<li>
									<a v-if="isAuthenticated" @click="logout">
										Log out
									</a>
								</li>
							</ul>
						</div>
					</li>
				</ul>
				<a v-if="vxOffcanvasPresent" href="javascript:void(0)" class="md-color-white uk-margin-left uk-hidden@l" @click="toggleOffcanvas">
					<i v-show="!vxOffcanvasExpanded" class="mdi mdi-menu"></i><i v-show="vxOffcanvasExpanded" class="mdi mdi-arrow-right"></i>
				</a>
			</div>
		</nav>
	</header>
</template>

<script>
import { mapState, mapGetters } from 'vuex'
import { scMq } from '~/assets/js/utils'
import { scHelpers } from "~/assets/js/utils";
import ScFullscreen from './FullScreen';
const { uniqueID } = scHelpers;

export default {
	name: 'ScHeader',
	components: {
		ScFullscreen,
	
	},
	data: () => ({
		users: {
			avatar: require('~/assets/img/avatars/avatar_default_sm.png'),
			alerts: [
				{
					id: 1,
					text: 'Information Page Not Found!',
					icon: 'mdi-alert-outline',
					color: 'md-color-red-600'
				},
				{
					id: 2,
					text: 'A new password has been sent to your e-mail address.',
					icon: 'mdi-email-check-outline',
					color: 'md-color-blue-600'
				},
				{
					id: 3,
					text: 'You do not have permission to access the API!',
					icon: 'mdi-alert-outline',
					color: 'md-color-red-600'
				},
				{
					id: 4,
					text: 'Your enquiry has been successfully sent.',
					icon: 'mdi-check-all',
					color: 'md-color-light-green-600'
				}
			]
		},
		sidebarMainExpanded: true,
		offcanvasExpanded: false,
		offcanvasPresent: false,
		logo: require('~/assets/img/duka.png'),
		logo2: require('~/assets/img/duka2.png'),
		alertsEmpty: null,
		
	}),
	computed: {
		...mapState([
			'vxSidebarMainExpanded',
			'vxOffcanvasPresent',
			'vxOffcanvasExpanded',
			'vxTopMenuActive',
			'vxActiveLocale',
			'vxSidebarMiniActive'
		]),
		// ...mapState('auth', ['loggedIn', 'user']),
		 ...mapGetters(['isAuthenticated', 'loggedInUser'])
		
	},
	watch: {
		'vxSidebarMainExpanded' (state) {
			this.sidebarMainExpanded = state;
		},
		'vxOffcanvasExpanded' (state) {
			this.offcanvasExpanded = state;
		},
		'vxOffcanvasPresent' (state) {
			this.offcanvasPresent = state;
		}
	},
	mounted () {
		const self = this;
		self.$nextTick(() => {
			if(scMq.mediumMin()) {
				self.sidebarMainExpanded = this.vxSidebarMainExpanded;
			} else {
				self.sidebarMainExpanded = false;
			}
		});
		// sticky header
		var options = scMq.mediumMax() ? { showOnUp: true, animation: "uk-animation-slide-top" } : {};
		UIkit.sticky(this.$refs.header, options);
	},
	methods: {
		async logout () {
	        await this.$auth.logout()
	        localStorage.removeItem('nav')
	        this.$store.commit('menus/resetState')
			 localStorage.removeItem('defaultRoute')
			  localStorage.removeItem('jwt')
			  localStorage.removeItem('time')
	        this.$router.push('/login')
	      },
		toggleMainSidebar () {
			let state = !this.sidebarMainExpanded;
			this.$store.commit('sidebarMainToggle', state);
		},
		toggleOffcanvas () {
			let state = !this.offcanvasExpanded;
			this.$store.commit('offcanvasToggle', state);
		},
		updateLocale (event, code) {
			if (code === this.vxActiveLocale) {
				event.preventDefault();
			}
			this.$i18n.setLocale(code);
			this.$store.commit('updateLocale', code);
			this.isActiveLang(code)
		},
		isActiveLang (code) {
			return code === this.vxActiveLocale
		}
	}
}
</script>
