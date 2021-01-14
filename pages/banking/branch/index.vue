<template>
	<div id="sc-page-wrapper">
		<client-only>
			<div id="sc-page-top-bar" class="sc-top-bar" data-uk-sticky="offset:48; show-on-up: true; animation: uk-animation-slide-top-medium">
				<div class="sc-top-bar-content uk-flex uk-flex-1">
					<h1 class="sc-top-bar-title uk-flex-1">
						Branches
					</h1>
				</div>
			</div>
		</client-only>
		<div id="sc-page-content">
			<div class="sc-fab-page-wrapper">
				<nuxt-link :to="'/banking/branch/create'">
					<a href="javascript:void(0)" class="sc-fab sc-fab-medium sc-fab-primary">
						<i class="mdi mdi-plus"></i>
					</a>
				</nuxt-link>
			</div>
			<ScCard>
				<ScCardBody>
					<VueGoodTable
						:columns="columns"
						:rows="branches"
						:pagination-options="{ enabled: true }"
						style-class="uk-table uk-table-divider scutum-vgt"
					>
						<template slot="table-row" slot-scope="props">
							<span v-if="props.column.field === 'branchId'">
								{{ props.index + 1 }}
							</span>
							<span v-if="props.column.field === 'bank_id'">
							
								{{ props.row.bank.bank_name }}
				

							</span>
							<span v-if="props.column.field === 'branch_name'">
								{{ props.row.branch_name }}
							</span>
							<span v-if="props.column.field === 'physical_address'">
								{{ props.row.physical_address }}
							</span>
							<span v-if="props.column.field === 'contact_person_name'">
								{{ props.row.contact_person_name }}
							</span>
							<span v-if="props.column.field === 'contact_person_number'">
								{{ props.row.contact_person_number }}
							</span>
							<span v-if="props.column.field === 'contact_person_email'">
								{{ props.row.contact_person_email }}
							</span>
							<!-- <span v-if="props.column.field === 'status'" class="uk-badge md-bg-blue-600">
								{{ props.row.status }}
							</span> -->
							<span v-if="props.column.field === 'action'">
								<nuxt-link :to="'/banking/branch/view/'+ props.row.branch_id">
									<button class="sc-button sc-button-mini md-bg-green-400" data-uk-tooltip="Edit branch">
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
import 'vue-good-table/dist/vue-good-table.css'
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
		VueGoodTable,
	
	},
	data: () => ({
		tags: [],
		submitStatus: null,
		snackText:'',
		branches: [],
	}),
	computed: {
		...mapState('auth', ['loggedIn', 'user']),
		...mapGetters({
		}),
		columns () {
			return [
				{
					label: '#',
					field: 'branchId',
				},
				{
					label: 'Bank',
					field: 'bank_id',
				},
				{
					label: 'Branch',
					field: 'branch_name',
				},
				{
					label: 'Address',
					field: 'physical_address',
				},
				{
					label: 'Contact Person Name',
					field: 'contact_person_name',
				},
				{
					label: 'Contact Person Number',
					field: 'contact_person_number',
				},
				{
					label: 'Contact Person Email',
					field: 'contact_person_email',
				},
				// {
				// 	label: 'Status',
				// 	tdClass: 'uk-text-center',
				// 	field: 'status'
				// },
				{
					label: 'Action',
					field: 'action',
				}
			]
		}
	},
	mounted () {
		this.getBranch()
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
		formatDate (value) {
			var date = new Date(value * 1000)
			return moment(date).format("DD MMM, YYYY")
		},
		formatAmount (value) {
			return value.replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')
		},

		async getBranch () {
			try {
				await this.$axios.get(
					'/branches'
				)
					.then(res =>{
						this.branches = res.data
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

