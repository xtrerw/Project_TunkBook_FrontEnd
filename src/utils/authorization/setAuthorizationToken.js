import axios from "axios";
//configura token si login con exitos
const setAuthorizationToken=(token)=>{
    if (token) {
        //si login con exito
        axios.defaults.headers.common['Authorization']=token
    }else{
        //si login con fallo,quita tokn
        delete axios.defaults.headers.common['Authorization']
    }
}

export default setAuthorizationToken;