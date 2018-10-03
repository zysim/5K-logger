// TimeArray.js
/**
 * Not to be confused with ./components/Time.js.
 * This file helps me calculate the times that I'm using in that component.
 */
export default function(minutes, seconds, milliseconds) {
    // Create a time object, seal it, tidy it up, and return
    const t = TimeArray(minutes, seconds, milliseconds);
    Object.seal(t);
    return t._get();
}

/**
 * Divides the TimeArray by `dividend`
 */
export function divide(timearray, dividend) {
    if (!dividend) {
        throw new Error("Tried dividing by 0 or NaN");
    }
    const t = TimeArray.call(null, ...timearray);
    t.internal = Math.round(t.internal / dividend);
    return t._get();
}

function TimeArray(minutes, seconds, milliseconds) {
    return {
        internal: minutes * 60000 + seconds * 1000 + milliseconds,
        /**
         * Prepares the time object to be released into the world
         */
        _get() {
            let ms = 0,
                s = 0,
                m = 0;
            if (this.internal > 999) {
                ms = this.internal % 1000;
                s = ~~(this.internal / 1000);
            }
            if (s > 59) {
                // Get minutes first
                m = ~~(s / 60);
                s = s % 60;
            }
            return [m, s, ms];
        }
    };
}
