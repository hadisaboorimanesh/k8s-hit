import axios from '../api/axios'
import useAuth from "./useAuth.js";

const useRefreshToken = () => {
    const {setAuth} = useAuth();

    const refresh = async () => {
        const response = await axios.post("/token");
        setAuth(prev => {
            return {...prev, accessToken: response.data.access_token}
        })
        return response.data.access_token;
    }
    return refresh;
}

export default useRefreshToken;