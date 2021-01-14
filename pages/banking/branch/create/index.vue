<template>
	<div id="sc-page-wrapper">
		<div id="sc-page-top-bar" class="sc-top-bar" data-uk-sticky="offset:48; show-on-up: true; animation: uk-animation-slide-top-medium">
			<div class="sc-top-bar-content uk-flex uk-flex-1">
				<h1 class="sc-top-bar-title uk-flex-1">
					Create Branch
				</h1>
			</div>
		</div>
		<div id="sc-page-content">
			<div class="sc-fab-page-wrapper">
				<nuxt-link :to="'/banking/branch'">
					<a href="javascript:void(0)" class="sc-fab sc-fab-medium sc-fab-primary">
						<i class="mdi mdi-arrow-left"></i>
					</a>
				</nuxt-link>
			</div>

			<ScCard>
				<ScCardBody>
					<form>
						<div class="uk-margin-top" data-uk-grid>
							<div class="uk-width-1-2@m">
								<v-select 
									v-model="bank_id"
									label="bank_name"
									:filterable="false"
									:options="options"
									:required="!selected"
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
							<div class="uk-width-1-2@m">
								<ScInput v-model="$v.branch_name.$model" name="branch_name" :error-state="$v.branch_name.$error" :validator="$v.branch_name">
									<label>Branch name</label>
								</ScInput>
								<ul class="sc-vue-errors">
									<li v-if="!branch_name.required">
										Field is required
									</li>
								</ul>
							</div>
							<div class="uk-width-1-2@m">
								<ScInput v-model="$v.physical_address.$model" name="physical_address" :error-state="$v.physical_address.$error" :validator="$v.physical_address">
									<label>Physical address</label>
								</ScInput>
								<ul class="sc-vue-errors">
									<li v-if="!physical_address.required">
										Field is required
									</li>
								</ul>
							</div>
							<div class="uk-width-1-2@m">
								<ScInput v-model="$v.contact_person_name.$model" name="contact_person_name" :error-state="$v.contact_person_name.$error" :validator="$v.contact_person_name">
									<label>Contact Person Name</label>
								</ScInput>
								<ul class="sc-vue-errors">
									<li v-if="!contact_person_name.required">
										Field is required
									</li>
								</ul>
							</div>
						</div>
						<div class="uk-margin-top" data-uk-grid>
							<div class="uk-width-1-2@m">
								<ScInput v-model="$v.contact_person_number.$model" name="contact_person_number" :error-state="$v.contact_person_number.$error" :validator="$v.contact_person_number">
									<label>Contact Person Number</label>
								</ScInput>
								<ul class="sc-vue-errors">
									<li v-if="!contact_person_number.required">
										Field is required
									</li>
								</ul>
							</div>
							<div class="uk-width-1-2@m">
								<ScInput v-model="$v.contact_person_email.$model" name="contact_person_email" :error-state="$v.contact_person_email.$error" :validator="$v.contact_person_email">
									<label>Contact Person Email</label>
								</ScInput>
								<ul class="sc-vue-errors">
									<li v-if="!contact_person_email.required">
										Field is required
									</li>
								</ul>
							</div>
						</div>
						<div class="uk-modal-footer uk-text-right">
							<button class="sc-button sc-button-primary" :disabled="submitStatus === 'PENDING'" data-uk-tooltip="Save" @click="branchSave($event)">
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
import Vue from 'vue'
import VueTypeahead from 'vue-typeahead'
import axios from 'axios'
Vue.prototype.$http = axios
var qs=require('qs')
import { validationMixin } from 'vuelidate'
import ScInput from '~/components/Input'
import { required } from 'vuelidate/lib/validators'
import { mapGetters } from 'vuex'
import { mapState } from 'vuex'
import moment from 'moment'
import vSelect from 'vue-select'

Vue.component('v-select', vSelect)
import 'vue-select/dist/vue-select.css';


// httpClient.interceptors.request.use(function (config) {
// 	const token = localStorage.getItem('token');
// 	config.headers.Authorization =  token ? `Bearer ${token}` : '';
// 	return config;
// });

export default {
	middleware: ['auth'],
	components: {
		ScInput

	},
	extends: VueTypeahead,
	mixins: [validationMixin],
	data: () => ({
		submitStatus: null,
		snackText:'',
		branch_name:'',
		bank_id:'',
		physical_address:'',
		contact_person_name:'',
		contact_person_number:'',
		contact_person_email:'',
		banks: [],
		banks: [],
		options: []



	
	}),
	validations: {
		branch_name: {
			required
		},
		bank_id: {
			required
		},
		physical_address: {
			required
		},
		contact_person_name: {
			required
		},
		contact_person_number: {
			required
		},
		contact_person_email: {
			required
		}

	},
	computed: {
		banking () {
			return this.banks.map(function (obj) {
				obj.id = obj.id || obj.bank_id;
				obj.text = obj.text || obj.bank_name;
				return obj;
			});
		},
		...mapState('auth', ['loggedIn', 'user']),
		...mapGetters({
		}),
	},
	mounted () {
		this.getBanks()
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
			fetch(
				url+`/banks/search?id=${escape(search)}`, { headers: {"Authorization" : window.localStorage.getItem('jwt')} }
			).then(res => {
				res.json().then(json => (vm.options = json));
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
		async getBanks (){
			try {
				await this.$axios.get(
					'/banks'
				)
					.then(res =>{
						var data = res.data.data.dataModels
						this.banks = data
					})
					.catch(err => {
						if (err.response.data.statusCode == 401 || err.response.data.statusCode == 403) {
							this.$store.commit('setAppRoute', this.$route.path);
			            }
					})
			} catch (err) {
				this.showNotification(err)
			}
		},
		async branchSave (event) {
			event.preventDefault()
			this.$v.$touch();
			if (this.$v.$invalid) {
				this.submitStatus = 'ERROR'
			} else {
				this.submitStatus = 'OK'
				try {
					await this.$axios.post('/branches', {
						branch_name: this.branch_name,
						bank_id: this.bank_id.bank_id,
						physical_address: this.physical_address,
						contact_person_name:this.contact_person_name,
						contact_person_number:this.contact_person_number,
						contact_person_email:this.contact_person_email
					})
						.then(res =>{
							this.$router.push('/banking/branch')
							this.snackText = 'success created'
							this.showNotification(this.snackText);
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
			}
		},
	},
	head () {
		return {
			'title': 'Dukapal | Branches'
		}
	}
}
</script>
<style lang="scss">
  @import '~scss/plugins/vue-good-table.scss';
</style>
<style scoped>
img {
  height: auto;
  max-width: 2.5rem;
  margin-right: 1rem;
}

.d-center {
  display: flex;
  align-items: center;
}

.selected img {
  width: auto;
  max-height: 23px;
  margin-right: 0.5rem;
}

.v-select .dropdown li {
  border-bottom: 1px solid rgba(112, 128, 144, 0.1);
}

.v-select .dropdown li:last-child {
  border-bottom: none;
}

.v-select .dropdown li a {
  padding: 10px 20px;
  width: 100%;
  font-size: 1.25em;
  color: #3c3c3c;
}

.v-select .dropdown-menu .active > a {
  color: #fff;
}



</style>
