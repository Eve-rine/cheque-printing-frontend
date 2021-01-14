<template>
	<div id="sc-page-wrapper">
		<client-only>
			<div id="sc-page-top-bar" class="sc-top-bar" data-uk-sticky="offset:48; show-on-up: true; animation: uk-animation-slide-top-medium">
				<div class="sc-top-bar-content uk-flex uk-flex-1">
					<h1 class="sc-top-bar-title uk-flex-1">
						Batch {{ batch_no }} cheques
					</h1>
					<div class="sc-actions">
						<button class="sc-fab sc-fab-small sc-fab-primary" type="button">
							<i class="mdi mdi-package-down"></i>
						</button>
						<div data-uk-dropdown="pos: bottom-left">
							<ScCard>
								<ul class="uk-nav uk-dropdown-nav">
									<li>
										<a href="javascript:void(0)" @click="listExcelDownload($event)">
											<i class="mdi mdi-file-excel-outline"></i>Download excel
										</a>
									</li>
									<li>
										<a href="javascript:void(0)" @click="listPdfDownload($event)">
											<i class="mdi mdi-file-pdf-outline"></i>Download pdf
										</a>
									</li>
								</ul>
							</ScCard>
						</div>
					</div>
					<div class="sc-actions uk-margin-left">
						<a href="javascript:void(0)" class="sc-actions-icon mdi mdi-filter-variant sc-js-el-hide" data-uk-toggle="target: #sc-page-top-bar; cls: sc-top-bar-expanded"></a>
						<a href="javascript:void(0)" class="sc-actions-icon mdi mdi-close sc-js-el-show" data-uk-toggle="target: #sc-page-top-bar; cls: sc-top-bar-expanded"></a>
					</div>
				</div>
			</div>
		</client-only>
		<div id="sc-page-content">
			<div v-if="loggedIn" id="modal-open-edit" class="uk-flex-middle" uk-modal="bg-close:false">
				<div class="uk-modal-dialog uk-modal-body">
					<button class="uk-modal-close-default" type="button" data-uk-close></button>
					<h2 class="uk-modal-title">
						Edit cheque
					</h2>
					<form>
						<div class="uk-margin-top" data-uk-grid>
							<div class="uk-width-1-4@m">
								<ScInput v-model="editedItem.payee" name="payee">
									<label>Payee</label>
								</ScInput>
							</div>
							<div class="uk-width-1-4@m">
								<ScInput v-model="editedItem.amount" name="amount">
									<label>Amount</label>
								</ScInput>
							</div>
							<div class="uk-width-1-4@m">
								<div v-flatpickr="{ wrap: true, clickOpens: false }" class="uk-position-relative">
									<a class="uk-form-icon uk-form-icon-flip" href="javascript:void(0)" data-uk-icon="icon: calendar" data-toggle></a>
									<a v-show="editedItem.pay_date !== ''"
										class="uk-form-icon uk-form-icon-flip"
										href="javascript:void(0)"
										data-uk-icon="icon: close"
										data-clear
									></a>
									<input
										v-model="editedItem.pay_date" 
										name="pay_date"
										class="uk-input"
										type="text"
										placeholder="Pay date"
										data-input
									>
								</div>
							</div>
							<div class="uk-width-1-4@m">
								<client-only>
									<Select2
										v-model="editedItem.cheque_type" 
										name="cheque_type"
										:options="chequeStatus"
										:settings="{ 'width': '100%', 'placeholder': 'Select type...', allowClear: true }"
									></Select2>
								</client-only>
							</div>
						</div>
						<div class="uk-modal-footer uk-text-right">
							<button class="sc-button sc-button-primary" :disabled="submitStatus === 'PENDING'" data-uk-tooltip="Save" @click="chequeUpdate($event,editedItem.id)">
								<i class="mdi mdi-checkbox-marked-outline"></i>
							</button>
						</div>
					</form>
				</div>
			</div>
			<div v-if="loggedIn" id="modal-open-cheque-no" class="uk-flex-middle" uk-modal="bg-close:false">
				<div class="uk-modal-dialog uk-width-1-4 uk-margin-auto uk-modal-body">
					<button class="uk-modal-close-default" type="button" data-uk-close></button>
					<h2 class="uk-modal-title">
						Save cheque number
					</h2>
					<form>
						<div class="uk-margin-top" data-uk-grid>
							<div class="uk-width-1-1@m">
								<ScInput v-model="editedCheque.cheque_no" name="cheque_no">
									<label>Cheque number</label>
								</ScInput>
							</div>
						</div>
						<div class="uk-modal-footer uk-text-right">
							<button class="sc-button sc-button-danger uk-modal-close" type="button" data-uk-tooltip="Close">
								<i class="mdi mdi-close-outline"></i>
							</button>
							<button class="sc-button sc-button-primary" :disabled="submitStatus === 'PENDING'" data-uk-tooltip="Save" @click="chequeNoUpdate($event,editedCheque.id)">
								<i class="mdi mdi-checkbox-marked-outline"></i>
							</button>
						</div>
					</form>
				</div>
			</div>
			<div v-if="loggedIn" id="modal-open-auth" class="uk-flex-middle" uk-modal="bg-close:false">
				<div class="uk-modal-dialog uk-width-1-4 uk-margin-auto uk-modal-body">
					<button class="uk-modal-close-default" type="button" data-uk-close></button>
					<h2 class="uk-modal-title">
						Append signature
					</h2>
					<form>
						<div class="uk-margin-top" data-uk-grid>
							<div class="uk-width-1-1@m">
								<client-only>
									<Select2
										v-model="editedItem.authorization_status" 
										name="authorization_status"
										:options="authorization"
										:settings="{ 'width': '100%', 'placeholder': 'Select action...', allowClear: true }"
									></Select2>
								</client-only>
							</div>
							<div class="uk-width-1-1@m">
								<ScInput v-model="editedItem.password" type="password" name="password">
									<label>Password</label>
								</ScInput>
							</div>
						</div>
						<div class="uk-modal-footer uk-text-right">
							<button class="sc-button sc-button-primary uk-modal-close" :disabled="submitStatus === 'PENDING'" data-uk-tooltip="Save" @click="authCheque($event,editedItem.id)">
								<i class="mdi mdi-checkbox-marked-outline"></i>
							</button>
						</div>
					</form>
				</div>
			</div>
			<div class="sc-fab-page-wrapper">
				<nuxt-link :to="'/payments/batch'">
					<a href="javascript:void(0)" class="sc-fab sc-fab-medium sc-fab-primary">
						<i class="mdi mdi-arrow-left"></i>
					</a>
				</nuxt-link>
			</div>
			<ScCard>
				<ScCardBody>
					<table class="uk-table uk-table-small uk-table-divider">
						<thead>
							<tr>
								<th class="uk-text-nowrap">
									<strong>#</strong>
								</th>
								<th class="uk-text-nowrap">
									<strong>Payee</strong>
								</th>
								<th class="uk-text-nowrap">
									<strong>Amount</strong>
								</th>
								<th class="uk-text-nowrap">
									<strong>Pay date</strong>
								</th>
								<th class="uk-text-nowrap">
									<strong>Cheque No.</strong>
								</th>
								<th class="uk-text-nowrap">
									<strong>Type</strong>
								</th>
								<th class="uk-text-nowrap">
									<strong>Authorize</strong>
								</th>
								<th class="uk-text-nowrap">
									<strong>Guide</strong>
								</th>
								<th class="uk-text-nowrap">
									<strong>Signed</strong>
								</th>
								<th class="uk-text-nowrap">
									<strong>Status</strong>
								</th>
								<th class="uk-text-nowrap">
									<strong>Action</strong>
								</th>
							</tr>
						</thead>
						<tbody>
							<tr v-for="(cheque, index) in issues" :key="index">
								<td> {{ index + 1 }}</td>
								<td>{{ cheque.payee }}</td>
								<td>{{ formatAmount(cheque.amount) }}</td>
								<td>{{ formatDatee(cheque.pay_date) }}</td>
								<td>
									<p v-if="cheque.cheque_no == null">
										<center>_ _ _ _ _ _</center>
									</p>
									<p v-else>
										<span class="uk-badge md-bg-orange-600">
											{{ cheque.cheque_no }}
										</span>
									</p>
								</td>
								<td> 
									{{ cheque.cheque_type }}
								</td>
								<td>
									<div v-if="cheque.print_status == '10'">
										<button class="sc-button sc-button-mini md-bg-red-400" data-uk-tooltip="Printed">
											<i class="mdi mdi-thumb-up md-color-white"></i>
										</button>
									</div>
									<div v-else-if="cheque.status == 'printed'">
										<button class="sc-button sc-button-mini md-bg-red-400" data-uk-tooltip="closed">
											<i class="mdi mdi-thumb-up md-color-white"></i>
										</button>
									</div>
									<div v-else>
										<button class="sc-button sc-button-mini md-bg-green-400"
											data-uk-tooltip="Authorize cheque"
											type="button"
											@click="authItem(cheque)"
										>
											<i class="mdi mdi-check-all md-color-white"></i>
										</button>
									</div>
								</td>
								<td> 
									<div v-if="cheque.approval_count == null">
										<span class="uk-badge md-bg-orange-600">
											{{ cheque.approval }} -0
										</span>
									</div>
									<div v-else>
										<span class="uk-badge md-bg-orange-600">
											{{ cheque.approval }} - {{ cheque.approval_count }}
										</span>
									</div>
								</td>
								<td>
									<div v-if="cheque.print_status == '10'">
										<span class="uk-badge md-bg-orange-600">
											Signed
										</span>
									</div>
									<div v-else>
										<span class="uk-badge md-bg-orange-600">
											Pending
										</span>
									</div>
								</td>
								<td>
									<div v-if="cheque.status == 'closed'">
										<span :class="[statusLabel(cheque.status)]">
											printed
										</span>
									</div>
									<div v-if="cheque.status == 'printed'">
										<span :class="[statusLabel(cheque.status)]">
											closed
										</span>
									</div>
									<div v-if="cheque.status == 'complete'">
										<span :class="[statusLabel(cheque.status)]">
											pending
										</span>
									</div>
								</td>
								<td>
									<div v-if="cheque.print_status == '10' && cheque.status == 'printed'">
										<button class="sc-button sc-button-mini md-bg-blue-400"
											data-uk-tooltip="Save cheque number"
											type="button"
											data-uk-toggle="target: #modal-open-cheque-no"
											@click="editChequeNo(cheque)"
										>
											<i class="mdi mdi-cash-100 md-color-white"></i>
										</button>
									</div>
									<div v-else-if="cheque.status == 'complete'">
										<div v-if="cheque.print_status == '10'">
											<i class="mdi mdi-thumb-up md-color-red"></i>
										</div>
										<div v-else>
											<button class="sc-button sc-button-mini md-bg-blue-400"
												data-uk-tooltip="Edit cheque"
												type="button"
												data-uk-toggle="target: #modal-open-edit"
												@click="editItem(cheque)"
											>
												<i class="mdi mdi-pencil-outline md-color-white"></i>
											</button>
										</div>
									</div>
									<div v-else-if="cheque.status == 'printed'">
										<button class="sc-button sc-button-mini md-bg-red-400" data-uk-tooltip="closed">
											<i class="mdi mdi-thumb-up md-color-white"></i>
										</button>
									</div>
									<div v-else>
										<button class="sc-button sc-button-mini md-bg-green-400" data-uk-tooltip="cheque number saved">
											<i class="mdi mdi-thumb-up md-color-white"></i>
										</button>
									</div>
								</td>
							</tr>
						</tbody>
					</table>
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
const { uniqueID } = scHelpers
export default {
	middleware: ['auth'],
	components: {
		Select2: process.client ? () => import('~/components/Select2') : null,
		ScInput
	},
	mixins: [validationMixin],
	data: () => ({
		filter: {
			text: '',
			date: '',
			tags: [],
		},
		submitStatus: null,
		dpIcons: '',
		issues: [],
		batch_no:'',
		type: ['Open', 'Closed'],
		authorization: ['Approve', 'Decline'],
		dialogChequeAdd: false,
		dialogCheque: false,
		authorizeCheque: false,
		dialogChequeNo: false,
		search: '',
		valid: true,
		dialog: false,
		snackText:'',
		chequeStatus: ['Open', 'Closed'],
		cheques: [],
		bank_id:'',
		branch_id:'',
		account_id:'',
		payee: '',
		amount: '',
		pay_date: '',
		cheque_type: '',
		approval: '',
		approval_count: '',
		editedItem: {
			payee: '',
			amount: '',
			pay_date: '',
			cheque_type: '',
			authorization_status: '',
			password: '',
		},
		editedCheque: {
			cheque_no: '',
		},
	}),
	computed: {
		...mapState('auth', ['loggedIn', 'user']),
		...mapGetters({
		})
	},
	mounted () {
		this.getCheques()
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
		editItem (cheque) {
			this.editedIndex = this.cheques.indexOf(cheque)
			this.editedItem = Object.assign({}, cheque)
			UIkit.modal('#modal-open-edit').hide()
		},
		authItem (cheque) {
			this.editedIndex = this.cheques.indexOf(cheque)
			this.editedItem = Object.assign({}, cheque)
			UIkit.modal('#modal-open-auth').show()
		},
		editChequeNo (cheque) {
			this.editedIndex = this.cheques.indexOf(cheque)
			this.editedCheque = Object.assign({}, cheque)
			// UIkit.modal('#modal-open-cheque-no').show()
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
					`/cheques/${this.$route.params.id}`
				)
					.then(res =>{
						this.issues = res.data.data.dataModels
						this.batch_no = this.issues[0].batch_id
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
		async chequeUpdate (e, event, id) {
			e.preventDefault()
			try {
				await this.$axios.put(`/cheques/${event}`, {
					payee: this.editedItem.payee,
					amount: this.editedItem.amount,
					pay_date: this.editedItem.pay_date,
					cheque_type: this.editedItem.cheque_type
				})
					.then(res =>{
						this.getCheques()
						this.snackText = JSON.stringify(res.data.message)
						this.showNotification(this.snackText)
						UIkit.modal('#modal-open-edit').hide()
						this.$router.push(this.$route.path)
					})
					.catch(err => {
						UIkit.modal('#modal-open-edit').hide()
						if (err.response.data.statusCode == 401 || err.response.data.statusCode == 403) {
							this.$store.commit('setAppRoute', this.$route.path);
						}
						this.snackText = JSON.stringify(err.response.data.message)
						this.showNotification(this.snackText)
						this.$router.push(this.$route.path)
					})
			} catch (err) {
				this.showNotification(err)
			}
		},
		async authCheque (e, event, id) {
			e.preventDefault()
			try {
				await this.$axios.put(`/cheques/verify/${event}`, {
					authorization_status: this.editedItem.authorization_status,
					password: this.editedItem.password,
					id: event,
				})
					.then(res =>{
						
						this.snackText = JSON.stringify(res.data.message)
						this.showNotification(this.snackText)
						UIkit.modal('#modal-open-auth').hide()
						this.$router.push(this.$route.path)
						this.getCheques()
					})
					.catch(err => {
						UIkit.modal('#modal-open-auth').hide()
						if (err.response.data.statusCode == 401 || err.response.data.statusCode == 403) {
							this.$store.commit('setAppRoute', this.$route.path);
						}
						this.snackText = JSON.stringify(err.response.data.message)
						this.showNotification(this.snackText)
						this.$router.push(this.$route.path)
					})
			} catch (err) {
				this.showNotification(err)
			} 
		},
		async chequeNoUpdate (e, event, id) {
			e.preventDefault()
			try {
				await this.$axios.put(`/cheques/number/${event}`, {
					cheque_no: this.editedCheque.cheque_no,
				})
					.then(res =>{
						this.getCheques()
						this.snackText = JSON.stringify(res.data.message)
						this.showNotification(this.snackText)
						UIkit.modal('#modal-open-cheque-no').hide()
						this.$router.push(this.$route.path)
					})
					.catch(err => {
						UIkit.modal('#modal-open-cheque-no').hide()
						if (err.response.data.statusCode == 401 || err.response.data.statusCode == 403) {
							this.$store.commit('setAppRoute', this.$route.path);
						}
						this.snackText = JSON.stringify(err.response.data.message)
						this.showNotification(this.snackText)
						this.$router.push(this.$route.path)
					})
			} catch (err) {
				this.showNotification(err)
			}
		},
		async listExcelDownload (event) {
			try {
				await this.$axios({
					url: `/batch/download/excel/${this.$route.params.id}`,
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
			} catch (err) {
				this.showNotification(err)
			}
		},
		async listPdfDownload (event) {
			try {
				await this.$axios({
					url: `/batch/download/pdf/${this.$route.params.id}`,
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
	},
	head () {
		return {
			'title': 'Medfast | Entries'
		}
	}
}
</script>
<style lang="scss">
  @import '~scss/plugins/vue-good-table.scss';
</style>
