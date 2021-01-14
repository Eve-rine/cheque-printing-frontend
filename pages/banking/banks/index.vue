<template>
	<div id="sc-page-wrapper">
		<client-only>
			<div id="sc-page-top-bar" class="sc-top-bar" data-uk-sticky="offset:48; show-on-up: true; animation: uk-animation-slide-top-medium">
				<div class="sc-top-bar-content uk-flex uk-flex-1">
					<h1 class="sc-top-bar-title uk-flex-1">
						Banks
					</h1>
				</div>
			</div>
		</client-only>
		<div id="sc-page-content">
			<div class="sc-fab-page-wrapper">
				<nuxt-link :to="'/banking/banks/create'">
					<a href="javascript:void(0)" class="sc-fab sc-fab-medium sc-fab-primary">
						<i class="mdi mdi-plus"></i>
					</a>
				</nuxt-link>
			</div>
			<ScCard>
				<ScCardBody>
					<VueGoodTable
						:columns="columns"
						:rows="banks"
						:pagination-options="{ enabled: true }"
						style-class="uk-table uk-table-divider scutum-vgt"
					>
						<template slot="table-row" slot-scope="props">
							<span v-if="props.column.field === 'bank_id'">
								{{ props.index + 1 }}
							</span>
							<span v-if="props.column.field === 'bank_name'">
								{{ props.row.bank_name }}
							</span>
							<span v-if="props.column.field === 'bank_code'">
								{{ props.row.bank_code }}
							</span>
							<span v-if="props.column.field === 'head_office_number'">
								{{ props.row.head_office_number }}
							</span>
							<span v-if="props.column.field === 'head_office_address'">
								{{ props.row.head_office_address }}
							</span>
							<span v-if="props.column.field === 'head_office_email'">
								{{ props.row.head_office_email }}
							</span>
							<!-- <span v-if="props.column.field === 'status'" class="uk-badge md-bg-blue-600">
								{{ props.row.status }}
							</span> -->
							<span v-if="props.column.field === 'action'">
								<nuxt-link :to="'/banking/banks/view/'+ props.row.bank_id">
									<button class="sc-button sc-button-mini md-bg-green-400" data-uk-tooltip="Edit bank">
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

import 'vue-good-table/dist/vue-good-table.css'
import { VueGoodTable } from 'vue-good-table'
import { mapState } from 'vuex'
import moment from 'moment'
export default {
	middleware: ['auth'],
	components: {
		VueGoodTable,
	},
	data: () => ({
		banks: [],
	}),
	watch: {
		compare (){
			var tokenDate = new Date(parseInt(localStorage.getItem('time')) * 1000)
			var date = new Date();
			// date.getTime() is in milliseconds and thus we've got to divide by 1000
			if(tokenDate<date.getTime()/1000){
				this.router.push('/login')
			}else{
				console.log('The token is still valid');
			}		
		}
	},
	computed: {
		...mapState('auth', ['loggedIn', 'user']),

		columns () {
			return [
				{
					label: '#',
					field: 'bank_id',
				},
				{
					label: 'Bank',
					field: 'bank_name',
				},
				{
					label: 'Bank code',
					field: 'bank_code',
				},
				{
					label: 'Head office number',
					field: 'head_office_number',
				},
				{
					label: 'Head office address',
					field: 'head_office_address',
				},
				{
					label: 'Head office email',
					field: 'head_office_email',
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
		this.getBanks(),
		this.compare()
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
			return moment(date).format("DD MMM YYYY hh:mm a")
		},

		compare (){
			var tokenDate = this.formatDate(localStorage.getItem('time'))
			var date = new Date();
			// date.getTime() is in milliseconds and thus we've got to divide by 1000
			// if(tokenDate.getTime<date.getTime()/1000){
			//   this.$router.push('/login')
			if(	 tokenDate < date){
				  	console.log('The token is expired');
	      
			}else{
				// this.$auth.logout();
				// this.$router.push('/login')
				console.log('The token is valid');
				console.log(date);
				console.log(tokenDate);
			}
		},
		async getBanks () {
			try {
				await this.$axios.get(
					'/banks'
				)
					.then(res =>{
						this.banks = res.data.data.dataModels
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
	},
	head () {
		return {
			'title': 'Dukapal | Banks'
		}
	}
}
</script>
<style lang="scss">
  @import '~scss/plugins/vue-good-table.scss';
</style>
