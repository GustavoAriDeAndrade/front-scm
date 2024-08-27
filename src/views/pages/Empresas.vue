<template>
	<div id="empresas">
		<div class="tabela-empresas">
			<div class="col-12 nova-empresa">
				<!-- botão para ativação da modal -->
				<v-btn class="primary-button" raised @click="dialog_empresa = true">
					<i class="fas fa-store"></i>
					<i class="mr-2 fas fa-plus-circle"></i> 
					Cadastrar Empresa
				</v-btn>
			</div>
			<!-- tabela que ira conter as informações de cada empresa -->
			<CustomTable 
				v-if="headers != ''"
				:action="'getEmpresas'"
				:getter="$store.getters.empresas"
				:headers="headers"
				:search="true"
				:title="'Empresas'"
				:icone="'fas fa-city'"
				:pagination="true"
				:filters="filtros"
				ref="tabela"
			>
				<template v-slot:identifier="{ item }">
					{{ formatCnpjCpf(item.identifier) }}
				</template>
				<template v-slot:status="{ item }">
					<span v-if="item.status">
						Ativo
						<img src="./../../assets/images/icon-ativo.png">
					</span>
					<span v-else>
						Inativo
						<img src="./../../assets/images/icon-inativo.png">
					</span>
				</template>
				<!-- botão para ativação da modal presente na tabela -->
				<template v-slot:acoes="{ item }">
					<v-btn class="primary-button" raised small @click="editarEmpresa(item.uuid)">
						<i class="fas fa-cog"></i>
						Editar
					</v-btn>
				</template>
			</CustomTable>
			<!-- modal para cadastro/edição de uma empresa -->
			<v-dialog v-model="dialog_empresa" persistent max-width="650px">
				<v-card>
					<v-card-title>
						<span v-if="empresa.empresa_uuid" class="headline"> <img src="./../../assets/images/icone-nova-empresa.png"> Editar Empresa</span>						
						<span v-else class="headline"><img src="./../../assets/images/icone-nova-empresa.png"> Nova Empresa</span>
					</v-card-title>
					<v-card-text>
						<v-container>
							<v-form ref="form_empresa">
								<div class="row">
									<div class="col-12">
										<v-text-field 
											:rules="[v => !!v || 'Campo Nome obrigatório']" 
											v-model="empresa.nome" 
											label="Nome" 
											placeholder="Nome" 
											background-color="white"
											hide-details
											outlined
										/>
									</div>
									<div class="col-12">
										<v-text-field 
											v-mask="'##.###.###/####-##'"
											type="text"
											:rules="[v => (validarCNPJ(v)) || 'Campo CNPJ obrigatório']" 
											v-model="empresa.identifier" 
											label="CNPJ" 
											placeholder="CNPJ" 
											background-color="white"
											hide-details
											outlined
										/>
									</div>
									<div v-if="empresa.empresa_uuid"  class="col-12">
										<v-select 
											:rules="[v => !!v || 'Campo Status obrigatório']" 
											:items="['Ativo', 'Inativo']" 
											v-model="empresa.status" 
											label="Status" 
											placeholder="Status" 
											background-color="white"
											hide-details
											outlined
										/>
									</div>
									<!--div para os dias da semana e horarios de cada empresa-->
									<div class="col-12">
										<h3>Horários de funcionamento</h3>
										<div class="horario" v-for="(horario, i) in empresa.horarios" :key="i">
											<div class="inputs">
												<div class="row">
													<div class="col-md-4 col-12">
														<v-select
															:rules="[v => (!!v || v == 0) || 'Campo Dia(s) obrigatório']"
															:items="dias_semana"
															v-model="empresa.horarios[i].weekday"
															item-text="texto"
															item-value="dia"
															label="Dia(s) da semana"
															placeholder="Dia(s) da semana"
															background-color="white"
															hide-details
															outlined
														/>
													</div>
													<div class="col-md-4 col-12">
														<v-text-field
															:rules="[v => !!v || 'Campo De obrigatório']"
															v-model="empresa.horarios[i].start_time"
															label="De"
															placeholder="De"
															background-color="white"
															hide-details
															outlined
															readonly
															@click="chamaTimePicker"
															:data-modalToggle="'id_modal_time_picker_de_'+[i]"
														/>
														<div :id="'id_modal_time_picker_de_'+[i]" class="modal-time-picker">
															<div class="wrapper-time-picker">
																<v-time-picker
																	v-model="timeDe"
																	full-width
																	format="24hr"
																>
																	<v-spacer></v-spacer>
																	<v-btn text-style="text-transform: capitalize; font-size: 16px;" @click="fechaTimePicker()">
																		Cancelar
																	</v-btn>
																	<v-btn class="primary-button" small @click="saveDe(i, timeDe)">
																		OK
																	</v-btn>
																</v-time-picker>
															</div>
														</div>
													</div>
													<div class="col-md-4 col-12">
														<v-text-field
															:rules="[v => !!v || 'Campo Até obrigatório', v => v > empresa.horarios[i].start_time || 'Campo Maior que TimeDe']"
															v-model="empresa.horarios[i].end_time"
															label="Até"
															placeholder="Até"
															background-color="white"
															hide-details
															outlined
															readonly
															@click="chamaTimePicker"
															:data-modalToggle="'id_modal_time_picker_ate_'+[i]"
														/>
														<div :id="'id_modal_time_picker_ate_'+[i]" class="modal-time-picker">
															<div class="wrapper-time-picker">
																<v-time-picker
																	v-model="timeAte"
																	full-width
																	format="24hr"
																>
																	<v-spacer></v-spacer>
																	<v-btn text style="text-transform: capitalize; font-size: 16px;" @click="fechaTimePicker()">
																		Cancelar
																	</v-btn>
																	<v-btn class="primary-button" small @click="saveAte(i, timeAte)">
																		OK
																	</v-btn>
																</v-time-picker>
															</div>
														</div>
													</div>
												</div>
											</div>
											<v-btn v-if="empresa.horarios.length > 1" type="button" @click="removeHorario(i)" color="primary-button" raised class="remover-horario">
												<i class="fas fa-minus"></i>
											</v-btn>
										</div>
										<v-btn class="primary-button" raised @click="addHorario">
											<i style="margin-right: 10px" class="fas fa-plus"></i> Adicionar Horário
										</v-btn>
									</div>
								</div>
							</v-form>
						</v-container>
					</v-card-text>
					<v-card-actions>
						<v-spacer></v-spacer>
						<v-btn color="darken-1" text style="text-transform: capitalize; font-size: 16px;" @click="closeEmpresa">
							Cancelar
						</v-btn>
						<v-btn class="primary-button"  small @click="enviarempresa">
							Salvar
						</v-btn>
					</v-card-actions>
				</v-card>
			</v-dialog>
			<DialogMensagem :visible="dialog_resposta" :mensagem="resposta" @close="dialog_resposta=false"/>
			<Loader v-if="loading"/>
		</div>
	</div>
