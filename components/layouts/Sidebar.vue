<template>
	<aside id="sc-sidebar-main" class="sc-sidebar-info-fixed">
		<div id="sc-sidebar-main-offcanvas-bar" class="uk-offcanvas-bar">
			<div class="sc-sidebar-main-scrollable" data-sc-scrollbar="visible-y">
				<ScMenuList v-if="loggedIn" :menu-data="menuEntries" :is-parent="true"></ScMenuList>
			</div>
			<div class="sc-sidebar-info">
				{{ $t('version') }}: {{ vxAppVersion }}
			</div>
		</div>
	</aside>
</template>

<script>
import { mapState } from 'vuex'
import ScMenuList from './MenuList'
import { scMq } from '~/assets/js/utils'

export default {
	components: {
		ScMenuList
	},
	data: () => ({

	}),
	computed: {
		...mapState('auth', ['loggedIn', 'user']),
		...mapState({menuEntries: state => state.menus.menu}),
		...mapState([
			'vxSidebarMainExpanded',
			'vxAppVersion',
			('menus', ['menus'])
			
		]),
	},
	watch: {
		'vxSidebarMainExpanded' (state) {
			if(scMq.mediumMax()) {
				if (state) {
					UIkit.offcanvas('#sc-sidebar-main').show();
					if(this.$store.getters.offcanvasState) {
						this.$store.commit('offcanvasToggle', false);
					}
				} else {
					UIkit.offcanvas('#sc-sidebar-main').hide();
				}
			}
		},
		$route () {
			if(scMq.mediumMax()) {
				this.$store.commit('sidebarMainToggle', false);
			}
		}
	},
	mounted () {
		const self = this;
		if(scMq.mediumMax()) {
			// activate UIKit offcanvas
			UIkit.offcanvas(document.getElementById('sc-sidebar-main'), {
				overlay: true,
				container: '#nuxt-wrapper'
			});
			// update drop container
			UIkit.util.on('#sc-sidebar-main', 'hidden', function () {
				self.$store.commit('sidebarMainToggle', false);
			});
			self.$store.commit('sidebarMainToggle', false);
		}
	}
}
</script>

<style>
</style>
