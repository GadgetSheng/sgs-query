import { CDN_FILE_PREFIX, FILE_PREFIX, GIT_FILE_LIST, PACKAGE_MAP } from "./config";
import { localforage } from "./store";
import { regexMatch } from './helper';
import { Hero, Skill } from "./domain";

const buildKey = (type: string, key: string) => {
  return `${type}_${key}`;
}

export async function saveFileContext(fileName: string) {
  try {
    let text: string = await localforage.getItem(fileName) || '';
    if (text && text.length) {
      console.log('%s context cached', fileName);
    } else {
      const useCDN=localStorage.getItem('useCDN') === '1';
      const url = (useCDN?CDN_FILE_PREFIX:FILE_PREFIX) + fileName + '.js';
      text = await fetch(url).then(resp => resp.text());
      console.log(fileName, text.length)
    }
    await localforage.setItem(fileName, text);
    localStorage.setItem(fileName, String(text.length));
    // console.log('saveFileContext.%s.done', fileName);
    return true;
  } catch (error) {
    // console.warn('error.code=',error?.code); // 22  QuotaExceededError
    console.error('saveFileContext.error', fileName, error);
    return false;
  }
}

export async function saveDictionary(fileList: string[]) {
  const report: Record<string, any> = {};
  for (const fileName of fileList) {
    const key = buildKey('dict', fileName);
    if (!report[fileName]) report[fileName] = { name: PACKAGE_MAP[fileName] }
    const item: Record<string, string | number> = report[fileName];
    let dictionary = await localforage.getItem(key);
    if (!dictionary) {
      const source: string = await localforage.getItem(fileName) || '';
      dictionary = regexMatch(fileName, source, 1);
      if (Object.keys(dictionary as object).length > 0) {
        await localforage.setItem(key, dictionary);
      }
    } else {
      console.log('%s dictionary cached', key);
    }
    item.dict = Object.keys(dictionary as Record<string, string>).length;
  }
  return report
}

async function combineMap() {
  const map: Record<string, string> = {};
  for (const fileName of GIT_FILE_LIST) {
    const key = buildKey('dict', fileName);
    const dictionary = await localforage.getItem(key);
    Object.assign(map, dictionary);
  }
  // console.log('===combined===')
  // console.log(map);
  // console.log('===combined===')
  return map;
}

async function resolveHeros(fileName: string, dataMap: any, dict: Record<string, string>) {
  const characters: Array<Hero> = [];

  Object.entries(dataMap).forEach(async ([key, array]) => {
    // ['female', 'wu', 3, Array(2)]
    const [gender, nation, hp, skills]: any = array;
    const hero: Hero = { key, gender, nation, hp, from: PACKAGE_MAP[fileName] };
    hero.name = dict[key];
    const [a, b] = key.split('_');
    hero.pinyin = b || a;
    hero.skills = skills.map((skillName: string) => {
      let name = dict[skillName];
      if (!name) {
        name = skillName;
        // console.warn('> cannot translate [name]: %s', skillName);
      }
      const desc = dict[`${skillName}_info`];
      // if (!desc) console.warn('> cannot translate [desc]: %s', skillName);
      return { key: skillName, name, desc } as Skill;
    });
    characters.push(hero);
  });
  return characters;
}

export async function saveHeros(fileList: string[], report: Record<string, any> = {}) {
  const dict: Record<string, string> = await combineMap();
  for (const fileName of fileList) {
    const key = buildKey('heros', fileName);
    if (!report[fileName]) report[fileName] = {}
    const item: Record<string, string | number> = report[fileName];
    let heros: any = await localforage.getItem(key);
    if (!heros) {
      const source: string = await localforage.getItem(fileName) || '';
      const dataMap = regexMatch(fileName, source, 2);
      heros = await resolveHeros(fileName, dataMap, dict);
      await localforage.setItem(key, heros);
    } else {
      console.warn('%s heros cached', key);
    }
    item.heros = (heros as Array<Hero>).length;
  }
  return report
}

export async function initAll() {
  let count = 0;
  // STEP 1: SaveFileContext
  for (const fileName of GIT_FILE_LIST) {
    const done = await saveFileContext(fileName);
    if (done) count++;
  }
  console.log('saveFileContext', count);
  // STEP 2: SaveDictionary
  const report = await saveDictionary(GIT_FILE_LIST);
  // STEP 3: ResloveHeros
  saveHeros(GIT_FILE_LIST, report);
  return report;
}


export async function queryCards(where: string) {
  const result: any = [];
  for (const fileName of GIT_FILE_LIST) {
    const key = buildKey('heros', fileName);
    // console.log(fileName, where);
    const heros: any = await localforage.getItem(key);
    if (heros && heros.length) {
      const hero = heros.find((hero: any) => {
        return hero.key.indexOf(where) >= 0
          || (hero.name && hero.name.indexOf(where) >= 0)
      });
      if (hero) {
        const data = { from: fileName, ...hero };
        result.push(data);
      }
    }
  }
  return result;
}

export async function queryCardsByForm(form: Record<string, string>) {
  const result: Array<Hero> = [];
  const { packages = [], nation = '', pinyin = '' } = form;
  if (nation === '' && pinyin === '') return result;
  const filterByForm = (hero: Hero) => {
    const match1 = nation && hero.nation === nation;
    const match2 = pinyin && (hero.pinyin || '').startsWith(pinyin);
    // console.log('filterByForm %s===%s,%s===%s => %b', hero.nation, nation, hero.pinyin, pinyin);
    if (nation && pinyin) return match1 && match2;
    if (nation && !pinyin) return match1;
    if (pinyin && !nation) return match2;
    return false;
  };
  for (const fileName of packages) {
    const key = buildKey('heros', fileName);
    const heros: any = await localforage.getItem(key) || [];
    if (heros.length) {
      const matches = heros.filter(filterByForm);
      if (matches.length) result.push(...matches);
    }
  }
  return result;
}


export async function simpleTest() {
  // const fileName='old';
  // const text = await localforage.getItem(fileName) || '';
  // const data = regexTest(text);
  // console.log('simpleTest',data);
  const keys = (await localforage.keys()).filter(name => name.startsWith('heros'));
  const report: Record<string, any> = {};
  for (const key of keys) {
    const heros = await localforage.getItem(key);
    report[key] = (heros as Array<Hero>).length;
  }
  return report;
}

export async function queryBySkill(where:string){
  if(!where || where.length<2) return [];
  const query=where.toLowerCase().replaceAll(/\s/g,'');
  const skills:Record<string,string>[]=[];
  for (const fileName of GIT_FILE_LIST) {
    const from=PACKAGE_MAP[fileName];
    const storageKey = buildKey('dict', fileName);
    const dicts: Record<string,string> = await localforage.getItem(storageKey) || {};
    for(const [key,value] of Object.entries(dicts)){
      const id=`${from}<${key}>`;
      if(key.endsWith('_info') && key.startsWith(query)) {
        skills.push({
          name: dicts[key.replace('_info','')], 
          desc: value,
          id,
          
        });
      }
      if(!key.endsWith('_info') && value===query){
        skills.push({ 
          name: value, 
          desc: dicts[`${key}_info`],
          id,
        });
      }
    }
  }
  return skills;
}