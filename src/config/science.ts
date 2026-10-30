export const scienceElements = [
 {symbol:'H',name:'Hydrogen',number:1,group:1,period:1,column:1},
 {symbol:'C',name:'Carbon',number:6,group:14,period:2,column:2},
 {symbol:'N',name:'Nitrogen',number:7,group:15,period:2,column:3},
 {symbol:'O',name:'Oxygen',number:8,group:16,period:2,column:4},
] as const
export const chemistryStory = [
 {title:'Start with atoms',short:'Atoms',description:'Six symbols: four hydrogen atoms and two oxygen atoms. Here they are pieces of a diagram, not a physical reaction pathway.',duration:2600},
 {title:'See the connections',short:'Bonds',description:'Lines show connectivity in a hydronium ion and a hydroxide ion. A bond represents a shared pair of electrons.',duration:2800},
 {title:'Read the whole species',short:'Species',description:'H₃O⁺ and OH⁻ are ions. Read the atom counts and overall charges together before considering a change.',duration:2800},
 {title:'Follow a proton transfer',short:'Reaction',description:'Hydroxide accepts a proton from hydronium. The net result is two water molecules; atom count and total charge are conserved.',duration:4400},
 {title:'Same particles. Different arrangements.',short:'Matter',description:'Compare a crystalline solid, a liquid and a gas. This separate particle model illustrates arrangement and motion, not another reaction.',duration:5200},
 {title:'Make the idea your own',short:'Understand',description:'Understand the mechanism. Don’t just memorise the reaction.',duration:3200},
] as const
export type MatterState='solid'|'liquid'|'gas'
export const matterDescriptions:Record<MatterState,string>={
 solid:'A crystalline solid: particles vibrate about ordered positions. The small movements do not mean the particles are motionless.',
 liquid:'A liquid: particles stay close together in a disordered arrangement and move past one another.',
 gas:'A gas: particles are much farther apart and move throughout the available space.',
}
export const reactionInventory={reactants:{H:4,O:2,charge:0},products:{H:4,O:2,charge:0}}
