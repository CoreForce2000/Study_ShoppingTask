// src/atoms.js
import { atom } from 'jotai';

type EntryData = {
    participantId:string;
    gender:"male"|"female"|"";
    group:string;
    age:number;
    handedness:"left"|"right"|"";
    quickMode:boolean;
    shopTime:"10 min"|"15 min"|"";
}

export const entryDataAtom = atom<EntryData>({participantId:"",group:"",gender:"",age:0,handedness:"", quickMode:false, shopTime:""});
