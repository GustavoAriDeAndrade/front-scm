<template>
    <div class="card-table">
        <div class="row table-content">
            <div class="col-12 wrapper-conteudos">
                <div class="col-md-1 col-12 title">
                    <!-- <h2 v-if="title">{{title}}</h2> -->
                    <img :src="icone" alt="">
                </div>
				<div class="col-md-4 div-paginacao">
					<p><span>Resultados</span> por página:</p>
					<v-select 
					:items="qnt_por_pagina" 
					v-model="perPage" 
					dense 
					solo
					@change="hendleBusca"
					>
					</v-select>
			   </div>
               <div v-if="search" class="col-md-5 col-12 d-flex justify-end align-center div-busca">
					<v-text-field 
						type="text"
						v-model="busca" 
						placeholder="Buscar..."
						@change="hendleBusca"
					/>
					<div class="div-icon">
						<v-icon>fas fa-search</v-icon>
					</div>
				</div>
                <div class="col-md-2 col-12 d-flex justify-end align-center btn-opcoes-headers">
                    <v-btn light class="secondary-button headline">
                        Opções
                    </v-btn>
                </div>
                <div class="col-12 cards_">
					<div class="row row-cards">
						<div class="card col-md-4 col-12" v-for="card in dados" :key="card.id">
							<div class="conteudo">
								<div class="nome">
									<img src="./../assets/images/avatar.png">
									{{card.name}}
									<v-btn
										@click="actionEditarTelefone(card.id)"
										elevation="0"
									>
										<v-icon >far fa-edit</v-icon>
									</v-btn>
								</div>
								<div class="informacoes">
									<p class="numero-telefone">
										<img src="./../assets/images/icon-phone.png">
										<b>Telefone</b>
										{{card.number}}
									</p>
									<p class="situacao" v-if="card.status = true">
										<img style="width: 20px" src="./../assets/images/icon-ativo.png">
										<b>Situação</b>
										Ativo
									</p>
									<p class="situacao" v-if="card.status = false">
										<img style="width: 20px" src="./../assets/images/icon-inativo.png">
										<b>Situação</b>
										Inativo
									</p>
									<p style="margin-left: 10px;" class="situacao" v-if="card.battery > 30">
										<img src="./../assets/images/icon-conectado.png">
										<b>Bateria</b>
										{{card.battery}}%	
									</p>
									<p style="margin-left: 10px;" class="situacao" v-if="card.battery <= 30">
										<img src="./../assets/images/icon-desconectado.png">
										<b>Bateria</b>
										{{card.battery}}%
									</p>
									<p style="margin-left: 10px;" class="status-whatsapp" v-if="card.status_whats == 'isConnected'">
										<img src="./../assets/images/icon-conectado.png">
										<b>Status WhatsApp</b>
										{{card.status_whats_text}}
									</p>
									<p style="margin-left: 10px;" class="status-whatsapp" v-else>
										<img src="./../assets/images/icon-desconectado.png">
										<b>Status WhatsApp</b>
										{{card.status_whats_text}}									
									</p>
								</div>
							</div>
						</div>
					</div>
                </div>
                <div v-if="pagination" class="col-12 justify-end d-flex pt-2">
                    <v-pagination v-model="currentPage" :length="rows" @input="handlePagination"/>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
	import store from '@/store'

	export default {
		props: ["action", "getter", "title", "search", "pagination", "filters", "icone", "actionEditarTelefone"],
		name: "CardTable",
		data() {
			return {
				// variável para mostrar a modal para editar/criar um telefone
				dialog_telefone: false,
				loading: true,
				dados: [],
				options: {},
				order_by: '',
				order: 'asc',
				busca: '',
				total: 0,
				currentPage: 1,
				perPage:  this.filters.perPage || 10,
				qnt_por_pagina: [10, 50, 100, 1000],
			}
		},
		methods:{
			async init(){
				await this.changeLoading(true)
				await store.dispatch(
					this.action, 
					this.updateFilters()
				)
				this.changeLoading(false)
			},
			handlePagination(value) {
				this.currentPage = value
				this.init()
			},
			hendleBusca() {
				this.init()
			},
			changeLoading(value) {
				this.loading = value
			},
			updateFilters(){
				return {
					adicionais: this.filters,
					offset: (this.perPage * (this.currentPage - 1)),
					limit: this.perPage,
					order_column: this.order_by,
					order_dir: this.order,
					search: this.busca,
				}
			},			
			cahngeTableStyle(){
				this.tabelaCard = !this.tabelaCard
			}
		},
		watch: {
			updateTable () {
				this.dados = this.getter.dados
				this.total = this.getter.total
			},
		},
		mounted(){
			this.init()
		},
		computed: {
			rows() {
				return Math.ceil(this.total/this.perPage)  
			},
			updateTable () {
				return this.getter
			},
		},
	}
</script>

<style lang="scss">
	.card-table{
		flex: 1;
		padding: 12px;
		padding-top: 0;
		margin-bottom: 30px;
		.table-content{
			flex: 1;
			.wrapper-conteudos{
				display: flex;
				flex-wrap: wrap;
				padding-top: 0;
				.title{
					display: flex;
					flex-wrap: wrap;
					justify-content: center;
					align-items: center;
					img{
						border: 1px solid #11263C;
						border-radius: 10px;
						padding: 10px;
					}
				}
			}
			.div-paginacao{
				display: flex;
				flex-wrap: wrap;
				align-items: center;
				padding: 0 15px;
				p{
					font-size: 14px;
					margin: 0;
					span{
						font-weight: 600;
					}
				}
				.v-input{
					display: flex;
					flex-wrap: wrap;
					align-items: center;
					max-width: 32%;
					margin-left: 10px;
					.v-input__slot{
						padding: 0 0 0 12px;;
					}
					.v-text-field__details{
						display: none;
					}
				}
			}
			.div-busca{
				padding: 0 15px;
				position: relative;
				.v-input{
					margin: 0;
					padding: 0;					
					.v-input__slot{
						background: #F9F9F9;
						border: 1px solid #C8C8C8;
						box-sizing: border-box;
						border-radius: 30px;
						padding: 7px 70px 5px 15px;
						margin: 0;
						&:before, &:after{
							display: none;							
						}
					}
					.v-text-field__details{
						display: none;
					}
				}
				.div-icon{
					position: absolute;
					display: flex;
					justify-content: center;
					align-items: center;
					background: rgba(17, 38, 60, 1);
					border: 1px solid #C8C8C8;
					border-radius: 0 30px 30px 0 ;
					width: 60px;
					right: 15px;
					margin-top: 0;
					height: 69%;
					cursor: pointer;
					svg, i{
						padding: 0 15px;
						width: 45px;
						margin: 0;
						z-index: 1;
						color: #fff;
					}
				}
			}
			.cards_{
				.row-cards{
					.conteudo{
						border: 1px solid #C8C8C8;
						border-radius: 10px;
						background-color: #f9f9f9;
						padding: 10px;
						font-size: 14px;
						color: #11263C;
						height: 100%;
						.nome{
							display: flex;
							flex-wrap: wrap;
							align-items: center;
							justify-content: space-around;
							font-size: 18px;
							font-weight: 600;
							text-align: center;
							margin-bottom: 10px;
							button{
								background-color: transparent;
							}
						}
						p{
							display: flex;
							flex-wrap: wrap;
							align-items: center;
							margin: 0;
							color: #747474;
							b{
								color: #11263C;
								font-weight: 600;
								margin: 0 5px;
							}
						}
					}
				}
			}
		}
	}
</style>
