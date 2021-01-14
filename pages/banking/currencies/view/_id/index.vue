<template>
	<div id="sc-page-wrapper">
		<div id="sc-page-top-bar" class="sc-top-bar" data-uk-sticky="offset:48; show-on-up: true; animation: uk-animation-slide-top-medium">
			<div class="sc-top-bar-content uk-flex uk-flex-1">
				<h1 class="sc-top-bar-title uk-flex-1">
					Edit Currency
				</h1>
			</div>
		</div>	
		<div id="sc-page-content">
			<div class="sc-fab-page-wrapper">
				<nuxt-link :to="'/banking/banks'">
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
								<ScInput v-model="$v.editedItem.voucher_no.$model" name="voucher_no" :error-state="$v.editedItem.voucher_no.$error" :validator="$v.editedItem.voucher_no">
									<label>Voucher Number</label>
								</ScInput>
								<ul class="sc-vue-errors">
									<li v-if="!editedItem.voucher_no.required">
										Field is required
									</li>
								</ul>
							</div>
							<div class="uk-width-1-3@m">
								<ScInput v-model="$v.editedItem.currency_code.$model" name="currency_code" :error-state="$v.editedItem.currency_code.$error" :validator="$v.editedItem.currency_code">
									<label>Currency code</label>
								</ScInput>
								<ul class="sc-vue-errors">
									<li v-if="!editedItem.currency_code.required">
										Field is required
									</li>
								</ul>
							</div>
							<div class="uk-width-1-3@m">
								<ScInput v-model="$v.editedItem.currency_name.$model" name="currency_name" :error-state="$v.editedItem.currency_name.$error" :validator="$v.editedItem.currency_name">
									<label>Currency Name</label>
								</ScInput>
								<ul class="sc-vue-errors">
									<li v-if="!editedItem.currency_name.required">
										Field is required
									</li>
								</ul>
							</div>
						</div>
						<div class="uk-modal-footer uk-text-right">
							<button class="sc-button sc-button-primary" :disabled="submitStatus === 'PENDING'" data-uk-tooltip="Save" @click="updateCurrency($event)">
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
import { validationMixin } from 'vuelidate'
import ScInput from '~/components/Input'
import { required, minLength, email, sameAs } from 'vuelidate/lib/validators'
import { mapState } from 'vuex'
import moment from 'moment'
import { format, parseISO } from 'date-fns'

export default {
	middleware: ['auth'],
	components: {
		ScInput,
	},
	mixins: [validationMixin],
	data: () => ({
		submitStatus: null,
		editedItem: {
			voucher_no: '',
			currency_code:'',
			currency_name: '',
		},
	
	}),
	validations: {
		editedItem: {
			voucher_no: {
				required
			},
			currency_code: {
				required
			},
			currency_name: {
				required
			}
		}
	},
	computed: {
		...mapState('auth', ['loggedIn', 'user']),
	},
	mounted () {
		this.getCurrency()
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
		async getCurrency () {
			try {
				await this.$axios.get(
					`/currency/${this.$route.params.id}`
				)
					.then(res =>{
						this.editedItem.voucher_no = res.data.data.voucher_no
						this.editedItem.currency_code = res.data.data.currency_code
						this.editedItem.currency_name = res.data.data.currency_name
					})
					.catch(err => {
						if (err.response.data.statusCode == 401 || err.response.data.statusCode == 403) {
							this.$store.commit('setAppRoute', this.$route.path);
							this.snackText = JSON.stringify(err.response.data.message)
						    this.showNotification(this.snackText)
			            }
					})
			} catch (err) {
				this.showNotification(err)
			}
		},
		async updateCurrency (event) {
			event.preventDefault()
			this.$v.$touch();
			if (this.$v.editedItem.$invalid) {
				this.submitStatus = 'ERROR'
			} else {
				this.submitStatus = 'OK'
				try {
					await this.$axios.put(`/currency/${this.$route.params.id}`, {
						voucher_no: this.editedItem.voucher_no,
						currency_code: this.editedItem.currency_code,
						currency_name: this.editedItem.currency_name,
					})
						.then(res =>{
							this.$router.push('/banking/currencies')
							this.snackText = JSON.stringify(res.data.message)
							this.showNotification(this.snackText)
						})
						.catch(err => {
							if (err.response.data.statusCode == 401 || err.response.data.statusCode == 403) {
								this.$store.commit('setAppRoute', this.$route.path);
								this.snackText = JSON.stringify(err.response.data.message)
						    this.showNotification(this.snackText)
			            }
			            this.$router.push('/banking/currencies')
						})
				} catch (err) {
					this.showNotification(err)
				}
			}
		},
		
	},
	head () {
		return {
			'title': 'Dukapal | Currency'
		}
	}
}
</script>
<style lang="scss">
  @import '~scss/plugins/vue-good-table.scss';
</style>
