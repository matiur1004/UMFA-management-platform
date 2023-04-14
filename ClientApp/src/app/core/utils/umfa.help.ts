import { Time } from "@angular/common";


export const formatDateString = (dt: Date): string  => {
    let ret = `${dt.getFullYear()}-${String(dt.getMonth()+1).padStart(2, '0')}-${String(dt.getDate()).padStart(2, '0')}`
    ret += ` ${ String(dt.getHours()).padStart(2, '0') }:${ String(dt.getMinutes()).padStart(2, '0') }`;
    return ret;
}

export const formatTimeString = (tim: Time): string => {
    let ret = `${ String(tim.hours).padStart(2, '0') }:${ String(tim.minutes).padStart(2, '0') }`;
    return ret;
}