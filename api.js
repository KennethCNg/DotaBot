// import dotaToken from './dotaToken';
import axios from "axios";
import find from "lodash/find";
import {
    giphyToken
} from "./giphyToken";

const GIPHY_BASE_URL = `https://api.giphy.com/v1/gifs/translate?s=`;
const DOTA_BASE_URL = `https://api.opendota.com/api/`;
let url;

const getPlayerInfo = (accountId = 91368232) => {
    return axios.get(DOTA_BASE_URL + `players/` + accountId.toString() + `/matches?`);
};

const getHeroes = () => {
    return axios.get(DOTA_BASE_URL + `heroes`);
};

export const fetchPlayerLastMatchStats = accountId => {
    return axios.all([getPlayerInfo(accountId), getHeroes()]).then(
        axios.spread((matches, heroes) => {
            const lastMatch = matches.data[0];
            const heroName = find(
                heroes.data,
                heroObj => heroObj.id === lastMatch.hero_id
            ).localized_name;

            return `In your last match you played ${heroName}. You had ${
        lastMatch.kills
      } kills, ${lastMatch.deaths} deaths, and ${lastMatch.assists} assists.`;
        })
    );
};

export const fetchGif = queryTerm => {
    url = GIPHY_BASE_URL + queryTerm + `&api_key=${giphyToken}` + `&limit=5`;
    return axios.get(url);

}

export const fetchHoroscope = sign => {
    url = `http://horoscope-api.herokuapp.com/horoscope/today/${sign}`
    return axios.get(url);
}

// my steam 32 player Id: 91368232