import Vue from 'vue'
import IdleVue from '~/components/idleTimer'

const eventsHub = new Vue()

const options = {
	eventEmitter: eventsHub,
	idleTime:JSON.parse(window.localStorage.getItem('time'))
};
