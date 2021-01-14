<template>
	<div></div>
</template>
<script>
import { mapState } from 'vuex'
export default {
	middleware: ['auth'],
	// redirect / to dashboard/v1
	// fetch ({ params, redirect }) {
	// 	redirect(301, '/dashboard/v1')
	// }
	computed: {
		...mapState('auth', ['loggedIn', 'user'])
	},
	mounted () {
		this.$store.commit('setAppRedirect', this.$route.path)
	},
}
</script>
