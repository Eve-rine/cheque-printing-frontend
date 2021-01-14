<template>
	<div id="sc-page-wrapper">
		<client-only>
			<div id="sc-page-top-bar" class="sc-top-bar" data-uk-sticky="offset:48; show-on-up: true; animation: uk-animation-slide-top-medium">
				<div class="sc-top-bar-content uk-flex uk-flex-1">
					<h1 class="sc-top-bar-title uk-flex-1">
						Events
					</h1>
				</div>
			</div>
		</client-only>
		<div id="sc-page-content">
			<div class="sc-fab-page-wrapper">
				<nuxt-link :to="'/calendar/create'">
					<a href="javascript:void(0)" class="sc-fab sc-fab-medium sc-fab-primary">
						<i class="mdi mdi-plus"></i>
					</a>
				</nuxt-link>
			</div>
			<ScCard class="uk-height-1-1">
				<div class="uk-grid-collapse uk-grid-divider uk-height-1-1 uk-grid" data-uk-grid>
					<div class="uk-width-expand@m uk-height-1-1 uk-flex uk-flex-column">
						<ScCardHeader>
							<div class="uk-flex-middle uk-grid-small uk-grid" data-uk-grid>
								<div class="uk-width-auto uk-flex-last@m">
									<button class="sc-button sc-button-default sc-button-outline uk-button-dropdown" type="button">
										<span id="sc-js-cal-view-name">
											{{ calendar.viewName | toUppercase }}
										</span>
									</button>
									<div data-uk-dropdown="boundary: #sc-page-content; mode: click">
										<ul class="uk-nav uk-dropdown-nav">
											<li>
												<a href="javascript:void(0)" :class="{'sc-text-semibold': calendar.viewName === 'Day'}" @click.prevent="changeCalView('day')">
													Day
												</a>
											</li>
											<li>
												<a href="javascript:void(0)" :class="{'sc-text-semibold': calendar.viewName === 'Week'}" @click.prevent="changeCalView('week')">
													Week
												</a>
											</li>
											<li>
												<a href="javascript:void(0)" :class="{'sc-text-semibold': calendar.viewName === 'Month'}" @click.prevent="changeCalView('month')">
													Month
												</a>
											</li>
											<li>
												<a href="javascript:void(0)" :class="{'sc-text-semibold': calendar.viewName === '2 Weeks'}" @click.prevent="changeCalView('2weeks')">
													2 Weeks
												</a>
											</li>
										</ul>
									</div>
								</div>
								<div class="uk-width-auto uk-visible@m">
									<button type="button" class="sc-button sc-button-default sc-button-flat" @click.prevent="moveToday">
										Today
									</button>
								</div>
								<div class="uk-width-auto uk-flex uk-flex-middle">
									<button type="button" class="sc-button sc-button-default sc-button-flat sc-button-icon" @click.prevent="movePrev">
										<i class="mdi mdi-chevron-left"></i>
									</button>
									<button type="button" class="sc-button sc-button-default sc-button-flat sc-button-icon" @click.prevent="moveNext">
										<i class="mdi mdi-chevron-right"></i>
									</button>
								</div>
								<div class="uk-width-expand@s">
									<h1 class="tui-full-calendar-range-name">
										{{ calendar.rangeText }}
									</h1>
								</div>
							</div>
						</ScCardHeader>
						<ScCardBody>
							<client-only>
								<Calendar
									ref="tuiCalendar"
									:calendars="calendarList"
									:schedules="scheduleList"
									:view="calendar.view"
									:week="calendar.week"
									:month="calendar.month"
									:template="calendarTemplate"
									@beforeDeleteSchedule="onBeforeDeleteSchedule"
									@beforeUpdateSchedule="onBeforeUpdateSchedule"
									@beforeCreateSchedule="onBeforeCreateSchedule"
									@clickSchedule="onClickSchedule"
									@calendarInitialized="calendarInitialized"
								></Calendar>
							</client-only>
						</ScCardBody>
					</div>
				</div>
			</ScCard>
		</div>
	</div>
</template>

