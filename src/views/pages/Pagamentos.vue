
<template>
    <div id="vendas">
        <div class="tabela-vendas">
            <!-- Filtros -->
            <div class="col-12 filtros">
                <div class="row row-filtros">
                    <!-- filtros para os gráficos -->
                    <div class="col-12 selects">
                        <v-form ref="form_selects">
                            <v-icon>fas fa-filter</v-icon>
                            <v-select
                                :items="clientes"
                                item-text="nome" 
                                item-value="id"
                                v-model="filtros.cliente_id" 
                                label="Cliente"
                                placeholder="Cliente" 
                                background-color="white"
                                hide-details
                                outlined
                            />
                            <v-select
                                :items="status_filtro"
                                item-text="nome" 
                                item-value="valor"
                                v-model="filtros.status" 
                                label="Status"
                                placeholder="Status" 
                                background-color="white"
                                hide-details
                                outlined
                            />
                            <v-btn class="primary-button" raised small @click="searchFiltro">Filtrar</v-btn>
                        </v-form>
                    </div>
                </div>
            </div>
            <!-- tabela que ira conter os vendas cadastrados -->
            <CustomTable
                v-if="headers != ''"
                :action="'getVendas'"
                :getter="$store.getters.pagamentos"
                :headers="headers"
                :search="true"
                :title="'Pagamentos'"
                :icone="'fas fa-money-bill-wave-alt'"
                :pagination="true"
                :filters="filtros"
                ref="tabela"
            >
                <template v-slot:valor_parcela="{ item }">
                    <span v-if="item.payments.length > 0">
                        R$ {{ item.payments[0].valor_restante }}
                    </span>
                    <span v-else>
                        -/-
                    </span>
                </template>
                <template v-slot:payments="{ item }">
                    <span v-if="item.payments.length > 0">
                        {{ moment(item.payments[0].data_vencimento).format('DD/MM/YYYY') }}
                    </span>
                    <span v-else style="color: green;">
                        Quitada
                    </span>
                </template>
                <!-- botões para ativação das modais presentes na tabela -->
                <template v-slot:acoes="{ item }">
                    <v-btn class="primary-button" raised small @click="visualizarVenda(item.id)">
                        <i class="fas fa-eye"></i>
                        Visualizar
                    </v-btn>
                </template>
            </CustomTable>
            <!-- modal para pagar uma parcela -->
            <v-dialog v-model="dialog_venda" persistent max-width="850px">
                <v-card>
                    <v-card-title>
                        <span class="headline">Dados Venda</span>
                    </v-card-title>
                    <v-card-text>
                        <v-container>
                            <v-form ref="form_venda">
                                <div class="row">
                                    <div class="col-6 div-input">
                                        <v-text-field
                                            v-model="venda.cliente"
                                            label="Cliente"
                                            placeholder="Cliente"
                                            background-color="white"
                                            hide-details
                                            outlined
                                            readonly
                                        />
                                    </div>
                                    <div class="col-6 div-input">
                                        <v-text-field
                                            v-model="venda.caixa"
                                            label="Caixa"
                                            placeholder="Caixa"
                                            background-color="white"
                                            hide-details
                                            outlined
                                            readonly
                                        />
                                    </div>
                                    <div class="col-6 div-input">
                                        <v-text-field
                                            v-model="venda.valor_total"
                                            label="Valor total"
                                            placeholder="Valor total"
                                            background-color="white"
                                            prefix="$"
                                            hide-details
                                            outlined
                                            readonly
                                        />
                                    </div>
                                    <div class="col-12">
                                        <h2>Produtos Comprados</h2>
                                        <!-- tabela dos produtos da compra -->
                                        <v-data-table
                                            :headers="header_produtos"
                                            :items="venda.produtos"
                                            style="margin-top: 10px;"
                                        >
                                            <template v-slot:[`item.valor_unidade`]="{ item }">
                                                <span>
                                                    R$ {{ item.valor_unidade }}
                                                </span>
                                            </template>
                                        </v-data-table>
                                    </div>
                                    <div class="col-12">
                                        <h2>Parcelas</h2>
                                        <!-- tabela das parcelas da compra -->
                                        <v-data-table
                                            :headers="header_parcelas"
                                            :items="venda.parcelas"
                                            style="margin-top: 10px;"
                                        >
                                            <template v-slot:[`item.valor`]="{ item }">
                                                <span>
                                                    R$ {{ item.valor }}
                                                </span>
                                            </template>
                                            <template v-slot:[`item.valor_restante`]="{ item }">
                                                <span v-if="item.valor_restante > 0">
                                                    R$ {{ item.valor_restante }}
                                                </span>
                                                <span v-else style="color: green;">
                                                    Paga
                                                </span>
                                            </template>
                                            <template v-slot:[`item.data_vencimento`]="{ item }">
                                                <span>
                                                    {{ moment(item.data_vencimento).format('DD/MM/YYYY') }}
                                                </span>
                                            </template>
                                            <template v-slot:[`item.data_pagamento`]="{ item }">
                                                <span v-if="item.data_pagamento != null">
                                                    {{ moment(item.data_pagamento).format('DD/MM/YYYY') }}
                                                </span>
                                                <span v-else>
                                                    -/-
                                                </span>
                                            </template>
                                            <template v-slot:[`item.acoes`]="{ item }">
                                                <v-btn v-if="item.pagar == true" class="success-button" raised small @click="pagarParcela(item)">
                                                    <i class="fas fa-check"></i>
                                                </v-btn>
                                            </template>
                                        </v-data-table>
                                    </div>
                                    <div class="col-4 div-input">
                                        <v-text-field
                                            v-model="pagamento.valor"
                                            label="Valor Parcela"
                                            placeholder="Valor Parcela"
                                            background-color="white"
                                            prefix="$"
                                            hide-details
                                            outlined
                                            disabled
                                        />
                                    </div>
                                    <div class="col-4 div-input">
                                        <v-text-field
                                            type="number"
                                            v-model="pagamento.valor_pago"
                                            label="Valor Pago"
                                            placeholder="Valor Pago"
                                            background-color="white"
                                            prefix="$"
                                            min="1"
                                            hide-details
                                            outlined
                                            @input="valorPago"
                                        />
                                    </div>
                                    <div class="col-4 div-input">
                                        <v-autocomplete
                                            :items="formas_pagamento"
                                            item-text="nome" 
                                            item-value="id"
                                            v-model="pagamento.forma_pagamento_id" 
                                            label="Forma Pagamento"
                                            placeholder="Forma Pagamento" 
                                            background-color="white"
                                            hide-details
                                            outlined
                                        />
                                    </div>
                                </div>
                            </v-form>
                        </v-container>
                    </v-card-text>
                    <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn color="darken-1" text style="text-transform: capitalize; font-size: 16px;" @click="closePagamento">
                            Cancelar
                        </v-btn>
                        <v-btn class="primary-button" small @click="enviarPagamento">
                            Salvar
                        </v-btn>
                    </v-card-actions>
                </v-card>
            </v-dialog>
            <!-- modal para conclusão do pagamento -->
            <v-dialog v-model="dialog_prosseguir" persistent max-width="450px">
                <v-card>
                    <v-card-title>
                        <span class="headline">Pagamento realizado com sucesso!</span>
                    </v-card-title>
                    <v-card-text>
                        <v-container style="text-align: center;">
                            <h3>Deseja pagar mais uma parcela dessa compra?</h3><br>
                        </v-container>
                    </v-card-text>
                    <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn color="darken-1" text style="text-transform: capitalize; font-size: 16px;" @click="closePagamento">
                            Não
                        </v-btn>
                        <v-btn class="primary-button" small @click="continuarPagando">
                            Pagar
                        </v-btn>
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
    // importa o compnente de CustomTable
    import CustomTable from '@/components/CustomTable.vue'
    // importa o moment
    import moment from 'moment'

    // exporta o componente
    export default {
        // nome do componente
        name: 'Pagamentos',
        // componentes filhos
        components: {
            // componente de DialogMensagem
            DialogMensagem,
            // componente de CustomTable
            CustomTable,
            // componente de Loader
            Loader,
        },
    data: () => ({
        // variável para mostrar a modal para edita/criar uma venda
        dialog_venda: false,
        // variável para mostrar a modal de informação
        dialog_resposta: false,
        // variável para mostrar a modal de continuar pagando parcela
        dialog_prosseguir: false,
        // variável para a mensagem de resposta
        resposta: {},
        // variável para o componente de loading
        loading: false,
        // variável para armazenar as formas de pagamento
        formas_pagamento: [],
        // variável para armazenar os clientes
        clientes: [],
        // variável para armazenar os status para filtro
        status_filtro: [
            {
                nome: 'Pendente Pagamento',
                valor: false
            },
            {
                nome: 'Quitado',
                valor: true
            }
        ],
        // variáveis para visualizar uma venda
        venda: {
            venda_id: '',
            valor_total: '',
            cliente: '',
            caixa: '', 
            produtos: [],
            parcelas: [], 
        },
        // variável para armazenar a parcela que será paga
        pagamento: {
            parcela_id: '',
            venda_id: '',
            valor: '',
            valor_pago: '',
            forma_pagamento_id: ''
        },
        // variável para o cabeçalho da tabela
        headers: [
            {
                value: 'client.nome',
                text: 'Cliente',
                sortable: true,
            },
            {
                value: 'valor_parcela',
                text: 'Valor Parcela',
                align: 'end',
                sortable: true,
            },
            {
                value: 'payments',
                text: 'Próx. Vencimento',
                align: 'end',
                sortable: true,
            },
            {
                value: 'acoes',
                text: 'Ações',
                align: 'end',
                sortable: false,
            },
        ],
        // variável para o cabeçalho da tabela de produtos
        header_produtos: [
            {
                value: 'product.nome',
                text: 'Produto',
                sortable: true,
            },
            {
                value: 'valor_unidade',
                text: 'Valor Unidade',
                align: 'end',
                sortable: true,
            },
            {
                value: 'quantidade',
                text: 'Quantidade',
                align: 'end',
                sortable: true,
            },
        ],
        // variável para o cabeçalho da tabela de parcelas
        header_parcelas: [
            {
                value: 'parcela',
                text: 'Parcela',
                sortable: true,
            },
            {
                value: 'valor',
                text: 'Valor',
                align: 'end',
                sortable: true,
            },
            {
                value: 'valor_restante',
                text: 'Valor Restante',
                align: 'end',
                sortable: true,
            },
            {
                value: 'data_vencimento',
                text: 'Data Vencimento',
                align: 'end',
                sortable: true,
            },
            {
                value: 'data_pagamento',
                text: 'Data Pagamento',
                align: 'end',
                sortable: true,
            },
            {
                value: 'acoes',
                text: 'Pagar',
                align: 'end',
                sortable: false,
            },
        ],
        // variável para os filtros da tabela
        filtros: {
            perPage: 20,
            cliente_id: '',
            status: false,
        },
    }),
    // funções deste componente
    methods: {
        // função chamada quando a página é aberta
        async init(){
            // buscamos as formas de pagamento cadastradas
            this.getFormasPagamento()
            // buscamos os clientes cadastrados
            this.getClientes()
        },
        // função para pegar as formas de pagamento
        async getFormasPagamento(){
            // faz um dispatch para uma action no vuex para pegar as formas de pagamento
            let resp = await store.dispatch('getFormasPagamento')
            // caso o status seja 200 (deu certo)
            if(resp.status == 200){
                // atribui os dados à variável local
                this.formas_pagamento = await resp.data.types
            }
        },	
        // função para pegar os clientes
        async getClientes(){
            // faz um dispatch para uma action no vuex para pegar os clientes
            let resp = await store.dispatch('getClientesSelect')
            // caso o status seja 200 (deu certo)
            if(resp.status == 200){
                // atribui os dados à variável local
                this.clientes = await resp.data.clients
            }
        },	
        // função de filtro do nosso relatório
        async searchFiltro(){
            // atualiza a tabela
            this.$refs.tabela.init()
        },
        // função para enviar o pagamento de uma parcela
        async enviarPagamento(){
            let resp = {}
            // realiza a verificação dos dados
            let validacao = await this.verificaPagamento()
            // caso os campos do formulário estejam válidos
            if(validacao != 1){
                // coloca o componente como loading
                this.loading =  true
                // coleta os dados do venda
                let dados = {
                    // coleta a venda que está sendo paga
                    venda_id: this.pagamento.venda_id,
                    // coleta o valor restante a ser pago
                    valor_restante: parseFloat(this.pagamento.valor) - parseFloat(this.pagamento.valor_pago),
                    // coleta a forma de pagamento
                    metodo_pagamento_id: this.pagamento.forma_pagamento_id,
                    // coleta se a parcela foi quitada
                    paga: this.pagamento.valor == this.pagamento.valor_pago ? true : false,
                    // coleta a data que está sendo paga a parcela
                    data_pagamento: moment().format('YYYY-MM-DD HH:mm:ss')
                }
                // armazena os dados para realizar a atualização
                let date_update = {
                    dados_venda: dados,
                    id: this.pagamento.parcela_id
                }
                // rota para a atualização do venda
                resp = await store.dispatch('putVenda', date_update)
                // caso algo tenha dado errado
                if(resp.status != 200 && resp.status != 201){
                    // atribui o título da mensagem
                    this.resposta.titulo = 'Algo deu errado!'
                    // atribui o corpo da mensagem
                    this.resposta.mensagem = await resp.data.message || resp.data.error
                    // mostra a mensagem
                    this.dialog_resposta = true
                }else{
                    // abre a modal de confimação
                    this.dialog_prosseguir = true
                }
                // retira o loading do componente
                this.loading = false
                // atualiza a tabela
                this.$refs.tabela.init()
            // caso algum campo não tenha sido preenchido
            }else{
                // mostra a mensagem
                this.dialog_resposta = true
            }
        },
        // função para coletar uma venda para editar
        async visualizarVenda(venda_id){
            // coloca o componente como loading
            this.loading = true
            // faz um dispatch para uma action no vuex store para pegar uma venda passando o id
            var resp = await store.dispatch('getVenda', venda_id)
            // caso o status da resposta seja 200 (deu certo)
            if(resp.status == 200){
                // atribui os dados do venda vindos do back à váriável local
                this.venda.venda_id = await resp.data.sale.id || ''
                this.venda.valor_total = await resp.data.sale.valor_total || ''
                this.venda.cliente = await resp.data.sale.client.nome || ''
                this.venda.caixa = await resp.data.sale.user.nome || ''
                this.venda.produtos = await resp.data.sale.products || []
                this.venda.parcelas = await resp.data.sale.payments || []
                // formatamos o valor total
                this.venda.valor_total = this.formatValue(this.venda.valor_total)
                // formatamos o valor dos produtos
                this.venda.produtos = this.formataProdutos(this.venda.produtos)
                // ajeitamos as parcelas
                this.venda.parcelas = this.verificaParcelas(this.venda.parcelas)
                // abre a modal de vendas
                this.dialog_venda = true
            }else{
                // atribui o título da mensagem
                this.resposta.titulo = 'Algo deu errado!'
                // atribui o corpo da mensagem
                this.resposta.mensagem = await resp.data.message || resp.data.error
                // mostra a mensagem
                this.dialog_resposta = true 
            }
            // retira o loading do componente
            this.loading = false
        },
        // função para pegar uma parcela para pagar
        pagarParcela(parcela){
            // atribui o id da parcela
            this.pagamento.parcela_id = parcela.id
            // atribui o id da venda
            this.pagamento.venda_id = parcela.venda_id
            // atribui o valor da parcela
            this.pagamento.valor = parcela.valor_restante
        },
        // verifica o valor que será pago da parcela
        valorPago(){
            // verifica se o valor de entrada é válido
            if(parseFloat(this.pagamento.valor_pago) > parseFloat(this.pagamento.valor)){
                // atribui o título da mensagem 
                this.resposta.titulo = 'Atenção!'
                // atribui o corpo da mensagem 
                this.resposta.mensagem = 'O valor pago não pode ser maior que o valor da parcela!'
                // mostra a mensagem
                this.dialog_resposta = true
                // reseta a variável
                this.pagamento.valor_pago = ''
            }
        },
        // função para verificar os dados da compra 
        verificaPagamento(){
            // atribui o título da mensagem
            this.resposta.titulo = 'É necessário preencher o campo:'
            // limpa o corpo da mensagem 
            this.resposta.mensagem = ''
            // verifica se foi selecionado uma parcela
            if(this.pagamento.parcela_id == ''){
                // atribui a mensagem
                this.resposta.mensagem = 'Parcela que será paga'
                // retorna 
                return 1
            }
            // verifica se foi preenchido o valor pago
            if(this.pagamento.valor_pago == ''){
                // atribui a mensagem
                this.resposta.mensagem = 'Valor pago'
                // retorna 
                return 1
            }
            // verifica se o valor pago é valido
            if(parseFloat(this.pagamento.valor_pago) < 1){
                // atribui a mensagem
                this.resposta.mensagem = 'Valor pago deve ser maior que 1'
                // retorna 
                return 1
            }
            // verifica se foi preenchido a forma de pagamento
            if(this.pagamento.forma_pagamento_id == ''){
                // atribui a mensagem
                this.resposta.mensagem = 'Forma de pagamento'
                // retorna 
                return 1
            }
            // caso os campos tenham sido preenchidos
            if(this.resposta.mensagem == ''){
                // retorna 
                return 0
            }
        },
        // caso o usário deseje continuar pagando as parcelas desse cliente
        continuarPagando(){
            // armazena a venda id
            let venda_id = this.venda.venda_id
            // fecha a modal
            this.dialog_prosseguir = false
            // limpa os campos
            this.closePagamento()
            // atualiza os dados dessa compra
            this.visualizarVenda(venda_id)
        },
        // função para formatar o valor dos produtos
        formataProdutos(produtos){
            // percorremos os produtos
            for(let i = 0; i < produtos.length; i++){
                // formatamos o produto atual
                produtos[i].valor_unidade = this.formatValue(produtos[i].valor_unidade)
            }
            // retornamos os produtos
            return produtos
        },
        // função para exibir o botão apenas para a parcela da vez
        verificaParcelas(parcelas){
            // varíavel de verificação
            let pagar = false
            // percorre as parcelas
            for(let i = 0; i < parcelas.length; i++){
                // caso a parcela não tenha sido paga e ainda estejamos buscando
                if(parcelas[i].paga == false && pagar == false){
                    // marcamos para exibir o botão
                    parcelas[i].pagar = true
                    // setamos a variável
                    pagar = true
                // caso contrário
                }else{
                    // marcamos para não exibir o botão
                    parcelas[i].pagar = false
                }
                // formatamos o valor da parcela
                parcelas[i].valor = this.formatValue(parcelas[i].valor)
                // formatamos o valor restante da parcelas
                parcelas[i].valor_restante = parcelas[i].valor_restante > 0 ? this.formatValue(parcelas[i].valor_restante) : 0
            }
            // retornamos as parcelas
            return parcelas
        },
        // função para formatar o valor da parcela
        formatValue(valor){
            // converte o valor para float mantendo duas casas decimais
            let valor_formatado = parseFloat(valor).toFixed(2)
            // converte a vírgula em ponto, caso exista
            valor_formatado = valor_formatado.toString().replace(',', '.')
            // retorna o valor
            return  valor_formatado
        },
        // função que roda quando é fechada a modal de criar/editar o venda
        closePagamento(){
            // fecha a modal
            this.dialog_venda = false
            // fecha a modal
            this.dialog_prosseguir = false
            // limpa os dados locais do venda
            this.venda = {
                venda_id: '',
                valor_total: '',
                cliente: '',
                caixa: '', 
                produtos: [],
                parcelas: [], 
            }
            // limpa os dados da parcela
            this.pagamento = {
                parcela_id: '',
                venda_id: '',
                valor: '',
                valor_pago: '',
                forma_pagamento_id: ''
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
    #vendas {
        display: flex;
        max-height: 100%;
        padding: 24px;
        flex-wrap: wrap;
        background: url('~@/assets/images/BackgroundEntrar.png') no-repeat center center fixed;
        background-size: cover;
        min-height: 100vh;
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
    .v-dialog {
        .headline {
            display: flex;
            flex-wrap: wrap;
            align-items: center;
            font-weight: 600;
            color: #11263C;
        }
        .v-card {
            background-color: #f9f9f9;
        }
        .v-card__title {
            span {
                display: flex;
                flex-wrap: wrap;
                align-items: center;
                font-weight: 600;
                color: rgba(17, 38, 60, 1);
            }
            svg {
                margin-left: 15px;
                path {
                    fill: rgba(17, 38, 60, 1);
                }
            }
        }
        .v-text-field__details {
            display: none;
        }
        .div-input {
            padding: 5px;
        }
    }
</style>
