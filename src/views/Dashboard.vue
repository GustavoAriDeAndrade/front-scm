<template>
	<div id="dashboard">
		<div class="container-fluid main-container">
			<div class="row main-row">
				<div class="left" v-bind:class="{ open: $store.getters.open_menu }">
					<div @click="minimize" class="background"></div>
					<MenuLateral/>
				</div>
				<div class="right">
					<div class="row right-row">
						<div class="top">
							<NavBar/>
						</div>
						<div class="page-content">
							<router-view/>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>


<script>
	import MenuLateral from '@/components/MenuLateral.vue'
	import NavBar from '@/components/NavBar.vue'
	import store from '@/store'
	
	export default {
		name: 'Dashboard',
		components: {
			MenuLateral,
			NavBar,
		},
		methods: {
			async init() {
            	this.$router.push('/inicial')
			},
			minimize() {
				store.dispatch('toggleMenu')
			},
			getSubscriptionState() {
				return Promise.all([
				window.OneSignal.isPushNotificationsEnabled(),
				window.OneSignal.isOptedOut()
				]).then(function(result) {
					var isPushEnabled = result[0];
					var isOptedOut = result[1];

					return {
						isPushEnabled: isPushEnabled,
						isOptedOut: isOptedOut
					};
				});
			}

		},
		// funções que rodam quando o componente é montado
		mounted(){
 
			window.OneSignal.push(() => {
				window.OneSignal.init({
					appId: process.env.VUE_APP_ONESIGNAL_APP_ID,
					notifyButton: {
						enable: false,
					},
					allowLocalhostAsSecureOrigin: true,
				});

				window.OneSignal.showNativePrompt()

				window.OneSignal.getUserId(function(userId) {
					store.dispatch('postUsuarioIdOneSignal',{device:{deviceToken:userId, device_type: 'one-signal'}})
				});
			}); 
      		this.init()
		}
	}

	
</script>
<style lang="scss">
	#dashboard{
		height: 100vh;
		display: flex;
		flex: 1;
		@media (max-width: 767px) {
			max-width: 100vw;
		}
		.main-container{
			height: 100vh;
			display: flex;
			flex: 1;
			padding: 0 12px;
			.main-row{
				height: 100vh;
				flex: 1;
				position: relative;
				@media (max-width: 767px) {
					max-width: 100vw;
				}
				.left{
					position: sticky;
					top: 0;
					transition: all ease .3s;
					width: 60px;
					z-index: 10;
					-webkit-box-shadow: 0px 0px 5px 0px rgba(0,0,0,0.25); 
					box-shadow: 0px 0px 5px 0px rgba(0,0,0,0.25);
					max-height: 100vh;
					.background{
						display: none;
					}
					@media (max-width: 768px) {
						.background{
							display: block;
							background-color: #33333333;
							content: "";
							backdrop-filter: blur(7px);
							position: absolute;
							left: 100%;
							top: 0;
							visibility: hidden;
							opacity: 0;
							width: 100vw;
							height: 100vh;
						}
					}
					.wrapper-btn-minimize{
						display: flex;
						justify-content: flex-end;
						.btn-minimize{
							border: none;
							background-color: transparent;
							align-self: flex-end;
							transform: rotate(-180deg);
							transition: all ease .3s;
							height: 52px;
						}
					}
					&.open{
						width: 260px;
						.btn-minimize{
							transform: rotate(0deg);
						}
						@media (max-width: 768px) {
							.background{
								visibility: visible;
								opacity: 1;
							}
						}
					}
					@media (max-width: 767px) {
						position: fixed;
						right: 100%;
    					max-width: 100vw;
						z-index: 100;
						box-shadow: 0px 0px 5px 0px rgba(0, 0, 0, 0.1);
						&.open{
							width: 300px;
							z-index: 10;
							transform: translateX(100%);
							background-color: #fff;
						}
					}
				}
				.right{
					display: flex;
					flex: 1;
					padding: 0 12px;
					@media (max-width: 767px) {
    					max-width: 100vw;
					}
					.right-row{
						flex: 1;
						flex-direction: column;
						.top{
							position: sticky;
							top: 0;
							z-index: 5;
							-webkit-box-shadow: 0px 0px 5px 0px rgba(0,0,0,0.25); 
							box-shadow: 0px 0px 5px 0px rgba(0,0,0,0.25);
						}
						.page-content{
							background-color: $primarybackground;
							flex: 1;
							border-left: 1px solid var(--primary-color);
							// padding: 24px;
							@media (max-width: 767px) {
								max-width: 100vw;
								// padding: 12px;
							}
						}
					}
				}
			}
		}
	}
</style>