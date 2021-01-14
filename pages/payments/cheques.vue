<template>
	<div id="sc-page-wrapper">
		<client-only>
			<div id="sc-page-top-bar" class="sc-top-bar" data-uk-sticky="offset:48; show-on-up: true; animation: uk-animation-slide-top-medium">
				<div class="sc-top-bar-content uk-flex uk-flex-1">
					<h1 class="sc-top-bar-title uk-flex-1">
						Cheques
					</h1>
					<div class="sc-actions">
						<a class="sc-fab sc-fab-small sc-fab-primary" type="button" data-uk-toggle="target: #modal-open-date-range">
							<i class="mdi mdi-package-down"></i>
						</a>
					</div>
					<div class="sc-actions uk-margin-left">
						<a href="javascript:void(0)" class="sc-actions-icon mdi mdi-filter-variant sc-js-el-hide" data-uk-toggle="target: #sc-page-top-bar; cls: sc-top-bar-expanded"></a>
						<a href="javascript:void(0)" class="sc-actions-icon mdi mdi-close sc-js-el-show" data-uk-toggle="target: #sc-page-top-bar; cls: sc-top-bar-expanded"></a>
					</div>
				</div>
				<div class="sc-top-bar-content-expanded">
					<div class="uk-flex-bottom" data-uk-grid data-uk-match-height>
						<div class="uk-width-1-2@m">
						</div>
						<div class="uk-width-1-2@m">
							<form>
								<div class="uk-margin-top" data-uk-grid>
									<div class="uk-width-1-2@m">
										<div>
											<client-only>
												<Select2
													v-model="filter"
													:options="tagging"
													:settings="{ 'width': '100%', 'minimumResultsForSearch': -1, 'placeholder': 'Select filter...', 'closeOnSelect': false }"
													multiple
												></Select2>
											</client-only>
										</div>
									</div>
									<div class="uk-width-1-2@m">
										<button class="sc-button sc-button-primary" :disabled="submitStatus === 'PENDING'" data-uk-tooltip="Save" @click="filterData($event)">
											Filter
										</button>
									</div>
								</div>
							</form>
						</div>
					</div>
				</div>
			</div>
		</client-only>
		<div id="sc-page-content">
			<div v-if="loggedIn" id="modal-open-date-range" class="uk-flex-middle" uk-modal="bg-close:false">
				<div class="uk-modal-dialog uk-modal-body">
					<button class="uk-modal-close-default" type="button" data-uk-close @click.prevent="clearForm($event)"></button>
					<h2 class="uk-modal-title">
						Select date range
					</h2>
					<form>
						<div class="uk-margin-top" data-uk-grid>
							<div class="uk-width-1-3@m">
								<ScInput v-model="$v.dateFrom.$model"
									v-flatpickr
									placeholder="start date..."
									:error-state="$v.dateFrom.$error"
									:validator="$v.dateFrom"
								>
								</ScInput>
								<ul class="sc-vue-errors">
									<li v-if="!dateFrom.required">
										Field is required
									</li>
								</ul>
							</div>
							<div class="uk-width-1-3@m">
								<ScInput v-model="$v.dateTo.$model"
									v-flatpickr
									placeholder="end date..."
									:error-state="$v.dateTo.$error"
									:validator="$v.dateTo"
								>
								</ScInput>
								<ul class="sc-vue-errors">
									<li v-if="!dateTo.required">
										Field is required
									</li>
								</ul>
							</div>
							<div class="uk-width-1-3@m">
								<client-only>
									<Select2
										v-model="$v.filter.$model"
										:options="tagging"
										:error-state="$v.filter.$error"
										:validator="$v.filter"
										:settings="{ 'width': '100%', 'minimumResultsForSearch': -1, 'placeholder': 'Select filter...', 'closeOnSelect': false }"
									></Select2>
								</client-only>
								<ul class="sc-vue-errors">
									<li v-if="!filter.required">
										Field is required
									</li>
								</ul>
							</div>
						</div>
						<div class="uk-modal-footer uk-text-right">
							<button class="sc-button sc-button-primary" :disabled="submitStatus === 'PENDING'" data-uk-tooltip="Download excel" @click="listExcelDownload($event)">
								<i class="mdi mdi-file-excel-outline sc-icon-18"></i>
							</button>
							<button class="sc-button sc-button-primary" :disabled="submitStatus === 'PENDING'" data-uk-tooltip="Download PDF" @click="listPdfDownload($event)">
								<i class="mdi mdi-file-pdf-outline sc-icon-18"></i>
							</button>
						</div>
					</form>
				</div>
			</div>
			<ScCard>
				<ScCardBody>
					<VueGoodTable
						:columns="columns"
						:rows="issues"
						:pagination-options="{ enabled: true }"
						style-class="uk-table uk-table-divider scutum-vgt"
					>
						<template slot="table-row" slot-scope="props">
							<span v-if="props.column.field === 'issueId'">
								{{ props.index + 1 }}
							</span>
							<span v-if="props.column.field === 'batch_id'">
								<nuxt-link :to="'/payments/view/'+ props.row.batch_id">
									<button class="sc-button sc-button-mini md-bg-green-400" data-uk-tooltip="View batch entries">
										{{ props.row.batch_id }}
									</button>
								</nuxt-link>
							</span>
							<span v-if="props.column.field === 'payee'">
								{{ props.row.payee }}
							</span>
							<span v-if="props.column.field === 'amount'">
								{{ formatAmount(props.row.amount) }}
							</span>
							<span v-if="props.column.field === 'pay_date'">
								{{ formatDatee(props.row.pay_date) }}
							</span>
							<span v-if="props.column.field === 'cheque_no'">
								{{ props.row.cheque_no }}
							</span>
							<span v-if="props.column.field === 'status'" class="uk-badge md-bg-red-600">
								<div v-if="props.row.print_status == '10'">
									printed
								</div>
								<div v-if="props.row.print_status == '9'">
									Not printed
								</div>
								<div v-if="props.row.print_status == '8'">
									rejected
								</div>
							</span>
						</template>
					</VueGoodTable>
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
import { VueGoodTable } from 'vue-good-table'
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
		VueGoodTable,
		ScInput,
	},
	mixins: [validationMixin],
	data: () => ({
		tags: [
			{
				id: '10',
				text: 'Printed'
			},
			{
				id: '9',
				text: 'Non printed'
			},
			{
				id: '8',
				text: 'Rejected'
			}
		],
		dateFrom:'',
		dateTo:'',
		filter:'',
		submitStatus: null,
		dpIcons: '',
		issues: [],
	}),
	validations: {
		dateTo: {
			required
		},
		dateFrom: {
			required
		},
		filter: {
			required
		}
	},
	computed: {
		tagging () {
			return this.tags.map(function (obj) {
				obj.id = obj.id || obj.id;
				obj.text = obj.text || obj.text;
				return obj;
			});
		},
		...mapState('auth', ['loggedIn', 'user']),
		...mapGetters({
		}),
		columns () {
			return [
				{
					label: '#',
					field: 'issueId',
				},
				{
					label: 'Batch',
					field: 'batch_id',
				},
				{
					label: 'Payee',
					field: 'payee',
				},
				{
					label: 'Amount',
					field: 'amount',
				},
				{
					label: 'Cheque No.',
					field: 'cheque_no',
				},
				{
					label: 'Pay date',
					field: 'pay_date',
				},
				{
					label: 'Status',
					field: 'status'
				},
			]
		}
	},
	mounted () {
		this.$store.commit('setAppRedirect', this.$route.path);
		this.getCheques()
	},
	methods: {
		async clearForm () {
			this.$data.dateTo = ""
			this.$data.dateFrom = ""
			this.$data.filter = ""
			this.$v.dateTo.$reset()
			this.$v.dateFrom.$reset()
			this.$v.filter.$reset()
		},
		formatDate (value) {
			var date = new Date(value * 1000)
			return moment(date).format("DD MMM, YYYY")
		},
		formatDatee (value) {
			return moment(value).format("DD MMM, YYYY")
		},
		formatAmount (value) {
			return value.replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')
		},
		async getCheques () {
			try {
				await this.$axios.get(
					'/cheques/given'
				)
					.then(res =>{
						this.issues = res.data.data.dataModels
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
		async filterData (event) {
			event.preventDefault()
			try {
				await this.$axios.get( `/cheques/filter/${this.filter}`)
					.then(res =>{
						this.issues = res.data.data.dataModels
					})
					.catch(err => {
						if (err.response.data.statusCode == 401 || err.response.data.statusCode == 403) {
							this.$store.commit('setAppRoute', this.$route.path);
							this.snackText = JSON.stringify(err.response.data.message)
						    this.showNotification(this.snackText)
			            }
					})
			} catch (err) {
				this.swal(err)
			}
		},
		async listExcelDownload (event) {
			event.preventDefault()
			this.$v.$touch();
			if (this.$v.$invalid) {
				this.submitStatus = 'ERROR'
			} else {
				this.submitStatus = 'OK'
				var dateFrom = parseInt((new Date(this.dateFrom).getTime() / 1000).toFixed(0))
				var dateTo = parseInt((new Date(this.dateTo).getTime() / 1000).toFixed(0))
				await this.$axios({
					url: `/cheques/excel/${dateFrom},${dateTo},${this.filter}`,
					method: 'GET',
					responseType: 'blob',
				})
					.then((response) => {
						if (!window.navigator.msSaveOrOpenBlob){
							const url = window.URL.createObjectURL(new Blob([response.data]));
							const link = document.createElement('a');
							link.href = url;
							link.setAttribute('download', 'download.xlsx');
							document.body.appendChild(link);
							link.click();
						}else{
							const url = window.navigator.msSaveOrOpenBlob(new Blob([response.data]), "download.xlsx");
						}
					})
					.catch(err => {
						if (err.response.data.statusCode == 401 || err.response.data.statusCode == 403) {
							this.$store.commit('setAppRoute', this.$route.path);
							this.snackText = JSON.stringify(err.response.data.message)
						    this.showNotification(this.snackText)
			            }
					})
			}
		},
		async listPdfDownload (event) {
			event.preventDefault()
			this.$v.$touch();
			if (this.$v.$invalid) {
				this.submitStatus = 'ERROR'
			} else {
				this.submitStatus = 'OK'
				var dateFrom = parseInt((new Date(this.dateFrom).getTime() / 1000).toFixed(0))
				var dateTo = parseInt((new Date(this.dateTo).getTime() / 1000).toFixed(0))
				await this.$axios({
					url: `/cheques/pdf/${dateFrom},${dateTo},${this.filter}`,
					method: 'GET',
					responseType: 'blob',
				})
					.then((response) => {
						if (!window.navigator.msSaveOrOpenBlob){
							const url = window.URL.createObjectURL(new Blob([response.data]));
							const link = document.createElement('a');
							link.href = url;
							link.setAttribute('download', 'download.pdf');
							document.body.appendChild(link);
							link.click();
						}else{
							const url = window.navigator.msSaveOrOpenBlob(new Blob([response.data]), "download.pdf");
						}
					})
					.catch(err => {
						if (err.response.data.statusCode == 401 || err.response.data.statusCode == 403) {
							this.$store.commit('setAppRoute', this.$route.path);
							this.snackText = JSON.stringify(err.response.data.message)
						    this.showNotification(this.snackText)
			            }
					})
			}
		},
	},
	head () {
		return {
			'title': 'Medfast | Printed'
		}
	}
}
</script>
<style lang="scss">
  @import '~scss/plugins/vue-good-table.scss';
</style>
