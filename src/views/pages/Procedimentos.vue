<template>
    <div id="procedimentos">
        <div class="tabela-procedimentos">
            <!-- botão para abrir a modal-->
            <div class="col-12 novo-procedimento">
                <v-btn class="primary-button" raised @click="createProcedimento">
                    <i class="fas fa-list-ol"></i>
                    <i class="fas fa-plus"></i>
                    Cadastrar Procedimento
                </v-btn>
            </div>
            <!-- tabela que ira conter os procedimentos de cada empresa-->
            <CustomTable
                v-if="headers != ''"
                :action="'getProcedimentos'"
                :getter="$store.getters.procedimentos"
                :headers="headers"
                :search="true"
                :title="'Procedimentos'"
                :icone="'far fa-list-alt'"
                :pagination="true"
                :filters="filtros"
                ref="tabela"
            >
                <template v-slot:acoes="{ item }">
                    <v-btn class="primary-button" raised small @click="editarProcedimento(item.uuid)">
                        <i class="fas fa-cog"></i>
                        Editar
                    </v-btn>
                </template>
            </CustomTable>
            <!-- modal para cadastro e edição de um procedimento-->
            <v-dialog v-model="dialog_procedimento" persistent max-width="550px">
                <v-card>
                    <v-card-title>
                        <span v-if="procedimento.procedimento_uuid" class="headline"> <img src="./../../assets/images/icone-nova-empresa.png"> Editar Procedimentos</span>
                        <span v-else class="headline"><img src="./../../assets/images/icone-nova-empresa.png"> Novo Procedimento</span>
                    </v-card-title>
                    <v-card-text>
                        <v-container>
                            <v-form ref="form_procedimento">
                                <div class="row">
                                    <div class="col-12">
                                        <v-text-field
                                            :rules="[v => !!v || 'Campo Procedimento Obrigatório']"
                                            v-model="procedimento.nome"
                                            label="Procedimento"
                                            placeholder="Procedimento"
                                            background-color="white"
                                            hide-details
                                            outlined
                                        />
                                    </div>
									<div class="col-12">
										<v-select
											:rules="[v => !!v || 'Campo Empresa obrigatório']"
											:items="$store.getters.companies"
											item-text="name" 
											item-value="uuid"
											v-model="procedimento.empresa" 
											label="Empresa(s)"
											placeholder="Empresa(s)" 
											background-color="white"
											hide-details
											outlined
										/>
									</div>
                                    <div class="col-12">
                                        <v-text-field
                                            v-mask="'###'"
                                            type="text"
                                            :rules="[v => !!v || 'Campo Duração Obrigatório']"
                                            v-model="procedimento.duracao"
                                            label="Duração"
                                            placeholder="Duração(min.)"
                                            suffix="Min"
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
                    <v-btn color="darken-1" text style="text-transform: capitalize; font-size: 16px;" @click="closeProcedimento">
                        Cancelar
                    </v-btn>
                    <v-btn class="primary-button" small @click="enviarProcedimento">
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
        name: 'Procedimentos',
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
        // variável para mostrar a modal para edita/criar um procedimento
        dialog_procedimento: false,
        // variável para mostrar a modal de informação
        dialog_resposta: false,
        // variável para a mensagem de resposta
        resposta: {},
        // variável para o componente de loading
        loading: false,
        // variáveis para criar/editar um procedimento
        procedimento: {
            procedimento_uuid: '',
            nome: '',
            duracao: '',
            empresa: '',
        },
        // variável para o cabeçalho da tabela
        headers: [
            {
                value: 'name',
                text: 'Procedimento',
                sortable: true,
            },
            {
                value: 'duration',
                text: 'Duração(min)',
                sortable: true,
            },
            {
                value: 'companies.name',
                text: 'Empresa',
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
        // função para abrir a modal de cadastro/edição de procedimento
        async createProcedimento(){
            // abre a modal de procedimentos
            this.dialog_procedimento = true
        },
        // função para enviar um procedimento
        async enviarProcedimento(){
            let resp = {}
            // caso os campos do formulário estejam válidos
            if (this.$refs.form_procedimento.validate()){
                // coloca o componente como loading
                this.loading =  true
                // coleta os dados do procedimento
                let dados = await {
                    // coleta o nome do procedimento
                    name: this.procedimento.nome,
                    // coleta a duração do procedimento
                    duration: this.procedimento.duracao.toString(),
                    // coleta a empresa do procedimento
                    company: this.procedimento.empresa,
                }
                // caso ja exista um procedimento_uuid
                if(this.procedimento.procedimento_uuid){
                    // armazena os dados para realizar a atualização
                    let date_update = await {
                        dados_procedimento: dados,
                        uuid: this.procedimento.procedimento_uuid
                    }
                    // rota para a atualização do procedimento
                    resp = await store.dispatch('putProcedimento', date_update)
                }else{
                    // rota para a criação do procedimento
                    resp = await store.dispatch('postProcedimento', dados)
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
                    this.resposta.titulo = 'Procedimento ' + (this.procedimento.procedimento_uuid ? 'editado!' : 'cadastrado!')
                    // atribui o corpo da mensagem
                    this.resposta.mensagem = 'Procedimento ' + (this.procedimento.procedimento_uuid ? 'editado' : 'cadastrado') + ' com sucesso!'
                    // fecha a modal de create/edit procedimento
                    this.closeProcedimento()
                    // mostra a mensagem
                    this.dialog_resposta = true
                }
                // retira o loading do componente
                this.loading = false
                // atualiza a tabela
                this.$refs.tabela.init()
            }
        },
        // função para coletar um procedimento para editar
        async editarProcedimento(procedimento_uuid){
            // coloca o componente como loading
            this.loading = true
            // faz um dispatch para uma action no vuex store para pegar um procedimento passando o uuid
            var resp = await store.dispatch('getProcedimento', procedimento_uuid)
            // caso o status da resposta seja 200 (deu certo)
            if(resp.status == 200){
                // atribui os dados do procedimento vindos do back à váriável local
                this.procedimento.procedimento_uuid = await resp.data.uuid || ''
                this.procedimento.nome = await resp.data.name || ''
                this.procedimento.duracao = await resp.data.duration || ''
                this.procedimento.empresa = await resp.data.companies.uuid || ''
                // mostra a modal de criar/editar o procedimento
                this.createProcedimento()
            }else{
                // atribui o título da mensagem
                this.resposta.titulo = await 'Algo deu errado!'
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
        // função que roda quando é fechada a modal de criar/editar o procedimento
        closeProcedimento(){
            // fecha a modal
            this.dialog_procedimento = false
            // limpa os dados locais do procedimento
            this.procedimento = {
                procedimento_uuid: '',
                nome: '',
                duracao: '',
                empresa: '',
            }
        },
    }
}
</script>

<style lang="scss">
    #procedimentos{
        display: flex;
        max-height: 100%;
        padding: 24px;
        flex-wrap: wrap;
        .tabela-procedimentos{
            width: 100%;
            background-color: #fff;
            border-radius: 10px;
            .novo-procedimento{
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