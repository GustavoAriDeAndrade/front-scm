<template>
    <div id="funcionarios">
        <div class="tabela-funcionarios">
            <!-- botões para abrir as modais-->
            <div class="col-12 nova-agenda">
                <v-btn class="primary-button" raised @click="dialog_agendas = true">
                    Vincular calendário              
                </v-btn> 
            </div>
            <!--tabela que ira conter as informações gerais de cada funcionario-->
            <CustomTable
                v-if="headers != ''"
                :action="'getFuncionarios'"
                :getter="$store.getters.funcionarios"
                :headers="headers"
                :search="true"
                :title="'Funcionarios'"
                :icone="'fas fa-user-tie'"
                :pagination="true"
                :filters="filtros"
                ref="tabela"
            >
                <template v-slot:procedures="{ item }">
                    <div v-if="item.user.procedures">
                        <span v-for="(procedure, i) in item.user.procedures" :key="i">
                            {{procedure.name}}
                            {{((item.user.procedures.length - 1) > i) ? ', ' : ''}}
                        </span>
                    </div>
                </template>
                <!--botões para ativação das modais presentes na tabela-->
                <template v-slot:calendar="{ item }">
                    <v-btn class="primary-button" raised small @click="editarEscolha(item.user.uuid, item.company.uuid)" :disabled="$store.getters.user_uuid !=  item.user.uuid ? true : false">
                        <i class="far fa-calendar-check"></i>
                    </v-btn>
                </template>
                <template v-slot:acoes="{ item }">
                    <v-btn class="primary-button" raised small @click="editarFuncionario(item.uuid)" :disabled="$store.getters.company_uuid == null || ($store.getters.user.group.key == 'company-attendant' ? ($store.getters.user_uuid !=  item.user.uuid ? true : false) : false) ? true : false">
                        <i class="fas fa-cog"></i>
                        Editar
                    </v-btn>
                </template>               
            </CustomTable>
            <!--modal para o cadastro dos procedimentos, dias e horarios que cada funcionario trabalha-->
            <v-dialog v-model="dialog_funcionario" persistent max-width="735px">
                <v-card>
                    <v-card-title>
                        <span class="headline">Funcionário <v-icon> fas fa-cog</v-icon> </span>
                    </v-card-title>
                    <v-card-text>
                        <v-container>
                            <v-form ref="form_funcionario">
                                <div class="row">
                                    <div class="col-12">
                                        <v-text-field
                                            :rules="[v => !!v || 'Campo Nome obrigatório']"
                                            v-model="funcionario.nome"
                                            label="Funcionário" 
                                            placeholder="Funcionário"
                                            background-color="white"
                                            hide-details
                                            outlined
                                            disabled
                                            prepend-inner-icon="mdi-account"
                                        />
                                    </div>
                                    <div class="col-12">
                                        <v-autocomplete
                                            :rules="[v => !!v || 'Campo Procedimento(s) obrigatório']"
                                            :items="procedimentos"
                                            item-text="name"
                                            item-value="uuid"
                                            v-model="funcionario.procedimento"
                                            label="Procedimento(s)"
                                            placeholder="Procedimento(s)"
                                            background-color="white"
                                            hide-details
                                            outlined
                                            multiple
                                            disabled
                                        />
                                    </div>
                                    <!--div para os dias da semana e horarios do funcionario-->
                                    <div class="col-12">
                                        <h3>Horários de Trabalho</h3>
                                        <div class="horario" v-for="(horario, i) in funcionario.horarios" :key="i">
                                            <div class="inputs">
                                                <div class="row">
                                                    <div class="col-md-4 col-12">
                                                        <v-select
                                                            :rules="[v => (!!v || v == 0) || 'Campo Dia(s) obrigatório']"
                                                            :items="dias_semana"
                                                            v-model="funcionario.horarios[i].weekday"
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
                                                            v-model="funcionario.horarios[i].start_time"
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
                                                                    <v-btn text style="text-transform: capitalize; font-size: 16px;" @click="fechaTimePicker()">
                                                                        Cancelar
                                                                    </v-btn>
                                                                    <v-btn class="primary-button" small @click="saveDe(i, timeDe)">
                                                                        OK
                                                                    </v-btn>
                                                                </v-time-picker>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div class ="col-md-4 col-12">
                                                        <v-text-field
                                                            :rules="[v => !!v || 'Campo Até obrigatório', v => v > funcionario.horarios[i].start_time || 'Campo Maior que TimeDe']"
                                                            v-model="funcionario.horarios[i].end_time"
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
                                            <v-btn v-if="funcionario.horarios.length > 1" type="button" @click="removeHorario(i)" color="primary-button" raised class="remover-horario">
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
                        <v-btn color="darken-1" text style="text-transform: capitalize; font-size: 16px;" @click="closeFuncionario">
                            Cancelar
                        </v-btn>
                        <v-btn class="primary-button" small @click="enviarFuncionario">
                            Salvar
                        </v-btn>
                    </v-card-actions>
                </v-card>
            </v-dialog>
            <!--modal para caso o usuário deseje usar uma agenda externa-->
            <v-dialog v-model="dialog_agendas" persistent max-width="650px">
                <v-card>
                    <v-card-title>
                        <span class="headline"></span>
                    </v-card-title>
                    <v-card-text>
                        <h2 class="text-center">O Calendário Externo</h2>
                        <p></p>
                        <p class="text-center">O OkAgenda oferece a opção de cadastrar um calendário externo caso deseje ter seus agendamentos salvos em mais um calendário.</p>
                        <p class="text-center">Atualmente disponibilizamos conexão com o calendário externo do Google.</p> 
                        <p class="text-center">Caso deseje utilizá-lo clique no botão a baixo e você será redirecionado para fazer login com sua conta Google e terá seus agendamentos salvos no calendário por eles disponibilizado.</p>
                        <p class="text-center">Vale ressaltar que seus agendamentos continuarão sendo salvos no calendário disponibilizado pelo OkAgenda!</p>
                        <p class="text-center">Caso não deseje utilizar o calendário externo clique em cancelar.</p>
                    </v-card-text>
                    <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn color="darken-1" text style="text-transform: capitalize; font-size: 16px;" @click="closeAgenda">
                            Cancelar
                        </v-btn>
                        <v-btn class="primary-button" fab small @click="redirecionarAgenda">
                            <v-icon>
                                fab fa-google-plus-g
                            </v-icon>
                        </v-btn>
                    </v-card-actions>
                </v-card>
            </v-dialog>
            <!--modal para o funcionário escolher qual calendário ele deseja utilizar-->
            <v-dialog v-model="dialog_escolha" persistent max-width="550px">
                <v-card>
                    <v-card-title>
                        <span class="headline">Agenda <v-icon>far fa-calendar-check</v-icon></span>
                    </v-card-title>
                    <v-card-text>
                        <div class="info-usuario">
                            <span class="saudacao-usuario">Olá <b>{{user_first_name}}!</b></span>
                        </div>
                        abaixo estão as agendas que você pode escolher para salvar seus dados no Google Agenda.

                        eles são obtidos a partir do login de sua empresa no mesmo.
                        <v-container>
                            <v-form ref="form_calendar">
                                <div class="row">
                                    <div class="col-12">
                                        <v-select
                                            :rules="[v => !!v || 'Campo calendário obrigatório']"
                                            :items="calendarios"
                                            item-text="name"
                                            item-value="id"
                                            v-model="funcionario.calendario"
                                            lable="Calendário"
                                            placeholder="Calendário"
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
                        <v-btn color="darken-1" text style="text-transform: capitalize; font-size: 16px;" @click="closeEscolha">
                            Cancelar
                        </v-btn>
                        <v-btn class="primary-button" small @click="enviarEscolha">
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
<!--funções para trazer e encaminhar os dados das modais e da tabela-->
<script>
    // importa o store
    import store from '@/store'
    // importa o componente de DialogMensagem
    import DialogMensagem from '@/components/DialogMensagem.vue'
    // importa o componente de Loader
    import Loader from '@/components/Loader.vue'
    // importa o componente de CustomTable
    import CustomTable from '@/components/CustomTable.vue'
    // importa a API para fazer consultas diretamente no back
	import API from '@/plugins/api'

    // exporta o componente
    export default{
        // nome do componente
        name: 'funcionarios',
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
            // variável para mostrar a modal para criar/editar os dados dos funcionarios
            dialog_funcionario: false,
            // variável para mostrar a modal de login na conta google
            dialog_agendas: false,
            // variável para mostrar a modal de informação
            dialog_resposta: false,
            // variável para mostrar a modal timePickerDe
            modal_time_de: false,
            // variável para mostrar a modal de escolha de agenda
            dialog_escolha: false,
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
            // variável para as empresas
            empresas: [],
            // variável para os procedimentos
            procedimentos: [],
            // variável para os calendários
            calendarios: [],
            // variável para armazenar o primeiro nome do usuário
            user_first_name: '',
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
            // variável para criar/editar os dados do funcionário
            funcionario: {
                uuid: '',
                nome: '',
                procedimento: [],
                calendario: '',
                horarios: [{
                    weekday: '',
                    start_time: '',
                    end_time: '',
                }]
            },
            // variável para o cabeçalho da tabela
            headers: [
                {
                    value: 'user.name',
                    text: 'Nome',
                    sortable: true,
                },
                {
                    value: 'procedures',
                    text: 'Procedimento(s)',
                    sortable: true,
                },
                {
                    value: 'company.name',
                    text: 'Empresa',
                    sortable: true,
                },
                {
                    value: 'calendar',
                    text: 'Agenda',
                    sortable: false,
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
            // função para salvar horário inicial do funcionário
            async saveDe(i, time){
                this.funcionario.horarios[i].start_time = await time
                let el = document.getElementById(this.attrDataIrmaoModalToggle)
                el.classList.remove('ativo')
                this.attrDataIrmaoModalToggle.classList.remove('ativo')
            },
            // função para salvar o horário final do funcionário
            async saveAte(i, time){
                this.funcionario.horarios[i].end_time = await time
                let el = document.getElementById(this.attrDataIrmaoModalToggle)
                el.classList.remove('ativo')
                this.attrDataIrmaoModalToggle.classList.remove('ativo')
            },
            // função para puxar os procedimentos para a modal de especialidades
            async getProcedimentos(){
                // faz uma requisição para o back através da API
                const { data, status } = await API.get('procedure?orderBy=created_at&order=asc&_embed=true')
                // caso a requisição seja concluída
                if(status == 200){
                    // atribui os dados à variável local
                    this.procedimentos = data.procedures
                }
            },
            // função para puxar os calendários disponibilizados para cada usuário
            async getCalendarios(funcionario_uuid){
                // coloca o componente como loading
                this.loading = true
                // faz um dispatch para uma action no vuex store para pegar o calendário passando o usuário
                var resp = await store.dispatch('getCalendars', funcionario_uuid)
                // caso o status da resposta seja 200 (deu certo)
                if(resp.status == 200){
                    // chama a função para atribuir o nome do usuário
                    this.setUserFirstName()
                    // atribui as opções de calendário para o funcionário
                    this.calendarios = resp.data.options
                    // abre a modal de escolha para o funcionário
                    this.dialog_escolha = true
                // caso o funcionário não possua agenda vinculada
                }else if(resp.status == 204){
                    // atribui o título da mensagem
                    this.resposta.titulo = 'Sem calendário!'
                    // atribui o corpo da mensagem
                    this.resposta.mensagem = 'Funcionário ainda não vinculou nenhum calendário!'
                    // mostra a mensagem
                    this.dialog_resposta = true
                // caso tenha dado algum erro
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
            // função para salvar a escolha de calendário de cada funcionário
            async enviarEscolha(){
                let resp = {}
                // caso o campo do formulário esteja válido
                if(this.$refs.form_calendar.validate()){
                    // coloca o componente como loading
                    this.loading = await true
                    // coleta os dados do funcionário
                    let dados = await {
                        // coleta a escolha de agenda 
                        calendar_id: await this.funcionario.calendario,
                    }
                    // caso exista um funcionario_uuid
                    if(this.funcionario.uuid){
                        // armazena os dados para realizar a atualização
                        let date_update = await {
                            dados_funcionario: dados,
                            uuid: this.funcionario.uuid
                        }
                        // rota para a atualização dos dados do funcionário
                        resp = await store.dispatch('putEscolha', date_update)
                    }
                    // caso algo tenha dado errado
                    if(resp.status != 200 && resp.status != 201){
                        // atribui o título da mensagem
                        this.resposta.titulo = await 'Algo deu errado!'
                        // atribui o corpo da mensagem
                        this.resposta.mensagem = await resp.data.message || resp.data.error
                        // mostra a mensagem
                        this.dialog_resposta = true
                    // caso tenha dado tudo certo
                    }else{
                        // atribui o título da mensagem
                        this.resposta.titulo = await 'Agenda Adicionada!'
                        // atribui o corpo da mensagem
                        this.resposta.mensagem = await 'Agenda Vinculada ao funcionário com sucesso!'
                        // fecha a modal de escolha
                        this.closeEscolha()
                        // mostra a mensagem
                        this.dialog_resposta = true
                    }
                    // retira o loading do componente
                    this.loading = false
                }
            },
            //função para editar a escolha de agenda do funcionário
            async editarEscolha(funcionario_uuid, company_uuid){
                // coloca o componente como loading
                this.loading = true
                // coleta os dados
                let dados = {
                    // coleta o uuid do funcionário
                    user_uuid: funcionario_uuid,
                    // coleta a empresa do funcionário
                    company_uuid: company_uuid,
                }
                // faz um dispatch para uma action no vuex store para pegar um funcionário passando o uuid
                var resp = await store.dispatch('usersCalendar', dados)
                // caso o status da resposta seja 200 (deu certo)
                if(resp.status == 200){
                    // atribui o company user uuid do funcionário
                    this.funcionario.uuid = await resp.data.calendario.uuid || ''
                    // atribui o calendário do funcionario
                    this.funcionario.calendario = await resp.data.calendario.calendar_id || ''
                }
                // aciona a função para pegar os calendários
                this.getCalendarios(funcionario_uuid)
                // retira o loading do componente
                this.loading = false
            },
            // função pra enviar os dias e horarios de cada funcionário
            async enviarFuncionario() {
                let resp = {}
                // caso os campos do formulário estejam válidos
                if(this.$refs.form_funcionario.validate()){
                    // coloca o componente como loading
                    this.loading = true
                    // coleta os dados do funcionário
                    let dados = await {
                        // coleta o uuid do funcionario
                        funcionario_uuid: await this.funcionario.uuid,
                        // coleta os horarios do funcionário
                        hours: await this.funcionario.horarios,
                    }
                    // rota para a atualização dos horários do funcionario
                    resp = await store.dispatch('postHorario', dados)
                    // caso algo tenha dado errado
                    if(resp.status != 200 && resp.status != 201){
                        // atribui o título da mensagem
                        this.resposta.titulo = await 'Algo deu errado!'
                        // atribui o corpo da mensagem
                        this.resposta.mensagem = await resp.data.message || resp.data.error
                        // mostra a mensagem
                        this.dialog_resposta = true
                    // caso tenha dado tudo certo
                    }else{
                        // atribui o título da mensagem
                        this.resposta.titulo = await 'Dados ' + (this.funcionario.uuid ? 'editados!' : 'cadastrados!')
                        // atribui o corpo da mensagem
                        this.resposta.mensagem = await 'Dados ' + (this.funcionario.uuid ? 'editados' : 'cadastrados') + ' com sucesso!'
                        // fecha a modal de create/edit funcionário
                        this.closeFuncionario()
                        // mostra a mensagem
                        this.dialog_resposta = true
                    }
                    // retira o loading do componente
                    this.loading = false
                }
            },
            // função para coletar um funcionário para editar
            async editarFuncionario(funcionario_uuid){
                // coloca o componente como loading
                this.loading = true
                // faz um dispatch para uma action no vuex store para pegar um funcionário passando o uuid
                var resp = await store.dispatch('getHorario', funcionario_uuid)
                // caso o status da resposta seja 200 (deu certo)
                if(resp.status == 200){
                    // atribui os dados do funcinário vindos do back às variáveis locais
                    this.funcionario.uuid = await resp.data.hours[0].uuid || ''
                    this.funcionario.nome = await resp.data.hours[0].user.name || ''
                    this.funcionario.procedimento = (resp.data.hours[0].user.procedures || []).map(procedure => procedure.uuid)
                    // aciona a função para puxar os procedimentos
                    this.getProcedimentos()
                    // caso exista dados de horários
                    if(resp.data.hours[0].hours){
                        // faz as atribuições
                        for(let i = 0; i < resp.data.hours[0].hours.length; i++){
                            if(this.funcionario.horarios[i] == undefined){
                                this.funcionario.horarios[i] = {
                                }
                            }
                            this.funcionario.horarios[i].weekday = resp.data.hours[0].hours[i].week_day
                            this.funcionario.horarios[i].start_time = resp.data.hours[0].hours[i].from
                            this.funcionario.horarios[i].end_time = resp.data.hours[0].hours[i].to
                        }
                    // caso ainda não exista dados de horários
                    }else{
                        this.funcionario.horarios = [{
                            weekday: '',
                            start_time: '',
                            end_time: '',
                        }]
                    }
                    // mostra a modal para criar/editar um funcionário
                    this.dialog_funcionario = true
                // caso tenha dado algum erro no carregamento dos dados
                }else{
                    // atribui o título da mensagem
                    this.resposta.titulo = await 'Algo deu errado!'
                    // atribui o corpo da mensagem
                    this.resposta.mensagem = await resp.data.message || resp.data.error
                    // mostra a mensagem
                    this.dialog_resposta= true
                }
                // retira o loading do componente
                this.loading = false
                // atualiza a tabela
                this.$refs.tabela.init()
            },
            // função para enviar a escolha de agenda do usuário
            async redirecionarAgenda(){
                // abre a modal de agenda externa
                this.dialog_agendas  = true
                // chama a rota responsável pelo redirecionamento do usuário
                await store.dispatch('redirectUser')
                // fecha a modal responsável pelo redirecionamento do usuário
                this.closeAgenda()
            },
            // função para setar o primeiro nome do usuário
            async setUserFirstName(){
                // faz a verificação dos dados do usuário
                if(this.$store.getters.user){
                    // puxa o nome do usuário
                    var nome = this.$store.getters.user.name
                    // divide o nome completo para pegar o primeiro
                    var first_name = nome.split(' ')
                    // atribui o primeiro nome do usuário
                    this.user_first_name = first_name[0]
                }
            },
            // função para abrir campos extras de adição de dias da semana
            addHorario(){
                this.funcionario.horarios.push({
                    weekday: '',
                    start_time: '',
                    end_time: '',
                })
            },
            // função para remover campos extras de dias da semana
            removeHorario(index){
                if(index > -1){
                    this.funcionario.horarios.splice(index, 1)
                }
            },
            // função que roda quando é fechada a modal para criar/editar um funcionário
            closeFuncionario(){
                // fecha a modal
                this.dialog_funcionario = false
                // limpa os dados locais do funcionario
                this.funcionario = {
                    uuid: '',
                    nome: '',
                    procedimento: '',
                    horarios: [{
                        weekday: '',
                        start_time: '',
                        end_time: '',
                    }]
                }
            },
            // função que roda quando é fechada a modal para adição de agenda externa
            closeAgenda(){
                // fecha a modal
                this.dialog_agendas = false
            },
            // função que roda quando é fechada a modal para escolha de agenda do funcionário
            closeEscolha(){
                // fecha a moda
                this.dialog_escolha = false
                // limpa os dados locais do funcionário
                this.funcionario = {
                    calendario: '',
                }
            },
            // função que roda quando é aberta a modal de timePicker
			chamaTimePicker: function(e){
                let var_el = e.target
                let data_modal_toggle = var_el.getAttribute('data-modalToggle')
                this.attrDataIrmaoModalToggle = data_modal_toggle
                let el_modal = document.getElementById(this.attrDataIrmaoModalToggle)
                el_modal.classList.add('ativo')
            },
            // função que roda quando é fechada a modal de timePicker
            fechaTimePicker(){
                let el = document.getElementById(this.attrDataIrmaoModalToggle)
                el.classList.remove('ativo')
            },
        },
    }
</script>
<!-- scss do front -->
<style lang="scss" scoped>
    #funcionarios{
        display: flex;
        max-height: 100%;
        padding: 24px;
        flex-wrap: wrap;
        .tabela-funcionarios{
            width: 100%;
            background-color: #fff;
            border-radius: 10px;
            .nova-agenda{
                display: flex;
                justify-content: flex-end;
                padding-bottom: 0;
                button{
                    padding: 1 5px !important;
                    i, svg{
                        margin-left: 5px;
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
            margin-left: 13px;
        }
    }
    .info-usuario{
        display: flex;
        flex-wrap: wrap;
        flex-direction: column;
        align-items: flex-start;
        justify-content: start;
        padding-left: 190px;
        .saudacao-usuario{
            font-size: 16px;
            color: rgb(58, 55, 55);
            b{
                font-weight: 700;
            }
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