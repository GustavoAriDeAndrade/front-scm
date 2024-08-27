<template>
    <div id="page-calendar">
        <div class="calendario">
            <!--modal para realizar a filtragem do calendário-->
            <v-dialog v-model="dialog_filtro" persistent max-width="500px">
                <v-card>
                    <v-card-title>
                        <span class="headline">Filtrar Calendário</span>
                    </v-card-title>
                    <v-card-text>
                        <v-container>
                            <div class="row">
                                <div class="col-12">
                                    <v-select
                                        :items="procedimentos_filtro"
                                        item-text="name"
                                        item-value="uuid"
                                        v-model="filtro.procedimento"
                                        label="Procedimento"
                                        placeholder="Procedimento"
                                        background-color="white"
                                        hide-details
                                        outlined
                                        @change="funcionariosFiltro()"
                                    />
                                </div>
                                <div class="col-12">
                                    <v-select
                                        :items="funcionarios_filtro"
                                        item-text="name"
                                        item-value="uuid"
                                        v-model="filtro.funcionario"
                                        label="Funcionário"
                                        placeholder="Funcionário"
                                        background-color="white"
                                        hide-details
                                        outlined
                                    />
                                </div>
                            </div>
                        </v-container>
                    </v-card-text>
                    <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn color="darken-1" text style="text-transform: capitalize; font-size: 16px;" @click="dialog_filtro = false">
                            Cancelar
                        </v-btn>
                        <v-btn class="primary-button" small @click="calendar">
                            Filtrar
                        </v-btn>
                    </v-card-actions>
                </v-card>
            </v-dialog>
            <!--modal para realizar um agendamento manual-->
            <v-dialog v-model="dialog_agendamento" persistent max-width="900px">
                <v-card>
                    <v-card-title>
                        <span class="headline">Agendamento Manual</span>
                    </v-card-title>
                    <v-card-text>
                        <v-container>
                            <v-form ref="form_agendamento">
                                <div class="row">
                                    <div class="col-6">
                                        <v-text-field
                                            :rules="[v => !!v || 'Campo Nome Cliente obrigatório']"
                                            v-model="agendar_manual.nome_cliente"
                                            label="Nome do Cliente"
                                            placeholder="Nome do Cliente"
                                            background-color="white"
                                            hide-details
                                            outlined
                                        />
                                    </div>
                                    <div class="col-6">
                                        <v-text-field
                                            :rules="[v => !!v || 'Campo identificação obrigatório']"
                                            v-model="agendar_manual.identifier"
                                            label="Número para Contato"
                                            placeholder="Número para Contato"
                                            v-mask="agendar_manual.identifier.length < 19 ? '+55 (##) ####-####' : '+55 (##) # ####-####'"
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
                                            v-model="agendar_manual.empresa"
                                            label="Empresa"
                                            placeholder="Empresa"
                                            background-color="white"
                                            hide-details
                                            outlined
                                            @change="$store.getters.user.group.key == 'company-admin' || $store.getters.user.group.key == 'company-receptionist' ? usersCompany() : userCompanyProcedure()"
                                        />
                                    </div>
                                    <div v-if="$store.getters.user.group.key == 'company-admin' || $store.getters.user.group.key == 'company-receptionist'" class="col-6">
                                        <v-select
                                            :disabled="this.agendar_manual.empresa == ''"
                                            :rules="[v => !!v || 'Campo Funcionário obrigatório']"
                                            :items="funcionarios"
                                            item-text="name"
                                            item-value="uuid"
                                            v-model="agendar_manual.agent_uuid"
                                            label="Funcionário"
                                            placeholder="Funcionário"
                                            background-color="white"
                                            hide-details
                                            outlined
                                            @change="userCompanyProcedure()"
                                        />
                                    </div>
                                    <div class="col-6">
                                        <v-select
                                            :disabled="this.agendar_manual.empresa == ''"
                                            :rules="[v => !!v || 'Campo Procedimento obrigatório']"
                                            :items="procedimentos"
                                            item-text="name"
                                            item-value="uuid"
                                            v-model="agendar_manual.procedimento"
                                            label="Procedimento"
                                            placeholder="Procedimento"
                                            background-color="white"
                                            hide-details
                                            outlined
                                            @change="clean()"
                                        />
                                    </div>
                                    <div class="col-6">
                                        <v-menu
                                            :disabled="this.agendar_manual.procedimento == ''"
                                            transition="scale-transition"
                                            offset-y
                                            max-width="290px"
                                            min-width="auto"
                                            :close-on-content-click="false"
                                            v-model="menu"
                                        >
                                            <template v-slot:activator="{ on, attrs }">
                                                <v-text-field
                                                    label="Dia"
                                                    persistent-hint
                                                    icon="mdi-calendar"
                                                    v-model="data_agendamento"
                                                    outlined
                                                    hide-details
                                                    readonly
                                                    v-bind="attrs"
                                                    v-on="on"
                                                    @change="clean()"
                                                />
                                            </template>
                                            <v-date-picker
                                                v-model="data_calendario"
                                                no-title
                                                color="#11263C"
                                                locale="pt-br"
                                                @input="menu = false"
                                                @change="clean()"
                                            ></v-date-picker>
                                        </v-menu>
                                    </div>
                                    <div class="col-6">
                                        <v-select
                                            :disabled="this.agendar_manual.procedimento == ''"
                                            :rules="[v => !!v || 'Campo Período obrigatório']"
                                            :items="['Manhã', 'Tarde/Noite']"
                                            v-model="agendar_manual.periodo"
                                            label="Período do dia"
                                            placeholder="Período do dia"
                                            background-color="white"
                                            hide-details
                                            outlined
                                            @change="horariosDisponiveis()"
                                        />
                                    </div>
                                    <div class="col-6">
                                        <v-select
                                            :disabled="this.agendar_manual.periodo == ''"
                                            :rules="[v => !!v || 'Campo Horário obrigatório']"
                                            :items="horarios"
                                            v-model="agendar_manual.horario"
                                            label="Horário Agendamento"
                                            placeholder="Horário Agendamento"
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
                        <v-btn color="darken-1" text style="text-transform: capitalize; font-size: 16px;" @click="closeAgendamento">
                            Cancelar
                        </v-btn>
                        <v-btn class="primary-button" small @click="confirmarAgendamento">
                            Agendar
                        </v-btn>
                    </v-card-actions>
                </v-card>
            </v-dialog>
            <!--modal para realizar um bloqueio do calendário-->
            <v-dialog v-model="dialog_bloqueio" persistent max-width="1000px">
                <v-card>
                    <v-card-title>
                        <span class="headline">Bloqueio Manual</span>
                    </v-card-title>
                    <v-card-text>
                        <v-container>
                            <v-form ref="form_bloqueio">
                                <div class="row">
                                    <div class="col-6">
                                        <v-select
                                            :rules="[v => !!v || 'Campo Empresa obrigatório']"
                                            :items="$store.getters.companies"
                                            item-text="name"
                                            item-value="uuid"
                                            v-model="bloquear_manual.empresa"
                                            label="Empresa"
                                            placeholder="Empresa"
                                            background-color="white"
                                            hide-details
                                            outlined
                                            @change="$store.getters.user.group.key == 'company-admin' || $store.getters.user.group.key == 'company-receptionist' ? usersCompany() : '' "
                                        />
                                    </div>
                                    <div v-if="$store.getters.user.group.key == 'company-admin' || $store.getters.user.group.key == 'company-receptionist'" class="col-6">
                                        <v-select
                                            :disabled="this.bloquear_manual.empresa == ''"
                                            :rules="[v => !!v || 'Campo Funcionário obrigatório']"
                                            :items="funcionarios"
                                            item-text="name"
                                            item-value="uuid"
                                            v-model="bloquear_manual.agent_uuid"
                                            label="Funcionário"
                                            placeholder="Funcionário"
                                            background-color="white"
                                            hide-details
                                            outlined
                                        />
                                    </div>
                                    <h4 v-if="this.bloquear_manual.agent_uuid == ''">*Selecione uma empresa e um funcionário para desbloquear os campos de seleção de dias</h4>
                                    <div v-if="this.bloquear_manual.agent_uuid != ''" class="col-12">
                                        <h3>Dia(s) e Horário(s) que a agenda será bloqueada</h3>
                                        <h5>Verifique seus agendamentos antes de bloquear um horário afim de evitar conflitos de horários!</h5>
                                        <div class="horario" v-for="(horario, i) in bloquear_manual.horarios" :key="i">
                                            <div class="inputs">
                                                <div class="row">
                                                    <div class="col-6">
                                                        <v-text-field
                                                            :rules="[v => !!v || 'Campo De obrigatório']"
                                                            v-model="bloquear_manual.horarios[i].start_date"
                                                            label="Bloquear De (Dica: Clique no ícone de calendário)"
                                                            placeholder="Bloquear De"
                                                            background-color="white"
                                                            hide-details
                                                            outlined
                                                            type="datetime-local"
                                                            @change="bloquear_manual.horarios[i].start_date != '' && bloquear_manual.horarios[i].end_date != '' ? verificaHorario(i) : ''"
                                                        />
                                                    </div>
                                                    <div class="col-6">
                                                        <v-text-field
                                                            :rules="[v => v > bloquear_manual.horarios[i].start_date || 'Data Inicial Maior que data Final', v => !!v || 'Campo Até obrigatório']"
                                                            v-model="bloquear_manual.horarios[i].end_date"
                                                            label="Até (Dica: Clique no ícone de calendário)"
                                                            placeholder="Até"
                                                            background-color="white"
                                                            hide-details
                                                            outlined
                                                            type="datetime-local"
                                                            @change="bloquear_manual.horarios[i].start_date != '' && bloquear_manual.horarios[i].end_date != '' ? verificaHorario(i) : ''"
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                            <v-btn v-if="bloquear_manual.horarios.length > 1" type="button" @click="removeHorario(i)" color="primary" raised class="remover-horario">
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
                        <v-btn color="darken-1" text style="text-transform: capitalize; font-size: 16px;" @click="closeBloqueio">
                            Cancelar
                        </v-btn>
                        <v-btn class="primary-button" small @click="confirmarBloqueio">
                            Salvar
                        </v-btn>
                    </v-card-actions>
                </v-card>
            </v-dialog>
            <!--modal para mostrar os horários que já possuem agendamento marcado-->
            <v-dialog v-model="dialog_horarios" persistent max-width="700px">
                <v-card>
                    <v-card-title>
                        <span class="headline">Data Indisponível</span>
                    </v-card-title>
                    <v-card-text>
                        <p></p>
                        <p class="text-center">Não será possível bloquear a agenda no intervalo selecionado.</p>
                        <v-container>
                            <div class="col-12">
                                <h3 class="text-center">Agendamentos para esse período:</h3>
                                <v-simple-table>
                                    <template v-slot: default>
                                        <thead>
                                            <tr>
                                                <th class="text-left">
                                                    Empresa
                                                </th>
                                                <th class="text-left">
                                                    Procedimento
                                                </th>
                                                <th class="text-left">
                                                    Início Agendamento
                                                </th>
                                                <th class="text-left">
                                                    Fim Agendamento
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr v-for="item in dados_agendamento" :key="item.uuid">
                                                <td>{{item.empresa}}</td>
                                                <td>{{item.procedimento}}</td>
                                                <td>{{item.data_inicio}}</td>
                                                <td>{{item.data_fim}}</td>
                                            </tr>
                                        </tbody>
                                    </template>
                                </v-simple-table>
                            </div>
                        </v-container>
                    </v-card-text>
                    <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn class="primary-button" small @click="closeDadosAgendamento">
                            OK
                        </v-btn>
                    </v-card-actions>
                </v-card>
            </v-dialog>
            <!--modal para mostrar os dado de um agendamento-->
            <v-dialog v-model="dialog_dados" persistent max-width="650px">
                <v-card>
                    <v-card-title>
                        <span class="headline">Dados do Agendamento</span>
                    </v-card-title>
                    <v-card-text>
                        <v-container>
                            <v-form ref="form_dados">
                                <div class="row">
                                    <div class="col-6">
                                        <v-text-field
                                            v-model="infos_agendamento.name_client"
                                            label="Cliente"
                                            placeholder="Cliente"
                                            background-color="white"
                                            outlined
                                            disabled
                                        />
                                    </div>
                                    <div class="col-6">
                                        <v-text-field
                                            v-model="infos_agendamento.identifier"
                                            label="Número Cliente"
                                            placeholder="Número Cliente"
                                            v-mask="infos_agendamento.identifier < 19 ? '+55 (##) ####-####' : '+55 (##) # ####-####'"
                                            background-color="white"
                                            outlined
                                            disabled
                                        />
                                    </div>
                                    <div class="col-6">
                                        <v-text-field
                                            v-model="infos_agendamento.nome_funcionario"
                                            label="Funcionário"
                                            placeholder="Funcionário"
                                            background-color="white"
                                            outlined
                                            disabled
                                        />
                                    </div>
                                    <div class="col-6">
                                        <v-text-field
                                            v-model="infos_agendamento.nome_empresa"
                                            label="Empresa"
                                            placeholder="Empresa"
                                            background-color="white"
                                            outlined
                                            disabled
                                        />
                                    </div>
                                    <div class="col-6">
                                        <v-text-field
                                            v-model="infos_agendamento.nome_procedimento"
                                            label="Procedimento"
                                            placeholder="Procedimento"
                                            background-color="white"
                                            outlined
                                            disabled
                                        />
                                    </div>
                                    <div class="col-6">
                                        <v-text-field
                                            v-model="infos_agendamento.data"
                                            label="Data"
                                            placeholder="Data"
                                            background-color="white"
                                            outlined
                                            disabled
                                        />
                                    </div>
                                    <div class="col-12">
                                        <v-select
                                            :rules="[v => !!v || 'Campo Status obrigatório']"
                                            :items="status_agendamento"
                                            item-text="name"
                                            item-value="uuid"
                                            v-model="infos_agendamento.scheduling_status"
                                            label="Status Agendamento"
                                            placeholder="Status Agendamento"
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
                        <v-btn color="darken-1" text style="text-transform: capitalize; font-size: 16px;" @click="closeEditStatus(3)">
                            Cancelar
                        </v-btn>
                        <v-btn class="warning-button" small @click="dialog_excluir = true">
                            Excluir
                        </v-btn>
                        <v-btn class="primary-button" small @click="confirmarEdit">
                            Salvar
                        </v-btn>
                    </v-card-actions>
                </v-card>
            </v-dialog>
            <!--modal para excluir os dados de um agendamento-->
            <v-dialog v-model="dialog_excluir" persistent max-width="400px">
                <v-card>
                    <v-card-title>
                        <span class="headline">Exclusão de Agendamento</span>
                    </v-card-title>
                    <v-card-text>
                        <p class="text-center">Confirmar exclusão de procedimento agendado para {{infos_agendamento.data}} do calendário de {{infos_agendamento.agent_name}}?</p>
                    </v-card-text>
                    <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn color="darken-1" text style="text-transform: capitalize; font-size: 16px;" @click="closeEditStatus(2)">
                            Cancelar
                        </v-btn>
                        <v-btn class="warning-button" small @click="excluir">
                            Excluir
                        </v-btn>
                    </v-card-actions>
                </v-card>
            </v-dialog>
            <DialogMensagem :visible="dialog_resposta" :mensagem="resposta" @close="dialog_resposta=false"/>
            <Loader v-if="loading"/>
            <!--Calendário em si-->
            <div class="pagina-calendario">
                <FullCalendar :options="calendarOptions"/>
            </div>
        </div>
    </div>
