// Remember, we're gonna use strict mode in all scripts now!
'use strict';

let testArray = [9, 3, 6, 7, 34, 'err', 67, 5, 111];

let max = testArray[0];
let min = testArray[0];

for (let i = 0; i < testArray.length; i++) {
    const currNum = testArray[i];
    if (typeof currNum !== 'number') continue;

    if (currNum > max) max = currNum;
    if (currNum < min) min = currNum;
}
console.log(max, min);
