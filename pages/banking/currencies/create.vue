<template>
	<div id="sc-page-wrapper">
		<client-only>
			<div id="sc-page-top-bar" class="sc-top-bar" data-uk-sticky="offset:48; show-on-up: true; animation: uk-animation-slide-top-medium">
				<div class="sc-top-bar-content uk-flex uk-flex-1">
					<h1 class="sc-top-bar-title uk-flex-1">
						Add a currency
					</h1>
				</div>
			</div>
		</client-only>
		<div id="sc-page-content">
			<div class="sc-fab-page-wrapper">
				<nuxt-link :to="'/banking/currencies'">
					<a href="javascript:void(0)" class="sc-fab sc-fab-medium sc-fab-primary">
						<i class="mdi mdi-arrow-left"></i>
					</a>
				</nuxt-link>
			</div>
			<ScCard>
				<ScCardBody>
					<form>
						<div class="uk-margin-top" data-uk-grid>
							<div class="uk-width-1-3@m">
								<ScInput v-model="$v.voucher_no.$model" name="voucher_no" :error-state="$v.voucher_no.$error" :validator="$v.voucher_no">
									<label>Voucher no</label>
								</ScInput>
								<ul class="sc-vue-errors">
									<li v-if="!voucher_no.required">
										Field is required
									</li>
								</ul>
							</div>
							<div class="uk-width-1-3@m">
								<ScInput v-model="$v.currency_code.$model" name="currency_code" :error-state="$v.currency_code.$error" :validator="$v.currency_code">
									<label>Currency code</label>
								</ScInput>
								<ul class="sc-vue-errors">
									<li v-if="!currency_code.required">
										Field is required
									</li>
								</ul>
							</div>
							<div class="uk-width-1-3@m">
								<ScInput v-model="$v.currency_name.$model" name="currency_name" :error-state="$v.currency_name.$error" :validator="$v.currency_name">
									<label>Currency Name</label>
								</ScInput>
								<ul class="sc-vue-errors">
									<li v-if="!currency_name.required">
										Field is required
									</li>
								</ul>
							</div>
						</div>
						<div class="uk-modal-footer uk-text-right">
							<button class="sc-button sc-button-primary" :disabled="submitStatus === 'PENDING'" data-uk-tooltip="Save" @click="addCurrency($event)">
								<i class="mdi mdi-checkbox-marked-outline"></i>
							</button>
						</div>
					</form>
				</ScCardBody>
			</ScCard>
		</div>
	</div>
</template>

<script>

import ScInput from '~/components/Input'
import { validationMixin } from 'vuelidate'
import { required, minLength, email, sameAs } from 'vuelidate/lib/validators'
import { mapState } from 'vuex'
export default {
	middleware: ['auth'],
	components: {
		ScInput,
	},
	mixins: [validationMixin],
	data: () => ({
		submitStatus: null,
		voucher_no: '',
		currency_code:'',
		currency_name: '',
		

	}),
	validations: {
		
		voucher_no: {
			required
		},
		currency_code: {
			required
		},
		currency_name: {
			required
		},
		

	},
	computed: {
		...mapState('auth', ['loggedIn', 'user']),

	},
	mounted () {

	},
 
	methods: {
		async showNotification (text, pos, status, persistent) {
			var config = {};
			config.timeout = persistent ? !persistent : 3000;
			if(status) {
				config.status = status;
			}
			if(pos) {
				config.pos = pos;
			}
			UIkit.notification(text, config);
		},

		async addCurrency (e, evt) {
			e.preventDefault()
			this.$v.$touch();
			if (this.$v.$invalid) {
				this.submitStatus = 'ERROR'
			} else {
				this.submitStatus = 'OK'
				try {
					await this.$axios.post('/currency', {
						voucher_no: this.voucher_no,
						currency_code: this.currency_code,
						currency_name: this.currency_name,
					})
						.then(res =>{
							this.$router.push('/banking/currencies')
							this.snackText = JSON.stringify(res.data.message)
							this.showNotification(this.snackText)
			
	

						})
						.catch(err => {
							this.snackText = JSON.stringify(err.response.data.message);
							this.showNotification(this.snackText)
						})
				} catch (err) {
					this.showNotification(err)
				}
			}	
		},

	},
	head () {
		return {
			'title': 'Dukapal | currency'
		}
	}
}
</script>
<style lang="scss">
  @import '~scss/plugins/vue-good-table.scss';
</style>
