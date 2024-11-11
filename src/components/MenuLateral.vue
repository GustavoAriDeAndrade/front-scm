<template>
	<div id="menu-lateral">
		<div class="row">
			<div class="top">
				<Logo/>
			</div>
			<ul>
				<li v-for="(menu, i) in respective_menus" :key="i">
					<router-link @click.native="closeMenu" :to="menu.link">
						<span class="icone">
							<i :class="menu.icon"></i>
						</span>
						<span class="texto">
							<p>
								{{menu.name}}
							</p>
						</span>
					</router-link>
				</li>
				<li v-if="$store.getters.screen_size.width <= 768">
					<router-link @click.native="closeMenu" to="/logout">
						<span class="icone">
							<i class="fas fa-sign-out-alt"></i>
						</span>
						<span class="texto">
							<p>
								Sair
							</p>
						</span>
					</router-link>
				</li>
			</ul>
		</div>
	</div>
</template>

<script>
	import store from '@/store'
	import Logo from "@/components/Logo.vue"
	
	export default {
		name: 'MenuLateral',
		components: {
			Logo,
		},
		data: () => ({
			dialog_resposta: false,
			resposta: {},
			all_menus: [
				{
					link: '/usuarios',
					name: 'Usuários',
					icon: 'fas fa-users',
					group: ['admin'],
				},
				{
					link: '/clientes',
					name: 'Clientes',
					icon: 'fas fa-user-friends',
					group: ['admin', 'caixa'],
				},
				{
					link: '/produtos',
					name: 'Produtos',
					icon: 'fas fa-tshirt',
					group: ['admin', 'caixa'],
				},
				{
					link: '/vendas',
					name: 'Vendas',
					icon: 'fas fa-store',
					group: ['admin', 'caixa']
				},
				{
					link: '/pagamentos',
					name: 'Pagamentos',
					icon: 'fas fa-money-bill-wave-alt',
					group: ['admin', 'caixa']
				},
				{
					link: '/relatorios',
					name: 'Relatórios',
					icon: 'fas fa-chart-bar',
					group: ['admin']
				}
			],
			respective_menus: [],
		}),
		methods: {
			menuPerGroup(){
				this.respective_menus = this.all_menus.filter(this.isThisGroup);
			},
			isThisGroup(menu){
				if(menu.group.length > 0){
					let response = (menu.group).find(element => element == store.getters.user.group.chave)
					return response != undefined
				}
				return true
			},
			closeMenu(){
				if (store.getters.screen_size.width < 768) {
					store.dispatch('toggleMenu')
				}
			},
			init(){
				this.menuPerGroup()
			}
		},
		mounted() {
			this.init()
		},
	}
</script>

<style lang="scss">
	#menu-lateral{
		text-align: center;
		padding: 0 12px;
		height: 100vh;
		position: relative;
		z-index: 1;
		background-color:  #ffffff;
		@media (max-width: 768px) {
			overflow-y: auto;
		}
		.top{
			display: flex;
			justify-content: center;
			align-items: center;
			flex: 1;
			#logo{
				padding: 12px;
			}
		}
		ul{
			padding: 0;
			list-style: none;
			margin: 0;
			width: 100%;
			
			li{
				border-bottom: 1px solid #F2E1D1;
				a{
					padding: 15px 30px;
					display: flex;
					color: #2D2D23;
					transition: all ease .3s;
					align-items: center;
					.icone{
						margin-right: 10px;
						width: 20px;
						display: flex;
						align-items: center;
						justify-content: center;
						transition: all ease .3s;
					}
					p{
						margin-bottom: 0;
						position: relative;
						top: 1px;
					}
					&.active,
					&:hover{
						color: rgba(37, 37, 37, 0.911);
						background-color: #fff6e6;
					}
				}
			}
		}
	}
	.left:not(.open){
		#menu-lateral{
			.top{
				.logo{
					padding: 5px;
				}
			}
			ul{
				li{
					a{
						position: relative;
						padding: 10px 0px;
						align-items: center;
						justify-content: center;
						display: flex;
						.icone{
							margin-right: 0px;
						}
						.texto{
							position: absolute;
							width: max-content;
							right: 0;
							opacity: 0;
							padding: 5px 15px 5px 35px;
							transition: all ease .3s;
							&:after,
							&:before{
								content: '';
								box-shadow: 0px 0px 5px 0px rgba(0, 0, 0, 0.1);
								position: absolute;
							}
							&:before{
								top: 0;
								right: 0;
								bottom: 0;
								left: 20px;
								border-radius: 5px;
								z-index: 1;
								background-color: #FFDAA4;
							}
							&:after{
								transform: rotate(45deg) translateY(-50%);
								width: 20px;
								height: 20px;
								box-shadow: 0px 0px 5px 0px rgba(0, 0, 0, 0.1);
								left: 5px;
								top: 40%;
								border-radius: 0 5px;
							}
							p{
								background-color: #FFD9A3;
								z-index: 2;
								border-radius: 5px;
								position: relative;
								line-height: 2;
								&:before{
									content: '';
									background-color:  #FFD9A3;
									position: absolute;
									transform: rotate(45deg) translateY(-50%);
									width: 20px;
									height: 20px;
									left: -31px;
									top: 40%;
									border-radius: 0 5px;
								}
							}
						}
						&:hover{
							.texto{
								transform: translateX(100%);
								opacity: 1;
								color: #242123;
							}
						}
					}
				}
			}
		}
	}
</style>