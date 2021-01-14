<template>
	<div id="sc-page-wrapper">
		<div id="sc-page-top-bar" class="sc-top-bar" data-uk-sticky="offset:48; show-on-up: true; animation: uk-animation-slide-top-medium">
			<div class="sc-top-bar-content uk-flex uk-flex-1">
				<h1 class="sc-top-bar-title uk-flex-1">
					Edit bank
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
								<ScInput v-model="$v.editedItem.bank_name.$model" name="bank_name" :error-state="$v.editedItem.bank_name.$error" :validator="$v.editedItem.bank_name">
									<label>Bank name</label>
								</ScInput>
								<ul class="sc-vue-errors">
									<li v-if="!editedItem.bank_name.required">
										Field is required
									</li>
								</ul>
							</div>
							<div class="uk-width-1-3@m">
								<ScInput v-model="$v.editedItem.bank_code.$model" name="bank_code" :error-state="$v.editedItem.bank_code.$error" :validator="$v.editedItem.bank_code">
									<label>Bank code</label>
								</ScInput>
								<ul class="sc-vue-errors">
									<li v-if="!editedItem.bank_code.required">
										Field is required
									</li>
								</ul>
							</div>
							<div class="uk-width-1-3@m">
								<ScInput v-model="$v.editedItem.head_office_number.$model" name="head_office_number" :error-state="$v.editedItem.head_office_number.$error" :validator="$v.editedItem.head_office_number">
									<label>Head office number</label>
								</ScInput>
								<ul class="sc-vue-errors">
									<li v-if="!editedItem.head_office_number.required">
										Field is required
									</li>
								</ul>
							</div>
						</div>
						<div class="uk-margin-top" data-uk-grid>
							<div class="uk-width-1-2@m">
								<ScInput v-model="$v.editedItem.head_office_address.$model" name="head_office_address" :error-state="$v.editedItem.head_office_address.$error" :validator="$v.editedItem.head_office_address">
									<label>Head office address</label>
								</ScInput>
								<ul class="sc-vue-errors">
									<li v-if="!editedItem.head_office_address.required">
										Field is required
									</li>
								</ul>
							</div>
							<div class="uk-width-1-2@m">
								<ScInput v-model="$v.editedItem.head_office_email.$model" name="head_office_email" :error-state="$v.editedItem.head_office_email.$error" :validator="$v.editedItem.head_office_email">
									<label>Head office email</label>
								</ScInput>
								<ul class="sc-vue-errors">
									<li v-if="!editedItem.head_office_email.required">
										Field is required
									</li>
								</ul>
							</div>
						</div>
						<div class="uk-modal-footer uk-text-right">
							<button class="sc-button sc-button-primary" :disabled="submitStatus === 'PENDING'" data-uk-tooltip="Save" @click="bankUpdate($event)">
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
			bank_name: '',
			bank_code:'',
			head_office_email: '',
			head_office_address: '',
			head_office_number: '',
		},
	
	}),
	validations: {
		editedItem: {
			bank_name: {
				required
			},
			bank_code: {
				required
			},
			head_office_email: {
				required
			},
			head_office_address: {
				required
			},
			head_office_number: {
				required
			}
		}
	},
	computed: {
		...mapState('auth', ['loggedIn', 'user']),
	},
	mounted () {
		this.getBanks()
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
		async getBanks () {
			try {
				await this.$axios.get(
					`/banks/${this.$route.params.id}`
				)
					.then(res =>{
						this.editedItem = res.data.data.dataModels[0]
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
		async bankUpdate (event) {
			event.preventDefault()
			this.$v.$touch();
			if (this.$v.editedItem.$invalid) {
				this.submitStatus = 'ERROR'
			} else {
				this.submitStatus = 'OK'
				try {
					await this.$axios.put(`/banks/${this.$route.params.id}`, {
						bank_name: this.editedItem.bank_name,
						bank_code: this.editedItem.bank_code,
						head_office_email: this.editedItem.head_office_email,
						head_office_address: this.editedItem.head_office_address,
						head_office_number: this.editedItem.head_office_number,
					})
						.then(res =>{
							this.$router.push('/banking/banks')
							this.snackText = JSON.stringify(res.data.message)
							this.showNotification(this.snackText)
						})
						.catch(err => {
							if (err.response.data.statusCode == 401 || err.response.data.statusCode == 403) {
								this.$store.commit('setAppRoute', this.$route.path);
								this.snackText = JSON.stringify(err.response.data.message)
						    this.showNotification(this.snackText)
			            }
			            this.$router.push('/banking/banks')
						})
				} catch (err) {
					this.showNotification(err)
				}
			}
		},
		
	},
	head () {
		return {
			'title': 'Dukapal | Create'
		}
	}
}
</script>
<style lang="scss">
  @import '~scss/plugins/vue-good-table.scss';
</style>
