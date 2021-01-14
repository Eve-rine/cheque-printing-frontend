<template>
	<div id="sc-page-wrapper">
		<client-only>
			<div id="sc-page-top-bar" class="sc-top-bar" data-uk-sticky="offset:48; show-on-up: true; animation: uk-animation-slide-top-medium">
				<div class="sc-top-bar-content uk-flex uk-flex-1">
					<h1 class="sc-top-bar-title uk-flex-1">
						Batch
					</h1>
					<div class="sc-actions">
						<a class="sc-fab sc-fab-small sc-fab-primary" type="button" data-uk-toggle="target: #modal-open-date-range">
							<i class="mdi mdi-package-down"></i>
						</a>
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
							<div class="uk-width-1-2@m">
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
							<div class="uk-width-1-2@m">
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
				<div class="sc-fab-page-wrapper">
					<nuxt-link :to="'/payments/create'">
						<a href="javascript:void(0)" class="sc-fab sc-fab-medium sc-fab-primary">
							<i class="mdi mdi-plus"></i>
						</a>
					</nuxt-link>
				</div>
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
							<span v-if="props.column.field === 'cheques'">
								{{ props.row.cheques }}
							</span>
							<span v-if="props.column.field === 'amount'">
								{{ formatAmount(props.row.amount) }}
							</span>
							<span v-if="props.column.field === 'status'" :class="[statusLabel(props.row.status)]">
								{{ props.row.status }}
							</span>
							<span v-if="props.column.field === 'action'">
								<button v-if="props.row.status === 'printed'" class="sc-button sc-button-mini md-bg-red-400" data-uk-tooltip="Printed">
									<i class="mdi mdi-printer md-color-white"></i>
								</button>
								<button v-else class="sc-button sc-button-mini md-bg-orange-400" data-uk-tooltip="Print cheques" @click="downloadCheques($event, props.row.batch_id)">
									<i class="mdi mdi-printer md-color-white"></i>
								</button>
								<button class="sc-button sc-button-mini md-bg-green-400" data-uk-tooltip="Download list" @click="downloadBatch($event, props.row.batch_id)">
									<i class="mdi mdi-arrow-down-bold-box-outline md-color-white"></i>
								</button>
								<button class="sc-button sc-button-mini md-bg-blue-400" data-uk-tooltip="Print history" @click="recordCheques($event, props.row.batch_id)">
									<i class="mdi mdi-printer-off md-color-white"></i>
								</button>
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
import { scHelpers } from "~/assets/js/utils"
const { uniqueID } = scHelpers
export default {
	middleware: ['auth'],
	components: {
	
		ScInput,
		VueGoodTable,
	},
	mixins: [validationMixin],
	data: () => ({
		tags: [],
		dateFrom:'',
		dateTo:'',
		submitStatus: null,
		dpIcons: '',
		currentPage: 1,
		itemsPerPage: 20,
		resultCount: '',
		issues: []
	}),
	validations: {
		dateTo: {
			required
		},
		dateFrom: {
			required
		}
	},
	computed: {
		chequesDom: function () {      
	          return this.cheques      
	    },  
		totalPages: function () {
			return Math.ceil(this.resultCount / this.itemsPerPage)
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
					label: 'Cheques',
					field: 'cheques',
				},
				{
					label: 'Amount',
					field: 'amount',
				},
				{
					label: 'Status',
					field: 'status'
				},
				{
					label: 'Action',
					field: 'action'
				}
			]
		}
	},
	watch: {
		bank_id (id) {
			try {
				this.$axios.get(
					`/branch/select/${id}`
				)
					.then(res =>{
						this.branches = res.data.data.dataModels
						this.accounts = []
					})
					.catch(err => {
						if (err.response.data.statusCode == 401 || err.response.data.statusCode == 403) {
							this.$store.commit('setAppRoute', this.$route.path);
			            }
			            this.snackText = JSON.stringify(err.response.data.message)
						this.showNotification(this.snackText)
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
			            }
			            this.snackText = JSON.stringify(err.response.data.message)
						this.showNotification(this.snackText)
					})
			} catch (err) {
				this.showNotification(err)
			}
		},
	},
	mounted () {
		this.$store.commit('setAppRedirect', this.$route.path);
		this.getBatch()    
	},
	methods: {
		statusLabel (status) {
	      let statusClass = null;
	      switch (status) {
	      case 'complete':
	        statusClass = 'uk-badge md-bg-green-600';
	        break;
	      case 'printed':
	        statusClass = 'uk-badge md-bg-red-600';
	        break;
	      case 'pending':
	        statusClass = 'uk-badge md-bg-orange-600';
	        break;
	      case 'closed':
	        statusClass = 'uk-badge md-bg-red-600';
	        break;
	      case 'Open':
	        statusClass = 'uk-badge md-bg-green-600';
	        break;
	      default:
	      }
	      return statusClass;
	    },

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
		async clearForm () {
			this.$data.dateTo = ""
			this.$data.dateFrom = ""
			this.$v.dateTo.$reset()
			this.$v.dateFrom.$reset()
		},
		formatAmount (value) {
			return value.replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')
		},
		async getBatch () {
			try {
				await this.$axios.get(
					'/batch'
				)
					.then(res =>{
						this.issues = res.data.data.dataModels
						this.resultCount = res.data.data.count.totalCount
						this.itemsPerPage = res.data.data.count.defaultPageSize
					})
					.catch(err => {
						if (err.response.data.statusCode == 401 || err.response.data.statusCode == 403) {
							this.$store.commit('setAppRoute', this.$route.path);
			            }
			            this.snackText = JSON.stringify(err.response.data.message)
						this.showNotification(this.snackText)
					})
			} catch (err) {
				this.showNotification(err)
			}
		},
		async downloadBatch (event, id) {
			try {
				await this.$axios({
					url: `/batch/download/pdf/${id}`,
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
			            }
			            this.snackText = JSON.stringify(err.response.data.message)
						this.showNotification(this.snackText)
					})
			} catch (err) {
				this.showNotification(err)
			}
		},
		async downloadCheques (event, id) {
			try {
				await this.$axios({
					url: `/cheques/download/${id}`,
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
			            }
			            this.snackText = JSON.stringify(err.response.data.message)
						this.showNotification(this.snackText)
					})
			} catch (err) {
				this.showNotification(err)
			}
		},
		async recordCheques (event, id) {
			try {
				await this.$axios({
					url: `/cheques/record/${id}`,
					method: 'GET',
					responseType: 'blob',
				})
					.then((response) => {
						this.getBatch()
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
			            }
			            this.snackText = JSON.stringify(err.response.data.message)
						this.showNotification(this.snackText)
					})
			} catch (err) {
				this.showNotification(err)
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
					url: `/batch/pdf/${dateFrom},${dateTo}`,
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
			            }
			            this.snackText = JSON.stringify(err.response.data.message)
						this.showNotification(this.snackText)
					})
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
					url: `/batch/excel/${dateFrom},${dateTo}`,
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
			            }
			            this.snackText = JSON.stringify(err.response.data.message)
						this.showNotification(this.snackText)
					})
			}
		},
	},
	head () {
		return {
			'title': 'Medfast | Batch'
		}
	}
}
</script>
<style lang="scss">
  @import '~scss/plugins/vue-good-table.scss';
</style>
<style type="text/css">

a.first::after {
  content:'...'
}

a.last::before {
  content:'...'
}
</style>