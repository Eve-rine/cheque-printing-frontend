export const state = () => ({
	message: '',
	type: ''
});

export const getters = {

	hasAlert (state) {
		return state.message !== '';
	},

	alertMessage (state) {
		return state.message;
	},

	alertType (state) {
		return state.type;
	}
};

export const mutations = {

	SET_ALERT (state, payload) {
		state.type = payload.type;
		state.message = payload.message;
	}
};

export const actions = {

	setAlert ({commit}, payload) {
		commit('SET_ALERT', payload);
	},
	clearAlert ({commit}) {
		commit('SET_ALERT', { message: '', type: '' });
	}
};
