import React from 'react';
import { IMG_PREFIX } from '../utils/config';
import { GenderEnum, NationEnum, Skill } from '../utils/domain';

const GenderMap: any = {
    [GenderEnum.male]: '男',
    [GenderEnum.female]: '女'
}
const NationMap: any = {
    [NationEnum.wei]: '魏',
    [NationEnum.shu]: '蜀',
    [NationEnum.wu]: '吴',
    [NationEnum.qun]: '群',
    [NationEnum.jin]: '晋'
}

function CardList(props: any) {
    const { heros } = props;
    if (!heros || !heros.length) return <>EMPTY</>;
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
    const renderHeros = () => {
        return heros.map((hero: any, i: number) => {
            const { from, gender, hp, key, name, nation, skills = [] } = hero;
            const heroUrl = IMG_PREFIX + key + '.jpg';
            return (
                <div key={i} className="flex flex-row flex-1 b-1 b-solid b-#ccc rd-1 p-3 mx-3">
                    <img className="w-30 h-38 bg-cover" src={heroUrl}></img>
                    <div className="bg-white text-3 p-3">
                        <div className="fw-bold">
                            {name}
                            <i>[from: {from}]</i>
                        </div>
                        <div>{GenderMap[gender]} {hp} {NationMap[nation]}</div>
                        <ul className="xSkills">
                            {renderSkills(skills)}
                        </ul>
                    </div>
                </div>
            )
        });
    }
    return (
        <div className="w-full h-full flex flex-col overflow-y-auto max-w-160 gap-4">
            {renderHeros()}
        </div>
    )
}

export default CardList;