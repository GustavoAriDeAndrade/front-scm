<template>
    <div id="relatorios">
        <div class="graficos">
            <div class="col-12 filtros">
                <div class="row row-filtros">
                    <div class="col-3 titulo">
                        <p>RELATÓRIO <v-icon>fas fa-chart-bar</v-icon></p>
                    </div>
                    <!-- filtros para os gráficos -->
                    <div class="col-9 selects">
                        <v-form ref="form_selects">
                            <v-icon>fas fa-filter</v-icon>
                            <v-select
                                :items="relatorios"
                                item-text="nome" 
                                item-value="id"
                                v-model="filtro.relatorio_id" 
                                label="Relatório"
                                placeholder="Relatório" 
                                background-color="white"
                                hide-details
                                outlined
                            />
                            <v-menu
                                v-model="menu1"
                                :close-on-content-click="false"
                                transition="scale-transition"
                                offset-y
                                max-width="290px"
                                min-width="auto"
                                >
                                <template v-slot:activator="{ on, attrs }">
                                    <v-text-field
                                        v-model="data_de_formatada"
                                        label= "De"
                                        persistent-hint
                                        prepend-icon="mdi-calendar"
                                        hide-details
                                        readonly
                                        v-bind="attrs"
                                        v-on="on"
                                        style="font-size: 14px; font-weight: 600"			
                                    ></v-text-field>
                                </template>
                                <v-date-picker
                                    v-model="data_de"
                                    no-title
                                    color="#11263C"
                                    locale="pt-br"
                                    @input="menu1 = false"
                                ></v-date-picker>
                            </v-menu>
                            <v-menu
                                v-model="menu2"
                                :close-on-content-click="false"
                                transition="scale-transition"
                                offset-y
                                max-width="290px"
                                min-width="auto"
                                >
                                <template v-slot:activator="{ on, attrs }">
                                    <v-text-field
                                        v-model="data_ate_formatada"
                                        label= "Até"
                                        persistent-hint
                                        prepend-icon="mdi-calendar"
                                        hide-details
                                        readonly
                                        v-bind="attrs"
                                        v-on="on"
                                        style="font-size: 14px; font-weight: 600"			
                                    ></v-text-field>
                                </template>
                                <v-date-picker
                                    v-model="data_ate"
                                    no-title
                                    color="#11263C"
                                    locale="pt-br"
                                    @input="menu2 = false"
                                ></v-date-picker>
                            </v-menu>
                            <v-btn class="primary-button" raised small @click="searchFiltro">Filtrar</v-btn>
                        </v-form>
                    </div>
                </div>
            </div>
            <!-- Gráfico de redes sociais -->
            <div class="row">
                <div class="col-12">
                    <h3 class="text-center">Dados Do Relatório</h3>
                    <v-simple-table>
                        <template v-slot: default>
                            <thead>
                                <tr>
                                    <th class="text-left">
                                        Produto
                                    </th>
                                    <th class="text-left">
                                        Quantidade Vendida
                                    </th>
                                    <th class="text-left">
                                        Preço Unitário
                                    </th>
                                    <th class="text-left">
                                        Valor Arrecadado
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="item in dados_relatorio" :key="item.nome">
                                    <td>{{ item.nome }}</td>
                                    <td>{{ item.total }}</td>
                                    <td>R$ {{ item.preco_unitario }}</td>
                                    <td>R$ {{ item.valor }}</td>
                                </tr>
                            </tbody>
                        </template>
                    </v-simple-table>
                </div>
            </div>
            <DialogMensagem :visible="dialog_resposta" :mensagem="resposta" @close="dialog_resposta=false"/>
            <Loader v-if="loading"/>
        </div>
    </div>
</template>

