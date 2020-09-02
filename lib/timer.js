'use strict';

/**
 * @class Timer
 * @description Class for times, timers, schedules, astro...
 * @author Mic-M <https://github.com/Mic-M/>
 * @license MIT License
 */
class Timer {

    /**
     * Constructor
     *
     * @param {object} adapter - ioBroker adapter instance object
     */
    constructor(adapter) {
        this.adapter = adapter;
    }

    /**
     * TEST
     */
    testFunc() {
        // Loggen
        this.adapter.log.warn(`[timer.js - testFunc()] - hier sind wir nun.`);
        this.adapter.log.warn(`Aktueller Wert von 'adapter.x.test.test1': '${this.adapter.x.test.test1}'`);
        // Neuen Wert in die Variable
        this.adapter.log.warn(`Jetzt setzen wir neuen Wert in 'adapter.x.test.test1': 'NEUER WERT'`);
        this.adapter.x.test.test1 = `NEUER WERT`;
    }

    /**
     * Stop all timers
     * @param {object} timersObj - object with all timers in format: { timerAbc:{}, timerXyz:{}  }
     *                               where {} is the according timer object set by setTimeout() function.
     */
    stopAllTimers(timersObj) {
        // loop through objects by for...in
        for (const timerType in timersObj) {
            // timerType is e.g. 'motion'
            for (const timerName in timersObj[timerType]) {
                this.adapter.log.debug('Stopping timer: ' + timerName);
                clearTimeout(timersObj[timerType][timerName]);
                timersObj[timerType][timerName] = null;
            }
        }
    }



    /**
     * Get the timestamp of an astro name.
     *
     * @param {string} astroName            Name of sunlight time, like "sunrise", "nauticalDusk", etc.
     * @param {number} [offsetMinutes=0]    Offset in minutes
     * @return {number}                     Timestamp of the astro name
     */
    getAstroNameTs(astroName, offsetMinutes=0) {

        try {
            let ts = this.adapter.x.mSuncalc.getTimes(new Date(), this.adapter.x.latitude, this.adapter.x.longitude)[astroName];
            if (!ts || ts.getTime().toString() === 'NaN') {
                // Fix night / nightEnd per adapter options.
                // In northern areas is no night/nightEnd provided in the Summer.
                // So we use 0:00 for night and 2:00 for night end as fallback.
                if (this.adapter.config.fixNightNightEnd && ['night', 'nightEnd'].includes(astroName) ) {
                    const currDate = new Date();
                    const midnightTs = currDate.setHours(24,0,0,0); // is the future midnight of today, not the one that was at 0:00 today
                    switch (astroName) {
                        case 'night':
                            this.adapter.log.debug(`[getAstroNameTs] No time found for [${astroName}], so we set 00:00 as fallback per adapter config.`);
                            return midnightTs; // midnight - 00:00
                        case 'nightEnd':
                            this.adapter.log.debug(`[getAstroNameTs] No time found for [${astroName}], so we set 02:00 as fallback per adapter config.`);
                            return midnightTs + (1000*3600*2); // 02:00
                    }
                } else {
                    this.adapter.log.warn(`[getAstroNameTs] No time found for [${astroName}].`);
                    return 0;
                }
            }

            ts = this.adapter.x.mGeneric.roundTimeStampToNearestMinute(ts);
            ts = ts + (offsetMinutes * 60 * 1000);
            return ts;
        } catch (error) {
            this.adapter.x.mGeneric.dumpError('[getAstroNameTs()]', error);
            return 0;
        }

    }

}

module.exports = Timer;