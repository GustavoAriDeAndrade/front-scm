<template>
    <div id="caixa">
        <div class="campos">
            <div class="col-12 filtros">
                <div class="col-3 titulo">
                    <p>VENDAS <v-icon>fas fa-store</v-icon></p>
                </div>
                <div class="row">
                    <div class="col-8">
                        <v-autocomplete
                            :items="clientes"
                            item-text="nome" 
                            item-value="id"
                            v-model="venda.cliente_id" 
                            label="Cliente"
                            placeholder="Cliente" 
                            background-color="white"
                            hide-details
                            outlined
                        />
                    </div>
                    <div class="col-4 btn-cliente">
                        <!-- botão para cadastro de cliente -->
                        <v-btn class="primary-button" raised @click="dialog_cliente = true">
                            Novo Cliente
                            <i class="fas fa-user-plus" style="margin-left: 4px;"></i> 
                        </v-btn>
                    </div>
                    <div class="col-12">
                        <!-- tabela para gerenciamento dos produtos da compra -->
                        <v-data-table
                            :headers="headers"
                            :items="itens_carrinho"
                        >
                            <template v-slot:[`item.valor`]="{ item }">
                                <span>
                                    R$ {{ item.valor }}
                                </span>
                            </template>
                            <template v-slot:top>
                                <v-toolbar flat>
                                    <v-toolbar-title>Carrinho</v-toolbar-title>
                                    <v-divider
                                        class="mx-4"
                                        inset
                                        vertical
                                    ></v-divider>
                                    <v-spacer></v-spacer>
                                    <!-- botão para adicionar produto ao carrinho -->
                                    <v-btn class="primary-button" raised @click="dialog_carrinho = true">
                                        Adicionar Produto ao Carrinho
                                        <i class="fas fa-plus" style="margin-left: 4px;"></i> 
                                    </v-btn>
                                </v-toolbar>
                            </template>
                            <!-- botões para ações nos itens do carrinho -->
                            <template v-slot:[`item.actions`]="{ item }">
                                <v-icon class="me-2" size="small" @click="editarProduto(item)">mdi-pencil</v-icon>
                                <v-icon size="small" @click="removerProduto(item)">mdi-delete</v-icon>
                            </template>
                        </v-data-table>
                    </div>
                    <div class="col-4 div-input">
                        <v-text-field 
                            type="number"
                            v-model="venda.valor_total" 
                            label="Valor Total" 
                            placeholder="Valor Total" 
                            background-color="white"
                            prefix="$"
                            hide-details
                            outlined
                            min="0"
                            disabled
                        />
                    </div>
                    <div class="col-4 div-input">
                        <v-text-field 
                            type="number"
                            v-model="venda.valor_desconto" 
                            label="Desconto" 
                            placeholder="Desconto" 
                            background-color="white"
                            prefix="$"
                            hide-details
                            outlined
                            min="0"
                            @input="valorDesconto"
                        />
                    </div>
                    <div class="col-4 div-input">
                        <v-text-field 
                            type="number"
                            v-model="valor_restante" 
                            label="Valor Restante" 
                            placeholder="Valor Restante" 
                            background-color="white"
                            prefix="$"
                            hide-details
                            outlined
                            min="0"
                            disabled
                        />
                    </div>
                    <div class="col-4 div-input">
                        <v-text-field 
                            type="number"
                            v-model="venda.valor_entrada" 
                            label="Valor Entrada" 
                            placeholder="Valor Entrada" 
                            background-color="white"
                            prefix="$"
                            hide-details
                            outlined
                            min="0"
                            @input="valorEntrada"
                        />
                    </div>
                    <div class="col-4">
                        <v-autocomplete
                            :items="formas_pagamento"
                            item-text="nome" 
                            item-value="id"
                            v-model="venda.forma_pagamento_id" 
                            label="Forma Pagamento"
                            placeholder="Forma Pagamento" 
                            background-color="white"
                            hide-details
                            outlined
                        />
                    </div>
                    <div class="col-4 div-input">
                        <v-text-field 
                            type="number"
                            v-model="venda.quantidade_parcelas" 
                            label="Parcelas" 
                            placeholder="Parcelas" 
                            background-color="white"
                            hide-details
                            outlined
                            min="1"
                            @input="valorParcelas"
                        />
                    </div>
                    <div class="col-4 div-input">
                        <v-text-field 
                            v-model="venda.data_parcela" 
                            label="Primeira Parcela" 
                            placeholder="Primeira Parcela" 
                            background-color="white"
                            v-mask="'##/##/####'"
                            hide-details
                            outlined
                        />
                    </div>
                    <div class="col-4 div-input">
                        <v-text-field 
                            type="number"
                            v-model="venda.valor_parcelas" 
                            label="Valor Parcelas" 
                            placeholder="Valor Parcelas" 
                            background-color="white"
                            prefix="$"
                            hide-details
                            outlined
                            min="0"
                            disabled
                        />
                    </div>
                    <div class="col-6 btn-cancelar">
                        <!-- botão para finalizar a compra -->
                        <v-btn class="primary-button" raised @click="cleanCaixa">
                            Cancelar Compra
                        </v-btn>
                    </div>
                    <div class="col-6 btn-finalizar">
                        <!-- botão para finalizar a compra -->
                        <v-btn class="primary-button" raised @click="finalizarCompra">
                            Finalizar Compra
                            <i class="fas fa-check" style="margin-left: 5px;"></i> 
                        </v-btn>
                    </div>
                </div>
            </div>
			<!-- modal para cadastro de um cliente -->
			<v-dialog v-model="dialog_cliente" persistent max-width="600px">
				<v-card>
					<v-card-title>
						<span class="headline"><v-icon style="margin-right: 10px;">fa-user-plus</v-icon> Novo Cliente</span>
					</v-card-title>
					<v-card-text>
						<v-container>
							<v-form ref="form_cliente">
								<div class="row">
									<div class="col-12 div-input">
										<v-text-field 
											:rules="[v => !!v || 'Campo Nome obrigatório']" 
											v-model="cliente.nome" 
											label="Nome" 
											placeholder="Nome" 
											background-color="white"
											hide-details
											outlined
											prepend-inner-icon="mdi-account"
										/>
									</div>
									<div class="col-12 div-input">
										<v-text-field 
											:rules="[v => !!v || 'Campo Telefone obrigatório']" 
											v-model="cliente.telefone" 
											label="Telefone" 
											placeholder="Telefone" 
											background-color="white"
                                            v-mask="'(##) # ####-####'"
											hide-details
											outlined
										/>
									</div>
									<div class="col-12 div-input">
										<v-textarea
											v-model="cliente.observacao"
											label="Observação"
											placeholder="Observação"
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
						<v-btn color="darken-1" text style="text-transform: capitalize; font-size: 16px;" @click="closeCliente">
							Cancelar
						</v-btn>
						<v-btn class="primary-button" small @click="enviarCliente">
							Salvar
						</v-btn>
					</v-card-actions>
				</v-card>
			</v-dialog>
            <!-- modal para atribuir os detalhes do produto -->
            <v-dialog v-model="dialog_carrinho" max-width="500px">
                <v-card>
                    <v-card-title>
                        <span class="text-h5">{{ formTitle }}</span>
                    </v-card-title>
                    <v-card-text>
                        <v-container>
                            <v-form ref="form_carrinho">
                                <div class="row">
                                    <div class="col-12 div-input">
                                        <v-autocomplete
                                            :items="produtos"
                                            item-text="nome" 
                                            item-value="id"
                                            v-model="carrinho.produto_id" 
                                            label="Produto"
                                            placeholder="Produto" 
                                            background-color="white"
                                            hide-details
                                            outlined
                                            @change="atribuiValor"
                                        />
                                    </div>
                                    <div class="col-12 div-input">
                                        <v-text-field 
                                            type="number"
                                            v-model="carrinho.valor" 
                                            label="Preço Unidade" 
                                            placeholder="Preço Unidade" 
                                            background-color="white"
                                            prefix="$"
                                            hide-details
                                            outlined
                                            disabled
                                        />
                                    </div>
                                    <div class="col-12 div-input">
                                        <v-text-field 
                                            type="number"
                                            v-model="carrinho.quantidade" 
                                            label="Quantidade" 
                                            placeholder="Quantidade" 
                                            background-color="white"
                                            hide-details
                                            outlined
                                            min="1"
                                        />
                                    </div>
                                </div>
                            </v-form>
                        </v-container>
                    </v-card-text>
                    <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn color="darken-1" text style="text-transform: capitalize; font-size: 16px;" @click="closeProduto">
                            Cancel
                        </v-btn>
                        <v-btn class="primary-button" small @click="salvarProduto">
                            Salvar
                        </v-btn>
                    </v-card-actions>
                </v-card>
            </v-dialog>
            <!-- modal para confirmar a remoção de um item do carrinho -->
            <v-dialog v-model="dialog_remove_carrinho" max-width="500px">
                <v-card>
                    <v-card-title class="text-h5">
                        Remover Item
                    </v-card-title>
                    <v-card-text>
                        Você tem certeza que deseja remover o item {{ this.carrinho.nome }}, no valor de R$ {{ this.carrinho.valor }} do carrinho?
                    </v-card-text>
                    <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn color="darken-1" text style="text-transform: capitalize; font-size: 16px;" @click="closeDelete">
                            Cancelar
                        </v-btn>
                        <v-btn class="primary-button" small @click="confirmaRemocao">
                            Remover
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
			// variável para mostrar a modal para criar um cliente
			dialog_cliente: false,
            // variável para mostrar a modal de adição no carrinho
            dialog_carrinho: false,
			// variável para mostrar a modal para criar um cliente
			dialog_remove_carrinho: false,
            // variável para a mensagem de resposta
            resposta: {},
            // variável para o componente de loading
            loading: false,
            // variável para armazenar os clientes
            clientes: [],
            // variável para armazenar os produtos
            produtos: [],
            // variável para armazenar as formas de pagamento
            formas_pagamento: [],
            // variável para armazenar os dados da venda
            venda: {
                cliente_id: '',
                usuario_id: '',
                produtos: [],
                valor_total: 0.00,
                valor_desconto: 0.00,
                valor_entrada: 0.00,
                forma_pagamento_id: '',
                quantidade_parcelas: 1,
                valor_parcelas: 0.00,
                data_parcela: moment().format('DDMMYYYY'),
            },
			// variável para criar cliente
			cliente: {
				nome: '',
				telefone: '',
				observacao: '',
			},
            // variável para os itens do carrinho
            itens_carrinho: [],
            // variável para armazenar se o produto está sendo editado/criado
            editedIndex: -1,
            // variável para controlar o valor restante do pagamento
            valor_restante: 0.00,
            // variável para o produto que está sendo editado
            carrinho: {
                produto_id: '',
                nome: '',
                quantidade: 1,
                valor: 0,
            },
            // variável para o estado padão do produto
            carrinho_padrao: {
                produto_id: '',
                nome: '',
                quantidade: 1,
                valor: 0,
            },
            // variável para tabela do carrinho
            headers: [
                {
                    text: 'Produto',
                    value: 'nome',
                },
                { 
                    text: 'Quantidade', 
                    value: 'quantidade', 
                    align: 'end',
                },
                { 
                    text: 'Preço unidade', 
                    value: 'valor',
                    align: 'end', 
                },
                { 
                    text: 'Ações', 
                    value: 'actions',
                    align: 'end', 
                    sortable: false 
                },
            ],
        }),
        // verifica qual título será atribuído
        computed: {
            formTitle() {
                return this.editedIndex === -1 ? 'Adicionar Produto' : 'Editar Produto'
            },
        },
        // funções deste componente
        methods: {
            // função chamada quando a página é aberta
			async init(){
                // buscamos os clientes cadastrados
            	this.getClientes()
                // buscamos os produtos cadastrados
            	this.getProdutos()
                // buscamos as formas de pagamento cadastradas
            	this.getFormasPagamento()
                // atribui o usuário que está realizando a venda
                this.venda.usuario_id = this.$store.getters.user.id
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
			// função para pegar os produtos
			async getProdutos(){
				// faz um dispatch para uma action no vuex para pegar os produtos
				let resp = await store.dispatch('getProdutosSelect')
				// caso o status seja 200 (deu certo)
				if(resp.status == 200){
					// atribui os dados à variável local
					this.produtos = await resp.data.products
				}
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
			// função para enviar um cliente
			async enviarCliente(){
				let resp = {}
				// caso os campos do formulário estejam válidos
				if (this.$refs.form_cliente.validate()){
					// coloca o componente como loading
					this.loading = true
					// coleta os dados do cliente
					let dados = {
						// coleta o nome do cliente
						nome: this.cliente.nome,
						// coleta o telefone do cliente
						telefone: this.cliente.telefone,
						// coleta a observação do cliente
						observacao: this.cliente.observacao,
                        // seta o cliente como ativo
                        ativo: true,		
					}
                    // rota para a criação dos dados dados do cliente
                    resp = await store.dispatch('postClientes', dados)
					// caso algo tenha dado errado
					if(resp.status != 200 && resp.status != 201){
						// atribui o título da mensagem 
						this.resposta.titulo = 'Algo deu errado!'
						// atribui o corpo da mensagem 
						this.resposta.mensagem = await resp.data.message || resp.data.error
						// mostra a mensagem
						this.dialog_resposta = true
					// caso tenha dado tudo certo
					}else{
                        // atribui o novo cliente ao array
                        this.clientes.push(resp.data.cliente)
                        // marca o novo cliente como selecionado
                        this.venda.cliente_id = resp.data.cliente.id
						// fecha a modal de create cliente
						this.closeCliente()
					}
					// retira o loading do componente
					this.loading = false
				}
			},
            // função para finalizar uma compra
            async finalizarCompra(){
				let resp = {}
                // realiza a verificação dos dados
                let validacao = await this.verificaCarrinho()
                // caso a compra tenha sido validada com sucesso
                if(validacao != 1){
					// coloca o componente como loading
					this.loading = true
                    // coleta os dados da compra
                    let dados = {
                        cliente_id: this.venda.cliente_id.toString(),
                        usuario_id: this.venda.usuario_id.toString(),
                        produtos: this.venda.produtos,
                        valor_total: parseFloat(this.venda.valor_total) - parseFloat(this.venda.valor_desconto),
                        valor_entrada: parseFloat(this.venda.valor_entrada),
                        forma_pagamento_id: this.venda.forma_pagamento_id != '' ? this.venda.forma_pagamento_id.toString() : '',
                        quantidade_parcelas: parseInt(this.venda.quantidade_parcelas),
                        valor_parcelas: parseFloat(this.venda.valor_parcelas),
                        data_parcela: moment(this.venda.data_parcela, 'DD/MM/YYYY'),
                    }
                    // percorremos os produtos
                    for(let i = 0; i < dados.produtos.length; i++){
                        // formatamos o produto id
                        dados.produtos[i].produto_id = dados.produtos[i].produto_id.toString()
                        // formatamos a quantidade
                        dados.produtos[i].quantidade = parseInt(dados.produtos[i].quantidade)
                        // formatamos o produto id
                        dados.produtos[i].valor = parseFloat(dados.produtos[i].valor)
                    }
                    // rota para o cadastro da compra
                    resp = await store.dispatch('postCompra', dados)
					// caso algo tenha dado errado
					if(resp.status != 200 && resp.status != 201){
						// atribui o título da mensagem 
						this.resposta.titulo = 'Algo deu errado!'
						// atribui o corpo da mensagem 
						this.resposta.mensagem = await resp.data.message || resp.data.error
						// mostra a mensagem
						this.dialog_resposta = true
					// caso tenha dado tudo certo
					}else{
						// atribui o título da mensagem 
						this.resposta.titulo = 'Compra Registrada'
						// atribui o corpo da mensagem 
						this.resposta.mensagem = 'Compra registrada com sucesso!'
						// fecha a modal de create/edit usuário
						this.cleanCaixa()
						// mostra a mensagem
						this.dialog_resposta = true
					}
					// retira o loading do componente
					this.loading = false
                // caso algum campo não tenha sido preenchido
                }else{
                    // mostra a mensagem
                    this.dialog_resposta = true
                }
            },
            // função para abrir a modal de edição do produto
            editarProduto(item){
                // atribui a posição do item do carrinho
                this.editedIndex = this.itens_carrinho.indexOf(item)
                // atribui os dados do item que está sendo editado
                this.carrinho = Object.assign({}, item)
                // abre a modal para edição do produto
                this.dialog_carrinho = true
            },
            // função para abrir a modal de remoção do produto
            removerProduto(item){
                // atribui a posição do item do carrinho
                this.editedIndex = this.itens_carrinho.indexOf(item)
                // atribui os dados do item que está sendo editado
                this.carrinho = Object.assign({}, item)
                // abre a modal para remoção do produto
                this.dialog_remove_carrinho = true
            },
            // função para remover um item do carrinho 
            confirmaRemocao(){
                // remove o item do carrinho
                this.itens_carrinho.splice(this.editedIndex, 1)
                // remove o item do array enviado
                this.venda.produtos.splice(this.editedIndex, 1)
                // atualiza o valor total
                this.valorTotal()
                // chama a função para fechar a modal de remoção
                this.closeDelete()
            },
            // função para atribuir o valor do produto ao campo
            atribuiValor(){
                // buscamos os dados do produto que foi selecionado
                let produto_busca = this.produtos.find(produto => produto.id === this.carrinho.produto_id)
                // formata o valor antes de atribuir ao campo
                let valor =this.formatValue(produto_busca.valor)
                // atribuimos o valor do produto
                this.carrinho.valor = valor
            },
            // função para salvar um produto
            salvarProduto(){
                // buscamos os dados do produto que foi selecionado
                let produto_busca = this.produtos.find(produto => produto.id === this.carrinho.produto_id)
                // atribuimos o seu nome
                this.carrinho.nome = produto_busca.nome
                // se o produto estiver sendo editado
                if(this.editedIndex > -1){
                    // edita o item no carrinho
                    Object.assign(this.itens_carrinho[this.editedIndex], this.carrinho)
                    // edita o item no array enviado
                    Object.assign(this.venda.produtos[this.editedIndex], this.carrinho)
                // se o produto estiver sendo adicionado
                }else{
                    // adiciona o item no carrinho
                    this.itens_carrinho.push(this.carrinho)
                    // adiciona o item no array enviado
                    this.venda.produtos.push(this.carrinho)
                }
                // atualiza o valor total
                this.valorTotal()
                // fecha a modal
                this.closeProduto()
            },
            // função para verificar os dados da compra 
            verificaCarrinho(){
                // atribui o título da mensagem
				this.resposta.titulo = 'É necessário preencher o campo:'
                // limpa o corpo da mensagem 
                this.resposta.mensagem = ''
                // verifica se foi preenchido o cliente
                if(this.venda.cliente_id == ''){
                    // atribui a mensagem
                    this.resposta.mensagem = 'Cliente que está realizando a compra'
                    // retorna 
                    return 1
                }
                // verifica se foi adicionado produtos
                if(this.venda.produtos[0] == undefined){
                    // atribui a mensagem
                    this.resposta.mensagem = 'Produto que será comprado'
                    // retorna 
                    return 1
                }
                // verifica se foi preenchido o valor total da compra
                if(this.venda.valor_total == ''){
                    // atribui a mensagem
                    this.resposta.mensagem = 'Valor total da compra'
                    // retorna 
                    return 1
                }
                // verifica se foi preenchida forma de pagamento
                if(this.venda.valor_entrada != '' && this.venda.forma_pagamento_id == ''){
                    // atribui a mensagem
                    this.resposta.mensagem = 'Forma de pagamento da compra'
                    // retorna 
                    return 1
                }
                // verifica se foi preenchido a quantidade de parcelas
                if(this.venda.quantidade_parcelas == ''){
                    // atribui a mensagem
                    this.resposta.mensagem = 'Quantidade de parcelas do pagamento'
                    // retorna 
                    return 1
                }
                // verifica se foi preenchido o valor das parcelas
                if(this.venda.valor_total != this.venda.valor_entrada && this.venda.valor_parcelas == ''){
                    // atribui a mensagem
                    this.resposta.mensagem = 'Valor de cada parcela'
                    // retorna 
                    return 1
                }
                // verifica se foi preenchido o vencimento da primeira parcela
                if(this.venda.data_parcela == ''){
                    // atribui a mensagem
                    this.resposta.mensagem = 'Vencimento da primeira parcela'
                    // retorna 
                    return 1
                }
                // verifica a data de vencimento da primeira parcela
                if(moment(this.venda.data_parcela, 'DD/MM/YYYY').format('DD-MM-YYYY') < moment().format('DD-MM-YYYY')){
                    // atribui a mensagem
                    this.resposta.mensagem = 'Vencimento da primeira parcela não pode ser menor que o dia atual'
                    // retorna 
                    return 1
                }
                // caso os campos tenham sido preenchidos
                if(this.resposta.mensagem == ''){
                    // retorna 
                    return 0
                }
            },
            // função para calcular o valor total do carrinho
            valorTotal(){
                // zera a variável
                this.venda.valor_total = 0
                // percorremos o array com os dados do carrinho
                for(let i = 0; i < this.venda.produtos.length; i++){
                    // atribuimos o valor unitario do produto atual
                    let valor = parseFloat(this.venda.produtos[i].valor)
                    // atribuimos a quantidade do produto atual
                    let quantidade = parseInt(this.venda.produtos[i].quantidade)
                    // realizamos a multiplicação
                    let multiplicacao = valor * quantidade
                    // atribui à variável
                    this.venda.valor_total = this.venda.valor_total + multiplicacao
                }
                // atribui ao valor restante do pagamento 
                this.valor_restante = this.venda.valor_total
                // atualiza o valor das parcelas
                this.valorParcelas()
            },
            // caso o uusário resolva dar um desconto ao cliente
            valorDesconto(){
                // verifica se o valor de entrada é válido
                if(parseFloat(this.venda.valor_desconto) <= parseFloat(this.venda.valor_total)){
                    // atribui o novo valor restante para pagamento
                    this.valor_restante = parseFloat(this.venda.valor_total) - parseFloat(this.venda.valor_desconto)
                    // atualiza o valor das parcelas
                    this.valorParcelas()
                // caso o valor de entrada seja inválido
                }else{
                    // atribui o título da mensagem 
                    this.resposta.titulo = 'Atenção!'
                    // atribui o corpo da mensagem 
                    this.resposta.mensagem = 'O desconto não pode ser maior que o valor total!'
                    // mostra a mensagem
                    this.dialog_resposta = true
                    // reseta a variável
                    this.venda.valor_desconto = 0.00
                    // corrigi o valor restante
                    this.valor_restante = this.venda.valor_total
                    // formata o valor restante
                    this.valor_restante = this.formatValue(this.valor_restante)
                    // corrigi o valor das parcelas
                    this.venda.valor_parcelas = this.venda.valor_total
                }
            },
            // caso o cliente resolva dar um valor de entrada na compra
            valorEntrada(){
                // verifica se o valor de entrada é válido
                if(parseFloat(this.venda.valor_entrada) <= parseFloat(this.venda.valor_total)){
                    // atribui o novo valor restante para pagamento
                    this.valor_restante = parseFloat(this.venda.valor_total) - parseFloat(this.venda.valor_entrada) - parseFloat(this.venda.valor_desconto)
                    // atualiza o valor das parcelas
                    this.valorParcelas()
                // caso o valor de entrada seja inválido
                }else{
                    // atribui o título da mensagem 
                    this.resposta.titulo = 'Atenção!'
                    // atribui o corpo da mensagem 
                    this.resposta.mensagem = 'O valor de entrada não pode ser maior que o valor total!'
                    // mostra a mensagem
                    this.dialog_resposta = true
                    // reseta a variável
                    this.venda.valor_entrada = 0.00
                    // corrigi o valor restante
                    this.valor_restante = this.venda.valor_total
                    // formata o valor restante
                    this.valor_restante = this.formatValue(this.valor_restante)
                    // corrigi o valor das parcelas
                    this.venda.valor_parcelas = this.venda.valor_total
                }
            },
            // função para calcular o valor das parcelas
            valorParcelas(){
                // verifica se a quantidade de parcelas possui um valor válido
                if(parseInt(this.venda.quantidade_parcelas) < 1){
                    // caso seja inválido, tornamos válido
                    this.venda.quantidade_parcelas = 1
                }
                // realiza o calculo
                this.venda.valor_parcelas = parseFloat(this.valor_restante) / parseInt(this.venda.quantidade_parcelas)
                // formata o valor total
                this.venda.valor_total = this.formatValue(this.venda.valor_total)
                // formata o valor das parcelas
                this.venda.valor_parcelas = this.formatValue(this.venda.valor_parcelas)
                // formata o valor restante
                this.valor_restante = this.formatValue(this.valor_restante)
            },
			// função para fechar a modal de cliente
			closeCliente(){
				// fecha a modal
				this.dialog_cliente = false
				// limpa os dados locais do cliente
				this.cliente =  {
					nome: '',
					telefone: '',
					observacao: '',
				}
			},
            // função para fechar a modal de produto
            closeProduto(){
                // fecha a modal
                this.dialog_carrinho = false
                // limpa os campos
                this.$nextTick(() => {
                    this.carrinho = Object.assign({}, this.carrinho_padrao)
                    this.editedIndex = -1
                })
            },
            // função para fechar a modal de remoção de produto
            closeDelete(){
                // fecha a modal
                this.dialog_remove_carrinho = false
                // limpa os campos
                this.$nextTick(() => {
                    this.carrinho = Object.assign({}, this.carrinho_padrao)
                    this.editedIndex = -1
                })
            },
            // função para limpar os campos do caixa
            cleanCaixa(){
                // limpa os campos
                this.venda = {
                    cliente_id: '',
                    usuario_id: '',
                    produtos: [],
                    valor_total: 0.00,
                    valor_entrada: 0.00,
                    forma_pagamento_id: '',
                    quantidade_parcelas: 1,
                    valor_parcelas: 0.00,
                    data_parcela: moment().format('DDMMYYYY'),
                },
                // limpa o carrinho
                this.itens_carrinho = [],
                // zera o valor restante
                this.valor_restante = 0.00
            },
            // função para formatar o valor do produto
            formatValue(valor){
                // converte a vírgula em ponto, caso exista
                let valor_formatado = valor.toString().replace(',', '.')
                // converte o valor para float mantendo duas casas decimais
                valor_formatado = parseFloat(valor_formatado).toFixed(2)
                // retorna o valor
                return  valor_formatado
            },
        },
		// funções que rodam quando o componente é montado
		mounted(){
      		this.init()
		}
    }
</script>

<style lang="scss">
    #caixa{
		display: flex;
		max-height: 100%;
		padding: 24px;
		flex-wrap: wrap;
        background: url('~@/assets/images/BackgroundEntrar.png') no-repeat center center fixed;
        background-size: cover;

        .campos{
			background-color: #fff;
			border-radius: 10px;
			width: 100%;
            .titulo{
                padding-bottom: 0;
                p{
                    color: #11263C;
                    font-weight: 500;
                    font-size: 20px;
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
        }
        .btn-cliente{
            padding: 20px;
            text-align: center;
        }
        .btn-cancelar{
            text-align: right;
            margin-top: 15px;
        }
        .btn-finalizar{
            text-align: left;
            margin-top: 15px;
        }
    }
</style>
