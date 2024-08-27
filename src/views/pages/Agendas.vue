<template>
    <div id="agenda">
        <div class="tabela-agenda">
            <!--botão para abrir a modal-->
            <div class="col-12 nova-agenda">
                <v-btn class="primary-button" raised @click="criarAgenda">
                    <i class="fa fa-rss" aria-hidden="true"></i>
                    Nova Agenda
                </v-btn>
            </div>
            <!--tabela que ira conter os funcionario e seus dados-->
            <CustomTable
                v-if="headers != ''"
                :action="'getAgendas'"
                :getter="$store.getters.registros"
                :headers="headers"
                :search="true"
                :title="'Agendas'"
                :icone="'fa fa-address-book'"
                :pagination="true"
                :filters="filtros"
                ref="tabela"
            >
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
                <!--botão para ativação da modal presente na tabela-->
                <template v-slot:acoes="{ item }">
                    <v-btn class="primary-button" raised small @click="editarAgenda(item.uuid)" :disabled="$store.getters.user.group.hierarchy_order != 3 ? true : false">
                        <i class="fas fa-cog"></i>
                        Editar
                    </v-btn>
                </template>
            </CustomTable>
            <!--modal para cadastro e edição dos dados para a conexão com o whats-->
            <v-dialog v-model="dialog_agenda" persistent max-width="1200px">
                <v-card>
                    <v-card-title>
                        <span v-if="dados.uuid" class="headline">Editar Agenda da empresa</span>
                        <span v-else class="headline">Nova agenda da empresa</span>
                    </v-card-title>
                    <v-card-text>
                        <v-container>
                            <v-stepper v-model="step">
                                <v-stepper-header>
                                    <v-stepper-step
                                        :editable="dados.uuid ? true : false"
                                        :complete="step > 1"
                                        step="1"                                
                                    >
                                        Sua Agenda
                                    </v-stepper-step>

                                    <v-divider></v-divider>

                                    <v-stepper-step
                                        :editable="dados.uuid ? true : false"
                                        :complete="step > 2"
                                        step="2"
                                    >
                                        Usuários da Agenda
                                    </v-stepper-step>

                                    <v-divider></v-divider>

                                    <v-stepper-step
                                        :editable="dados.uuid ? true : false"
                                        :complete="step > 3"
                                        step="3"
                                    >
                                        Mensagens Personalizadas
                                    </v-stepper-step>

                                    <v-divider></v-divider>

                                    <v-stepper-step
                                        :editable="dados.uuid ? true : false"
                                        :complete="step > 4"
                                        step="4"
                                    >
                                        Configurações Finais
                                    </v-stepper-step>

                                    <v-divider></v-divider>

                                </v-stepper-header>
                                <v-stepper-items>
                                    <v-stepper-content step="1">
                                        <v-form ref="form_dados">
                                            <h2 class="text-center">Sua Agenda</h2>
                                            <p></p>
                                            <p class="text-center">Bem vindo as configurações da agenda da sua empresa.</p>
                                            <p class="text-center">Aqui pode-se editar o nome dela e as mensagens que deseja exibir aos seus clientes durante a conversa</p>
                                            <p class="text-center">Configure os dados da forma que lhe agradar para atender seus clientes.</p>
                                            <div class="row">
                                                <div class="col-12">
                                                    <div class="row">
                                                        <div class="col-6">
                                                            <v-text-field
                                                                :rules="[v => !!v || 'Campo Nome obrigatório']"
                                                                v-model="dados.name"
                                                                label="Nome da Agenda"
                                                                placeholder="Nome da Agenda"
                                                                background-color="white"
                                                                hide-details
                                                                outlined
                                                            />
                                                        </div>
                                                        <div class="col-6">
                                                            <v-select
                                                                :rules="[v => !!v || 'Campo Api obrigatório']"
                                                                :items="apis"
                                                                item-text="name"
                                                                item-value="uuid"
                                                                v-model="dados.api"
                                                                label="API Utilizada pela Agenda"
                                                                placeholder="API Utilizada pela Agenda"
                                                                background-color="white"
                                                                hide-details
                                                                outlined
                                                            />
                                                        </div>
                                                        <div class="col-6">
                                                            <v-select
                                                                :rules="[v => !!v || 'Campo Empresa obrigatório']"
                                                                :items="$store.getters.companies"
                                                                item-text="name" 
                                                                item-value="uuid"
                                                                v-model="dados.company" 
                                                                label="Empresa que Utilizará a Agenda"
                                                                placeholder="Empresa que Utilizará a Agenda" 
                                                                background-color="white"
                                                                hide-details
                                                                outlined
                                                                @change="getProcedimentosEmpresa()"
                                                            />
                                                        </div>
                                                        <div class="col-6">
                                                            <v-text-field
                                                                v-model="dados.settings.departament_default_id"
                                                                label="Departamento responsável pela agenda"
                                                                placeholder="Departamento responsável pela agenda"
                                                                background-color="white"
                                                                hide-details
                                                                outlined
                                                            />
                                                        </div>
                                                        <div class="col-6">
                                                            <v-text-field
                                                                v-model="dados.settings.queue_okWhats"
                                                                label="Fila do okWhats"
                                                                placeholder="Fila do okWhats"
                                                                background-color="white"
                                                                hide-details
                                                                outlined
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                                <div class="col-12">
                                                    <div class="row">
                                                        <div class="col-6">
                                                            <v-btn color="darken-1" text style="text-transform: capitalize; font-size: 16px;" @click="closeAgenda">
                                                                Cancelar
                                                            </v-btn>
                                                        </div>
                                                        <div class="col-6">
                                                            <div class="row justify-end">
                                                                <div class="col-12 col-md-3">
                                                                    <v-btn class="primary-button" small @click="proximaPagina">
                                                                        Próximo
                                                                    </v-btn>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </v-form>
                                    </v-stepper-content>
                                    <v-stepper-content step="2">
                                        <v-form ref="form_dados_0">
                                            <h2 class="text-center">Usuário da Agenda</h2>
                                            <p></p>
                                            <p class="text-center">Aqui você ira selecionar quais procedimentos e até mesmo funcionário serão alcançados pela configuração de sua agenda.</p>
                                            <p class="text-center">Todos os selecionado disponibilizarão dessa agenda durante o contato com seus clientes.</p>
                                            <div class="row">
                                                <div class="col-12">
                                                    <div class="row">
                                                        <div class="col-6">
                                                            <v-autocomplete
                                                                :rules="[v => !!v || 'Campo Procedimento(s) obrigatório']"
                                                                :items="procedimentos"
                                                                item-text="name"
                                                                item-value="uuid"
                                                                v-model="dados.settings.procedure_uuid"
                                                                label="Procedimento(s)"
                                                                placeholder="Procedimento(s)"
                                                                background-color="white"
                                                                chips
                                                                deletable-chips
                                                                small-chips
                                                                hide-details
                                                                outlined
                                                                multiple
                                                                @change="userByProcedure()"
                                                            />
                                                        </div>
                                                        <div class="col-6">
                                                            <v-autocomplete
                                                                :items="funcionarios"
                                                                item-text="user.name"
                                                                item-value="user_uuid"
                                                                v-model="dados.settings.user_uuid"
                                                                label="Funcionário(s)"
                                                                placeholder="Funcionário(s)"
                                                                background-color="white"
                                                                chips
                                                                deletable-chips
                                                                small-chips
                                                                hide-details
                                                                outlined
                                                                multiple
                                                            />
                                                        </div>  
                                                    </div>
                                                </div>
                                                <div class="col-12">
                                                    <div class="row">
                                                        <div class="col-6">
                                                            <v-btn color="darken-1" text style="text-transform: capitalize; font-size: 16px;" @click="closeAgenda">
                                                                Cancelar
                                                            </v-btn>
                                                            <v-btn @click="step = 1">
                                                                Voltar
                                                            </v-btn>
                                                        </div>
                                                        <div class="col-6">
                                                            <div class="row justify-end">
                                                                <div class="col-12 col-md-3">
                                                                    <v-btn class="primary-button" small @click="proximaPagina">
                                                                        Próximo
                                                                    </v-btn>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </v-form>
                                    </v-stepper-content>
                                    <v-stepper-content step="3">
                                        <v-form ref="form_dados_1">
                                            <div class="row">
                                                <div class="col-12">
                                                    <div class="row">
                                                        <div v-if="dados.uuid" class="col-12">
                                                            <v-select
                                                                :rules="[v => !!v || 'Campo Status obrigatório']"
                                                                :items="['Ativo', 'Inativo']"
                                                                v-model="dados.status"
                                                                label="Status da sua Agenda"
                                                                placeholder="Status da sua Agenda"
                                                                background-color="white"
                                                                hide-details
                                                                outlined
                                                            />
                                                        </div>
                                                        <div class="col-6">
                                                            <v-text-field
                                                                v-mask="'##'"
                                                                type="text"
                                                                :rules="[v => !!v || 'Campo Aviso Agendamento obrigatório']"
                                                                v-model="dados.settings.avisoAgendamento"
                                                                label="Aviso de Agendamento Próximo"
                                                                placeholder="Aviso de Agendamento Próximo"
                                                                suffix="Dia(s) Antes do Agendamento"
                                                                background-color="white"
                                                                hide-details
                                                                outlined
                                                            />
                                                        </div>
                                                        <div class="col-6">
                                                            <v-text-field
                                                                v-mask="'##'"
                                                                type="text"
                                                                :rules="[v => !!v || 'Campo Busca Máxima obrigatória']"
                                                                v-model="dados.settings.maxDays"
                                                                label="Máximo de dias para Busca"
                                                                placeholder="Máximo de dias para Busca"
                                                                suffix="Dias"
                                                                background-color="white"
                                                                hide-details
                                                                outlined
                                                            />
                                                        </div>
                                                        <div class="col-6">
                                                            <v-textarea
                                                                :rules="[v => !!v || 'Campo Mensagem de Opções de Procedimento Obrigatório.']"
                                                                v-model="dados.settings.messageProcedure"
                                                                label="Mensagem de Procedimentos Disponíveis"
                                                                placeholder="Mensagem de Procedimentos Disponíveis"
                                                                background-color="white"
                                                                hide-details
                                                                outlined
                                                            />
                                                        </div>
                                                        <div class="col-6">
                                                            <v-textarea
                                                                :rules="[v => !!v || 'Campo Mensagem de Opções de Profissionais Obrigatório.']"
                                                                v-model="dados.settings.messageUser"
                                                                label="Mensagem de Profissionais Disponíveis"
                                                                placeholder="Mensagem de Profissionais Disponíveis"
                                                                background-color="white"
                                                                hide-details
                                                                outlined
                                                            />
                                                        </div>
                                                        <div class="col-6">
                                                            <v-textarea
                                                                :rules="[v => !!v || 'Campo Mensagem de Opções de Data Obrigatório.']"
                                                                v-model="dados.settings.messageDay"
                                                                label="Mensagem de Dias de Atendimento Disponíveis"
                                                                placeholder="Mensagem de Dias de Atendimento Disponíveis"
                                                                background-color="white"
                                                                hide-details
                                                                outlined
                                                            />
                                                        </div>
                                                        <div class="col-6">
                                                            <v-textarea
                                                                :rules="[v => !!v || 'Campo Mensagem de Horários Obrigatório.']"
                                                                v-model="dados.settings.messageTime"
                                                                label="Mensagem de Horários de Atendimento Disponíveis"
                                                                placeholder="Mensagem de Horários de Atendimentos Disponíveis"
                                                                background-color="white"
                                                                hide-details
                                                                outlined
                                                            />
                                                        </div>
                                                        <div class="col-6">
                                                            <v-textarea
                                                                :rules="[v => !!v || 'Campo Mensagem de redirecionamento para atendimento Obrigatório']"
                                                                v-model="dados.settings.messageAttendant"
                                                                label="Mensagem de Transferência para Atendente"
                                                                placeholder="Mensagem de Transferência para Atendente"
                                                                background-color="white"
                                                                hide-details
                                                                outlined
                                                            />
                                                        </div>
                                                        <div class="col-6">
                                                            <v-textarea
                                                                :rules="[v => !!v || 'Campo Mensagem de Atendimento Desmarcado Obrigatório.']"
                                                                v-model="dados.settings.unscheduledScheduleMessage"
                                                                label="Mensagem de Atendimento Desmarcado devida a não confirmação."
                                                                placeholder="Mensagem de Atendimento Desmarcado devido a não confirmação."
                                                                background-color="white"
                                                                hide-details
                                                                outlined
                                                            />
                                                        </div>
                                                        <div class="col-6">
                                                            <v-textarea
                                                                :rules="[v => !!v || 'Campo Mensagem Confirmação data Agendamento Obrigatório.']"
                                                                v-model="dados.settings.messageConfirmSchedule"
                                                                label="Mensagem para Confirmar Data Agendamento"
                                                                placeholder="Mensagem para Confirmar Data Agendamento"
                                                                background-color="white"
                                                                hide-details
                                                                outlined
                                                            />
                                                        </div>
                                                        <div class="col-6">
                                                            <v-textarea
                                                                :rules="[v => !!v || 'Campo Mensagem Agendamento Confirmado Obrigatório.']"
                                                                v-model="dados.settings.confirmed"
                                                                label="Mensagem para Informar que Agendamento foi Confirmado"
                                                                placeholder="Mensagem para Informar que Agendamento foi Confirmado"
                                                                background-color="white"
                                                                hide-details
                                                                outlined
                                                            />
                                                        </div>
                                                        <div class="col-6">
                                                            <v-textarea
                                                                :rules="[v => !!v || 'Campo Mensagem Agendamento Desmarcado Obrigatório.']"
                                                                v-model="dados.settings.unchecked"
                                                                label="Mensagem para caso Agendamento seja Desmarcado"
                                                                placeholder="Mensagem para Agendamento seja Desmarcado"
                                                                background-color="white"
                                                                hide-details
                                                                outlined
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                                <div class="col-12">
                                                    <div class="row">
                                                        <div class="col-6">
                                                            <v-btn color="darken-1" text style="text-transform: capitalize; font-size: 16px;" @click="closeAgenda">
                                                                Cancelar
                                                            </v-btn>
                                                            <v-btn @click="step = 2">
                                                                Voltar
                                                            </v-btn>
                                                        </div>
                                                        <div class="col-6">
                                                            <div class="row justify-end">
                                                                <div class="col-12 col-md-3">
                                                                    <v-btn class="primary-button" small @click="proximaPagina">
                                                                        Próximo
                                                                    </v-btn>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </v-form>
                                    </v-stepper-content>
                                    <v-stepper-content step="4">
                                        <v-form ref="form_dados_2">
                                            <div class="row">
                                                <div class="col-12">
                                                    <div class="row">
                                                        <div class="col-6">
                                                            <v-text-field
                                                                :rules="[v => !!v || 'Campo Título Procedimentos Obrigatório']"
                                                                v-model="dados.settings.titleProcedures"
                                                                label="Título para Procedimentos"
                                                                placeholder="Título para Procedimentos"
                                                                background-color="white"
                                                                hide-details
                                                                outlined
                                                            />
                                                        </div>
                                                        <div class="col-6">
                                                            <v-text-field
                                                                :rules="[v => !!v || 'Campo Título Profissionais Obrigatório']"
                                                                v-model="dados.settings.titleUser"
                                                                label="Título para Profissionais"
                                                                placeholder="Título para Profissionais"
                                                                background-color="white"
                                                                hide-details
                                                                outlined
                                                            />
                                                        </div>
                                                        <div class="col-6">
                                                            <v-text-field
                                                                :rules="[v => !!v || 'Campo Título Dias Obrigatório']"
                                                                v-model="dados.settings.titleDay"
                                                                label="Título para Dias"
                                                                placeholder="Título para Dias"
                                                                background-color="white"
                                                                hide-details
                                                                outlined
                                                            />
                                                        </div>
                                                        <div class="col-6">
                                                            <v-text-field
                                                                :rules="[v => !!v || 'Campo Título Horários Obrigatório']"
                                                                v-model="dados.settings.titleTime"
                                                                label="Título para Horários"
                                                                placeholder="Título para Horários"
                                                                background-color="white"
                                                                hide-details
                                                                outlined
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                                <div class="col-12">
                                                    <div class="row">
                                                        <div class="col-6">
                                                            <v-btn color="darken-1" text style="text-transform: capitalize; font-size: 16px; margin-right: 10px;" @click="closeAgenda">
                                                                Cancelar
                                                            </v-btn>
                                                            <v-btn @click="step = 3">
                                                                Voltar
                                                            </v-btn>
                                                        </div>
                                                        <div class="col-6">
                                                            <div class="row justify-end">
                                                                <div class="col-3">
                                                                    <v-btn class="primary-button" small @click="enviarAgenda">
                                                                        Salvar
                                                                    </v-btn>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </v-form>
                                    </v-stepper-content>
                                </v-stepper-items>
                            </v-stepper>
                        </v-container>
                    </v-card-text>
                </v-card>
            </v-dialog>
            <DialogMensagem :visible="dialog_resposta" :mensagem="resposta" @close="dialog_resposta=false"/>
            <Loader v-if="loading"/>
        </div>
    </div>