</template>
<!--Funções para trazer e encaminhar os dados dos calendários-->
<script>
    // importa o calendário
   // import '@fullcalendar/core/vdom'
    // importa o calendário
    import FullCalendar from '@fullcalendar/vue'
    // importa a grade de dias do calendário
    import dayGridPlugin from '@fullcalendar/daygrid'
    // importa a grade de horários do calendário
    import timeGridPlugin from '@fullcalendar/timegrid'
    // importa o plugin de interações do calendário
    import interactionPlugin from '@fullcalendar/interaction'
    // importa o plugin de lista pro calendário
    import listPlugin from '@fullcalendar/list'
    // importa o store
    import store from '@/store'
    // importa o componente de DialogMensagem
    import DialogMensagem from '@/components/DialogMensagem.vue'
    // importa o componente de Loader
    import Loader from '@/components/Loader.vue'
	// importa o moment
	import moment from 'moment'

    // exporta o componente
    export default {
        // nome do componente
        name: 'calendarios',
        // componentes filhos
        components: {
            // componente do FullCalendar
            FullCalendar,
            // componente de DialogMensagem
            DialogMensagem,
            // componente de Loader
            Loader,
        },
        // dados do componente
        data() {
            return {
                // opções do calendário
                calendarOptions: {
                    // plugins necessários
                    plugins: [ dayGridPlugin, interactionPlugin, listPlugin, timeGridPlugin ],
                    // modo de exibição inicial
                    initialView: 'dayGridMonth',
                    // evento de click nos procedimentos
                    eventClick: this.eventClick,
                    // botões do calendário
                    customButtons: {
                        edit: {
                            text: 'Filtrar',
                            click: this.buttonFilter
                        },
                        agendar: {
                            text: 'Agendamento Manual',
                            click: this.agendarManual
                        },
                        block: {
                            text: 'Bloqueio Manual',
                            click: this.bloquearManual
                        }
                    },
                    // eventos de cada data
                    events: [],
                    // altera o idioma do calendário
                    locale: 'pt-br',
                    // texto dos botões
                    buttonText: {
                        // mês
                        month: 'Mês',
                        // semana
                        week: 'Semana',
                        // dia
                        day: 'Dia',
                        // listagem
                        list: 'Semana'
                    },
                    // configuração do cabeçalho do calendário
                    headerToolbar: {
                        // botões à esquerda do nosso calendário
                        left: 'prev next edit agendar block',
                        // título do calendário centralizado
                        center: 'title',
                        // botões à direita do nosso calendário
                        right: 'dayGridMonth listWeek timeGridDay'
                    },
                    // destaca o dia selecionado pelo usuário
                    selectable: true
                },
                // variável para mostrar a modal de informação
                dialog_resposta: false,
                // variável para mostrar a modal de agendamento manual
                dialog_agendamento: false,
                // variável para mostrar a modal de bloqueio manual
                dialog_bloqueio: false,
                // variável para mostrar a modal com os agendamentos já feitos
                dialog_horarios: false,
                // variável para mostrar a modal de filtro do calendário
                dialog_filtro: false,
                // variável para mostrar a modal de exclusão de um agendamento
                dialog_excluir: false,
                // variável para a modal de ações do agendamento
                dialog_dados: false,
                // variável para mostrar o calendário para seleção do dia
                menu: false,
                // variável para armazenar a data para o agendamento manual
                data_calendario: new Date().toISOString().substr(0, 10),
                // variável para a mensagem de resposta
                resposta: {},
                // variável para o loading
                loading: false,
                // variável para armazenar os procedimentos disponíveis
                procedimentos: [],
                // variável para armazenar os horários disponíveis
                horarios: [],
                // variável para armazenar os funcionários disponíveis
                funcionarios: [],
                // variável para armazenar os procedimentos no filtro
                procedimentos_filtro: [],
                // função para armazenar os funcionários no filtro
                funcionarios_filtro: [],
                // variável para armazenar os status de agendamento
                status_agendamento: [],
                // variável para os dados do agendamento
                infos_agendamento: {
                    uuid: '',
                    nome_funcionario: '',
                    uuid_funcionario: '',
                    nome_empresa: '',
                    uuid_empresa: '',
                    nome_procedimento: '',
                    uuid_procedimento: '',
                    scheduling_status: '',
                    data: '',
                },
                // variável para armazenar os dados do agendamento manual
                agendar_manual: {
                    agent_uuid: '',
                    nome_cliente: '',
                    identifier: '',
                    empresa: '',
                    procedimento: '',
                    periodo: '',
                    horario: '',
                },
                // variável para armazenar os dados do bloqueio manual
                bloquear_manual: {
                    agent_uuid: '',
                    empresa: '',
                    horarios: [{
                        start_date: '',
                        end_date: ''
                    }],
                    bloqueio_valido: false
                },
                // variável para armazenar os dados dos agendamentos
                dados_agendamento: [{
                    uuid: '',
                    empresa: '',
                    procedimento: '',
                    data_inicio: '',
                    data_fim: '',
                }],
                // variável para o filtro
                filtro: {
                    procedimento: '', 
                    funcionario: '',
                }
            }
        },
        computed: {
            data_agendamento(){
                return this.formatDate(this.data_calendario)
            },
        },
        watch: {
            '$store.getters.company_uuid': {
                handler(){
                    this.calendar()
                },
            },
        },
        // funções deste componente
        methods: {
            // função de início deste componente
            async init(){
                // chamamos a função
                await this.calendar()
                // puxamos os procedimentos para o filtro
                await this.procedimentosFiltro()
                // puxamos os funcionários para o filtro
                await this.funcionariosFiltro()
            },
            // função para abrir a modal de filtro
            async buttonFilter(){
                // chama a função para puxar os funcionários
                this.funcionariosFiltro()
                // chama a função para puxar os procedimentos
                this.procedimentosFiltro()
                // abre a modal
                this.dialog_filtro = true
            },
            // função para abrir a modal de agendamento manual
            async agendarManual(){
                // caso seja um atendente
                if(this.$store.getters.user.group.key == 'company-attendant'){
                    // atribuimos o seu uuid diretamente
                    this.agendar_manual.agent_uuid = this.$store.getters.user_uuid
                }
                // limpa a variável
                this.agendar_manual.identifier = ''
                // abre a modal de agendamento manual
                this.dialog_agendamento = true
            },
            // função para abrir a modal de bloqueio manual
            async bloquearManual(){
                // caso seja um atendente
                if(this.$store.getters.user.group.key == 'company-attendant'){
                    // atribuimos o seu uuid diretamente
                    this.bloquear_manual.agent_uuid = this.$store.getters.user_uuid
                }
                // abre a modal de bloqueio manual
                this.dialog_bloqueio = true
            },
            // função para puxar os procedimentos para o filtro
            async procedimentosFiltro(){
                // limpa a variável inicialmente
                this.procedimentos_filtro = []
                // limpa a variável para prevenir erros
                this.filtro.procedimento = ''
                // coleta os dados
                let dados = {
                    // coleta a empresa
                    company_uuid: this.$store.getters.company_uuid
                }
                // faz um dispatch para uma action no vuex para pegar os procedimentos
                var resp = await store.dispatch('procedimentosFiltro', dados)
                // caso o status da resposta seja 200 (deu certo)
                if(resp.status == 200){
                    // atribuímos os dados à variável local 
                    this.procedimentos_filtro = await resp.data.procedimentos
                }
            },
            // função para puxar os funcionários para o filtro
            async funcionariosFiltro(){
                // limpa a variável inicialmente
                this.funcionarios_filtro = []
                // limpa a variável para prevenir erros
                this.filtro.funcionario = ''
                // coleta os dados
                let dados = {
                    // coleta o uuid do procedimento
                    procedure_uuid: this.filtro.procedimento,
                    // coleta a empresa
                    company_uuid: this.$store.getters.company_uuid,
                }
                // faz um dispatch para uma action no vuex para pegar os funcionários
                var resp = await store.dispatch('funcionariosFiltro', dados)
                // caso o status seja 200 (deu certo)
                if(resp.status == 200){
                    // atribuímos os dados à variável local
                    this.funcionarios_filtro = await resp.data.funcionarios
                }
            },
            // função para puxar os status para a modal
            async schedulingStatus(){
                // faz um dispatch para uma action no vuex para pegar os status
                var resp = await store.dispatch('schedulingStatus')
                // caso o status seja 200 (deu certo)
                if(resp.status == 200){
                    // atribui os dados à variável local
                    this.status_agendamento = await resp.data.status
                }
            },
            // função para pegar os dados para o calendário do usuário
            async calendar(){
                // coloca o componente como loading
                this.loading = true
                // inicialmente limpa as variáveis
                this.calendarOptions.events = []
                // caso seja um atendente
                if(this.$store.getters.user.group.key == 'company-attendant'){
                    // atribuimos o seu uuid diretamente
                    this.filtro.funcionario = this.$store.getters.user_uuid
                }
                // coleta os dados
                let dados = {
                    // coleta o uuid do funcionário
                    user_uuid: this.filtro.funcionario,
                    // coleta o uuid do procedimento
                    procedure_uuid: this.filtro.procedimento,
                    // coleta a empresa
                    company_uuid: this.$store.getters.company_uuid,
                }
                // faz um dispatch para uma action no vuex para pegar os dados
                var resp = await store.dispatch('schedules', dados)
                // caso o status seja 200 (deu certo)
                if(resp.status == 200){
                    // rodamos um for para atribui os dados
                    for(let i = 0; i < resp.data.calendar.length; i++){
                        // convertemos a string em JSON
                        this.calendarOptions.events.push({
                            // atribuimos o título do procedimento
                            title: resp.data.calendar[i].procedures.name,
                            // atribuímos o início do procedimento
                            start: moment(resp.data.calendar[i].start_date).format('YYYY-MM-DD HH:mm:ss'),
                            // atribuímos o fim do procedimento
                            end: moment(resp.data.calendar[i].end_date).format('YYYY-MM-DD HH:mm:ss'),
                            // atribuímos os dados adicionais
                            data: {
                                uuid: resp.data.calendar[i].uuid,
                                company: resp.data.calendar[i].company,
                                name_client: resp.data.calendar[i].name_client,
                                identifier: resp.data.calendar[i].identifier,
                                procedure: resp.data.calendar[i].procedures,
                                user: resp.data.calendar[i].users,
                                status: resp.data.calendar[i].scheduling_status,
                                start_date: moment(resp.data.calendar[i].start_date).format('YYYY-MM-DD HH:mm:ss'),
                                end_date: moment(resp.data.calendar[i].end_date).format('YYYY-MM-DD HH:mm:ss')
                            }
                        })
                    }
                }
                // fecha a modal
                this.dialog_filtro == true ? this.dialog_filtro = false : ''
                // retira o loading do componente
                this.loading = false
            },
            // função para agendar manualmente um horário
            async confirmarAgendamento(){
                let resp = {}
                // caso os campos do formulário estejam válidos
                if(this.$refs.form_agendamento.validate()){
                    // coloca o componente como loading
                    this.loading = true
                    // coleta os dados do agendamento
                    let dados = await {
                        // coleta o uuid do funcionário
                        agent_uuid: await this.agendar_manual.agent_uuid, 
                        // coleta o nome do cliente
                        name_client: await this.agendar_manual.nome_cliente,
                        // coleta a identificação do cliente (sem formatar)
                        numero_cliente: await this.agendar_manual.identifier,
                        // coleta a identificação do cliente
                        identifier: await this.agendar_manual.identifier.replace(/\D/g, ''),
                        // coleta a empresa do funcionário
                        company_uuid: await this.agendar_manual.empresa,
                        // coleta o procedimento selecionado
                        procedure_uuid: await this.agendar_manual.procedimento,
                        // coleta o dia selecionado
                        dia_selecionado: this.data_agendamento,
                        // coleta o horário selecionado
                        horario_selecionado: await this.agendar_manual.horario,
                    }
                    // rota para a criação do agendamento
                    resp = await store.dispatch('postAgendamento', dados)
                    // caso tenha dado tudo certo
                    if(resp.status == 200 || resp.status == 201){
                        // atribui o título da mensagem
                        this.resposta.titulo = 'Agendado!'
                        // atribui o corpo da menasgem
                        this.resposta.mensagem = 'Agendamento Realizado com Sucesso!'
                        // fecha a modal
                        this.closeAgendamento()
                        // mostra a mensagem 
                        this.dialog_resposta = true
                        // atualiza o calendário
                        this.init()
                    // caso o horário tenha sido ocupado
                    }else if(resp.status == 204){
                        // atribui o título da mensagem
                        this.resposta.titulo = 'Horário ocupado'
                        // atribui o corpo da mensagem
                        this.resposta.mensagem = 'Horário acabou de ser ocupado, tente outro!'
                        // mostra a mensagem
                        this.dialog_resposta = true
                    // caso tenha dado algo errado
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
                }
            },
            // função para realizar um bloqueio manualmente
            async confirmarBloqueio(){
                let resp = {}
                // caso os campos do formulário e os horários estejam válidos
                if(this.$refs.form_bloqueio.validate() && this.bloquear_manual.bloqueio_valido == true){
                    // coloca o componente como loading
                    this.loading = true
                    // coleta os dados do bloqueio
                    let dados = await {
                        // coleta o uuid do funcionário
                        agent_uuid: await this.bloquear_manual.agent_uuid,
                        // coleta o uuid da empresa
                        company_uuid: await this.bloquear_manual.empresa,
                        // coleta a(s) data(s) selecionada(s) pelo funcionário
                        days: await this.bloquear_manual.horarios
                    }
                    // rota para o agendamento do bloqueio
                    resp = await store.dispatch('confirmarBloqueio', dados)
                    // caso algo tenha dado errado
                    if(resp.status == 200 || resp.status == 201){
                        // atribui o título da mensagem
                        this.resposta.titulo = 'Data Bloqueada!'
                        // atribui o corpo da mensagem
                        this.resposta.mensagem = 'Data bloqueada com sucesso!'
                        // fecha a modal de cadastro de bloqueio
                        this.closeBloqueio()
                        // mostra a mensagem
                        this.dialog_resposta = true
                        // atualiza o calendário
                        this.init()
                    }else if(resp.status == 204){
                        // atribui o título da mensagem
                        this.resposta.titulo = 'Horário ocupado'
                        // atribui o corpo da mensagem
                        this.resposta.mensagem = 'Horário acabou de ser ocupado, tente outro!'
                        // mostra a mensagem
                        this.dialog_resposta = true
                    // caso tenha dado algo errado
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
                }
            },
            // função para alterar o status de um agendamento manualmente
            async confirmarEdit(){
                let resp = {}
                // caso os campos do formulário estejam válidos
                if(this.$refs.form_dados.validate()){
                    // coloca o componente como loading
                    this.loading = true
                    // coleta os dados do agendamento
                    let dados = await {
                        // coleta o novo status do agendamento
                        scheduling_status_uuid: this.infos_agendamento.scheduling_status,
                        // coleta a empresa do agendamento
                        company_uuid: this.infos_agendamento.uuid_empresa,
                        // coleta o agent do agendamento
                        agent_uuid: this.infos_agendamento.uuid_funcionario,
                        // coleta o procedimento do agendamento
                        procedure_uuid: this.infos_agendamento.uuid_procedimento
                    }
                    // armazena os dados para realizar a atualização
                    let date_update = await {
                        dados_agendamento: dados,
                        uuid: this.infos_agendamento.uuid
                    }
                    // rota para a atualização dos dados do agendamento
                    resp = await store.dispatch('putScheduling', date_update)
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
                        this.resposta.titulo = 'Agendamento editado!'
                        // atribui o corpo da mensagem
                        this.resposta.mensagem = 'Agendamento editado com sucesso!'
                        // fecha a modal de edição
                        this.closeEditStatus(1)
                        // mostra a mensagem
                        this.dialog_resposta = true
                    }
                    // retira o loading do componente
                    this.loading = false
                }
            },
            // função para excluir um agendamento manualmente
            async excluir(){
                let resp = {}
                // coloca o componente como loading
                this.loading = true
                // armazena os dados para realizar a atualização
                let date_delete = await {
                    uuid: this.infos_agendamento.uuid
                }
                // rota para a exclusão dos dados do agendamento
                resp = await store.dispatch('deleteScheduling', date_delete)
                // caso algo tenha dado errado
                if(resp.status != 200 && resp.status != 201){
                    // atribui o título da mensagem
                    this.resposta.titulo = 'Ago deu errado!'
                    // atribui o corpo da mensagem
                    this.resposta.mensagem = await resp.data.message || resp.data.error
                    // mostra a mensagem
                    this.dialog_resposta = true
                // caso tenha tudo certo
                }else{
                    // atribui o título da mensagem
                    this.resposta.titulo = 'Agendamento excluído!'
                    // atribui o corpo da mensagem
                    this.resposta.mensagem = 'Agendamento excluído com sucesso!'
                    // fecha a modal de exclusão 
                    this.closeEditStatus(2)
                    // mostra a mensagem
                    this.dialog_resposta = true
                }
                // retira o loading do componente
                this.loading = false
            },
            // função para verificar se o horário escolhido para bloqueio é válido
            async verificaHorario(i){
                // coloca o componente como loading
                this.loading = true
                // coleta os dados
                let dados = {
                    // coleta o uuid do atendente_uuid
                    agent_uuid: this.bloquear_manual.agent_uuid,
                    // coleta a data inicial do bloqueio
                    data_inicial: moment(this.bloquear_manual.horarios[i].start_date).format('YYYY-MM-DD HH:mm:ss'),
                    // coleta a data final do bloqueio
                    data_final: moment(this.bloquear_manual.horarios[i].end_date).format('YYYY-MM-DD HH:mm:ss')
                }
                // faz um dispatch para uma action no vuex para verificar os horários
                var resp = await store.dispatch('verificaHorario', dados)
                // caso o status da resposta seja 200 (já possui horários para esse dia)
                if(resp.status == 200){
                    // faz as atribuições
                    for(let j = 0; j < resp.data.horarios.length; j++){
                        if(this.dados_agendamento[j] == undefined){
                            this.dados_agendamento[j] = {
                            }
                        }
                        this.dados_agendamento[j].uuid = resp.data.horarios[j].uuid
                        this.dados_agendamento[j].empresa = resp.data.horarios[j].company.name
                        this.dados_agendamento[j].procedimento = resp.data.horarios[j].procedures.name
                        this.dados_agendamento[j].data_inicio = moment(resp.data.horarios[j].start_date).format('DD/MM/YYYY HH:mm')
                        this.dados_agendamento[j].data_fim = moment(resp.data.horarios[j].end_date).format('DD/MM/YYYY HH:mm')
                    }
                    // não permite o dia para bloqueio
                    this.bloquear_manual.bloqueio_valido = false
                    // limpa o campo Até
                    this.bloquear_manual.horarios[i].end_date = ''
                    // mostra a modal para vizualição das informações
                    this.dialog_horarios = true
                // caso o status seja 204 (dia está livre para bloqueio)
                }else if(resp.status == 204){
                    // permite o bloqueio para o dia
                    this.bloquear_manual.bloqueio_valido = true
                // caso tenha dado algum erro no carregamento dos dados
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
            // função para coletar os procedimentos de um funcionário com base na empresa
            async userCompanyProcedure(){
                // coloca o componente como loading
                this.loading = true
                // limpa os campos
                this.agendar_manual.procedimento = ''
                this.agendar_manual.periodo = ''
                this.procedimentos = []
                this.horarios = []
                // coleta os dados
                let dados = {
                    // coleta o uuid do atendente
                    agent_uuid: this.agendar_manual.agent_uuid, 
                    // coleta a empresa selecionada
                    company: this.agendar_manual.empresa
                }
                // faz um dispatch para uma action no vuex para pegar os procedimentos passando os dados
                var resp = await store.dispatch('userCompanyProcedure', dados)
                // caso o status da resposta seja 200 (deu certo)
                if(resp.status == 200){
                    // atribui os dados à variável local
                    for(let i = 0; i < resp.data.procedimentos.length; i++){
                        this.procedimentos.push(resp.data.procedimentos[i].procedure)
                    }
                }
                // retira o loading do componente
                this.loading = false
            },
            // função para coletar os horários disponíveis para agendamento
            async horariosDisponiveis(){
                // coloca o componente como loading
                this.loading = true
                // coleta os dados
                let dados = {
                    // coleta o uuid do atendente
                    agent_uuid: this.agendar_manual.agent_uuid,
                    // coleta a empresa selecionada
                    company: this.agendar_manual.empresa,
                    // coleta o procedimento selecionado
                    procedure: this.agendar_manual.procedimento,
                    // coleta o período do dia selecionado
                    periodo: this.agendar_manual.periodo,
                    // coleta o dia selecionado
                    day: this.data_agendamento
                }
                // verificação do período selecionado
                if(dados.periodo){
                    // atribui o value correto
                    dados.periodo = dados.periodo == 'Manhã' ? 'MANHA' : 'TARDE'
                }
                // faz um dispatch para uma action no vuex para pegar os horários passando os dados
                var resp = await store.dispatch('horariosDisponiveis', dados)
                // caso o status da resposta seja 200 (deu certo)
                if(resp.status == 200){
                    // atribui os dados à variável local
                    this.horarios = resp.data.horarios
                }
                // retira o loading do componente
                this.loading = false
            },
            // função para pegar os funcionários de uma empresa
            async usersCompany(){
                // coloca o componente como loading
                this.loading = true
                // limpa os campos
                this.agendar_manual.agent_uuid = ''
                this.agendar_manual.procedimento = ''
                this.agendar_manual.periodo = ''
                this.procedimentos = []
                this.horarios = []
                this.funcionarios = []
                // faz um dispatch para uma action no vuex para pegar os funcionários passando a empresa
                var resp = await store.dispatch('usersCompany', this.agendar_manual.empresa ? this.agendar_manual.empresa : this.bloquear_manual.empresa)
                // caso a requisição seja concluída com sucesso
                if(resp.status == 200){
                    // limpa inicialmente a variável
                    this.funcionarios = []
                    // atribui os dados vindos do back à variável local
                    this.funcionarios = await resp.data.funcionarios
                }
                // retira o loading do componente
                this.loading = false
            },
            // função para abrir campos extras de adição de dias da semana
            addHorario(){
                this.bloquear_manual.horarios.push({
                    start_date: '',
                    end_date: '',
                })
            },
            // função para remover campos extras de dias da semana
            removeHorario(index){
                if(index > -1){
                    this.bloquear_manual.horarios.splice(index, 1)
                }
            },
            // função que roda quando é fechada a modal para agendamento manual
            closeAgendamento(){
                // fecha a modal
                this.dialog_agendamento = false
                // limpa os dados locais do agendamento
                this.agendar_manual = {
                    agent_uuid: '',
                    nome_cliente: '',
                    identifier: '',
                    empresa: '',
                    procedimento: '',
                    periodo: '',
                    horario: '',
                }
                // limpa a data
                this.data_calendario = new Date().toISOString().substr(0, 10)
            },
            // função que roda quando é fechada a modal de bloqueio manual
            closeBloqueio(){
                // fecha a modal
                this.dialog_bloqueio = false
                // limpa os dados locais do bloqueio
                this.bloquear_manual = {
                    agent_uuid: '',
                    empresa: '',
                    horarios: [{
                        start_date: '',
                        end_date: ''
                    }]
                }
                // limpa a data
                this.bloqueio_calendario = new Date().toISOString().substr(0, 10)
            },
            // função que roda qunado é fechada a modal com os agendamentos já marcados
            closeDadosAgendamento(){
                // fecha a modal
                this.dialog_horarios = false
                // limpa os dados locais
                this.dados_agendamento = [{
                    uuid: '',
                    empresa: '',
                    procedimento: '',
                    data_inicio: '',
                    data_fim: '',
                }]
            },
            // função que roda quando é fechada a modal de edição manual do status
            async closeEditStatus(modal){
                // fecha a modal
                if(modal == 1 || modal == 3){
                    this.dialog_dados = false
                }else{
                    this.dialog_excluir = false
                    this.dialog_dados = false
                }
                // limpa os dados locais
                this.infos_agendamento = {
                    uuid: '',
                    nome_funcionario: '',
                    uuid_funcionario: '',
                    nome_empresa: '',
                    uuid_empresa: '',
                    nome_procedimento: '',
                    uuid_procedimento: '',
                    scheduling_status: '',
                    data: '',
                }
                // recarrega o calendário
                modal != 3 ? this.init() : ''
            },
            // função para limpar o período afim de evitar erros
            async clean(){
                // limpa o campo
                this.agendar_manual.periodo = ''
            },
            // função para formatar a data selecionada pelo usuário
            formatDate(date){
                // caso não haja uma data retorna null 
                if(!date) return null
                // data no formato que desejamos
                const [year, month, day] = date.split('-')
                // retorna a data formatada
                return `${day}/${month}/${year}`
            },
            eventClick: function(info) {
                // atribuimos o uuid do agendamento
                this.infos_agendamento.uuid = info.event._def.extendedProps.data.uuid
                // atribuimos o nome do funcionário
                this.infos_agendamento.nome_funcionario = info.event._def.extendedProps.data.user.name
                // atribuimos o nome do cliente
                this.infos_agendamento.name_client = info.event._def.extendedProps.data.name_client
                // atribuimos o número do cliente
                this.infos_agendamento.identifier = info.event._def.extendedProps.data.identifier
                // atribuimos o uuid do funcionário
                this.infos_agendamento.uuid_funcionario = info.event._def.extendedProps.data.user.uuid
                // atribuimos o nome da empresa
                this.infos_agendamento.nome_empresa = info.event._def.extendedProps.data.company.name
                // atribuimos o uuid da empresa
                this.infos_agendamento.uuid_empresa = info.event._def.extendedProps.data.company.uuid
                // atribuimos o nome do procedimento
                this.infos_agendamento.nome_procedimento = info.event._def.extendedProps.data.procedure.name
                // atribuimos o uuid do procedimento
                this.infos_agendamento.uuid_procedimento = info.event._def.extendedProps.data.procedure.uuid
                // atribuímos o status do procedimento 
                this.infos_agendamento.scheduling_status = info.event._def.extendedProps.data.status
                // vericação da data
                if(moment(info.event._def.extendedProps.data.start_date).format('YYYY-MM-DD') == moment(info.event._def.extendedProps.data.end_date).format('YYYY-MM-DD')){
                    // caso o início e fim do procedimento seja no mesmo dia
                    this.infos_agendamento.data = moment(info.event._def.extendedProps.data.start_date).format('DD/MM HH:mm') + ' - ' + moment(info.event._def.extendedProps.data.end_date).format('HH:mm')
                }else{
                    // caso o início e o fim do procedimento seja em dias diferentes
                    this.infos_agendamento.data = moment(info.event._def.extendedProps.data.start_date).format('DD/MM HH:mm') + ' Até ' + moment(info.event._def.extendedProps.data.end_date).format('DD/MM HH:mm')
                }
                // chama a função com os status de agendamento
                this.schedulingStatus()
                // abre a modal
                this.dialog_dados = true
            },
            // função para atualização automática dos dados do calendário a cada dois minutos e meio
            refresh: function(){
                // atualiza os dados
                this.calendar()
            }
        },
        async mounted(){
            this.init()
            setInterval(this.refresh, 150000)
        }
    }
</script>

<style lang="scss">
    #page-calendar{
        display: flex;
        max-height: 100%;
        padding: 24px;
        flex-wrap: wrap;
        .calendario{
            background-color: #fff;
            border-radius: 10px;
            width: 100%;
            
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
			margin-left: 24px;
		}
	}
    .pagina-calendario{
        margin-top: 15px;
        width: 100%;
        height: 50%;
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