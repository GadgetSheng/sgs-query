import React from 'react';
import { IMG_PREFIX } from '../utils/config';
import { Skill } from '../utils/domain';

function Card(props: any) {
    const { hero } = props;
    // console.log('Card', hero); //需要优化
    if (!hero) return <>EMPTY</>;
    const { from, gender, hp, key, name, nation, skills = [] } = hero;
    const heroUrl = IMG_PREFIX + key + '.jpg';
    const renderSkills = () => {
        if (!skills.length) return null;
        return skills.map((skill: Skill) => {
            const { key: skillKey, name, desc } = skill;
            return (<li className="bg-[#aa3a] mt-2" title={skillKey}>
                {name} : {desc}
            </li>)
        })
    };
    return (
        <div className="w-full flex flex-row">
            <img className="w-30 h-38 bg-cover" src={heroUrl}></img>
            <div className="bg-white">
                <p className="text-4" title={from}>{name}</p>
                <div>{gender} {hp} {nation}</div>
                <ul className="xSkills">
                    {renderSkills()}
                </ul>
            </div>
        </div>
    )
}

export default Card;