//获取当前时间
export const timeIncrement = (startTime) => {
    let date = new Date();
    let intervals = date.getTime() - startTime;
    let a = intervals % 1000 / 10;
    let b = intervals % 60000 / 1000;
    let c = intervals % 3600000 / 60000;
    // let d = intervals / 3600000;
    return {
        total: intervals,
        ms: (a < 10) ? ('0' + Math.floor(a)) : (Math.floor(a)),
        s: (b < 10) ? ('0' + Math.floor(b)) : (Math.floor(b)),
        m: (c < 10) ? ('0' + Math.floor(c)) : (Math.floor(c))
    }
}

//打乱数组(不改变原数组)
export const shuffle = arrs => {
    let arr = [...arrs]

    let length = arr.length,
        randomIndex,
        temp;
    while (length) {
        randomIndex = Math.floor(Math.random() * (length--));
        temp = arr[randomIndex];
        arr[randomIndex] = arr[length];
        arr[length] = temp
    }
    return arr;
}