</template>
<!--funções para trazer e encaminhar os dados da modal e da tabela-->
<script>
	// importa o store
	import store from '@/store'
	// importa o componente de DialogMensagem 
	import DialogMensagem from '@/components/DialogMensagem.vue'
	// importa o componente de Loader 
	import Loader from '@/components/Loader.vue'
	// importa o componente de CustomTable 
	import CustomTable from '@/components/CustomTable.vue'

	// exporta o componente
	export default {
		// nome do componente
		name: 'empresas',
		// componentes filhos
		components: {
			// componente de DialogMensagem
			DialogMensagem,
			// componente de CustomTable
			CustomTable,
			// componente de Loader
			Loader,
		},
		// dados do componente
		data: () => ({
			// variável para mostrar a modal para editar/criar um empresa
			dialog_empresa: false,
			// variável para mostrar a modal de informação
			dialog_resposta: false,
			// variável para mostrar a modal timePickerDe
			modal_time_de: false,
			// variável para o horario da modal timePickerDe
			timeDe: null,
			// variável para mostrar a modal timePickerAte
			modal_time_ate: false,
			// variável para o horario da modal timePickerAte
			timeAte: null,
			// variável para a mensagem de resposta
			resposta: {},
			// variável para o loading
			loading: false,
            // variável para os dias da semana
            dias_semana: [
                {
                    dia: 1,
                    texto: 'Segunda-feira',
                },
                {
                    dia: 2,
                    texto: 'Terça-feira',
                },
                {
                    dia: 3,
                    texto: 'Quarta-feira',
                },
                {
                    dia: 4,
                    texto: 'Quinta-feira',
                },
                {
                    dia: 5,
                    texto: 'Sexta-feira',
                },
                {
                    dia: 6,
                    texto: 'Sábado',
                },
                {
                    dia: 7,
                    texto: 'Domingo',
                },
            ],
			// variável para criar/editar empresa
			empresa: {
				empresa_uuid: '',
				nome: '',
				identifier: '',
				status: '',
				horarios: [{
					weekday: '',
					start_time: '',
					end_time: '',
				}]
			},
			// variável para o cabeçalho da tabela
			headers: [
				{
					value: 'name',
					text: 'Nome',
					sortable: true,
				},
				 {
					value: 'identifier',
					text: 'CNPJ',
					sortable: true,
				},
				{
					value: 'token',
					text: 'Token',
					sortable: true,
				},
				{
					value: 'status',
					text: 'Status',
					sortable: true,
				},
				{
					value: 'acoes',
					sortable: false,
					text: 'Ações',
				},
			],
			// variável para os filtros da tabela
			filtros: {
				perPage: 20,
			},
		}),
		// funções deste componente
		methods: {
			// função para salvar horario inicial da empresa
			async saveDe(i, time){
				this.empresa.horarios[i].start_time = await time
				let el = document.getElementById(this.attrDataIrmaoModalToggle)
                el.classList.remove('ativo')
                this.attrDataIrmaoModalToggle.classList.remove('ativo')
			},
			// função para salvar o horário final da empresa
            async saveAte(i, time){
                this.empresa.horarios[i].end_time = await time
                let el = document.getElementById(this.attrDataIrmaoModalToggle)
                el.classList.remove('ativo')
                this.attrDataIrmaoModalToggle.classList.remove('ativo')
            },
			// função para enviar um empresa
			async enviarempresa(){
				let resp = {}
				// caso os campos do formulário estejam válidos
				if (this.$refs.form_empresa.validate()){
					// coloca o componente como loading
					this.loading = await true
					// coleta os dados do empresa
					let dados = await {
						// coleta o nome do empresa
						name: await this.empresa.nome,
						// coleta o cnpj do empresa
						identifier: await this.empresa.identifier.replace(/\D/g, ""),
						// coleta o status da empresa
						status: true,
						// coleta os horarios da empresa
						hours: await this.empresa.horarios,
					}
					// caso exista um empresa_uuid 
					if(this.empresa.empresa_uuid){
						// coleta o status do empresa
						dados.status = await this.empresa.status == 'Ativo' ? true : false
						// armazena os dados para realizar a atualização
						let date_update = await {
							dados_empresa: dados,
							uuid: this.empresa.empresa_uuid
						}
						// rota para a atualização dos dados da empresa
						resp = await store.dispatch('putEmpresas', date_update)
					}else{
						// faz a criação dos dados da empresa
						resp = await store.dispatch('postEmpresas', dados)
					}
					// caso algo tenha dado errado
					if(resp.status != 200 && resp.status != 201){
						// atribui o título da mensagem 
						this.resposta.titulo = await 'Algo deu errado!'
						// atribui o corpo da mensagem 
						this.resposta.mensagem = await  resp.data.message || resp.data.error
						// mostra a mensagem
						this.dialog_resposta = true
					// caso tenha dado tudo certo
					}else{
						// atribui o título da mensagem 
						this.resposta.titulo = await 'Empresa '  +  (this.empresa.empresa_uuid ? 'editada!' : 'cadastrada!')
						// atribui o corpo da mensagem 
						this.resposta.mensagem = await 'Empresa ' + (this.empresa.empresa_uuid ? 'editada' : 'cadastrada') + ' com sucesso!'
						// fecha a modal de create/edit empresa
						this.closeEmpresa()
						// mostra a mensagem
						this.dialog_resposta = true
					}
					// retira o loading do componente
					this.loading = false
					// atualiza a tabela
					this.$refs.tabela.init()
				}
			},
			// função para coletar um empresa para editar
			async editarEmpresa(empresa_uuid){
				// coloca o componente como loading
				this.loading = true
				// faz um dispatch para uma action no vuex store para pegar um empresa passando o id 
				var resp = await store.dispatch('getEmpresa', empresa_uuid)
				// caso o status da resposta seja 200 (deu certo) 
				if(resp.status == 200){
					// atribui os dados do empresa vindos do back à váriável local
					this.empresa.empresa_uuid = await resp.data.company.uuid || ''
					this.empresa.nome = await resp.data.company.name || ''
					this.empresa.identifier = await resp.data.company.identifier || ''
					this.empresa.status = await resp.data.company.status ? 'Ativo' : 'Inativo'
					// caso exista dados de horarios
					if(resp.data.company.hours){
						// faz as atribuições
						for(let i = 0; i < resp.data.company.hours.length; i++){
							if(this.empresa.horarios[i] == undefined){
								this.empresa.horarios[i] = {
								}
							}
							this.empresa.horarios[i].uuid = resp.data.company.hours[i].uuid
							this.empresa.horarios[i].weekday = resp.data.company.hours[i].week_day
							this.empresa.horarios[i].start_time = resp.data.company.hours[i].from
							this.empresa.horarios[i].end_time = resp.data.company.hours[i].to
						}
					// caso ainda não exista dados de horários
					}else{
						this.empresa.horarios = [{
							uuid: '',
							weekday: '',
							start_time: '',
							end_time: '',
						}]
					}
					// mostra a modal de creat/edit empresa
					this.dialog_empresa = true
				}else{
					// atribui o título da mensagem 
					this.resposta.titulo = await 'Algo deu errado!'
					// atribui o corpo da mensagem 
					this.resposta.mensagem = await  resp.data.message || resp.data.error
					// mostra a mensagem
					this.dialog_resposta = true
				}
				// retira o loading do componente
				this.loading = false
				// atualiza a tabela
				this.$refs.tabela.init()
			},
			// função que roda quando é fechada a modal de create/edit empresa
			closeEmpresa(){
				// fecha a modal
				this.dialog_empresa = false
				// limpa os dados locais do empresa
				this.empresa =  {
					empresa_uuid: '',
					nome: '',
					identifier: '',
					status: '',
					horarios: [{
						id: '',
						weekday: '',
						start_time: '',
						end_time: '',
					}]
				}
			},
			// função para abrir campo extras de adição de dias da semana 
			addHorario(){
				this.empresa.horarios.push({
					weekday: '',
					start_time: '',
					end_time: '',
				})
			},
			// função para remover campos extras de dias da semana
			removeHorario(index){
				if(index > -1){
					this.empresa.horarios.splice(index, 1)
				}
			},
			// função que roda quando é aberta a modal de TimePicker
			chamaTimePicker: function(e){
                let var_el = e.target
                let data_modal_toggle = var_el.getAttribute('data-modalToggle')
                this.attrDataIrmaoModalToggle = data_modal_toggle
                let el_modal = document.getElementById(this.attrDataIrmaoModalToggle)
                el_modal.classList.add('ativo')
            },
			// funçãoque roda quando é fechada a modal de timePicker
			fechaTimePicker(){
				let el = document.getElementById(this.attrDataIrmaoModalToggle)
				el.classList.remove('ativo')
			},
			// função para formatar a identificação da empresa
			formatCnpjCpf(value){

				const cnpjCpf = value.replace(/\D/g, '');

				return cnpjCpf.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/g, "$1.$2.$3/$4-$5");
			},
			// função para fazer as validações da identificação da empresa
			validarCNPJ(value) {
				var identifier = value.replace(/[^\d]+/g,'');
				if(identifier == '') return false;
				if (identifier.length != 14){
					return false;
				}
				// Elimina CNPJs invalidos conhecidos
				if (identifier == "00000000000000" || 
					identifier == "11111111111111" || 
					identifier == "22222222222222" || 
					identifier == "33333333333333" || 
					identifier == "44444444444444" || 
					identifier == "55555555555555" || 
					identifier == "66666666666666" || 
					identifier == "77777777777777" || 
					identifier == "88888888888888" || 
					identifier == "99999999999999"){
					return false;
				}
				// Valida DVs
				var tamanho = identifier.length - 2
				var numeros = identifier.substring(0,tamanho);
				var digitos = identifier.substring(tamanho);
				var soma = 0;
				var pos = tamanho - 7;
				for (let i = tamanho; i >= 1; i--) {
				soma += numeros.charAt(tamanho - i) * pos--;
				if (pos < 2)
						pos = 9;
				}
				resultado = soma % 11 < 2 ? 0 : 11 - soma % 11;
				if (resultado != digitos.charAt(0))
					return false;
					
				tamanho = tamanho + 1;
				numeros = identifier.substring(0,tamanho);
				soma = 0;
				pos = tamanho - 7;
				for (let i = tamanho; i >= 1; i--) {
				soma += numeros.charAt(tamanho - i) * pos--;
				if (pos < 2)
						pos = 9;
				}
				var resultado = soma % 11 < 2 ? 0 : 11 - soma % 11;
				if (resultado != digitos.charAt(1))
					return false;
					
				return true;
				
			},
		},
	}
