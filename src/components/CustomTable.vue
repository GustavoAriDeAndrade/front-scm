<template>
        <div class="custom-table">
                <div class="row table-content">
                        <div v-if="search" class="col-md-7 align-center div-busca">
                                <v-text-field 
                                        type="text"
                                        v-model="busca" 
                                        placeholder="Buscar..."
                                        @change="hendleBusca"
                                />
                                <div class="div-icon">
                                        <v-icon>fas fa-search</v-icon>
                                </div>
                        </div>  
                        <div class="col-md-3 div-paginacao">
                                <p><span>Resultados</span> por página:</p>
                                <v-select 
                                        :items="qnt_por_pagina" 
                                        v-model="perPage"
                                        dense 
                                        solo
                                        @change="hendleBusca"
                                >
                                </v-select>
                        </div>
                        <div class="col-md-2 d-flex justify-end align-center btn-opcoes-headers">
                                <v-btn light class="secondary-button" @click="activeMenuColunas">
                                        Opções
                                </v-btn>
                                <transition name="fade">
                                        <div v-if="menu_colunas_" class="sub-menu-headers">
                                                <span class="span-titulo-submenu">
                                                        Visibilidade das Colunas
                                                </span>
                                                <ul v-for="(option, i) in colums" :key="option.value">
                                                        <li>
                                                                <v-btn class="btn-opcao-coluna" @click="changeColums(i)">    
                                                                        <v-icon v-if="option.display" dark>mdi-check</v-icon>
                                                                        <v-icon v-else dark>mdi-cancel</v-icon>
                                                                        {{option.text}}
                                                                </v-btn>
                                                        </li>
                                                </ul>
                                        </div>
                                </transition>
                        </div>
                        <div class="col-12 tabela_">
                                <v-data-table
                                        :headers="computedHeaders"
                                        :items="dados"
                                        :items-per-page="perPage"
                                        class="elevation-1"
                                        :options.sync="options"
                                        hide-default-footer
                                        :loading="loading"
                                        loading-text="Processando"
                                >
                                        <template v-for="header in colums" v-slot:[`item.${header.value}`]="item">
                                                <div :class="header.value" :key="header.value">
                                                        <slot :name="header.value" v-bind="item">{{item.value}}</slot>       
                                                </div>
                                        </template>

                                </v-data-table>
                        </div>
                        <div v-if="pagination" class="col-12 justify-end d-flex pt-2">
                                <v-pagination v-model="currentPage" :length="rows" @input="handlePagination"/>
                        </div>
                </div>
        </div>
</template>

<script>
        import store from '@/store'

        export default {
                props: ["action", "getter", "headers", "search", "title", "icone", "pagination", "filters"],
                name: "CustomTable",
                data() {
                        return {
                                loading: true,
                                dados: [],
                                options: {},
                                busca: '',
                                order: '',
                                order_by: '',
                                total: 0,
                                currentPage: 1,
                                perPage:  this.filters.perPage || 10,
                                menu_colunas_: false,
                                colums: [],
                                qnt_por_pagina: [10, 50, 100, 1000],
                        }
                },
                methods:{
                        async init(){
                                await this.changeLoading(true)
                                await store.dispatch(
                                        this.action,
                                        this.updateFilters()
                                )
                                this.changeLoading(false)
                        },
                        handlePagination(value) {
                                this.currentPage = value
                                this.init()
                        },
                        async sortingChanged() {
                                this.order = await this.options.sortDesc[0] ? 'desc' : 'asc'
                                this.order_by = await this.options.sortBy[0]
                                this.init();
                        },
                        hendleBusca() {
                                this.init()
                        },
                        changeLoading(value) {
                                this.loading = value
                        },
                        updateFilters(){
                                return {
                                        adicionais: this.filters,
                                        offset: (this.perPage * (this.currentPage - 1)),
                                        limit: this.perPage,
                                        order_column: this.order_by,
                                        order_dir: this.order,
                                        search: this.busca,
                                        page: store.getters.company_id ? this.currentPage : ''
                                }
                        },
                        activeMenuColunas(){
                                this.menu_colunas_ = !this.menu_colunas_
                        },
                        async setHeaders(){
                                let temp_header = []
                                await this.headers.forEach(element => {
                                        temp_header.push({
                                                ...element,
                                                display: true
                                        })
                                });
                                this.colums = temp_header
                        },
                        async changeColums(item){
                                this.colums[item].display = !this.colums[item].display
                        }
                },
                watch: {
                        updateTable () {
                                this.dados = this.getter.dados
                                this.total = this.getter.total
                        },
                        options: {
                                handler () {
                                        this.sortingChanged()
                                },
                                deep: true,
                        },
                        '$store.getters.company_uuid': {
                                handler () {
                                        this.init()
                                },
                        },
                        '$store.getters.workspace_uuid': {
                                handler () {
                                        this.init()
                                },
                        },
                },
                mounted(){
                        this.init()
                        this.setHeaders()
                },
                computed: {
                        rows() {
                                return Math.ceil(this.total/this.perPage)
                        },
                        updateTable () {
                                return this.getter
                        },
                        computedHeaders(){
                                return this.colums.filter(item => item.display)
                        }
                },
        }
