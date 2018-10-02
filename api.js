// import dotaToken from './dotaToken';
import axios from "axios";
import find from "lodash/find";

const BASE_URL = `https://api.opendota.com/api/`;

const getPlayerInfo = (accountId = 91368232) => {
    return axios.get(BASE_URL + `players/` + accountId.toString() + `/matches?`);
};

const getHeroes = () => {
    return axios.get(BASE_URL + `heroes`);
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

// my steam 32 player Id: 91368232