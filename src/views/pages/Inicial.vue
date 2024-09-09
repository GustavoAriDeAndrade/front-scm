<template>
    <div id="produtos">
        <div class="tabela-produtos">
            <!-- botão para abrir a modal-->
            <div class="col-12 novo-produto">
                <v-btn class="primary-button" raised @click="createProduto">
                    <i class="fas fa-list-ol"></i>
                    <i class="fas fa-plus"></i>
                    Cadastrar Produto
                </v-btn>
            </div>
            <!-- tabela que ira conter os produtos cadastrados -->
            <CustomTable
                v-if="headers != ''"
                :action="'getProdutos'"
                :getter="$store.getters.produtos"
                :headers="headers"
                :search="true"
                :title="'Produtos'"
                :icone="'far fa-list-alt'"
                :pagination="true"
                :filters="filtros"
                ref="tabela"
            >
				<template v-slot:ativo="{ item }">
					<span v-if="item.ativo">
						Ativo
						<img src="./../../assets/images/icon-ativo.png">
					</span>
					<span v-else>
						Inativo
						<img src="./../../assets/images/icon-inativo.png">
					</span>
				</template>
				<!-- botões para ativação das modais presentes na tabela -->
                <template v-slot:acoes="{ item }">
                    <v-btn class="primary-button" raised small @click="editarProduto(item.id)">
                        <i class="fas fa-cog"></i>
                        Editar
                    </v-btn>
                </template>
            </CustomTable>
            <!-- modal para cadastro e edição de um produto-->
            <v-dialog v-model="dialog_produto" persistent max-width="550px">
                <v-card>
                    <v-card-title>
                        <span v-if="produto.produto_id" class="headline">Editar Produtos <v-icon>fa-user-edit</v-icon> </span>
                        <span v-else class="headline"><v-icon style="margin-right: 10px;">fa-user-plus</v-icon> Novo Produto</span>
                    </v-card-title>
                    <v-card-text>
                        <v-container>
                            <v-form ref="form_produto">
                                <div class="row">
                                    <div class="col-12 div-input">
                                        <v-text-field
                                            :rules="[v => !!v || 'Campo Produto Obrigatório']"
                                            v-model="produto.nome"
                                            label="Produto"
                                            placeholder="Produto"
                                            background-color="white"
                                            hide-details
                                            outlined
                                        />
                                    </div>
									<div v-if="produto.produto_id"  class="col-12 div-input">
										<v-select 
											:rules="[v => !!v || 'Campo Status obrigatório']" 
											:items="['Ativo', 'Inativo']" 
											v-model="produto.ativo" 
											label="Status" 
											placeholder="Status" 
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
                    <v-btn color="darken-1" text style="text-transform: capitalize; font-size: 16px;" @click="closeProduto">
                        Cancelar
                    </v-btn>
                    <!-- Click = chama a função atribuida -->
                    <v-btn class="primary-button" small @click="enviarProduto">
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

