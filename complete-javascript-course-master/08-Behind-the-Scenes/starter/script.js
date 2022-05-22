'use strict';

const testobj = {
    sat : {
        hours: 24,
        day: 1
    },
    sun : {
        hours: 24,
        day: 1
    },
    // mon : {
    //     hours: 24,
    //     day: 1
    // }
}

const {sat, ...others} = testobj;
console.log(sat, others)


