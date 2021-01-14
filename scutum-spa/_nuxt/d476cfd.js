(window.webpackJsonp=window.webpackJsonp||[]).push([[9],{325:function(t,e,n){"use strict";n.r(e);var l={name:"ScInput",props:{id:{type:String,default:null},name:{type:String,default:null},type:{type:String,default:"text"},value:{type:[String,Object],default:""},disabled:{type:Boolean,default:!1},readOnly:{type:Boolean,default:!1},mode:{type:String,default:""},state:{type:String,default:""},extraClasses:{type:String,default:""},successState:{type:Boolean,default:!1},errorState:{type:Boolean,default:!1},placeholder:{type:String,default:null},ukTooltip:{type:Object,default:null},focus:{type:Function,default:null},blur:{type:Function,default:null},change:{type:Function,default:null},keyUp:{type:Function,default:null},validator:{type:Object,default:null}},data:function(){return{inputFocused:!1}},computed:{modeClass:function(){return"outline"===this.$props.mode?"sc-input-outline":""},inputErrorClass:function(){return this.$props.errorState?"uk-form-danger":""},inputSuccessClass:function(){return this.$props.successState?"uk-form-success":""}},mounted:function(){this.ukTooltip&&UIkit.tooltip(this.$refs.input,this.ukTooltip)},methods:{inputBlur:function(){this.inputFocused=!1,this.blur&&this.blur(),this.validator&&this.validator.$touch(),this.$emit("blur")},inputFocus:function(){this.inputFocused=!0,this.focus&&this.focus(),this.$emit("focus")},inputChange:function(){this.change&&this.change(),this.$emit("change")},inputKeyUp:function(){this.keyUp&&this.keyUp(),this.$emit("keyUp")}}},r=n(3),component=Object(r.a)(l,(function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("div",{staticClass:"sc-input-wrapper",class:{"sc-input-wrapper-outline":"outline"===t.mode,"sc-input-wrapper-disabled":t.disabled,"sc-input-wrapper-danger":t.errorState,"sc-input-wrapper-success":t.successState,"sc-input-filled":""!==t.value||"fixed"===t.state,"sc-input-focus":t.inputFocused}},[t._t("icon"),t._v(" "),t._t("default"),t._v(" "),n("input",{ref:"input",class:["uk-input","sc-vue-input",t.modeClass,t.inputErrorClass,t.inputSuccessClass,t.extraClasses],attrs:{id:t.id,name:t.name,placeholder:t.placeholder,type:t.type,disabled:t.disabled,readonly:t.readOnly},domProps:{value:t.value},on:{focus:t.inputFocus,blur:t.inputBlur,change:t.inputChange,input:function(e){return t.$emit("input",e.target.value)},keyup:t.inputKeyUp}}),t._v(" "),"outline"!==t.mode?n("span",{staticClass:"sc-input-bar"}):t._e(),t._v(" "),t._t("help-inline")],2)}),[],!1,null,null,null);e.default=component.exports;installComponents(component,{Input:n(325).default})},462:function(t,e,n){t.exports=n.p+"img/logo_alt.ee1f89d.png"},463:function(t,e,n){t.exports=n.p+"img/logo.333dbc7.png"},470:function(t,e,n){"use strict";n.r(e);var l=n(460),r=n(380),o={layout:"login",components:{ScInput:n(325).default},mixins:[l.validationMixin],data:function(){return{userName:"",password:"",loginData:{login:"",password:""},recoverPassEmail:""}},computed:{appLogo:function(){return n(462)},appLogoLight:function(){return n(463)}},head:function(){return{title:"Scutum Admin Login Page"}},validations:{userName:{required:r.required,minLength:Object(r.minLength)(3)},password:{required:r.required,minLength:Object(r.minLength)(6)}},methods:{showAlert:function(){this.$swal("You pressed Login!!!")},submitForm:function(t){var e=this;t.preventDefault(),this.$v.$touch(),this.$v.$invalid?this.submitStatus="ERROR":(this.submitStatus="PENDING",setTimeout((function(){e.submitStatus="OK"}),500))},loginBack:function(){swal({title:"Are you sure?",text:"It will permanently deleted !",type:"warning",showCancelButton:!0,confirmButtonColor:"#3085d6",cancelButtonColor:"#d33",confirmButtonText:"Yes, delete it!"}).then((function(){swal("Deleted!","Your file has been deleted.","success")}))}}},c=n(3),component=Object(c.a)(o,(function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("div",{staticClass:"uk-flex uk-flex-center uk-flex-middle sc-login-page-wrapper"},[n("div",{staticClass:"uk-width-2-3@s uk-width-1-2@m uk-width-1-3@l uk-width-1-4@xl uk-margin-auto-vertical"},[n("ScCard",[n("ScCardHeader",{staticClass:"sc-padding uk-margin-medium-bottom ",staticStyle:{"background-color":"#018786"}},[n("div",{staticClass:"uk-flex uk-flex-middle"},[n("ScCardTitle",[n("h5",{staticStyle:{color:"white"}},[t._v("\n\t\t\t\t\t\t\tHEALTH PLUS LOGIN\n\t\t\t\t\t\t")])])],1)]),t._v(" "),n("ScCardBody",[n("div",{staticClass:"sc-toggle-login-register sc-toggle-login-password",attrs:{id:"sc-login-form"}},[n("div",{staticClass:"sc-login-page-inner"},[n("div",{staticClass:"uk-margin-medium"},[n("ScInput",{attrs:{name:"userName","error-state":t.$v.userName.$error,validator:t.$v.userName},model:{value:t.$v.userName.$model,callback:function(e){t.$set(t.$v.userName,"$model",e)},expression:"$v.userName.$model"}},[n("label",[t._v("Username *")])]),t._v(" "),n("ul",{staticClass:"sc-vue-errors"},[t.$v.userName.required?t._e():n("li",[t._v("\n\t\t\t\t\t\t\t\t\tField is required\n\t\t\t\t\t\t\t\t")]),t._v(" "),t.$v.userName.minLength?t._e():n("li",[t._v("\n\t\t\t\t\t\t\t\t\tUsername must have at least "+t._s(t.$v.userName.$params.minLength.min)+" letters.\n\t\t\t\t\t\t\t\t")])])],1),t._v(" "),n("div",{staticClass:"uk-margin-medium"},[n("ScInput",{attrs:{name:"password",type:"password","error-state":t.$v.password.$error,validator:t.$v.password},model:{value:t.$v.password.$model,callback:function(e){t.$set(t.$v.password,"$model",e)},expression:"$v.password.$model"}},[n("label",[t._v("Password *")])]),t._v(" "),n("ul",{staticClass:"sc-vue-errors"},[t.$v.password.required?t._e():n("li",[t._v("\n\t\t\t\t\t\t\t\t\tPassword is required.\n\t\t\t\t\t\t\t\t")]),t._v(" "),t.$v.password.minLength?t._e():n("li",[t._v("\n\t\t\t\t\t\t\t\t\tPassword must have at least "+t._s(t.$v.password.$params.minLength.min)+" characters.\n\t\t\t\t\t\t\t\t")])]),t._v(" "),n("div",{staticClass:"uk-margin-small-top uk-text-small uk-text-right@s"},[n("a",{staticClass:"sc-link",attrs:{href:"javascript:void(0)","data-uk-toggle":"target: .sc-toggle-login-password; animation: uk-animation-scale-up"}},[t._v("\n\t\t\t\t\t\t\t\t\tForgot Password?\n\t\t\t\t\t\t\t\t")])])],1),t._v(" "),n("div",{staticClass:"uk-margin-large-top"},[n("button",{staticClass:"sc-button sc-button-large sc-button-block sc-button-primary",attrs:{disabled:"PENDING"===t.submitStatus},on:{click:[function(e){return e.preventDefault(),t.submitForm(e)},t.showAlert]}},[t._v("\n\t\t\t\t\t\t\t\tSign In\n\t\t\t\t\t\t\t")])])])]),t._v(" "),n("div",{staticClass:"sc-toggle-login-password",attrs:{id:"sc-password-form",hidden:""}},[n("div",{staticClass:"sc-login-page-inner"},[n("div",{staticClass:"uk-margin-medium"},[t._v("\n\t\t\t\t\t\t\tPlease enter your email address. You will receive a link to reset your password.\n\t\t\t\t\t\t")]),t._v(" "),n("div",{staticClass:"uk-margin-medium"},[n("ScInput",{model:{value:t.recoverPassEmail,callback:function(e){t.recoverPassEmail=e},expression:"recoverPassEmail"}},[n("label",[t._v("\n\t\t\t\t\t\t\t\t\tEmail\n\t\t\t\t\t\t\t\t")])])],1),t._v(" "),n("div",{staticClass:"uk-margin-large-top"},[n("button",{staticClass:"sc-button sc-button-large sc-button-block sc-button-primary"},[t._v("\n\t\t\t\t\t\t\t\tReset Password\n\t\t\t\t\t\t\t")]),t._v(" "),n("div",{staticClass:"uk-margin-large-top uk-flex uk-flex-middle uk-flex-center"},[n("button",{staticClass:"sc-button sc-button-large sc-button-block sc-button-primary",on:{click:t.loginBack}},[t._v("\n\t\t\t\t\t\t\t\t\tBack to login form\n\t\t\t\t\t\t\t\t")])])])])])])],1)],1)])}),[],!1,null,null,null);e.default=component.exports}}]);