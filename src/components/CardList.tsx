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
        <li key={i} className="mt-2 rd-2 bg-[wheat] p-1 lh-normal c-#333" title={skillKey}>
          <span className="b-1 b-#666 rd-r-full b-solid bg-gray-200 px-1 fw-bold">{name}</span>
          &nbsp;
          <span>{desc}</span>
        </li>
      )
    })
  };
  const useCDN=localStorage.getItem('useCDN') === '1';
  const renderHeros = () => {
    return heros.map((hero: any, i: number) => {
      const { from, gender, hp, key, name, pinyin, nation, skills = [] } = hero;

      const heroUrl = (useCDN?CDN_IMG_PREFIX:IMG_PREFIX) + key + '.jpg';
      let bColor="";
      switch(nation){
        case NationEnum.wei:
          bColor='b-blue-300';
          break;
        case NationEnum.shu:
          bColor='b-red-300';
          break;
        case NationEnum.wu:
          bColor='b-green-300';
          break;
        case NationEnum.qun:
          bColor='b-yellow-300';
          break;
        case NationEnum.jin:
          bColor='b-purple-300';
          break;
        default: break;
      }
      // classList.push(bColor);
      const imgCls=["mt-3 h-38 w-30 b-2 b-groove bg-cover shadow-md rd-2"];
      imgCls.push(bColor);
      return (
        <div key={i} className="mx-3 box-border flex flex-row b-1 b-#ccc rd-2 b-solid bg-transparent px-3 py-1 shadow-xl">
          <div className="min-w-32 flex flex-col">
            <img className={imgCls.join(' ')} src={heroUrl} alt={key} ></img>
            {key}
          </div>
          <div className="p-3 text-3">
            <div className="flex justify-between fw-bold">
              <span className="text-14px">{name || pinyin}</span>
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
    <div className="h-full max-w-160 w-full flex flex-col gap-4">
      <div className="mx-4 p-2">总数：{heros.length}</div>
      {renderHeros()}
    </div>
  )
}

export default CardList;