<template>
	<div id="sc-page-wrapper">
		<client-only>
			<div id="sc-page-top-bar" class="sc-top-bar" data-uk-sticky="offset:48; show-on-up: true; animation: uk-animation-slide-top-medium">
				<div class="sc-top-bar-content uk-flex uk-flex-1">
					<h1 class="sc-top-bar-title uk-flex-1">
						Accounts
					</h1>
				</div>
			</div>
		</client-only>
		<div id="sc-page-content">
			<div class="sc-fab-page-wrapper">
				<nuxt-link :to="'/banking/account/create'">
					<a href="javascript:void(0)" class="sc-fab sc-fab-medium sc-fab-primary">
						<i class="mdi mdi-plus"></i>
					</a>
				</nuxt-link>
			</div>
			<ScCard>
				<ScCardBody>
					<VueGoodTable
						:columns="columns"
						:rows="accounts"
						:pagination-options="{ enabled: true }"
						style-class="uk-table uk-table-divider scutum-vgt"
					>
						<template slot="table-row" slot-scope="props">
							<span v-if="props.column.field === 'issueId'">
								{{ props.index + 1 }}
							</span>
							<span v-if="props.column.field === 'bank_id'">
								{{ props.row.bank.bank_name }}
							</span>
							<span v-if="props.column.field === 'branch_id'">
								{{ props.row.branch.branch_name }}
							</span>
							<span v-if="props.column.field === 'account_name'">
								{{ props.row.account_name }}
							</span>
							<span v-if="props.column.field === 'account_number'">
								{{ props.row.account_number }}
							</span>
							<span v-if="props.column.field === 'currency_id'">
								{{ props.row.currency_id }} 
							</span>
							<!-- <span v-if="props.column.field === 'status'" class="uk-badge md-bg-blue-600">
								{{ props.row.status }}
							</span> -->
							<span v-if="props.column.field === 'action'">
								<nuxt-link :to="'/banking/account/view/'+ props.row.account_id">
									<button class="sc-button sc-button-mini md-bg-green-400" data-uk-tooltip="Edit account">
										<i class="mdi mdi-pen md-color-white"></i>
									</button>
								</nuxt-link>
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
import Flatpickr from '~/plugins/flatpickr'
import 'vue-good-table/dist/vue-good-table.css'
import { required, minLength, email, sameAs } from 'vuelidate/lib/validators'
import { VueGoodTable } from 'vue-good-table'
import { mapGetters } from 'vuex'
import { mapState } from 'vuex'
import moment from 'moment'
import { format, parseISO } from 'date-fns'
import { scHelpers } from "~/assets/js/utils";

export default {
	middleware: ['auth'],
	components: {
		VueGoodTable,
	},
	mixins: [validationMixin],
	data: () => ({
		snackText:'',
		accounts: [],
		banks: [],
		users: [],
		branches: [],
		cheque: [],
		bank_id:'',
		branch_id:'',
		account_name:'',
		account_number:'',
		cheque:'',
		kra_pin:'',
	}),
	
	computed: {
		signing () {
			return this.users.map(function (obj) {
				obj.id = obj.id || obj.username;
				obj.text = obj.text || obj.username;
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
					label: 'Bank',
					field: 'bank_id',
				},
				{
					label: 'Branch',
					field: 'branch_id',
				},

				{
					label: 'Currency Code',
					field: 'currency_id',
				},
				{
					label: 'Account name',
					field: 'account_name',
				},
				{
					label: 'Account No.',
					field: 'account_number',
				},
				// {
				// 	label: 'status',
				// 	field: 'status',
				// },
				{
					label: 'Action',
					field: 'action',
				}
			]
		}
	},
	mounted () {
		this.getAccounts()
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
		async clearFormEdit () {
			UIkit.modal('#modal-edit-account').hide()
			this.getResetEdit()
		},
		async editCheque (event, id) {
			this.editedIndex = this.accounts.indexOf(event)
			this.editedItem = Object.assign({}, event)
			this.file_id = event.account_id
			UIkit.modal('#modal-edit-image').show();
		},
		formatDate (value) {
			var date = new Date(value * 1000)
			return moment(date).format("DD MMM, YYYY")
		},
		async formatAmount (value) {
			return value.replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')
		},
		async editSign (sign) {
			this.editedIndex = this.signs.indexOf(sign)
			this.editedSigns = Object.assign({}, sign)
			UIkit.modal('#modal-view-sign').show();
		},
		async statusLabel (status) {
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
			case 'Closed':
				statusClass = 'uk-badge md-bg-red-600';
				break;
			case 'Open':
				statusClass = 'uk-badge md-bg-green-600';
				break;
			default:
			}
			return statusClass;
		},
		async getAccounts () {
			try {
				await this.$axios.get(
					'/accounts'
				)
					.then(res =>{
						this.accounts = res.data
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
		 isEpired (expirySar) {
			return 
			
		},
	
		async cropImage () {
			this.cropImg = this.$refs.cropper.getCroppedCanvas().toDataURL();
		},
		async saveCanvas (event) {
			event.preventDefault()
			this.$refs.cropper.getCroppedCanvas().toBlob((blob) => {
				const formData = new FormData()
				formData.append('cheque', blob, 'cheque.png')
				this.$axios.post(`/accounts/change/${this.file_id}`, formData, {
					headers: {
						'Content-Type': 'multipart/form-data'
					}
				})
					.then((response) => {
						this.snackText = JSON.stringify(response.data.message)
						this.showNotification(this.snackText)
						UIkit.modal('#modal-edit-image').hide();
					})
					.catch(function (error) {
						if (err.response.data.statusCode == 401 || err.response.data.statusCode == 403) {
							this.$store.commit('setAppRoute', this.$route.path);
							this.snackText = JSON.stringify(err.response.data.message)
						    this.showNotification(this.snackText)
			            }
					})
			}, this.mime_type)
		},
		async getCroppedCanvas (size) {
			let options = null;
			options = { "width": 1200, "height": 380 }
			document.getElementById('croppedCanvasWrapper').innerHTML = '';
			UIkit.modal('#getCroppedCanvasModal').show();
			const croppedCanvas = this.$refs.cropper.getCroppedCanvas(options);
			document.getElementById('croppedCanvasWrapper').appendChild(croppedCanvas);
			document.getElementById("croppedCanvasDownload").href = croppedCanvas.toDataURL('image/jpeg');
		},
		async readImage (e) {
			const file = e.target.files[0];
			if (!file.type.includes('image/')) {
				alert('Please select an image file');
				return;
			}
			if (typeof FileReader === 'function') {
				const reader = new FileReader();
				reader.onload = (event) => {
					this.imgSrc = event.target.result;
					this.$refs.cropper.replace(event.target.result);
				};
				reader.readAsDataURL(file);
			} else {
				alert('Sorry, FileReader API not supported');
			}
		},
	},
	head () {
		return {
			'title': 'Dukapal | Accounts'
		}
	}
}
</script>
<style lang="scss">
  @import '~scss/plugins/vue-good-table.scss';
  @import '~scss/plugins/cropper';
</style>