</template>
<!--funções para trazer e encaminhar os dados das agendas dos fúncionarios-->
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
        name: 'agendas',
        // componente filhos
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
            // variável para mostrar a modal de editar/criar uma agenda
            dialog_agenda: false,
            // variável para mostrar a modal de informação
            dialog_resposta: false,
            // variável para a mensagem de resposta
            resposta: {},
            // variável para o loading
            loading: false,
            // variável para os procedimentos
            procedimentos: [],
            // variável para os funcionarios
            funcionarios: [],
            // variável para as Api's
            apis: [],
            // variável para mudar de página na modal 
            step: 1,
            // variável para criar/editar agenda
            dados: {
                uuid: '',
                name: '',
                api: '',
                company: '',
                status: '',
                has_user_uuid: '',
                settings: {
                    departament_default_id: '',
                    queue_okWhats: '',
                    procedure_uuid: [],
                    user_uuid: [],
                    maxDays: '',
                    messageProcedure: '',
                    avisoAgendamento: '',
                    titleProcedures: '',
                    messageUser: '',
                    titleUser: '',
                    messageDay: '',
                    titleDay: '',
                    messageTime: '',
                    titleTime: '',
                    messageAttendant: '',
                    messageConfirmSchedule: '',
                    confirmed: '',
                    unchecked: '',
                    unscheduledScheduleMessage: '',
                }
            },
            // variável para o cabeçalho da tabela
            headers: [
                {
                    value: 'uuid',
                    text: 'Código',
                    sortable: true,
                },
                {
                    value: 'name',
                    text: 'Nome',
                    sortable: true,
                },
                {
                    value: 'companies.name',
                    text: 'Empresa',
                    sortable: true,
                },
                {
                    value: 'status',
                    text: 'Status',
                    sortable: true,
                },
                {
                    value: 'acoes',
                    text: 'Ações',
                    sortable: false,
                },
            ],
            // variável para os filtros da tabela
            filtros: {
                perPage: 20,
            },
        }),
        // funções deste componente
        methods: {
            // função para puxar as API's do back
            async getApis(){
                // faz um dispatch para uma action no vuex para pegar as api's
                var resp = await store.dispatch('getApis')
                // caso o status seja 200 (deu certo)
                if(resp.status == 200){
                    // atribui os dados à variável local
                    this.apis = resp.data.api
                    // caso o usuário esteja criando uma agenda
                    if(this.dados.uuid == ''){
                        this.dados.settings.maxDays = await resp.data.api[0].settings_exemplo.maxDays
                        this.dados.settings.messageProcedure = await resp.data.api[0].settings_exemplo.messageProcedure
                        this.dados.settings.avisoAgendamento = await resp.data.api[0].settings_exemplo.avisoAgendamento
                        this.dados.settings.titleProcedures = await resp.data.api[0].settings_exemplo.titleProcedures
                        this.dados.settings.titleUser = await resp.data.api[0].settings_exemplo.titleUser
                        this.dados.settings.titleDay = await resp.data.api[0].settings_exemplo.titleDay
                        this.dados.settings.titleTime = await resp.data.api[0].settings_exemplo.titleTime
                        this.dados.settings.messageUser = await resp.data.api[0].settings_exemplo.messageUser
                        this.dados.settings.messageDay = await resp.data.api[0].settings_exemplo.messageDay
                        this.dados.settings.messageTime = await resp.data.api[0].settings_exemplo.messageTime
                        this.dados.settings.messageAttendant = await resp.data.api[0].settings_exemplo.messageAttendant
                        this.dados.settings.unscheduledScheduleMessage = await resp.data.api[0].settings_exemplo.unscheduledScheduleMessage
                        this.dados.settings.messageConfirmSchedule = await resp.data.api[0].settings_exemplo.messageConfirmSchedule
                        this.dados.settings.confirmed = await resp.data.api[0].settings_exemplo.confirmed
                        this.dados.settings.unchecked = await resp.data.api[0].settings_exemplo.unchecked
                    }
                }
            },
            // função para abrir a modal para criar uma nova agenda
            async criarAgenda(){
                // abre a modal
                this.dialog_agenda = true
                // volta a modal para a primeira página
                this.step = 1
                // aciona a função para puxar as API's disponíveis
                this.getApis()
                // caso o usuário esteja editando uma agenda
                if(this.dados.uuid != ''){
                    // atribui o uuid da company
                    this.dados.company = this.dados.company.uuid
                    // puxa os nomes dos procedimentos disponíveis
                    this.getProcedimentosEmpresa()
                }
            },		
            // função para puxar os procedimentos para a modal
            async getProcedimentosEmpresa(){
                // coleta os dados
                let dados = await {
                    // coleta a empresa selecionada
                    company: this.dados.company
                }
                // faz um dispatch para uma action no vuex pegar os procedimentos passando a empresa
                var resp = await store.dispatch('getProcedimentosEmpresa', dados)
                // caso o status seja 200 (deu certo)
                if(resp.status == 200){
                    // atribui os dados à variável local
                    this.procedimentos = await resp.data.procedure 
                }
            },
            // função para puxar um usuário com base nos procedimentos
            async userByProcedure(){
                // coleta os dados
                let dados = await {
                    // coleta os procedimentos selecionados
                    procedures: this.dados.settings.procedure_uuid,
                }
                // faz um dispatch para uma action no vuex para pegar os funcinários passando o procedimento
                var resp = await store.dispatch('userByProcedure', dados)
                // caso a requisição seja concluída com sucesso
                if(resp.status == 200){
                    // atribui os dados vindo do back a variável local
                    this.funcionarios = (resp.data.funcionarios || [])
                }
            },
            // função para enviar a agenda do funcionário
            async enviarAgenda(){
                let resp = {}
                // caso os campos do formulário estejam válidos
                if (this.$refs.form_dados_2.validate()){
                    // coloca o componente como loading
                    this.loading = await true
                    // caso já exista uma agenda 
                    if(this.dados.uuid){
                        // faz uma verificação para prevenir erros
                        if(this.dados.settings.procedure_uuid.length == 0){
                            // limpa os usuários também
                            this.dados.settings.user_uuid = []
                        }
                        // armazena os dados para realizar a atualização
                        let date_update = await {
                            dados_agenda: this.dados,
                            uuid: this.dados.uuid,
                        }
                        // verifica se há dados
                        if(date_update){
                            // caso haja dados faz a verificação do status
                            date_update.dados_agenda.status = date_update.dados_agenda.status == 'Ativo' ? true : false
                            // faz a verificação de se a agenda vai ter usuarios
                            date_update.dados_agenda.has_user_uuid = date_update.dados_agenda.settings.user_uuid.length != 0 ? true : false
                        }
                        // rota para a atualização da agenda
                        resp = await store.dispatch('putAgenda', date_update)
                    }else{
                        // rota para a criação da agenda
                        resp = await store.dispatch('postAgenda', this.dados)
                    }
                    // caso algo tenha dado errado
                    if(resp.status != 200 && resp.status != 201){
                        // atribui o título da mensagem
                        this.resposta.titulo = await 'Algo deu errado!'
                        // atribui o corpo da mensagem
                        this.resposta.mensagem = await resp.data.message || resp.data.error
                        // mostra a mensagem
                        this.dialog_resposta = true
                    }else{
                        // atribui o título da mensagem
                        this.resposta.titulo = await 'Agenda ' + (this.dados.uuid ? 'editado!' : 'cadastrado!')
                        // atribui o corpo da mensagem
                        this.resposta.mensagem = await 'Agenda ' + (this.dados.uuid ? 'editado' : 'cadastrado') + ' com sucesso!'
                        // fecha a modal de criação/edição de agendas
                        this.closeAgenda()
                        // mostra a mensagem
                        this.dialog_resposta = true
                    }
                    // retira o loading do componente
                    this.loading = false
                    // atualiza a tabela
                    this.$refs.tabela.init()
                }
            },
            // função para abrir a modal para editar uma agenda
            async editarAgenda(uuid){
                // coloca o componente como loading
                this.loading = true
                // faz um dispatch para uma action no vuex store para pegar uma agenda passando o uuid
                var resp = await store.dispatch('getAgenda', uuid)
                // caso o status da resposta seja 200 (deu certo)
                if(resp.status == 200){
                    // atribui os dados da agendas vindos do back a variável local
                    this.dados = {
                        uuid: resp.data.agenda[0].uuid,
                        name: resp.data.agenda[0].name,
                        api: resp.data.agenda[0].api_type_uuid,
                        company: resp.data.agenda[0].companies,
                        status: resp.data.agenda[0].status ? 'Ativo' : 'Inativo',
                        settings: resp.data.agenda[0].settings,
                    }
                    // puxa os usuário e procedimentos
                    await this.userByProcedure()
                    // mostra a modal de criar/editar uma agenda
                    this.criarAgenda()
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
            // função para fechar a modal de cadastro/edição de agenda
            async closeAgenda(){
                // fecha a modal
                this.dialog_agenda = false
                // limpa os dados locais da agenda
                this.dados = {
                    uuid: '',
                    name: '',
                    api: '',
                    status: '',
                    settings: { 
                        departament_default_id: '',
                        queue_okWhats: '',
                        procedure_uuid: [],
                        user_uuid: [],
                        maxDays: '',
                        avisoAgendamento: '',
                        messageProcedure: '',
                        titleProcedures: '',
                        titleUser: '',
                        titleDay: '',
                        titleTime: '',
                        messageUser: '',
                        messageDay: '',
                        messageTime: '',
                        messageAttendant: '',
                        unscheduledScheduleMessage: '',
                        messageConfirmSchedule: '',
                        confirmed: '',
                        unchecked: '',
                    }
                }
            },
            // função para mudar de página na modal
            async proximaPagina(){
                if(this.step == 1){
                    if(this.$refs.form_dados.validate()){

                        this.step = 2
                    }
                }else if(this.step == 2){

                    if(this.$refs.form_dados_0.validate()){

                        this.step = 3
                    }
                }else if(this.step == 3){

                    if(this.$refs.form_dados_1.validate()){

                        this.step = 4
                    }
                }
            },
        }
    }
</script>
<!--scss do front-->
<style lang="scss">
    #agenda{
        display: flex;
        max-height: 100%;
        padding: 24px;
        flex-wrap: wrap;
        .tabela-agenda{
            width: 100%;
            background-color: #fff;
            border-radius: 10px;
            .nova-agenda{
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
</style>