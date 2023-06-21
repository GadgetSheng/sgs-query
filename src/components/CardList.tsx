// import React from 'react';
import { CDN_IMG_PREFIX, IMG_PREFIX } from '../utils/config';
import { GenderMap, NationEnum, NationMap, Skill } from '../utils/domain';



function CardList(props: any) {
  const { heros } = props;
  if (!heros || !heros.length) return <div className="mx-4">EMPTY</div>;
  const renderSkills = (skills: any[]) => {
    if (!skills.length) return null;
    return skills.map((skill: Skill, i) => {
      const { key: skillKey, name, desc } = skill;
      return (
        <li key={i} className="bg-[wheat] c-#333 mt-2" title={skillKey}>
          {name} : {desc}
        </li>
      )
    })
  };
  const useCDN=localStorage.getItem('useCDN') === '1';
  const renderHeros = () => {
    return heros.map((hero: any, i: number) => {
      const { from, gender, hp, key, name, nation, skills = [] } = hero;

      const heroUrl = (useCDN?CDN_IMG_PREFIX:IMG_PREFIX) + key + '.jpg';
      const classList=["flex flex-row flex-1 bg-white box-border b-2 b-solid rd-2 px-3 py-1 mx-3 shadow-xl"];
      switch(nation){
        case NationEnum.wei:
          classList.push('b-blue-400');
          break;
        case NationEnum.shu:
          classList.push('b-red-400');
          break;
        case NationEnum.wu:
          classList.push('b-green-400');
          break;
        case NationEnum.qun:
          classList.push('b-yellow-400');
          break;
        case NationEnum.jin:
            classList.push('b-purple-400');
            break;
        default: break;
      }
      return (
        <div key={i} className={classList.join(' ')}>
          <div className="min-w-30 flex flex-col">
            <img 
              className="w-30 h-38 bg-cover shadow-md mt-5" 
              src={heroUrl} alt={key}
            ></img>
            {key}
          </div>
          <div className="text-3 p-3">
            <div className="fw-bold flex justify-between">
              <span className="text-14px">{name}</span>
              <i>[{from}]</i>
            </div>
            <div>{GenderMap[gender]} <b>{hp}</b> {NationMap[nation]}</div>
            <ul className="xSkills">
              {renderSkills(skills)}
            </ul>
          </div>
        </div>
      )
    });
  }
  return (
    <div className="w-full h-full flex flex-col max-w-160 gap-4">
      <h2>总数：{heros.length}</h2>
      {renderHeros()}
    </div>
  )
}

export default CardList;