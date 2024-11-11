/** importa o axios */
import Axios from 'axios';
/**
 * Define a classe que controla as requisições para o backend
 */
class FinerAPI {
	/**
	 * Construtor da classe
	 */
	constructor() {
		// efetua a inicialização da API
		this.init();
	}
	/**
	 * Inicializa a library de request
	 */
	init = () => {
		// inicializa o axios
		this.current = Axios.create({
			// define o url de base
			baseURL: process.env.VUE_APP_API_BASE_URL,
		});
	};
	/**
	 * Reinicializa a library de request
	 */
	reset = async () => {
		// reinicializa a library de request
		this.init();
		// atualiza na storage o token
		localStorage.setItem('token', '');
		// atualiza na storage o token
		localStorage.setItem('bearer', '');
		// atualiza para não configurado
		this.setup = false;
	};
	/**
	 * Atualiza os valores da autênticação
	 * @param {String} token 
	 */
	setAuthorization = async (token, bearer = true) => {
		// somente se for do tipo string e não estiver vazio
		if(typeof token === 'string' && token !== '') {
			// atualiza o token de autênticação
			this.current.defaults.headers.common['Authorization'] = bearer ? `Bearer ${token}` : token;
		}
		// atualiza na storage o token
		localStorage.setItem('token', token);
		// atualiza na storage o token
		localStorage.setItem('bearer', bearer ? 'true' : 'false');
	};
	/**
	 * Atualiza as headers
	 * @param {String} token 
	 */
	setHeader = async (key, value) => {
		this.current.defaults.headers.common[key] = value;
	};
	/**
	 * limpa as headers
	 * @param {String} token 
	 */
	deleteHeader = async (key) => {
		delete this.current.defaults.headers.common[key];
	};
	/**
	 * Atualiza os valores da autênticação
	 * @param {String} token 
	 */
	getAuthorization = () => {
		// retorna a autênticação
		return this.current.defaults.headers.common['Authorization'];
	};
	/**
	 * Coleta a instancia atual
	 */
	getCurrent = async () => {
		// se já rodou o setup
		if(this.setup) {
			// retorna a instancia atual
			return this.current;
		}
		// senão inicializa e retorna
		const token = localStorage.getItem('token');
		// atualiza na storage o token
		const bearer = localStorage.getItem('bearer');
		// se tiver o token
		if(token) {
			// atualiza o token
			await this.setAuthorization(token, bearer == 'true');
		}
		// atualiza para configurado
		this.setup = true;
		// retorna a instancia
		return this.current;
	};
	/**
	 * Efetua uma request de get
	 */
	get = async (url, params, options) => {
		// inicializa as opções
		const _options = {
			// parametros passado na url
			params: params,
			// demais opções possíveis
			...options,
		};
		// coleta a instancia atual
		const current = await this.getCurrent();
		// retorna uma promise
		return await current.get(url, _options);
	};
	/**
	 * Efetua uma request de post
	 */
	post = async (url, body, options) => {
		// tenta executar a ação
		try {
			// coleta a instancia atual
			const current = await this.getCurrent()
			// retorna uma promise
			const response = await current.post(url, body, options)
			// retorna a resposta
			return response
		// caso de algum erro
		}catch(e){
			// Verifica se o erro é o status 422
			if(e.response && e.response.status === 422){
				// Retorna a resposta do erro para que possa ser tratada fora do catch
				return e.response
			}else{
				// Caso seja outro tipo de erro, chama o handleError
				this.handleError(e)
				throw e
			}
		}
	};
	/**
	 * Efetua uma request de post
	 */
	put = async (url, body, options) => {
		// tenta executar a ação
		try {
			// coleta a instancia atual
			const current = await this.getCurrent()
			// retorna uma promise
			const response = await current.put(url, body, options)
			// retorna a resposta
			return response
		// caso de algum erro
		}catch(e){
			// Verifica se o erro é o status 422
			if(e.response && e.response.status === 422){
				// Retorna a resposta do erro para que possa ser tratada fora do catch
				return e.response
			}else{
				// Caso seja outro tipo de erro, chama o handleError
				this.handleError(e)
				throw e
			}
		}
	}
	/**
	 * Efetua uma request de patch
	 */
	patch = async (url, body, options) => {
		// tenta executar a ação
		try {
			// coleta a instancia atual
			const current = await this.getCurrent();
			// retorna uma promise
			const response = await current.patch(url, body, options);
			// retorna a resposta
			return response;
		// caso de algum erro
		} catch(e) {
			// trata o erro
			this.handleError(e);
			// continua o erro para cima
			throw e;
		}
	};
	/**
	 * Efetua uma request de delete
	 */
	delete = async (url, body, options) => {
		// tenta executar a ação
		try {
			// coleta a instancia atual
			const current = await this.getCurrent();
			// retorna uma promise
			const response = await current.delete(url, body, options);
			// retorna a resposta
			return response;
		// caso de algum erro
		} catch(e) {
			// trata o erro
			this.handleError(e);
			// continua o erro para cima
			throw e;
		}
	};
	/**
	 * Alerta a mensagem de erro padrão
	 */
	handleError = e => {
		// informativo do erro
		console.log(e.response);
		// // coleta a mensagem de resposta
		// if(e.response && e.response.data && e.response.data.message) {
		// 	// notifica
		// 	window.notify(e.response.data.message, { variant: 'error' });
		// // senão alerta o próprio erro
		// } else {
		// 	// notifica
		// 	window.notify(e.message, { variant: 'error' });
		// }
	};
}
const API = new FinerAPI();
/**
 * Atualiza o token de autênticação para todas as request
 * @param {String} token de autênticação
 */
export function setAuthorization(...args) {
	return API.setAuthorization(...args);
}
/** 
 * Efetua um GET
 */
export async function GET(...args) {
	// retorna 
	return await API.get(...args);
}
/** 
 * Efetua um POST
 */
export async function POST(...args) {
	// retorna 
	return await API.post(...args);
}
/** 
 * Efetua um PUT
 */
export async function PUT(...args) {
	// retorna 
	return await API.put(...args);
}
/** 
 * Efetua um PATCH
 */
export async function PATCH(...args) {
	// retorna 
	return await API.put(...args);
}
/** 
 * Efetua um DELETE
 */
export async function DELETE(...args) {
	// retorna 
	return await API.delete(...args);
}
// exporta a API
export default API;