<template>
    <div id="relatorios">
        <div class="graficos">
			<div class="col-12">
				<v-row align="center" justify="space-between">
					<!-- Coluna do título -->
					<v-col cols="auto">
					<div class="titulo">
						<p>
                        Relatórios
						<v-icon class="fas fa-chart-bar" style="font-size: 20px;"></v-icon>
						</p>
					</div>
					</v-col>
					
					<!-- Coluna do botão de ajuda -->
					<v-col cols="auto">
					<v-btn class="primary-button" @click="dialog_ajuda = true">Ajuda</v-btn>
					</v-col>
				</v-row>
			</div>
            <div class="col-12 filtros">
                <div class="row row-filtros">
                    <!-- filtros para os gráficos -->
                    <div class="col-12 selects">
                        <v-form ref="form_selects">
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
                            <div v-if="this.filtro.relatorio_id == '2'">
                                <v-select
                                    :items="usuarios"
                                    item-text="nome" 
                                    item-value="id"
                                    v-model="filtro.user_id" 
                                    label="Vendedor"
                                    placeholder="Vendedor" 
                                    background-color="white"
                                    hide-details
                                    outlined
                                />
                            </div>
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
            <!-- Tabela de produtos vendidos -->
            <div v-if="this.filtro.relatorio_id == '1'" class="row">
                <div class="col-12" ref="reportContentProdutos">
                    <h3 class="text-center">Produtos Vendidos</h3>
                    <v-simple-table>
                        <template v-slot: default>
                            <thead>
                                <tr>
                                    <th class="text-left">
                                        Produto
                                    </th>
                                    <th class="text-right">
                                        Quantidade Vendida
                                    </th>
                                    <th class="text-right">
                                        Preço Unitário
                                    </th>
                                    <th class="text-right">
                                        Valor Arrecadado
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="item in dados_relatorio_produtos" :key="item.nome">
                                    <td >{{ item.nome }}</td>
                                    <td class="text-right">{{ item.total }}</td>
                                    <td class="text-right">R$ {{ item.preco_unitario }}</td>
                                    <td class="text-right">R$ {{ item.valor }}</td>
                                </tr>
                            </tbody>
                        </template>
                    </v-simple-table>
                </div>
            </div>
            <!-- Tabela de vendas caixas -->
            <div v-if="this.filtro.relatorio_id == '2'" class="row">
                <div class="col-12" ref="reportContentCaixas">
                    <h3 class="text-center">Vendas Vendedores</h3>
                    <v-simple-table>
                        <template v-slot: default>
                            <thead>
                                <tr>
                                    <th class="text-left">
                                        Vendedor
                                    </th>
                                    <th class="text-right">
                                        Quantidade Vendida
                                    </th>
                                    <th class="text-right">
                                        Valor Arrecadado
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="item in dados_relatorio_caixa" :key="item.nome">
                                    <td >{{ item.nome }}</td>
                                    <td class="text-right">{{ item.total }}</td>
                                    <td class="text-right">R$ {{ item.valor }}</td>
                                </tr>
                            </tbody>
                        </template>
                    </v-simple-table>
                </div>
            </div>
            <!-- Tabela de pagamentos pendentes -->
            <div v-if="this.filtro.relatorio_id == '3'" class="row">
                <div class="col-12" ref="reportContentPagamentos">
                    <h3 class="text-center">Pagamentos Pendentes</h3>
                    <v-simple-table>
                        <template v-slot: default>
                            <thead>
                                <tr>
                                    <th class="text-left">
                                        Cliente
                                    </th>
                                    <th class="text-right">
                                        Data Compra
                                    </th>
                                    <th class="text-right">
                                        Valor Compra
                                    </th>
                                    <th class="text-right">
                                        Vencimento Parcela
                                    </th>
                                    <th class="text-right">
                                        Valor Parcela
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="item in dados_relatorio_pagamentos" :key="item.venda_id">
                                    <td >{{ item.nome }}</td>
                                    <td class="text-right">{{ item.data_compra }}</td>
                                    <td class="text-right">R$ {{ item.valor_compra }}</td>
                                    <td class="text-right">{{ item.data_vencimento }}</td>
                                    <td class="text-right">R$ {{ item.valor_restante }}</td>
                                </tr>
                            </tbody>
                        </template>
                    </v-simple-table>
                </div>
            </div>
            <div class="col-12 btn-gerar-pdf">
                <!-- botão para gerar o pdf do relatório -->
                <v-btn class="primary-button" raised @click="gerarPdf">
                    Gerar PDF
                    <i class="fas fa-check" style="margin-left: 5px;"></i> 
                </v-btn>
            </div>
			<!-- Modal de ajuda sobre a tela-->
            <v-dialog v-model="dialog_ajuda" max-width="500">
                <v-card>
                  <v-card-title class="headline">Ajuda: Tela de Relatórios</v-card-title>
                  <v-card-text>
                    <p><strong>1. Para gerar um novo relatório:</strong></p>
                    <ul>
                      <li>Selecione o tipo de relatório desejado.</li>
                      <li>Ajuste o filtro da data, conforme necessário.</li>
                      <li>Clique em Filtrar.</li>
                    </ul>
                  </v-card-text>
                  <v-card-actions>
                    <v-spacer></v-spacer>
                    <!-- Botão para fechar o modal -->
                    <v-btn color="primary" text @click="dialog_ajuda = false">Fechar</v-btn>
                  </v-card-actions>
                </v-card>
            </v-dialog>
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
    // importa a biblioteca para geração do pdf
    import jsPDF from 'jspdf'
    // importa a biblioteca para gerar o pdf a partir do HTML
    import html2canvas from 'html2canvas';

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
			// variável para mostrar a modal de ajuda
			dialog_ajuda: false,
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
            // variável para armazenar os vendedores cadastrados
            usuarios: [], 
            // variável para os relatórios disponíveis
            relatorios: [
                {
                    nome: 'Produtos Vendidos',
                    id: 1
                },
                {
                    nome: 'Vendas Vendedores',
                    id: 2
                },
                {
                    nome: 'Pagamentos Pendentes',
                    id: 3
                }
            ],
            // variável para o filtro
            filtro: {
                relatorio_id: 1,
                data_de: '',
                data_ate: '',
                user_id: '',
            },
            // variável para armazenar os dados do relatório
            dados_relatorio_produtos: [{
                nome: '',
                total: '',
                preco_unitario: '',
                valor: ''
            }],
            dados_relatorio_caixa: [{
                nome: '',
                total: '',
                valor: '',
            }],
            dados_relatorio_pagamentos: [{
                nome: '',
                data_compra: '',
                data_vencimento: '',
                valor_compra: '',
                valor_restante: '',
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
            // função chamada quando a página é aberta
            async init(){
                // buscamos os usuários cadastrados
                this.getUsuarios()
            },	
            // função para pegar os usuários 
            async getUsuarios(){
                // faz um dispatch para uma action no vuex para pegar os usuários
                let resp = await store.dispatch('getUsuariosSelect')
                // caso o status seja 200 (deu certo)
                if(resp.status == 200){
                    // atribui os dados à variável local
                    this.usuarios = await resp.data.users
                }
            },	
            // função de filtro do nosso relatório
            async searchFiltro(){
                let resp = {}
                // coloca o componente como loading
                this.loading = true
                // prepara os parâmetros
                let dados = {
                    // armazena a empresa selecionada
                    relatorio_id: this.filtro.relatorio_id,
                    // armazena o caixa selecionado
                    user_id: this.filtro.user_id,
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
                    // caso esteja gerando relatório de produtos vendidos
                    if(this.filtro.relatorio_id == '1'){
                        // trata os dados
                        this.produtosVendidos(resp.data.produtos)
                    // caso esteja gerando relatório de vendas caixa
                    }else if(this.filtro.relatorio_id == '2'){
                        // trata os dados
                        this.vendasCaixa(resp.data.caixas)
                    // caso esteja gerando relatório de pagamentos pendentes
                    }else if(this.filtro.relatorio_id == '3'){
                        // trata os dados
                        this.pagamentosPendentes(resp.data.clientes)
                    }
                }
                // retira o loading do componente
                this.loading = false
            },
            // função para preparar relatório dos produtos vendidos
            produtosVendidos(produtos){
                // limpa os dados da tabela
                this.dados_relatorio_produtos = [{
                    nome: '',
                    total: '',
                    preco_unitario: '',
                    valor: ''
                }]
                // cria a variável para armazenar os produtos
                const mapaProdutos = {}
                // percorremos os produtos
                produtos.forEach(produto => {
                    // se o produto já existe no mapa
                    if(mapaProdutos[produto.produto_id]){
                        // somamos a quantidade
                        mapaProdutos[produto.produto_id].quantidade += produto.quantidade
                    // se não existe,
                    }else{
                        // adicionamos o produto ao mapa
                        mapaProdutos[produto.produto_id] = { ...produto }
                    }
                })
                // Convertendo o objeto de volta para um array
                const resultado = Object.values(mapaProdutos)
                // faz as atribuições
                for(let i = 0; i < resultado.length; i++){
                    if(this.dados_relatorio_produtos[i] == undefined){
                        this.dados_relatorio_produtos[i] = {}
                    }
                    this.dados_relatorio_produtos[i].nome = resultado[i].product.nome
                    this.dados_relatorio_produtos[i].total = resultado[i].quantidade
                    this.dados_relatorio_produtos[i].preco_unitario = this.formatValue(resultado[i].valor_unidade)
                    this.dados_relatorio_produtos[i].valor = this.formatValue(parseInt(resultado[i].quantidade) * parseFloat(resultado[i].valor_unidade))
                }
            },
            // função para preparar relatório das vendas dos caixas
            vendasCaixa(caixas){
                // limpa os dados da tabela
                this.dados_relatorio_caixa = [{
                    nome: '',
                    total: '',
                    valor: '',
                }]
                // cria a variável para armazenar os caixas
                const mapaCaixas = {}
                // percorremos os caixas
                caixas.forEach(caixa => {
                    // se o caixa já existe no mapa
                    if(mapaCaixas[caixa.usuario_id]){
                        // somamos a quantidade
                        mapaCaixas[caixa.usuario_id].quantidade += 1
                        // somamos o valor
                        mapaCaixas[caixa.usuario_id].valor_total = parseFloat(mapaCaixas[caixa.usuario_id].valor_total) + parseFloat(caixa.valor_total)
                    // se não existe
                    }else{
                        // adicionamos o caixa ao mapa
                        mapaCaixas[caixa.usuario_id] = { ...caixa }
                        // iniciamos a quantidade de vendas
                        mapaCaixas[caixa.usuario_id].quantidade = 1
                    }
                })
                // Convertendo o objeto de volta para um array
                const resultado = Object.values(mapaCaixas)
                // faz as atribuições
                for(let i = 0; i < resultado.length; i++){
                    if(this.dados_relatorio_caixa[i] == undefined){
                        this.dados_relatorio_caixa[i] = {}
                    }
                    this.dados_relatorio_caixa[i].nome = resultado[i].user.nome
                    this.dados_relatorio_caixa[i].total = resultado[i].quantidade
                    this.dados_relatorio_caixa[i].valor = this.formatValue(resultado[i].valor_total)
                }
            },
            // função para preparar relatório dos pagamentos pendentes
            pagamentosPendentes(clientes){
                // limpa os dados da tabela 
                this.dados_relatorio_pagamentos = [{
                    nome: '',
                    data_compra: '',
                    data_vencimento: '',
                    valor_compra: '',
                    valor_restante: '',
                }]
                // faz as atribuições
                for(let i = 0; i < clientes[0].length; i++){
                    let cliente = clientes[0][i]
                    if(this.dados_relatorio_pagamentos[i] == undefined){
                        this.dados_relatorio_pagamentos[i] = {}
                    }
                    this.dados_relatorio_pagamentos[i].venda_id = cliente.venda_id
                    this.dados_relatorio_pagamentos[i].nome = cliente.nome
                    this.dados_relatorio_pagamentos[i].data_compra = moment(cliente.created_at).format('DD/MM/YYYY')
                    this.dados_relatorio_pagamentos[i].data_vencimento = moment(cliente.data_vencimento).format('DD/MM/YYYY')
                    this.dados_relatorio_pagamentos[i].valor_compra = this.formatValue(cliente.valor_total)
                    this.dados_relatorio_pagamentos[i].valor_restante = this.formatValue(cliente.valor_restante)
                }
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
            },
            // função para formatar o valor da parcela
            formatValue(valor){
                // converte o valor para float mantendo duas casas decimais
                let valor_formatado = parseFloat(valor).toFixed(2)
                // converte a vírgula em ponto, caso exista
                valor_formatado = valor_formatado.toString().replace('.', ',')
                // retorna o valor
                return  valor_formatado
            },
            // função para gerar o pdf do relatório
            async gerarPdf(){
                // variável para armazenar os dados do relatório
                let reportContent = ''
                // caso tenha selecionado o relatório de produtos
                if(this.filtro.relatorio_id == '1'){
                    // atribuimos os dados
                    reportContent = this.$refs.reportContentProdutos
                // caso tenha selecionado o relatório de caixas
                }else if(this.filtro.relatorio_id == '2'){
                    // atribuimos os dados
                    reportContent = this.$refs.reportContentCaixas
                // caso tenha selecionado o relatório de pagamentos
                }else if(this.filtro.relatorio_id == '3'){
                    // atribuimos os dados
                    reportContent = this.$refs.reportContentPagamentos
                }
                // extraimos o html
                const canvas = await html2canvas(reportContent)
                // setamos o tipo de url
                const imgData = canvas.toDataURL('image/png')
                // inicializamos o pdf
                const pdf = new jsPDF()
                // setamos a largura do pdf
                const imgWidth = 190
                // setamos as proporções da página
                const imgHeight = (canvas.height * imgWidth) / canvas.width
                // setamos o ponto de partida
                let position = 0
                // adicionamos a imagem no PDF
                pdf.addImage(imgData, 'PNG', 10, position, imgWidth, imgHeight)
                // caso tenha selecionado o relatório de produtos
                if(this.filtro.relatorio_id == '1'){
                    // salvamos o PDF 
                    pdf.save('relatorio-produtos.pdf')
                // caso tenha selecionado o relatório de caixas
                }else if(this.filtro.relatorio_id == '2'){
                    // salvamos o PDF 
                    pdf.save('relatorio-caixas.pdf')
                // caso tenha selecionado o relatório de pagamentos
                }else if(this.filtro.relatorio_id == '3'){
                    // salvamos o PDF 
                    pdf.save('relatorio-pagamentos.pdf')
                }
            },
        },
        // funções que rodam quando o componente é montado
        mounted(){
            this.init()
        }
    }
</script>

<style lang="scss">
    #relatorios{
		display: flex;
		max-height: 140%;
		padding: 24px;
		flex-wrap: wrap;
        background-color: #FFFFFF;
        .graficos{
			border-radius: 10px;
			width: 100%;
            .filtros{
                padding-bottom: 0;
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
        .btn-gerar-pdf{
            text-align: center;
            margin-top: 15px;
        }
    }
</style>