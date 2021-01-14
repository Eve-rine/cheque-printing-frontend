<template>
	<div class="uk-flex uk-flex-center uk-flex-middle sc-login-page-wrapper">
		<div class="uk-width-2-3@s uk-width-1-2@m uk-width-1-3@l uk-width-1-4@xl uk-margin-auto-vertical">
			<ScCard>
				<ScCardBody>
					<div class="sc-login-page-logo">
						<img v-rjs="require('~/assets/img/dukapal.png')" :src="appLogo" alt="dukapal">
					</div>
					<form ref="loginForm">
						<div class="sc-login-page-inner">
							<div class="uk-margin-medium">
								<ScInput v-model="$v.username.$model" name="username" :error-state="$v.username.$error" :validator="$v.username">
									<label>Username</label>
								</ScInput>
								<ul class="sc-vue-errors">
									<li v-if="!$v.username.required">
										Field is required
									</li>
									<li v-if="!$v.username.minLength">
										First Name must have at least {{ $v.username.$params.minLength.min }} letters.
									</li>
								</ul>
							</div>
							<div class="uk-margin-medium">
								<ScInput v-model="$v.loginPassword.$model"
									name="loginPassword"
									type="password"
									:error-state="$v.loginPassword.$error"
									:validator="$v.loginPassword"
								>
									<label>Password</label>
								</ScInput>
								<ul class="sc-vue-errors">
									<li v-if="!$v.loginPassword.required">
										Field is required
									</li>
									<li v-if="!$v.loginPassword.minLength">
										First Name must have at least {{ $v.loginPassword.$params.minLength.min }} letters.
									</li>
								</ul>
							</div>
							<div class="uk-margin-large-top">
								<button class="sc-button sc-button-primary" :disabled="submitStatus === 'PENDING'" @click="submitForm($event)">
									Login
								</button>
							</div>
						</div>
					</form>
				</ScCardBody>
			</ScCard>
		</div>
	</div>
</template>

<script>
import ScInput from '~/components/Input'
import { validationMixin } from 'vuelidate'
import { required, minLength, email, sameAs } from 'vuelidate/lib/validators'
import { mapState } from 'vuex'
export default {
	middleware: 'guest',
	layout: 'login',
	components: {
		ScInput
	},
	mixins: [validationMixin],
	data: () => ({
		renderComponent:true,
		submitStatus: null,
		snackText:'',
		username: "",
	    verify: false,
	    error: "",
	    errMSG:"",
	    loginPassword: "",
	}),
	validations: {
		username: {
			required,
			minLength: minLength(3)
		},
		loginPassword: {
			required,
			minLength: minLength(6)
		}
	},
	computed: {
		appLogo () {
			return require('~/assets/img/dukapal.png');
		},
		appLogoLight () {
			return require('~/assets/img/dukapal.png');
		},
		validateError () {
	      return () => this.verify === false || this.errMSG;
	    },
	    ...mapState('auth', ['loggedIn', 'user'])
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
	  	async submitForm (e) {
			e.preventDefault();
			this.$v.$touch();
			if (this.$v.$invalid) {
				this.submitStatus = 'ERROR'
			} else {
				this.submitStatus = 'OK'
				try {
			         await this.$auth.loginWith('local', {
			          data: {
			            "username": this.username,
			            "password": this.loginPassword
			          }
			        })
			        .then(res =>{
			        	// this.$router.push('/dashboard')
			        	// let redirect_url_one = this.$route.query.redirect
			        	// let redirect_url_two = this.$store.state.vxAppRoute
			        	// if (redirect_url_one != null) {
			        	// 	this.$router.push(redirect_url_one)
			        	// }else{
			        		// this.$router.push('/')
			        	// }
			            if (this.$auth.loggedIn) {
						  var jwt = this.$auth.getToken('local')
						  localStorage.setItem('jwt', jwt)
				          var token = jwt.split(".")
				          var data = JSON.parse(atob(token[1]))
						  var nav = data.menus
						  var time = data.exp
				          localStorage.setItem('nav', JSON.stringify(nav))
				          localStorage.setItem('time', JSON.stringify(time))
				          if (window.localStorage.getItem('nav')) {
				            var items = window.localStorage.getItem('nav')
				            var thems = window.localStorage.getItem('theme')
				            if (this.$store.commit('menus/add', JSON.parse(items))) {
				              this.$store.commit('timer/add', idleTimer)
				              
				            }
						  }
						  let redirect_url = this.$route.query.redirect ||'/'
					   this.$router.push({
									path: redirect_url,
								})
				          }
			          })
			        .catch(err => {
			            this.errMSG = JSON.stringify(err.response.data.errors.password[0]);
			            this.showNotification(this.errMSG)
			        })
			      } catch (err) {  
			          this.snackText ='Service denied'
			          this.showNotification(this.snackText)
			      }
			}
		},
	  },
	head () {
		return {
			'title': 'Dukapal | Login'
		}
	}
}
</script>
