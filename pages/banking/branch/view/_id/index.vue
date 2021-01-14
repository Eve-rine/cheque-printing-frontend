<template>
	<div id="sc-page-wrapper">
		<div id="sc-page-top-bar" class="sc-top-bar" data-uk-sticky="offset:48; show-on-up: true; animation: uk-animation-slide-top-medium">
			<div class="sc-top-bar-content uk-flex uk-flex-1">
				<h1 class="sc-top-bar-title uk-flex-1">
					Edit Branch
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
								<Select2
									v-model="$v.editedItem.bank_id.$model" 
									name="bank_id"
									:options="banking"
									:error-state="$v.editedItem.bank_id.$error" 
									:validator="$v.editedItem.bank_id"
									:settings="{ 'width': '100%', 'placeholder': 'Select bank...', allowClear: false }"
								></Select2>
								<ul class="sc-vue-errors">
									<li v-if="!editedItem.bank_id.required">
										Field is required
									</li>
								</ul>
							</div>
							<div class="uk-width-1-2@m">
								<ScInput v-model="$v.editedItem.branch_name.$model" name="branch_name" :error-state="$v.editedItem.branch_name.$error" :validator="$v.editedItem.branch_name">
									<label>Branch name</label>
								</ScInput>
								<ul class="sc-vue-errors">
									<li v-if="!editedItem.branch_name.required">
										Field is required
									</li>
								</ul>
							</div>
						</div>
						<div class="uk-margin-top" data-uk-grid>
							<div class="uk-width-1-1@m">
								<ScInput v-model="$v.editedItem.physical_address.$model" name="physical_address" :error-state="$v.editedItem.physical_address.$error" :validator="$v.editedItem.physical_address">
									<label>Physical address</label>
								</ScInput>
								<ul class="sc-vue-errors">
									<li v-if="!editedItem.physical_address.required">
										Field is required
									</li>
								</ul>
							</div>
						</div>
						<div class="uk-margin-top" data-uk-grid>
							<div class="uk-width-1-2@m">
								<ScInput v-model="$v.editedItem.contact_person_number.$model" name="contact_person_number" :error-state="$v.editedItem.contact_person_number.$error" :validator="$v.editedItem.contact_person_number">
									<label>Contact Person Number</label>
								</ScInput>
								<ul class="sc-vue-errors">
									<li v-if="!editedItem.contact_person_number.required">
										Field is required
									</li>
								</ul>
							</div>
							<div class="uk-width-1-2@m">
								<ScInput v-model="$v.editedItem.contact_person_name.$model" name="contact_person_name" :error-state="$v.editedItem.contact_person_name.$error" :validator="$v.editedItem.contact_person_name">
									<label>Contact Person Name</label>
								</ScInput>
								<ul class="sc-vue-errors">
									<li v-if="!editedItem.contact_person_name.required">
										Field is required
									</li>
								</ul>
							</div>
							<div class="uk-width-1-2@m">
								<ScInput v-model="$v.editedItem.contact_person_email.$model" name="contact_person_email" :error-state="$v.editedItem.contact_person_email.$error" :validator="$v.editedItem.contact_person_email">
									<label>Contact Person Email</label>
								</ScInput>
								<ul class="sc-vue-errors">
									<li v-if="!editedItem.contact_person_email.required">
										Field is required
									</li>
								</ul>
							</div>
						</div>
						<div class="uk-modal-footer uk-text-right">
							<button class="sc-button sc-button-primary" :disabled="submitStatus === 'PENDING'" data-uk-tooltip="Save" @click="branchUpdate($event,editedItem.branch_id)">
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
import { required, minLength, email, sameAs } from 'vuelidate/lib/validators'
import { mapGetters } from 'vuex'
import { mapState } from 'vuex'
import moment from 'moment'
import { format, parseISO } from 'date-fns'
import { scHelpers } from "~/assets/js/utils";
const { uniqueID } = scHelpers;

export default {
	middleware: ['auth'],
	components: {
		Select2: process.client ? () => import('~/components/Select2') : null,
		ScInput,
	},
	mixins: [validationMixin],
	data: () => ({
		submitStatus: null,
		snackText:'',
		banks:[],
		editedItem: {
			branch_name: '',
			bank_id: '',
			physical_address:'',
			contact_person_name:'',
			contact_person_number:'',
			contact_person_email:'',
		},
	
	}),
	validations: {
		editedItem: {
			branch_name: {
				required
			},
			bank_id: {
				required
			},
			physical_address: {
				required
			},
			contact_person_name:{
				required
			},
			contact_person_number:{
				required
			},
			contact_person_email:{
				required
			}
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
		this.getBranch()
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
		async getBranch () {
			try {
				await this.$axios.get(
					`/branches/${this.$route.params.id}`
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
		async branchUpdate (e, event, id) {
			e.preventDefault()
			this.$v.$touch();
			if (this.$v.editedItem.$invalid) {
				this.submitStatus = 'ERROR'
			} else {
				this.submitStatus = 'OK'
				try {
					await this.$axios.put(`/branches/${event}`, {
						branch_name: this.editedItem.branch_name,
						bank_id: this.editedItem.bank_id,
						physical_address: this.editedItem.physical_address,
					})
						.then(res =>{
							this.$router.push('/banking/branch')
							this.snackText = JSON.stringify(res.data.message)
							this.showNotification(this.snackText)
						})
						.catch(err => {
							if (err.response.data.statusCode == 401 || err.response.data.statusCode == 403) {
								this.$store.commit('setAppRoute', this.$route.path);
								this.snackText = JSON.stringify(err.response.data.message)
						    this.showNotification(this.snackText)
			            }
			            this.$router.push('/banking/branch')
						})
				} catch (err) {
					this.showNotification(err)
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