<script>
import { scHelpers, scMq } from "~/assets/js/utils"
const { uniqueID } = scHelpers;
import { validationMixin } from 'vuelidate'
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
		Calendar: process.client ? () => import('~/components/tui-calendar') : null,
	},
	mixins: [validationMixin],
	data: () => ({
		calInstance: null,
		dateFrom:'',
		dateTo:'',
		calendar: {
			rangeText: '',
			view: 'month',
			viewName: 'Month',
			week: {
				narrowWeekend: scMq.xlargeMin(),
			},
			month: {
				visibleWeeksCount: 0,
				narrowWeekend: scMq.xlargeMin(), 
			},
		},
		snackText:'',
		calendarList: [],
		scheduleList: [],
		calViewName: '',
		calendarListMainCb: {
			checked: true,
			indeterminate: false,
		},
		lastClickedSchedule: null,
		columnCollapsed: false,
		columnTransform: false,
		categories: ['allday', 'time'],
	}),
	computed: {
		dpRange () {
			return {
				minDate:"today"
			}
		},
		calendarTemplate () {
			const self = this;
			return {
				monthGridHeader (model) {
					var date = new Date(model.date);
					return '<span class="tui-full-calendar-weekday-grid-date">' + date.getDate() + '</span>';
				},
				milestone (model) {
					return '<span class="mdi mdi-flag-outline"></span>' + model.title;
				},
				task (model) {
					return '<span class="mdi mdi-calendar-check"></span>' + model.title;
				},
				allday (schedule) {
					return self.getTimeTemplate(schedule, true);
				},
				time (schedule) {
					return self.getTimeTemplate(schedule, false);
				}
			}
		},
		// tempScheduleList () {
		// },
		...mapState('auth', ['loggedIn', 'user']),
		...mapGetters({
		}),
	},
	mounted () {
		this.$store.commit('setAppRedirect', this.$route.path);
		this.getEvents()
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
		async getEvents (){
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
		calendarInitialized () {
			this.calInstance = this.$refs.tuiCalendar.getCalInstance();
			// set default range text
			this.setRenderRangeText();
			// set theme
			this.calInstance.setTheme(this.calendar.theme);
		},
		movePrev () {
			this.calInstance.prev();
			this.setRenderRangeText();
		},
		moveNext () {
			this.calInstance.next();
			this.setRenderRangeText();
		},
		moveToday () {
			this.calInstance.today();
			this.setRenderRangeText();
		},
		changeCalView (view) {
			const self = this;
			switch (view) {
			case 'day':
				self.calendar.view = 'day';
				self.calendar.viewName = 'Day';
				break;
			case 'week':
				self.calendar.view = 'week';
				self.calendar.viewName = 'Week';
				break;
			case 'month':
				self.calendar.month.visibleWeeksCount = 0;
				self.calendar.view = 'month';
				self.calendar.viewName = 'Month';
				break;
			case '2weeks':
				self.calendar.month.visibleWeeksCount = 2;
				self.calendar.view = 'month';
				self.calendar.viewName = '2 Weeks';
				break;
			}
			setTimeout(() => {
				this.setRenderRangeText();
			}, 100);
		},
		toggleCalendar (e, id) {
			this.calInstance.toggleSchedules(id, !e);
			let checkboxes = this.calendarList.map((k) => {
				return k.checked
			});
			let someChecked = checkboxes.some(cb => cb === true);
			let allChecked = checkboxes.every(cb => cb === true);

			if (allChecked) {
				this.calendarListMainCb.checked = true;
				this.calendarListMainCb.indeterminate = false
			} else if (someChecked) {
				this.calendarListMainCb.indeterminate = true
			} else {
				this.calendarListMainCb.checked = false;
				this.calendarListMainCb.indeterminate = false
			}
		},
		toggleCalendars (state) {
			this.calendarList.forEach(k => {
				k.checked = state;
				this.calInstance.toggleSchedules(k.id, !state);
			});
		},
		onBeforeDeleteSchedule (event) {
			var index = this.scheduleList.map(item => {
				return item.id
			}).indexOf(event.schedule.id);
			// this.scheduleList.splice(index, 1);
			try {
				this.$axios.put(`/events/${event.schedule.id}`)
					.then(res =>{
						this.getEvents()
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

			}
		},
		onBeforeUpdateSchedule (event) {
			const schedule = event.schedule;
			const startTime = event.start._date;
			const endTime = event.end._date;
			var index = this.scheduleList.map(item => {
				return item.id
			}).indexOf(event.schedule.id);
			let _schedule = this.scheduleList[index];
			if('calendar' in event) {
				if(this.lastClickedSchedule.id === schedule.id) {
					try {
						this.$axios.put(`/events/${_schedule.id}`, {
							title: event.schedule.title,
							start: this.$moment(startTime).format('YYYY-MM-DD HH:mm'),
							end: this.$moment(endTime).format('YYYY-MM-DD HH:mm'),
						})
							.then(res =>{
								this.snackText = JSON.stringify(res.data.message)
								this.showNotification(this.snackText)
								this.getEvents()
							})
							.catch(err => {
								if (err.response.data.statusCode == 401 || err.response.data.statusCode == 403) {
									this.$store.commit('setAppRoute', this.$route.path);
									this.snackText = JSON.stringify(err.response.data.message)
						    this.showNotification(this.snackText)
			            }
							})
					} catch (err) {
						this.showNotification(this.snackText)
					}
				}
			} else {
				let updatedObj = null;
				this.scheduleList.forEach((obj, index) => {
					if(obj.id === schedule.id) {
						updatedObj = obj;
						updatedObj.start = this.$moment(startTime).format('YYYY-MM-DD HH:mm');
						updatedObj.end = this.$moment(endTime).format('YYYY-MM-DD HH:mm');
					}
				});
				if (updatedObj) {
					this.scheduleList.splice(index, 1, updatedObj)
				}
			}
		},
		onBeforeCreateSchedule (event) {
			this.saveNewSchedule(event)
		},
		onClickSchedule (event) {
			this.lastClickedSchedule = event.schedule;
		},
		findCalendar (id) {
			let found;
			this.calendarList.forEach(function (calendar) {
				if (calendar.id === id) {
					found = calendar;
				}
			});
			return found;
		},
		saveNewSchedule (scheduleData) {
			let calendar = scheduleData.calendar || this.findCalendar(scheduleData.calendarId);
			let schedule = {
				id: uniqueID(),
				title: scheduleData.title,
				isAllDay: scheduleData.isAllDay,
				start: scheduleData.start,
				end: scheduleData.end,
				category: scheduleData.isAllDay ? 'allday' : 'time',
				dueDateClass: '',
				color: calendar.color,
				bgColor: calendar.bgColor,
				dragBgColor: calendar.dragBgColor,
				borderColor: calendar.borderColor,
				location: scheduleData.location,
				raw: {
					class: scheduleData.raw['class']
				},
				state: scheduleData.state
			};
			if (calendar) {
				schedule.calendarId = calendar.id;
				schedule.color = calendar.color;
				schedule.bgColor = calendar.bgColor;
				schedule.borderColor = calendar.borderColor;
			}
			this.scheduleList.push(schedule);
		},
		setRenderRangeText () {
			let options = this.calInstance.getOptions();
			let viewName = this.calendar.view;
			let html = [];
			if (viewName === 'day') {
				html.push(this.$moment(this.calInstance.getDate().getTime()).format('MMMM Do YYYY'));
			} else if (viewName === 'month' &&
        (!options.month.visibleWeeksCount || options.month.visibleWeeksCount > 4)) {
				html.push(this.$moment(this.calInstance.getDate().getTime()).format('MMMM YYYY'));
			} else {
				html.push(this.$moment(this.calInstance.getDateRangeStart().getTime()).format('MMMM Do YYYY'));
				html.push(' ~ ');
				html.push(this.$moment(this.calInstance.getDateRangeEnd().getTime()).format('MMMM Do YYYY'));
			}
			this.calendar.rangeText = html.join('');
		},
		getTimeTemplate (schedule, isAllDay) {
			var html = [];
			var start = this.$moment(schedule.start.toUTCString());
			if (!isAllDay) {
				html.push('<strong>' + start.format('HH:mm') + '</strong> ');
			}
			if (schedule.isPrivate) {
				html.push('<span class="mdi mdi-lock-outline"></span>');
				html.push(' ' + schedule.title);
			} else {
				if (schedule.isReadOnly) {
					html.push('<span class="mdi mdi-pencil-lock"></span>');
				}
				if (schedule.attendees.length) {
					html.push('<span class="mdi mdi-account-multiple-outline"></span>');
				}
				if (schedule.location) {
					html.push('<span class="mdi mdi-map-marker-outline"></span>');
				}
				if (schedule.hasOwnProperty('raw') && schedule.raw) {
					if (schedule.raw.hasOwnProperty('attendees')) {
						html.push('<span class="mdi mdi-account-multiple"></span>');
					}
					if (schedule.raw.hasOwnProperty('isImportant')) {
						html.push('<span class="mdi mdi-alert-outline"></span>');
					}
					if (schedule.raw.hasOwnProperty('icon')) {
						html.push('<span class="' + schedule.raw.icon + '"></span>');
					}
				}
				html.push(' ' + schedule.title);
			}
			return html.join('');
		},
		onColumnCollapsing (value) {
			this.columnCollapsed = value;
			this.columnTransform = true;
		},
		onColumnToggle () {
			this.columnTransform = false
		}
	},
	head () {
		return {
			'title': 'Dukapal | Calendar'
		}
	}
}
</script>

<style lang="scss">
</style>
