<template>
	<div id="sc-page-wrapper">
		<div id="sc-page-top-bar" class="sc-top-bar" data-uk-sticky="offset:48; show-on-up: true; animation: uk-animation-slide-top-medium">
			<div class="sc-top-bar-content uk-flex uk-flex-1">
				<h1 class="sc-top-bar-title uk-flex-1">
					Create Event
				</h1>
			</div>
		</div>
		<div id="sc-page-content">
			<div class="sc-fab-page-wrapper">
				<nuxt-link :to="'/calendar'">
					<a href="javascript:void(0)" class="sc-fab sc-fab-medium sc-fab-primary">
						<i class="mdi mdi-arrow-left"></i>
					</a>
				</nuxt-link>
			</div>

			<div v-if="loggedIn" id="block-weekends" class="uk-flex-middle" uk-modal="bg-close:false">
				<div class="uk-modal-dialog uk-modal-body">
					<button class="uk-modal-close-default" data-uk-close></button>
					<h2 class="uk-modal-title">
						Select Months
					</h2>
					<form>
						<div class="uk-margin-top" data-uk-grid>
							<div class="uk-width-1-2@m">
								<client-only>
									<Select2
										v-model="calStatus" 
										name="calStatus"
										:options="weekendStatus"
										:settings="{ 'width': '100%', 'placeholder': 'Select weekend...', allowClear: true }"
									></Select2>
								</client-only>
							</div>
							<div class="uk-width-1-2@m">
								<client-only>
									<Select2
										v-model="month"
										:options="months"
										:settings="{ 'width': '100%', 'minimumResultsForSearch': -1, 'placeholder': 'Select month...', 'closeOnSelect': false }"
										multiple
									></Select2>
								</client-only>
							</div>
						</div>
						<div class="uk-modal-footer uk-text-right">
							<button class="sc-button sc-button-primary" :disabled="submitStatus === 'PENDING'" data-uk-tooltip="Save" @click="blockWeekends($event)">
								<i class="mdi mdi-checkbox-marked-outline"></i>
							</button>
						</div>
					</form>
				</div>
			</div>
			<ScCard>
				<ScCardBody>
					<form ref="anyName">
						<div class=" uk-modal-header uk-position-top-right">
							<button class="sc-button sc-button-primary" type="button" data-uk-toggle="target: #block-weekends">
								Block Weekends
							</button>
						</div>
						<div class="uk-margin-top" data-uk-grid>
							<div class="uk-width-1-3@m">
								<ScInput v-model="$v.calTitle.$model" name="calTitle" :error-state="$v.calTitle.$error" :validator="$v.calTitle">
									<label>Title</label>
								</ScInput>
								<ul class="sc-vue-errors">
									<li v-if="!calTitle.required">
										Field is required
									</li>
								</ul>
							</div>
							<div class="uk-width-1-3@m">
								<label>Background color</label>
								<client-only>
									<ScColorpicker v-model="$v.calbgColor.$model"
										size="small"
										:inline="true"
										:error-state="$v.calbgColor.$error"
										:validator="$v.calbgColor"
									></ScColorpicker>
								</client-only>
								<ul class="sc-vue-errors">
									<li v-if="!calbgColor.required">
										Field is required
									</li>
								</ul>
							</div>
						</div>
						<div class="uk-margin-top" data-uk-grid>
							<div class="uk-width-1-2@m">
								<ScInput v-model="$v.calStart.$model"
									v-flatpickr="dpRange"
									placeholder="Pick start date..."
									mode="outline"
									:error-state="$v.calStart.$error"
									:validator="$v.calStart"
								></ScInput>
								<ul class="sc-vue-errors">
									<li v-if="!calStart.required">
										Field is required
									</li>
								</ul>
							</div>
							<div class="uk-width-1-2@m">
								<ScInput v-model="$v.calEnd.$model"
									v-flatpickr="dpRange"
									placeholder="Pick end date..."
									mode="outline"
									:error-state="$v.calEnd.$error"
									:validator="$v.calEnd"
								></ScInput>
								<ul class="sc-vue-errors">
									<li v-if="!calEnd.required">
										Field is required
									</li>
								</ul>
							</div>
						</div>
						<div class="uk-modal-footer uk-text-right">
							<button class="sc-button sc-button-primary" :disabled="submitStatus === 'PENDING'" data-uk-tooltip="Save" @click="eventSave($event)">
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
import { scHelpers, scMq } from "~/assets/js/utils"
const { uniqueID } = scHelpers;
import { validationMixin } from 'vuelidate'
import ScInput from '~/components/Input'
import Flatpickr from '~/plugins/flatpickr'
import 'vue-good-table/dist/vue-good-table.css'
import { required, minLength, email, sameAs } from 'vuelidate/lib/validators'
import { VueGoodTable } from 'vue-good-table'
import { mapGetters } from 'vuex'
import { mapState } from 'vuex'
import { format, parseISO } from 'date-fns'
import ColumnToggle from '~/components/ColumnToggle'
import moment from '~/plugins/moment'
require('tui-calendar/dist/tui-calendar.css')
export default {
	middleware: ['auth'],
	components: {
		// Select2: process.client ? () => import('~/components/Select2') : null,
		ScColorpicker: process.client ? () => import('~/components/Colorpicker') : null,
		ScInput,
	},
	mixins: [validationMixin],
	data: () => ({
		snackText:'',
		submitStatus: null,
		categories: ['allday', 'time'],
		weekendStatus: ['Yes', 'No'],
		calTitle:'',
		calCategory:'',
		calbgColor:'',
		calStart:'',
		calEnd:'',
		month:'',
		calStatus:'',
		months: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
	}),
	validations: {
		calTitle: {
			required
		},
		calbgColor: {
			required
		},
		calStart: {
			required
		},
		calEnd: {
			required
		},
		calStatus: {
			required
		}
	},
	computed: {
		dpRange () {
			return {
				minDate:"today"
			}
			
		},
		
		...mapState('auth', ['loggedIn', 'user']),
		...mapGetters({
		}),
	},
	methods: {
		compare (){
			var tokenDate = new Date(parseInt(localstorage.getItem('time')) * 1000)
			var date = new Date();
			// date.getTime() is in milliseconds and thus we've got to divide by 1000
			if(tokenDate<date.getTime()/1000){
				console.log('The token has expired');
			}else{
				console.log('The token is still valid');
			}
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
		
		// async clearForm () {
		// 	this.$data.calStatus = ""
		// 	// this.$data.months = ""
		// 	this.$v.calStatus.$reset()
		// 	// this.$v.dateFrom.$reset()
		// },
		async eventSave (e, event) {
			e.preventDefault()
			// this.$v.$touch();
			// if (this.$v.$invalid) {
			// 	this.submitStatus = 'ERROR'
			// } else {
			// 	this.submitStatus = 'OK'
			// 	try {
			await this.$axios.post('/events/created', {
				title: this.calTitle,
				bgColor: this.calbgColor,
				start: this.calStart,
				end: this.calEnd,
				
			})
				.then(res =>{
					this.$router.push('/calendar')
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
				// } catch (err) {
				// 	this.showNotification(this.snackText)
				// }
			// 
		},
		async blockWeekends (e, event) {
			e.preventDefault()
			// this.$v.$touch();
			// if (this.$v.$invalid) {
			// 	this.submitStatus = 'ERROR'
			// } else {
			// 	this.submitStatus = 'OK'
			// 	try {
			await this.$axios.post('/events', {
				status: this.calStatus,
				month: this.month,
			})
				.then(res =>{
					UIkit.modal('#block-weekends').hide()
					this.$router.push('/calendar')
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
				// } catch (err) {
				// 	this.showNotification(this.snackText)
				// }
		// 	}
		},
	},
	head () {
		return {
			'title': 'Dukapal | Calendar'
		}
	}
}
</script>
<style lang="scss">
  @import '~scss/plugins/vue-good-table.scss';
</style>
