// importa o axios para fazer as requisições para o back
import axios from 'axios'
import router from '@/router'

const url = process.env.VUE_APP_API_BASE_URL

const Request = async ({route, method = 'GET', body = null,headers = {}}) => {
    
    var token = await localStorage.getItem('token')
    var resp = null

    var params = await {
        url: url + route,
        method: method,
        headers: headers,
        maxContentLength: Infinity,
        maxBodyLength: Infinity,
    }

    if (method != 'GET'){
        params.data = await body
    }
    
    if(token != ''){
        axios.defaults.headers.common['Authorization'] = token
    }else{
        await delete axios.defaults.headers.common['Authorization']
    }
    
    try{
        resp = await axios(params)
    }catch(e){
        resp = e.response
    }

    if(resp.status == 401){
        await router.push('/logout')
    }
    return resp 
}

export default Request