</script>
<!-- scss do front -->
<style lang="scss" scoped>
	#empresas{
		display: flex;
		max-height: 100%;
		padding: 24px;
		flex-wrap: wrap;
		.tabela-empresas{
			width: 100%;
			background-color: #fff;
			border-radius: 10px;
			.nova-empresa{
				display: flex;
				justify-content: flex-end;
				padding-bottom: 0;
				button{
					padding: 0 5px !important;
					i, svg{
						margin-left: 10px;
					}
					text-transform: capitalize;
				}
			}
		}
	}
	.horario{
		display: flex;
		flex: 1 1 auto;
		.inputs{
			display: flex;
			flex-wrap: wrap;
			flex: 1 1 auto;
			.modal-time-picker{
				display: none;
				position: absolute;
				left: 0;
				top: 0;
				width: 100%;
				height: 100%;
				background-color: rgba(33, 33, 33, 0.3);
				border-color: rgb(33, 33, 33);
				flex-wrap: wrap;
				align-items: center;
				justify-content: center;
				z-index: -1;
				&.ativo{
					display: flex;
					z-index: 2;
				}
				.wrapper-time-picker{
					width: 300px;
				}
			}
		}
		.remover-horario{
			min-width: inherit;
			margin-top: 20px;
			margin-left: 24px
		}
	}
	.v-dialog{
		.v-card{
			background-color: #f9f9f9;
		}
		.headline{
			display: flex;
			flex-wrap: wrap;
			align-items: center;
			font-weight: 600;
			color: #11263C;
		}
	}
</style>