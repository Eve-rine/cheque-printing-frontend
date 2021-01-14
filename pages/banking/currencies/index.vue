<template>
	<div id="sc-page-wrapper">
		<client-only>
			<div id="sc-page-top-bar" class="sc-top-bar" data-uk-sticky="offset:48; show-on-up: true; animation: uk-animation-slide-top-medium">
				<div class="sc-top-bar-content uk-flex uk-flex-1">
					<h1 class="sc-top-bar-title uk-flex-1">
						Currencies
					</h1>
				</div>
			</div>
		</client-only>
		<div id="sc-page-content">
			<div class="sc-fab-page-wrapper">
				<nuxt-link :to="'/banking/currencies/create'">
					<a href="javascript:void(0)" class="sc-fab sc-fab-medium sc-fab-primary">
						<i class="mdi mdi-plus"></i>
					</a>
				</nuxt-link>
			</div>
			<ScCard>
				<ScCardBody>
					<VueGoodTable
						:columns="columns"
						:rows="currencies"
						:pagination-options="{ enabled: true }"
						style-class="uk-table uk-table-divider scutum-vgt"
					>
						<template slot="table-row" slot-scope="props">
							<span v-if="props.column.field === 'currency_id'">
								{{ props.index + 1 }}
							</span>
							<span v-if="props.column.field === 'voucher_no'">
								{{ props.row.voucher_no }}
							</span>
							<span v-if="props.column.field === 'currency_code'">
								{{ props.row.currency_code }}
							</span>
							<span v-if="props.column.field === 'currency_name'">
								{{ props.row.currency_name }}
							</span>
							<span v-if="props.column.field === 'action'">
								<nuxt-link :to="'/banking/currencies/view/'+ props.row.currency_id">
									<button class="sc-button sc-button-mini md-bg-green-400" data-uk-tooltip="Edit currency">
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
		currencies: [],
	}),
	computed: {
		...mapState('auth', ['loggedIn', 'user']),

		columns () {
			return [
				{
					label: '#',
					field: 'currency_id',
				},
				{
					label: 'Voucher Number',
					field: 'voucher_no',
				},
				{
					label: 'Currency Code',
					field: 'currency_code',
				},
				{
					label: 'Currency Name',
					field: 'currency_name',
				},
			
				{
					label: 'Action',
					field: 'action',
				}
			]
		}
	},
	mounted () {
		this.getCurrencies()
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

		async getCurrencies () {
			try {
				await this.$axios.get(
					'/currency'
				)
					.then(res =>{
						this.currencies = res.data.data.dataModels
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
			'title': 'Dukapal | Currency'
		}
	}
}
</script>
<style lang="scss">
  @import '~scss/plugins/vue-good-table.scss';
</style>
