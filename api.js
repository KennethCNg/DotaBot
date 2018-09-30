import dotaToken from './dotaToken';
import axios from 'axios';

const fetchPlayerInfo = (accountId = 91368232) => {
    return axios.get(`https://api.opendota.com/api/players/` + accountId.toString() + `/matches?` + `api_key=${dotaToken}`);
};

export default fetchPlayerInfo;

// my steam 32 player Id: 91368232