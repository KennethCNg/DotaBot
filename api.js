// import dotaToken from './dotaToken';
import axios from "axios";
import find from "lodash/find";

const BASE_URL = `https://api.opendota.com/api/`;

const getPlayerInfo = (accountId = 91368232) => {
    return axios.get(BASE_URL + `players/` + accountId.toString() + `/recentMatches`);
};

const getHeroes = () => {
    return axios.get(BASE_URL + `heroes`);
};

export const fetchPlayerLastMatchStats = accountId => {
    return axios.all([getPlayerInfo(accountId), getHeroes()]).then(
        axios.spread((matches, heroes) => {
            /* matches.data is an array of the players matches 
            heroes.data is an array of heroes */
            if (matches.data.length === 0) {
                return `You have no registered matches`;
            }
            const lastMatch = matches.data[0];
            console.log(lastMatch);
            const heroName = find(
                heroes.data,
                heroObj => heroObj.id === lastMatch.hero_id
            ).localized_name;

            return `In match #${lastMatch.match_id} ,you played ${heroName}. You had ${lastMatch.kills} kills, ${lastMatch.deaths} deaths, and ${lastMatch.assists} assists. Find out more about the match by typing in !dotamatch [match_id]. `;
        })
    );
};

// my steam 32 player Id: 91368232