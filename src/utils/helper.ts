import { Hero, Skill } from "./domain";
import localforage from 'localforage';

/* eslint-disable @typescript-eslint/no-unused-vars */
const REGEX_TRANSLATE = /translate:\{([\S\s]+?),\s+\},?/gm;

const REGEX_CH = /character:\{([\S\s]+?),?\s+\},?/gm;

export function regexMatch(key: string, text: string, type = 1) {
    const regex = type === 1 ? REGEX_CH : REGEX_TRANSLATE;
    const name = key + '_' + (type === 1 ? 'character' : 'translate');
    const match = regex.exec(text);
    let result: Record<string, any> = {};
    if (match && match[1]) {
        const origin = match[1];
        let regular = origin
            .replaceAll(/\/\/.*$/gm, '')
            .replaceAll(/\s/g, '')
            .trim();
        if (regular.endsWith(',')) regular = regular.slice(0, -1);
        try {
            // if (key === 'refresh' && type === 2) console.log('===>match\r\n', regular);
            eval(`window.__JSON_${name}={${regular}}`);
            // @ts-expect-error __JSON
            result = window[`__JSON_${name}`];
            // @ts-expect-error __JSON
            window[`__JSON_${name}`] = null;
        } catch (error) {
            console.warn(key, type, error);
            console.error(regular);
            return {};
        }
    } else {
        console.log('===>not-match', key, type)
    }
    return result;

}


export async function simpleRegexMatch(key: string, text: string) {
    const REGEX = /translate:\{(.*?),?\}[\},]/g
    const name = key + '_translate';
    const source = text.replaceAll(/\/\/.*$/gm, '').replaceAll(/\s/gm, '');
    const match = REGEX.exec(source);
    let result: Record<string, any> = {};
    if (match && match[1]) {
        let origin = match[1];
        if (origin.endsWith(',')) origin = origin.slice(0, -1);
        try {
            // if (key === 'refresh' && type === 2) console.log('===>match\r\n', regular);
            eval(`window.__JSON_${name}={${origin}}`);
            // @ts-expect-error __JSON
            result = window[`__JSON_${name}`];
            // @ts-expect-error __JSON
            window[`__JSON_${name}`] = null;
        } catch (error) {
            console.warn(key, error);
            console.error(origin);
            return {};
        }
    } else {
        console.log('===>not-match', key)
    }
    return result;
}

async function combineMap(fileName: string = 'shenhua') {
    const dictionary: Record<string, string> = await localforage.getItem(`dict_${fileName}`);
    if (fileName !== 'shenhua') {
        const current = await localforage.getItem(`dict_shenhua`);
        Object.assign(dictionary, current)
    }
    if (fileName !== 'standard') {
        const current = await localforage.getItem(`dict_standard`);
        Object.assign(dictionary, current)
    }
    if (fileName !== 'old') {
        const current = await localforage.getItem(`dict_old`);
        Object.assign(dictionary, current)
    }
    return dictionary;
}

async function translate(hero: Hero, skills: string[]) {
    const { from, key } = hero;
    const dictionary: Record<string, string> = await combineMap(from);
    hero.name = dictionary[key];
    hero.skills = skills.map((skillName: string) => {
        const name = dictionary[skillName];
        const desc = dictionary[`${skillName}_info`];
        return { key: skillName, name, desc } as Skill;
    });
}

export async function resolveHeros(fileName: string, heroMap: Record<string, any[]>) {
    const characters: Array<Hero> = [];
    Object.entries(heroMap).forEach(async ([key, array]) => {
        // ['female', 'wu', 3, Array(2)]
        const [gender, nation, hp, skills]: any = array;
        const hero: Hero = { key, gender, nation, hp, from: fileName };
        await translate(hero, skills);
        characters.push(hero);
    });
    return characters;
}