<script>
    // importa o store
    import store from '@/store'
    // importa o componente de DialogMensagem
    import DialogMensagem from '@/components/DialogMensagem.vue'
    // importa o componente de Loader
    import Loader from '@/components/Loader.vue'
    // importa o moment
    import moment from 'moment'

    // exporta o componente
    export default{
        // nome do componente
        name: 'Relatorios',
        // componentes filhos
        components: {
            // componente de DialogMensagem
            DialogMensagem,
            // componente de Loader
            Loader,
        },
        // variáveis que serão usadas
        data: () => ({
            // variável para mostrar a modal de informação
            dialog_resposta: false,
            // variável para a mensagem de resposta
            resposta: {},
            // variável para o componente de loading
            loading: false,
            // variável para armazenar a data de do filtro
			data_de: new Date().toISOString().substr(0, 10),
            // variável para armazenar a data até do filtro			
			data_ate: new Date().toISOString().substr(0, 10),
            // abre o calendário do filtro			
			menu1: false,			
            // abre o segundo calendário do filtro
			menu2: false,
            // variável para os relatórios disponíveis
            relatorios: [
                {
                    nome: 'Produtos Vendidos',
                    id: 1
                }
            ],
            // variável para o filtro
            filtro: {
                relatorio_id: 1,
                data_de: '',
                data_ate: '',
            },
            // variável para armazenar os dados do relatório
            dados_relatorio: [{
                nome: '',
                total: '',
                preco_unitario: '',
                valor: ''
            }]
        }),
        // variáveis computadas em tempo real
		computed: {
			data_de_formatada () {
				return this.formatDate(this.data_de)
			},
			data_ate_formatada () {
				return this.formatDate(this.data_ate)
			},
		},
        // funções deste componente
        methods: {
            // função de filtro do nosso relatório
            async searchFiltro(){
                let resp = {}
                // coloca o componente como loading
                this.loading = true
                // limpa os dados da tabela
                this.dados_relatorio = [{
                    nome: '',
                    total: ''
                }]
                // prepara os parâmetros
                let dados = {
                    // armazena a empresa selecionada
                    relatorio_id: this.filtro.relatorio_id,
                    // armazena a data inicial selecionada
                    data_de: moment(this.data_de_formatada, 'DD/MM/YYYY').format('YYYY-MM-DD 00:00:00'),
                    // armazena a data final selecionada
                    date_ate: moment(this.data_ate_formatada, 'DD/MM/YYYY').format('YYYY-MM-DD 23:59:59'),
                }
                // rota para filtrar os relatórios
                resp = await store.dispatch('relatorio', dados)
                // caso algo tenha dado errado
                if(resp.status != 200 && resp.status != 204){
                    // atribui o título da mensagem
                    this.resposta.titulo = 'Algo deu errado!'
                    // atribui o corpo da mensagem
                    this.resposta.mensagem = await resp.data.message || resp.data.error
                    // mostra a mensagem
                    this.dialog_resposta = true
                // caso tenha dado certo
                }else{
                    // atribui os produtos
                    let produtos = resp.data.produtos
                    // cria a variável para armazenar os produtos
                    const mapaProdutos = {}
                    // percorremos os produtos
                    produtos.forEach(produto => {
                        // Se o produto já existe no mapa
                        if(mapaProdutos[produto.produto_id]){
                            // somamos a quantidade
                            mapaProdutos[produto.produto_id].quantidade += produto.quantidade
                        // Se não existe,
                        } else {
                            // adicionamos o produto ao mapa
                            mapaProdutos[produto.produto_id] = { ...produto }
                        }
                    })
                    // Convertendo o objeto de volta para um array
                    const resultado = Object.values(mapaProdutos)
                    // faz as atribuições
                    for(let i = 0; i < resultado.length; i++){
                        if(this.dados_relatorio[i] == undefined){
                            this.dados_relatorio[i] = {}
                        }
                        this.dados_relatorio[i].nome = resultado[i].product.nome
                        this.dados_relatorio[i].total = resultado[i].quantidade
                        this.dados_relatorio[i].preco_unitario = resultado[i].valor_unidade
                        this.dados_relatorio[i].valor = parseInt(resultado[i].quantidade) * parseFloat(resultado[i].valor_unidade)
                    }
                }
                // retira o loading do componente
                this.loading = false
            },
            // função para formatar as datas
            formatDate(date){
                // caso a data venha vazia
                if(!date){
                    // retorna
                    return null
                }
                // separa a data
                const [year, month, day] = date.split('-')
                // retorna a data formatada
                return `${day}/${month}/${year}`
            }
        }
    }
</script>

<style lang="scss">
    #relatorios{
		display: flex;
		max-height: 100%;
		padding: 24px;
		flex-wrap: wrap;

        .graficos{
			background-color: #fff;
			border-radius: 10px;
			width: 100%;
            .filtros{
                padding-bottom: 0;
                .titulo{
					padding-bottom: 0;
					p{
						color: #11263C;
						font-weight: 500;
						font-size: 14px;
						line-height: 58px;

						svg{
							font-size: 19px;
							margin: 0 4px;
							color: #040d16;
						}
						span{
							font-weight: 500;
							color: #D0D1D2;
						}
					}
                }
                .selects{
					form{
						display: flex;
						flex-wrap: nowrap;
						justify-content: space-between;
						align-items: center;
						svg{
							font-size: 15px;
							color: #3b3c3c;
						}
						.v-input{
							display: flex;
							flex-wrap: nowrap;
							justify-content: space-between;
							align-items: center;
							padding: 0 10px;
						}
					}
                }
            }
        }
    }
</style>