</script>

<style lang="scss">
        .custom-table{
                flex: 1;
                padding: 12px;
                background-color: #fff;
                margin-bottom: 30px;
                padding-top: 30px;
                .table-content{
                        flex: 1;
                        .titulo-tabela{
                                display: flex;
                                align-items: center;
                                text-transform: uppercase;
                                h2{
                                        font-style: normal;
                                        font-weight: 500;
                                        font-size: 18px;
                                        line-height: 28px;
                                        color: #11263C;
                                        flex: none;
                                        order: 0;
                                        flex-grow: 0;
                                        margin: 10px 0px;
                                }
                                svg{
                                        margin-left: 10px;
                                        path{
                                                fill: rgba(17, 38, 60, 1);
                                        }
                                }
                        }
                        .btn-opcoes-headers{
                                position: relative;
                                margin-top: -13px;
                                .btn-only-icon{
                                        background-color: rgba(201, 163, 200, 0.87) !important;
                                }
                                .sub-menu-headers{
                                        min-width: 310px;
                                        position: absolute;
                                        top: 80%;
                                        right: 0;
                                        background-color: #fff;
                                        padding: 10px;
                                        box-shadow: 10px 10px 24px -17px rgba(0,0,0,0.75);
                                        flex-wrap: wrap;
                                        display: flex;
                                        flex-direction: column;
                                        z-index: 1;
                                        .btn-exportar{
                                                background-color: rgba(201, 163, 200, 0.87);
                                        }
                                        .span-titulo-submenu{
                                                text-align: center;
                                        }
                                        ul{
                                                list-style: none;
                                                padding: 0;
                                                li{
                                                        margin-bottom: 5px;
                                                        .btn-opcao-coluna{
                                                                box-shadow: none!important;
                                                                width: 100%;
                                                                text-align: left!important;
                                                                padding: 0;
                                                                height: inherit!important;
                                                                span{
                                                                        text-align: left;
                                                                        padding: 5px;
                                                                        justify-content: flex-start;
                                                                        text-transform: capitalize;
                                                                }
                                                        }
                                                }
                                        }
                                        .div-exportar{
                                                display: flex;
                                                flex-wrap: wrap;
                                                flex-direction: column;
                                                margin-bottom: 10px;
                                                .wrapper-btns{
                                                        display: flex;
                                                        flex-wrap: wrap;
                                                        justify-content: space-between;
                                                        align-items: center;
                                                        text-align: center;
                                                        .wrapper-btn{
                                                                width: 25%;
                                                                display: flex;
                                                                flex-wrap: wrap;
                                                                align-items: center;
                                                                justify-content: center;
                                                                .btn-exportar{
                                                                        padding: 10px 15px;
                                                                }
                                                        }
                                                }
                                        }
                                        .div-imprimir{
                                                margin-bottom: 10px;
                                                display: flex;
                                                flex-wrap: wrap;
                                                justify-content: flex-start;
                                                align-items: center;
                                                flex-direction: column;
                                                .btn-exportar{
                                                        padding: 0px 10px;
                                                        width: 100%;
                                                        display: flex;
                                                        flex-wrap: wrap;
                                                        justify-content: flex-start;
                                                        align-items: center;
                                                        margin-bottom: 10px;
                                                        text-transform: capitalize;
                                                }
                                        }
                                        .wrapper-selecionar{
                                                display: flex;
                                                flex-wrap: wrap;
                                                justify-content: center;
                                                align-items: center;
                                                text-align: center;
                                                .btn-selecionar{
                                                        padding: 0;
                                                        width: 50%;
                                                        display: flex;
                                                        flex-wrap: wrap;
                                                        justify-content: center;
                                                        align-items: center;
                                                        text-align: center;
                                                        text-transform: capitalize;
                                                }
                                        }
                                }
                        }
                        .div-paginacao{
                                display: flex;
                                flex-wrap: wrap;
                                align-items: center;
                                padding: 0 15px;
                                p{
                                        font-size: 14px;
                                        margin: 0;
                                        color: #11263C;
                                        span{
                                                font-weight: 600;
                                        }
                                }
                                .v-input{
                                        display: flex;
                                        flex-wrap: wrap;
                                        align-items: center;
                                        max-width: 18%;
                                        margin-left: 10px;
                                        .v-input__slot{
                                                padding: 0 0 0 12px;;
                                        }
                                        .v-text-field__details{
                                                display: none;
                                        }
                                }
                        }
                        .div-busca{
                                padding: 0 15px;
                                position: relative;
                                .v-input{
                                        margin: 0;
                                        padding: 0;
                                        .v-input__slot{
                                                background: #F9F9F9;
                                                border: 1px solid #C8C8C8;
                                                box-sizing: border-box;
                                                border-radius: 30px;
                                                padding: 5px 60px 5px 15px;
                                                margin: 0;
                                                &:before, &:after{
                                                        display: none;
                                                }
                                        }
                                        .v-text-field__details{
                                                display: none;
                                        }
                                }
                                .div-icon{
                                        position: absolute;
                                        display: flex;
                                        justify-content: center;
                                        align-items: center;
                                        background: rgba(155, 115, 153, 0.87);
                                        border: 1px solid #C8C8C8;
                                        border-radius: 0 30px 30px 0 ;
                                        width: 30px;
                                        right: 15px;
                                        top: 0;
                                        height: 94%;
                                        cursor: pointer;
                                        svg, i{
                                                padding: 0 15px;
                                                width: 45px;
                                                margin: 0;
                                                z-index: 1;
                                                color: #fff;
                                        }
                                }
                        }
                        .tabela_{
                                table{
                                        thead{
                                                background-color: #F2F2F2;
                                        }
                                        tr{
                                                transition: all ease .3s;
                                                &:nth-child(even){
                                                        background-color: #F2F2F2 !important;
                                                }
                                                td{
                                                        &:nth-child(3){
                                                                font-weight: 600;
                                                        }
                                                        .status{
                                                                span{
                                                                        display: flex;
                                                                        flex-wrap: wrap;
                                                                        align-items: center;
                                                                        img{
                                                                                padding: 0 5px;
                                                                                width: 35px;
                                                                        }
                                                                }
                                                        }
                                                        .acoes{
                                                                button{
                                                                        padding: 0 10px !important;
                                                                        span{
                                                                                font-size: 12px;
                                                                                svg, i{
                                                                                        margin-right: 5px;
                                                                                }
                                                                        }
                                                                }
                                                        }
                                                        .config_menu, .config_nome{
                                                                display: flex;
                                                                align-items: center;
                                                                justify-content: center;
                                                                img{
                                                                        width: 25px;
                                                                        cursor: pointer;
                                                                }
                                                        }
                                                }
                                                &:hover{
                                                        background-color: #e2e2e2 !important;
                                                }
                                        }
                                }
                        }
                                                        .config_menu, .config_nome{
                                                                display: flex;
                                                                align-items: center;
                                                                justify-content: center;
                                                                img{
                                                                        width: 25px;
                                                                        cursor: pointer;
                                                                }
                                                        }
                                                
                                                &:hover{
                                                        background-color: #e2e2e2 !important;
                                                }
                                        
                                                        .config_menu, .config_nome{
                                                                display: flex;
                                                                align-items: center;
                                                                justify-content: center;
                                                                img{
                                                                        width: 25px;
                                                                        cursor: pointer;
                                                                }
                                                        }
                                                
                                                &:hover{
                                                        background-color: #e2e2e2 !important;
                                                                        }
                                                               
                                                        .config_menu, .config_nome{
                                                                display: flex;
                                                                align-items: center;
                                                                justify-content: center;
                                                                img{
                                                                        width: 25px;
                                                                        cursor: pointer;
                                                                }
                                                        }
                                                
                                                &:hover{
                                                        background-color: #e2e2e2 !important;
                                                                                }
                                                                        
                                                              
                                                        .config_menu, .config_nome{
                                                                display: flex;
                                                                align-items: center;
                                                                justify-content: center;
                                                                img{
                                                                        width: 25px;
                                                                        cursor: pointer;
                                                                }
                                                        }
                                                
                                                &:hover{
                                                        .config_menu, .config_nome{
                                                                display: flex;
                                                                align-items: center;
                                                                justify-content: center;
                                                                img{
                                                                        width: 25px;
                                                                        cursor: pointer;
                                                                }
                                                        }
                                                }
                                                &:hover{
                                                                          
                                                        .config_menu, .config_nome{
                                                                display: flex;
                                                                align-items: center;
                                                                justify-content: center;
                                                                img{
                                                                        width: 25px;
                                                                        cursor: pointer;
                                                                }
                                                        }
                                                        .config_menu, .config_nome{
                                                                display: flex;
                                                                align-items: center;
                                                                justify-content: center;
                                                                img{
                                                                        width: 25px;
                                                                        cursor: pointer;
                                                                                }
                                                                        }
                                                                
                                                        .config_menu, .config_nome{
                                                                display: flex;
                                                                align-items: center;
                                                                justify-content: center;
                                                                img{
                                                                }
                                                        }
                                                        .config_menu, .config_nome{
                                                                display: flex;
                                                                align-items: center;
                                                                justify-content: center;
                                                                img{
                                                                }
                                                        }
                                                        .config_menu, .config_nome{
                                                                display: flex;
                                                                align-items: center;
                                                                justify-content: center;
                                                                img{
                                                                        width: 25px;
                                                                        cursor: pointer;
                                                                }
                                                        }
                                                }
                                                &:hover{
                                                        background-color: #e2e2e2 !important;
                                                }
                                        }
                                }
                        
                
        
        .sem-dados{
                background-color: #fff;
                border-radius: 10px;
                padding: 10px;
                display: flex;
                align-items: center;
                justify-content: center;
                height: 100%;
                h4{
                        font-size: 16px;
                }
        }
</style>