<script>
    // importa o store
    import store from '@/store'
    // importa o componente de DialogMensagem
    import DialogMensagem from '@/components/DialogMensagem.vue'
    // importa o componente de Loader
    import Loader from '@/components/Loader.vue'
    // importa o compnente de CustomTable
    import CustomTable from '@/components/CustomTable.vue'

    // exporta o componente
    export default {
        // nome do componente
        name: 'Produtos',
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
        // variável para mostrar a modal para edita/criar um produto
        dialog_produto: false,
        // variável para mostrar a modal de informação
        dialog_resposta: false,
        // variável para a mensagem de resposta
        resposta: {},
        // variável para o componente de loading
        loading: false,
        // variáveis para criar/editar um produto
        produto: {
            produto_id: '',
            nome: '',
            ativo: '',
        },
        // variável para o cabeçalho da tabela
        headers: [
            {
                value: 'nome',
                text: 'Produto',
                sortable: true,
            },
            {
                value: 'ativo',
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
        // função para abrir a modal de cadastro/edição de produto
        async createProduto(){
            // abre a modal de produtos
            this.dialog_produto = true
        },
        // função para enviar um produto
        async enviarProduto(){
            let resp = {}
            // caso os campos do formulário estejam válidos
            if (this.$refs.form_produto.validate()){
                // coloca o componente como loading
                this.loading =  true
                // coleta os dados do produto
                let dados = {
                    // coleta o nome do produto
                    nome: this.produto.nome,
                }
                // caso ja exista um produto_id
                if(this.produto.produto_id){
                    // coleta o status do produto
                    dados.ativo = this.produto.ativo == 'Ativo' ? true : false
                    // armazena os dados para realizar a atualização
                    let date_update = {
                        dados_produto: dados,
                        id: this.produto.produto_id
                    }
                    // rota para a atualização do produto
                    resp = await store.dispatch('putProduto', date_update)
                }else{
                    // coleta o status do produto
                    dados.ativo = true
                    // rota para a criação do produto
                    resp = await store.dispatch('postProduto', dados)
                }
                // caso algo tenha dado errado
                if(resp.status != 200 && resp.status != 201){
                    // atribui o título da mensagem
                    this.resposta.titulo = 'Algo deu errado!'
                    // atribui o corpo da mensagem
                    this.resposta.mensagem = await resp.data.message || resp.data.error
                    // mostra a mensagem
                    this.dialog_resposta = true
                }else{
                    // atribui o título da mensagem
                    this.resposta.titulo = 'Produto ' + (this.produto.produto_id ? 'editado!' : 'cadastrado!')
                    // atribui o corpo da mensagem
                    this.resposta.mensagem = 'Produto ' + (this.produto.produto_id ? 'editado' : 'cadastrado') + ' com sucesso!'
                    // fecha a modal de create/edit produto
                    this.closeProduto()
                    // mostra a mensagem
                    this.dialog_resposta = true
                }
                // retira o loading do componente
                this.loading = false
                // atualiza a tabela
                this.$refs.tabela.init()
            }
        },
        // função para coletar um produto para editar
        async editarProduto(produto_id){
            // coloca o componente como loading
            this.loading = true
            // faz um dispatch para uma action no vuex store para pegar um produto passando o id
            var resp = await store.dispatch('getProduto', produto_id)
            // caso o status da resposta seja 200 (deu certo)
            if(resp.status == 200){
                // atribui os dados do produto vindos do back à váriável local
                this.produto.produto_id = await resp.data.product.id || ''
                this.produto.nome = await resp.data.product.nome || ''
				this.produto.ativo = await resp.data.product.ativo ? 'Ativo' : 'Inativo'
                // mostra a modal de criar/editar o produto
                this.createProduto()
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
            // atualiza a tabela
            this.$refs.tabela.init()
        },
        // função que roda quando é fechada a modal de criar/editar o produto
        closeProduto(){
            // fecha a modal
            this.dialog_produto = false
            // limpa os dados locais do produto
            this.produto = {
                produto_id: '',
                nome: '',
                ativo: '',
            }
        },
    }
}
</script>

<style lang="scss">
    #produtos{
        display: flex;
        max-height: 100%;
        padding: 24px;
        flex-wrap: wrap;
        .tabela-produtos{
            width: 100%;
            background-color: #fff;
            border-radius: 10px;
            .novo-produto{
                display: flex;
                justify-content: flex-end;
                padding-bottom: 0;
                button{
                    i, svg{
                        margin-right: 10px;
                    }
                    text-transform: capitalize;
                }
            }
        }
    }
    .v-dialog{
        .headline{
            display: flex;
            flex-wrap: wrap;
            align-items: center;
            font-weight: 600;
            color: #11263C;
        }
        .v-card{
            background-color: #f9f9f9;
        }
        .v-card__title{
            span{
                display: flex;
                flex-wrap: wrap;
                align-items: center;
                font-weight: 600;
                color: rgba(17, 38, 60, 1);
            }
            svg{
                margin-left: 15px;
                path{
                    fill: rgba(17, 38, 60, 1);
                }
            }
        }
        .v-text-field__details{
            display: none;
        }
        .div-input{
            padding: 5px;
        }
    }
</style>