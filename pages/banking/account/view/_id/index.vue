<template>
	<div id="sc-page-wrapper">
		<div id="sc-page-top-bar" class="sc-top-bar" data-uk-sticky="offset:48; show-on-up: true; animation: uk-animation-slide-top-medium">
			<div class="sc-top-bar-content uk-flex uk-flex-1">
				<h1 class="sc-top-bar-title uk-flex-1">
					Edit Account
				</h1>
			</div>
		</div>
		<div id="sc-page-content">
			<div class="sc-fab-page-wrapper">
				<nuxt-link :to="'/banking/account'">
					<a href="javascript:void(0)" class="sc-fab sc-fab-medium sc-fab-primary">
						<i class="mdi mdi-arrow-left"></i>
					</a>
				</nuxt-link>
			</div>
			<ScCard>
				<ScCardHeader separator>
					<div class="uk-flex uk-flex-middle">
						<div class="uk-flex-1">
							<ScCardTitle>
								Account details
							</ScCardTitle>
						</div>
						<div class="sc-actions">
							<a href="javascript:void(0)" class="sc-button sc-button-icon sc-button-outline sc-button-outline-square sc-button-outline-primary" @click="addAccount">
								<i class="mdi mdi-plus"></i>
							</a>
						</div>
					</div>
				</ScCardHeader>
				<ScCardBody>
					<form>
						<div class="uk-margin-top" data-uk-grid>
							<div class="uk-width-1-3@m">
								<v-select 
									v-model="bank_id"
									label="bank_name"
									:filterable="false"
									:options="options"
									placeholder="Select a bank"
									@search="onSearch"
								>
									<template slot="no-options">
										type to search banks..
									</template>
									<template slot="option" slot-scope="option">
										<div class="d-center">
											{{ option.bank_name }}
										</div>
									</template>
									<template slot="selected-option" slot-scope="option">
										<div class="selected d-center">
											{{ option.bank_name }}
										</div>
									</template>
								</v-select>
							</div>
						
							<div class="uk-width-1-3@m">
								<v-select 
									v-model="branch_id"
									label="branch_name"
									:filterable="false"
									:options="suggestions"
									placeholder="Select a branch"
									@search="onSearc"
								>
									<template slot="no-options">
										type to search branches..
									</template>
									<template slot="suggestion" slot-scope="suggestion">
										<div class="d-center">
											{{ suggestion.branch_name }}
										</div>
									</template>
									<template slot="selected-suggestion" slot-scope="suggestion">
										<div class="selected d-center">
											{{ suggestion.branch_name }}
										</div>
									</template>
								</v-select>
								<!-- <client-only>
									<Select2
										v-model="$v.branch_id.$model" 
										name="branch_id"
										:error-state="$v.branch_id.$error" 
										:validator="$v.branch_id"
										:options="branching"
										:settings="{ 'width': '100%', 'placeholder': 'Select branch...', allowClear: false }"
									></Select2>
									<ul class="sc-vue-errors">
										<li v-if="!branch_id.required">
											Field is required
										</li>
									</ul>
								</client-only> -->
							</div>
							<div class="uk-width-1-3@m">
								<client-only>
									<Select2
										v-model="$v.currency_id.$model" 
										name="currency_id"
										:error-state="$v.currency_id.$error" 
										:validator="$v.currency_id"
										:options="currency"
										:settings="{ 'width': '100%', 'placeholder': 'Choose currency', allowClear: false }"
									></Select2>
									<ul class="sc-vue-errors">
										<li v-if="!currency_id.required">
											Field is required
										</li>
									</ul>
								</client-only>
							</div>
							<div class="uk-width-1-3@m">
								<ScInput v-model="$v.account_name.$model" name="account_name" :error-state="$v.account_name.$error" :validator="$v.account_name">
									<label>Account name</label>
								</ScInput>
								<ul class="sc-vue-errors">
									<li v-if="!account_name.required">
										Field is required
									</li>
								</ul>
							</div>
						
							
							<div class="uk-width-1-3@m">
								<ScInput v-model="$v.kra_pin.$model" name="kra_pin" :error-state="$v.kra_pin.$error" :validator="$v.kra_pin">
									<label>Kra pin</label>
								</ScInput>
								<ul class="sc-vue-errors">
									<li v-if="!kra_pin.required">
										Field is required
									</li>
								</ul>
							</div>
							<div class="uk-width-1-3@m">
								<ScInput v-model="$v.account_number.$model" name="account_number" :error-state="$v.account_number.$error" :validator="$v.account_number">
									<label>Account number</label>
								</ScInput>
								<ul class="sc-vue-errors">
									<li v-if="!account_number.required">
										Field is required
									</li>
								</ul><br>
							</div>
						</div>
						<div style="color:red">
							* Check for mandatory signatories of this account
						</div>
						<div v-for="(signatory, index) in $v.signatories.$each.$iter" :key="signatory.id" class="sc-padding sc-form-section" :class="{'md-bg-grey-100' : index % 2}">
							<div class="uk-grid-match uk-grid" data-uk-grid>
								<div class="uk-width-expand@m">
									<div class="uk-grid" data-uk-grid>
										<div class="uk-width-1-3@m">
											<ScInput v-model="signatory.min_amount.$model" name="min_amount" :error-state="signatory.min_amount.$error" :validator="signatory.min_amount">
												<label>Minimum Amount</label>
											</ScInput>
											<ul class="sc-vue-errors">
												<li v-if="!signatory.min_amount.required">
													Field is required
												</li>
											</ul>
										</div>
										<div class="uk-width-1-3@m">
											<ScInput v-model="signatory.max_amount.$model" name="max_amount" :error-state="signatory.max_amount.$error" :validator="signatory.max_amount">
												<label>Maximum Amount</label>
											</ScInput>
											<ul class="sc-vue-errors">
												<li v-if="!signatory.max_amount.required">
													Field is required
												</li>
											</ul>
										</div>
										
										<div class="uk-margin-top" data-uk-grid>
											<div class="uk-width-1-2@m">
												<PrettyCheck v-model="signatory.type_one.$model"
													class="p-icon"
													:error-state="signatory.type_one.$error" 
													:validator="signatory.type_one"
													true-value="yes"
													false-value="no"
												>
													<i slot="extra" class="icon mdi mdi-check"></i>
													<Select2
														v-model="signatory.signatory_one.$model" 
														name="signatory_one"
														:options="signing"
														:error-state="signatory.signatory_one.$error" 
														:validator="signatory.signatory_one"
														:settings="{ 'width': '100%', 'placeholder': 'Select signatory...', allowClear: false }"
													></Select2>
												</PrettyCheck>
												<ul class="sc-vue-errors">
													<li v-if="!signatory.signatory_one.required">
														Field is required
													</li>
												</ul>
											</div>
											<div class="uk-width-1-2@m">
												<PrettyCheck 
													v-model="signatory.type_two.$model"
													class="p-icon"
													:error-state="signatory.type_two.$error" 
													:validator="signatory.type_two"
													true-value="yes"
													false-value="no"
												>
													<i slot="extra" class="icon mdi mdi-check"></i>
													<Select2
														v-model="signatory.signatory_two.$model" 
														name="signatory_two"
														:options="signing"
														:error-state="signatory.signatory_two.$error" 
														:validator="signatory.signatory_two"
														:settings="{ 'width': '100%', 'placeholder': 'Select signatory...', allowClear: false }"
													></Select2>
												</PrettyCheck>
												<ul class="sc-vue-errors">
													<li v-if="!signatory.signatory_two.required">
														Field is required
													</li>
												</ul>
											</div>
											<div class="uk-width-1-2@m">
												<PrettyCheck v-model="signatory.type_three.$model"
													class="p-icon"
													:error-state="signatory.type_three.$error" 
													:validator="signatory.type_three"
													true-value="yes"
													false-value="no"
												>
													<i slot="extra" class="icon mdi mdi-check"></i>
													<Select2
														v-model="signatory.signatory_three.$model" 
														name="signatory_three"
														:options="signing"
														:error-state="signatory.signatory_three.$error" 
														:validator="signatory.signatory_three"
														:settings="{ 'width': '100%', 'placeholder': 'Select signatory...', allowClear: false }"
													></Select2>
												</PrettyCheck>
												<ul class="sc-vue-errors">
													<li v-if="!signatory.signatory_three.required">
														Field is required
													</li>
												</ul>
											</div>
										</div>
									</div>
								</div>
								<div class="uk-width-auto@m uk-flex-middle">
									<a href="javascript:void(0)" class="sc-button sc-button-icon sc-button-outline sc-button-outline-square sc-button-outline-danger" @click="removeAccount($event,signatory.id)">
										<i class="mdi mdi-trash-can-outline"></i>
									</a>
								</div>
							</div>
						</div>
						<div class="uk-modal-footer uk-text-right">
							<button class="sc-button sc-button-primary" :disabled="submitStatus === 'PENDING'" data-uk-tooltip="Save" @click="accountSave($event)">
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
import Flatpickr from '~/plugins/flatpickr'
import 'vue-good-table/dist/vue-good-table.css'
import axios from 'axios'
import { required, minLength, email, sameAs } from 'vuelidate/lib/validators'
import { mapGetters } from 'vuex'
import { mapState } from 'vuex'
import { format, parseISO } from 'date-fns'
import { scHelpers } from "~/assets/js/utils";
import PrettyCheck from 'pretty-checkbox-vue/check';
import vSelect from 'vue-select'
import Vue from 'vue'
Vue.component('v-select', vSelect)
import 'vue-select/dist/vue-select.css';
const { uniqueID } = scHelpers;
if(process.client) {
	require('~/plugins/idleTimeout');
}
export default {
	middleware: ['auth'],
	components: {
		Select2: process.client ? () => import('~/components/Select2') : null,
		ScInput,
		PrettyCheck,
	},
	mixins: [validationMixin],
	data: () => ({
		submitStatus: null,
		prettyCheckboxModel: true,
		dpIcons: '',
		snackText:'',
		disable: [],
		users:[],
		bank_id:'',
		branch_id:'',
		currency_id:'',
		account_name:'',
		account_number:'',
		kra_pin:'',
		currencies:[],
		options:[],
		suggestions:[],
		  	selected: {
    	name: '',
			browser: '',
			browsers: [],
			repos: [],
		},

		signatories: [
			{
				id: uniqueID(),
				min_amount:'',
				max_amount:'',
				signatory_one: '',
				type_one: '',
				signatory_two: '',
				type_two: '',
				signatory_three: '',
				type_three: '',
			}
		],
	}),
	validations: {
		bank_id: {
			required
		},
		branch_id: {
			required
		},
		currency_id: {
			required
		},
		account_name: {
			required
		},
		account_number: {
			required
		},
		kra_pin: {
			required
		},
		signatories: {
			required,
			minLength: minLength(1),
			$each: {
				min_amount: {
					required
				},
				max_amount: {
					required
				},
				signatory_one: {
					required
				},
				type_one: {
					required
				},
				signatory_two: {
					required
				},
				type_two: {
					required
				},
				signatory_three: {
					required
				},
				type_three: {
					required
				},
			}
		}
	},
	computed: {
		signing () {
			return this.users.map(function (obj) {
				obj.id = obj.id || obj.username;
				obj.text = obj.text || obj.username;
				return obj;
			});
		},
		
		currency () {
			return this.currencies.map(function (obj) {
				obj.id = obj.currency_id || obj.currency_code;
				obj.text = obj.text || obj.currency_code;
				return obj;
			});
		},
		...mapState('auth', ['loggedIn', 'user']),
		...mapGetters({
		}),
	},
	watch: {
	},
	mounted () {
		this.getUsers()
		this.getCurrency ()
		this.getAccount()
	},
	methods: {
		  onSearch (search, loading) {
			if(search.length) {
				loading(true);
				this.search(loading, search, this);
			}
		},
		
		search: _.debounce((loading, search, vm) => {
			
			var url=vm.$axios.defaults.baseURL
			fetch(url+`/banks/search?id=${escape(search)}`, { headers: {"Authorization" : window.localStorage.getItem('jwt')} }
		
			).then(res => {
				res.json().then(json => (vm.options = json));
				loading(false);
			});
			
		}, 350),

		  onSearc (searc, loading) {
			if(searc.length) {
				loading(true);
				this.searc(loading, searc, this);
				
			}
		},
		
		searc: _.debounce((loading, searc, vm) => {
			var url=vm.$axios.defaults.baseURL
			fetch(
				url+`/branches/search?q=${vm.bank_id.bank_id}&id=${escape(searc)}`, { headers: {"Authorization" : window.localStorage.getItem('jwt')} }
				
			).then(res => {
				res.json().then(json => (vm.suggestions = json));
				loading(false);
			});
		}, 350),
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
		async addAccount () {
			this.signatories.push({
				id: uniqueID(),
				user_id: '',
				type: '',
			})
		},
		async removeAccount (e, id) {
			e.preventDefault();
			var index = this.signatories.map(function (signatory) {
				return signatory.id
			}).indexOf(id);
			this.signatories.splice(index, 1);
		},
		async getCurrency () {
			try {
				await this.$axios.get(
					'/currency'
				)
					.then(res =>{
						var data = res.data.data.dataModels
						this.currencies = data
					})
					.catch(err => {
						if (err.response.data.statusCode == 401 || err.response.data.statusCode == 403) {
							// this.$store.commit('setAppRoute', this.$route.path);
							this.snackText = JSON.stringify(err.response.data.message)
						    this.showNotification(this.snackText)
			            }
					})
			} catch (err) {
				this.showNotification(err)
			}
		},
		async getUsers () {
			try {
				await this.$axios.get(
					'/users'
				)
					.then(res =>{
						var data = res.data.data.dataModels
						this.users = data
					})
					.catch(err => {
						if (err.response.data.statusCode == 401 || err.response.data.statusCode == 403) {
							this.$store.commit('setAppRoute', this.$route.path);
							// this.snackText = JSON.stringify(err.response.data.message)
						 //    this.showNotification(this.snackText)
			            }
					})
			} catch (err) {
				this.showNotification(err)
			}
		},

		async getAccount () {
			try {
				await this.$axios.get(
					`/accounts/${this.$route.params.id}`
				)
					.then(res =>{
						// this.editedItem = res.data.data.dataModels[0]
						this.bank_id = res.data.bank.bank_name
						this.branch_id = res.data.branch.branch_name
						this.currency_id=res.data.currency_id
						this.account_name=res.data.account_name
						this.account_number=res.data.account_number
						this.kra_pin=res.data.kra_pin
						this.signatories=res.data.signatory
	
					})
					.catch(err => {
						if (err.response.data.statusCode == 401 || err.response.data.statusCode == 403) {
							this.$store.commit('setAppRoute', this.$route.path);
							this.snackText = JSON.stringify(err.response.data.message)
						    this.showNotification(this.snackText)
			            }
					})
			} catch (err) {
            
			}
		},
		async accountSave (event) {
			event.preventDefault()
			this.$v.$touch();
			if (this.$v.$invalid) {
				this.submitStatus = 'ERROR'
			} else {
				this.submitStatus = 'OK'
				try {
					await this.$axios.put(`/accounts/${this.$route.params.id}`, {
						Accounts:{
							bank_id: this.bank_id.bank_id,
							branch_id: this.branch_id.branch_id,
							account_name: this.account_name,
							kra_pin: this.kra_pin,
							account_number: this.account_number,
							currency_id:this.currency_id,
						},
						Signatures:this.signatories
					})
						.then(res =>{
							this.$router.push('/banking/account')
							this.snackText = JSON.stringify(res.data.message)
							this.showNotification(this.snackText)
						})
						.catch(err => {
							if (err.response.data.statusCode == 401 || err.response.data.statusCode == 403) {
							// this.$store.commit('setAppRoute', this.$route.path);
								this.$router.push('/')
								this.snackText = JSON.stringify(err.response.data.message)
						    this.showNotification(this.snackText)
			            }
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
  @import '~scss/vue/_pretty_checkboxes';
</style>
