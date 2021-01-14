<template>
	<div id="sc-page-wrapper">
		<div id="sc-page-top-bar" class="sc-top-bar" data-uk-sticky="offset:48; show-on-up: true; animation: uk-animation-slide-top-medium">
			<div class="sc-top-bar-content uk-flex uk-flex-1">
				<h1 class="sc-top-bar-title uk-flex-1">
					Create batch
				</h1>
			</div>
		</div>
		<div id="sc-page-content">
			<div class="sc-fab-page-wrapper">
				<nuxt-link :to="'/payments/batch'">
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
								Batch details
							</ScCardTitle>
						</div>
						<div class="sc-actions">
							<div>
								<a href="javascript:void(0)"
									class="sc-button sc-button-icon sc-button-outline sc-button-outline-square sc-button-outline-primary"
									type="button"
									style="margin-right: 3px"
									data-uk-tooltip="View blocked dates"
								>
									<i class="mdi mdi-eye"></i>
								</a>
								<div class="uk-width-large" data-uk-drop>
									<ScCard class="uk-margin-top">
										<ScCardBody>
											<VueGoodTable
												:columns="columns"
												:rows="scheduleList"
												style-class="uk-table uk-table-divider scutum-vgt"
												:pagination-options="{
													enabled: true,
													perPage: 5,
												}"
											>
												<template slot="table-row" slot-scope="props">
													<span v-if="props.column.field === 'month'">
														{{ props.row.dateMonth }}
													</span>
													<span v-if="props.column.field === 'from'">
														{{ props.row.from }}
													</span>
													<span v-if="props.column.field === 'to'">
														{{ props.row.to }}
													</span>
													<span v-if="props.column.field === 'title'">
														{{ props.row.title }}
													</span>
												</template>
											</VueGoodTable>
										</ScCardBody>
									</ScCard>
								</div>
							</div>
							<a href="javascript:void(0)" class="sc-button sc-button-icon sc-button-outline sc-button-outline-square sc-button-outline-primary" data-uk-tooltip="Add payee" @click="addPayee">
								<i class="mdi mdi-plus"></i>
							</a>
						</div>
					</div>
				</ScCardHeader>
				<ScCardBody>
					<form>
						<div class="uk-margin-top" data-uk-grid>
							<div class="uk-width-1-3@m">
								<client-only>
									<Select2
										v-model="$v.bank_id.$model" 
										name="bank_id"
										:error-state="$v.bank_id.$error" 
										:validator="$v.bank_id"
										:options="banking"
										:settings="{ 'width': '100%', 'placeholder': 'Select bank...', allowClear: true }"
									></Select2>
									<ul class="sc-vue-errors">
										<li v-if="!bank_id.required">
											Field is required
										</li>
									</ul>
								</client-only>
							</div>
							<div class="uk-width-1-3@m">
								<client-only>
									<Select2
										v-model="$v.branch_id.$model" 
										name="branch_id"
										:error-state="$v.branch_id.$error" 
										:validator="$v.branch_id"
										:options="branching"
										:settings="{ 'width': '100%', 'placeholder': 'Select branch...', allowClear: true }"
									></Select2>
									<ul class="sc-vue-errors">
										<li v-if="!branch_id.required">
											Field is required
										</li>
									</ul>
								</client-only>
							</div>
							<div class="uk-width-1-3@m">
								<client-only>
									<Select2
										v-model="$v.account_id.$model" 
										name="account_id"
										:error-state="$v.account_id.$error" 
										:validator="$v.account_id"
										:options="accounting"
										:settings="{ 'width': '100%', 'placeholder': 'Select account...', allowClear: true }"
									></Select2>
									<ul class="sc-vue-errors">
										<li v-if="!account_id.required">
											Field is required
										</li>
									</ul>
								</client-only>
							</div>
						</div>
						<div v-for="(item, index) in $v.chequesAdd.$each.$iter" :key="item.id" class="sc-padding sc-form-section" :class="{'md-bg-grey-100' : index % 2}">
							<div class="uk-grid-match uk-grid" data-uk-grid>
								<div class="uk-width-expand@m">
									<div class="uk-grid" data-uk-grid>
										<div class="uk-width-1-4@m">
											<ScInput v-model="item.payee.$model" name="payee" :error-state="item.payee.$error" :validator="item.payee">
												<label>Payee</label>
											</ScInput>
											<ul class="sc-vue-errors">
												<li v-if="!item.payee.required">
													Field is required
												</li>
											</ul>
										</div>
										<div class="uk-width-1-4@m">
											<ScInput v-model="item.amount.$model" name="amount" :error-state="item.amount.$error" :validator="item.amount">
												<label>Amount</label>
											</ScInput>
											<ul class="sc-vue-errors">
												<li v-if="!item.amount.required">
													Field is required
												</li>
											</ul>
										</div>
										<div class="uk-width-1-4@m">
											<ScInput v-model="item.pay_date.$model"
												v-flatpickr="dpRange"
												placeholder="Pick date..."
												:error-state="item.pay_date.$error"
												:validator="item.pay_date"
											>
											</ScInput>
											<ul class="sc-vue-errors">
												<li v-if="!item.pay_date.required">
													Field is required
												</li>
											</ul>
										</div>
										<div class="uk-width-1-4@m">
											<client-only>
												<Select2
													v-model="item.cheque_type.$model" 
													name="cheque_type"
													:error-state="item.cheque_type.$error" 
													:validator="item.cheque_type"
													:options="chequeStatus"
													:settings="{ 'width': '100%', 'placeholder': 'Select type...', allowClear: true }"
												></Select2>
											</client-only>
											<ul class="sc-vue-errors">
												<li v-if="!item.cheque_type.required">
													Field is required
												</li>
											</ul>
										</div>
									</div>
								</div>
								<div class="uk-width-auto@m uk-flex-middle">
									<a href="javascript:void(0)" class="sc-button sc-button-icon sc-button-outline sc-button-outline-square sc-button-outline-danger" @click="removePayee($event,item.id)">
										<i class="mdi mdi-trash-can-outline"></i>
									</a>
								</div>
							</div>
						</div>
						<div class="uk-modal-footer uk-text-right">
							<button class="sc-button sc-button-primary" :disabled="submitStatus === 'PENDING'" data-uk-tooltip="Save" @click="submitForm($event)">
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
import { VueGoodTable } from 'vue-good-table'
import moment from 'moment'
import { format, parseISO } from 'date-fns'
import { scHelpers } from "~/assets/js/utils";
const { uniqueID } = scHelpers;
export default {
	middleware: ['auth'],
	components: {
		Select2: process.client ? () => import('~/components/Select2') : null,
		ScInput,
		VueGoodTable,
	},
	mixins: [validationMixin],
	data: () => ({
		dateleft:6,
		submitStatus: null,
		dpIcons: '',
		snackText:'',
		disable: [],
		scheduleList: [],
		filteredDates: [],
		banks: [],
		branches: [],
		accounts: [],
		type: ['Open', 'Closed'],
		authorization: ['Approve', 'Decline'],
		search: '',
		valid: true,
		dialog: false,
		chequeStatus: ['Open', 'Closed'],
		cheques: [],
		bank_id:'',
		branch_id:'',
		account_id:'',
		payee: '',
		amount: '',
		pay_date: '',
		cheque_type: '',
		chequesAdd: [
			{
				id: uniqueID(),
				payee: '',
				amount: '',
				pay_date: '',
				cheque_no: '',
				status: '',
				cheque_type: '',
				menu2:'',
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
		account_id: {
			required
		},
		chequesAdd: {
			$each: {
				payee: {
					required
				},
				amount: {
					required
				},
				pay_date: {
					required
				},
				cheque_type: {
					required
				},
			}
		}
	},
	computed: {
		columns () {
			return [
				{
					label: 'Month',
					field: 'dateMonth',
					tdClass: 'uk-text-center',
					filterOptions: {
						enabled: true,
						filterDropdownItems: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
					}
				},
				{
					label: 'From',
					field: 'from',
					filterOptions: {
						enabled: true
					}
				},
				{
					label: 'To',
					field: 'to',
					filterOptions: {
						enabled: true
					}
				},
				{
					label: 'Reason',
					field: 'title',
					filterOptions: {
						enabled: true
					}
				}
			]
		},
		dpRange () {
			return {
				minDate:"today",
				disable: this.disable,
				beforeShowDay: function (date) {
		            return [true, 'highlighted', 'The custom title'];
		        }
			}
		},
		banking () {
			return this.banks.map(function (obj) {
				obj.id = obj.id || obj.bank_id;
				obj.text = obj.text || obj.bank_name;
				return obj;
			});
		},
		branching () {
			return this.branches.map(function (obj) {
				obj.id = obj.id || obj.branch_id;
				obj.text = obj.text || obj.branch_name;
				return obj;
			});
		},
		accounting () {
			return this.accounts.map(function (obj) {
				obj.id = obj.id || obj.account_number;
				obj.text = obj.text || obj.account_number;
				return obj;
			});
		},
		...mapState('auth', ['loggedIn', 'user']),
		...mapGetters({
		}),
	},
	watch: {
		bank_id (id) {
			try {
				this.$axios.get(
					`/branches/select/${id}`
				)
					.then(res =>{
						this.branches = res.data.data.dataModels
						this.accounts = []
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
		branch_id (id) {
			try {
				this.$axios.get(
					`/accounts/select/${id}`
				)
					.then(res =>{
						this.accounts = res.data.data.dataModels
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
	},
	mounted () {
		this.getBanks()
		this.getEvents()
		this.getDates()
		this.chequesAdd = []
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
		addPayee () {
			this.chequesAdd.push({
				id: uniqueID(),
				payee: '',
				amount: '',
				pay_date: '',
				cheque_type: '',
			})
		},
		removePayee (e, id) {
			e.preventDefault();
			var index = this.chequesAdd.map(function (item) {
				return item.id
			}).indexOf(id);
			this.chequesAdd.splice(index, 1);
		},

		async getEvents (){
			await this.$axios.get(
				'/events/dates',
			)
				.then(res =>{
					this.disable = res.data.data.dataModels
				})
				.catch(err => {
					if (err.response.data.statusCode == 401 || err.response.data.statusCode == 403) {
						this.$store.commit('setAppRoute', this.$route.path);
						// this.snackText = JSON.stringify(err.response.data.message)
						//     this.showNotification(this.snackText)
			            }
				})
		},
		async getDates (){
			await this.$axios.get(
				'/events',
			)
				.then(res =>{
					this.scheduleList = res.data.data.dataModels
				})
				.catch(err => {
					if (err.response.data.statusCode == 401 || err.response.data.statusCode == 403) {
						this.$store.commit('setAppRoute', this.$route.path);
						this.snackText = JSON.stringify(err.response.data.message)
						    this.showNotification(this.snackText)
			            }
				})
		},
		async getBanks () {
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
							this.snackText = JSON.stringify(err.response.data.message)
						    this.showNotification(this.snackText)
			            }
					})
			} catch (err) {
				this.showNotification(err)
			}
		},
		async submitForm (event) {
			event.preventDefault()
			this.$v.$touch();
			if (this.$v.$invalid) {
				this.submitStatus = 'ERROR'
			} else {
				this.submitStatus = 'OK'
				try {
					await this.$axios.post('/batch/create', {
						bank_id: this.bank_id,
						branch_id: this.branch_id,
						account_id: this.account_id,
						Cheques: this.chequesAdd
					})
						.then(res =>{
							this.$router.push('/payments/batch')
							this.snackText = JSON.stringify(res.data.message)
							this.showNotification(this.snackText)
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
			}
		},
	},
	head () {
		return {
			'title': 'Medfast | Create'
		}
	}
}
</script>
<style lang="scss">
  @import '~scss/plugins/vue-good-table.scss';
</style>
