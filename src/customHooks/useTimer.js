import React, { useEffect, useState } from "react";

export function useTimer(start, refreshTimer) {

    const initial = 60 * 5
    const [count, setCount] = useState(initial);

    useEffect(() => {
        setCount(initial)
        if (start) {
            const secondsLeft = setInterval(() => {
                setCount(c => c - 1);
                if (count == 0) {
                    clearInterval(secondsLeft)
                }
            }, 1000);
            return () => clearInterval(secondsLeft);
        }

    }, [start, refreshTimer]);

    return convertTime(count);
}
function convertTime(sec) {
    var hours = Math.floor(sec / 3600);
    (hours >= 1) ? sec = sec - (hours * 3600) : hours = '00';
    var min = Math.floor(sec / 60);
    (min >= 1) ? sec = sec - (min * 60) : min = '00';
    (sec < 1) ? sec = '00' : void 0;

    (min.toString().length == 1) ? min = '0' + min : void 0;
    (sec.toString().length == 1) ? sec = '0' + sec : void 0;

    return min + ':' + sec;
}