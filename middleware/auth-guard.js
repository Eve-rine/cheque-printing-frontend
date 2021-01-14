
export default function ({ $auth, route, redirect }) {
	if ((route.path !== '/login')){
		const REDIRECT_URL = '/login?redirect=' + route.path
		if (!$auth.loggedIn) {
			redirect(REDIRECT_URL)
		}

	}


}