<template>
	<div id="sc-style-switcher" :class="{'active' : sSwitchActive }">
		<a id="sc-style-switcher-toggle" href="javascript:void(0)" class="sc-sSw-toggle" @click.stop="sSwitchActive = !sSwitchActive">
			<i class="mdi mdi-tune"></i>
		</a>
		<span style="display:inline; padding-top:0" class="sc-text-semibold  uk-margin-bottom">
			APPLICATIONS
		</span>
		<ul class="uk-navbar-nav">
			<li style="width:200px">
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
		</ul>
	</div>
</template>

<script>
import { mapState } from 'vuex'
export default {
	name: 'ScStyleSwitcher',
	data: () => ({
		sSwitchActive: false,

		scrollToActive: false,
		accordionMode: false
	}),

	methods: {

	}
}
</script>
<style lang="scss">
	@import '~pretty-checkbox/src/pretty-checkbox.scss';
	@import "~scss/plugins/style_switcher";
</style>
