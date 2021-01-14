<template>
	<div id="sc-page-wrapper">
		<div id="sc-page-content">
			<div class="Typeahead">
				<i v-if="loading" class="fa fa-spinner fa-spin"></i>
				<template v-else>
					<i v-show="isEmpty" class="fa fa-search"></i>
					<i v-show="isDirty" class="fa fa-times" @click="reset"></i>
				</template>

				<input
					v-model="query"
					type="text"
					class="Typeahead__input"
					placeholder="Search user"
					autocomplete="off"
					@keydown.down="down"
					@keydown.up="up"
					@keydown.enter="hit"
					@keydown.esc="reset"
					@blur="reset"
					@input="update"
				>

				<ul v-show="hasItems">
					<li v-for="(item, $item) in items"
						:key="item.id"
						:class="activeClass($item)"
						@mousedown="hit"
						@mousemove="setActive($item)"
					>
						<span class="name" v-text="item.first_name"></span>
						<span class="screen-name" v-text="item.last_name"></span>
					</li>
				</ul>
			</div>
		</div>
		<div class="uk-flex-center uk-grid" data-uk-grid>
			<div class="uk-width-3-5@l">
				<ScCard class="uk-margin-top">
					<ScCardTitle>
						Cart
					</ScCardTitle>
					<ScCardBody>
						<div class="uk-overflow-auto">
							<table class="uk-table uk-table-hover uk-table-divider">
								<thead>
									<tr>
										<th class="uk-text-nowrap">
											id
										</th>
										<th class="uk-text-nowrap">
											Name
										</th>
										<th class="uk-text-nowrap">
											actions
										</th>
									</tr>
								</thead>
								<tbody>
									<tr v-for="record in records" :key="record.id">
										<td>{{ record.id }}</td>
										<td>{{ record.name }}</td>
										<td>
											<button class="sc-actions-icon mdi mdi-delete" @click="deleteRecord(record.id)"></button>
										</td>
									</tr>
								</tbody>
							</table>
						</div>
					</ScCardBody>
				</ScCard>
			</div>
		</div>
	</div>
</template>
<script>
import Vue from 'vue'
import VueTypeahead from 'vue-typeahead'
import axios from 'axios'
import Input from './Input.vue'
Vue.prototype.$http = axios
var qs=require('qs')
export default {
	components:{
Input
	},
	extends: VueTypeahead,
	data () {
		return {
			src:'http://demo.com/json/web/details/view',
			limit: 5,
			minChars: 3,
			query:'',
			fitst_name:'',
			last_name:'',
			queryParamName: 'id',
			name:'',
			records:''
			
			
		}
	},
	methods: {
		onHit (item) {	  
			this.addRecord(item)
			this.getRecords()

		},
         
		add: function (item) {
			this.items.push(item);

		},

		addRecord (item){
		 axios.post('http://demo.com/json/web/cart/create', qs.stringify({
			
				name:item.first_name.concat(item.last_name)
              
			}), {	headers: {
				'Content-type': 'application/x-www-form-urlencoded',
			}
			})
            	.then(function (response) {
					console.log('posted')
				})
				
				.catch(function (error) {
					console.log(error);
				});

			
		},
		      getRecords (){
			axios.get('http://demo.com/json/web/cart/get').then((result)=>{
				console.log(result)
				this.records=result.data

          
			})
		},
		      deleteRecord (id) {
				          Vue.swal({
				title: 'Are you sure?',
				text: 'You will not be able to recover this item!',
				icon: 'warning',
				showCancelButton: true,
				confirmButtonText: 'Yes, delete it!', 
				cancelButtonText: 'No, keep it',
				closeOnConfirm: false,
				closeOnCancel: false
			}).then((isConfirm) => {
				if (isConfirm.value) {
					axios.delete('http://demo.com/json/web/cart/delete&id='+id)
						.then(response=>{
							Vue.swal(
								'Deleted!',
								'Item has been deleted.',
								'success'
							);
							this.getRecords()
						})	.catch(function (error){
							if(error.response.status===404){
								Vue.swal(
									'Cancelled',
									'Item not Found',
									'error'
								)
				
							}
						})
				} else {
					Vue.swal(
						'Cancelled',
						'Item not deleted ',
						'error'
					)
					
				}
			}
			
			)
				
		}
	}
}
</script>



<style scoped>
.Typeahead {
  position: relative;
}
.Typeahead__input {
  width: 100%;
  font-size: 14px;
  color: #2c3e50;
  line-height: 1.42857143;
  box-shadow: inset 0 1px 4px rgba(0,0,0,.4);
  -webkit-transition: border-color ease-in-out .15s,-webkit-box-shadow ease-in-out .15s;
  transition: border-color ease-in-out .15s,box-shadow ease-in-out .15s;
  font-weight: 300;
  padding: 12px 26px;
  border: none;
  border-radius: 22px;
  letter-spacing: 1px;
  box-sizing: border-box;
}
.Typeahead__input:focus {
  border-color: #4fc08d;
  outline: 0;
  box-shadow: inset 0 1px 1px rgba(0,0,0,.075),0 0 8px #4fc08d;
}
.fa-times {
  cursor: pointer;
}
i {
  float: right;
  position: relative;
  top: 30px;
  right: 29px;
  opacity: 0.4;
}
ul {
  position: absolute;
  padding: 0;
  margin-top: 8px;
  min-width: 100%;
  background-color: #fff;
  list-style: none;
  border-radius: 4px;
  box-shadow: 0 0 10px rgba(0,0,0, 0.25);
  z-index: 1000;
}
li {
  padding: 10px 16px;
  border-bottom: 1px solid #ccc;
  cursor: pointer;
}
li:first-child {
  border-top-left-radius: 4px;
  border-top-right-radius: 4px;
}
li:last-child {
  border-bottom-left-radius: 4px;
  border-bottom-right-radius: 4px;
  border-bottom: 0;
}
span {
  display: block;
  color: #2c3e50;
}
.active {
  background-color: #0063b2ff;
}
.active span {
  color: white;
}
.name {
  font-weight: 700;
  font-size: 18px;
}
.screen-name {
  font-style: italic;
}
</style>