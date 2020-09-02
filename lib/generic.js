/* eslint-disable no-irregular-whitespace */
'use strict';

/**
 * @class Generic
 * @description Generic JavaScript and ioBroker Adapter methods.
 * @author Mic-M <https://github.com/Mic-M/>
 * @license MIT License
 */
class Generic {

    /**
     * Constructor
     *
     * @param {object} adapter - ioBroker adapter instance object
     */
    constructor(adapter) {
        this.adapter = adapter;
    }


    /**
     * Get ioBroker System Configuration Value:
     * Returns a value as configured in Administration Settings of ioBroker
     * @param {string}  what     Options like: city, country, longitude, latitude, language, tempUnit,
     *                                         currency, dateFormat, isFloatComma, licenseConfirmed,
     *                                         defaultHistory, activeRepo, diag
     *                           To see all options, use: log('All options: ' +  JSON.stringify(getObject('system.config').common));
     * @return {Promise<*>}      The option. Will be undefined if value is not set.
     */
    async asyncGetSystemConfig(what) {

        try {
            const config = await this.adapter.getForeignObjectAsync('system.config');
            if (this.isLikeEmpty(config.common[what])) {
                this.adapter.log.warn(`[asyncGetSystemConfig] System config for [${what}] not found.`);
                return;
            } else {
                return config.common[what];
            }
        } catch (error) {
            this.dumpError('[asyncGetSystemConfig()]', error);
            return;
        }

    }

    /**
     * Error Message to Log. Handles error object being provided.
     *
     * @param {string} msg               - (intro) message of the error
     * @param {*}      [error=undefined] - Optional: Error object or string
     */
    dumpError(msg, error=undefined) {
        if (!error) {
            this.adapter.log.error(msg);
        } else {
            if (typeof error === 'object') {
                if (error.stack) {
                    this.adapter.log.error(`${msg} – ${error.stack}`);
                } else if (error.message) {
                    this.adapter.log.error(`${msg} – ${error.message}`);
                } else {
                    this.adapter.log.error(`${msg} – ${JSON.stringify(error)}`);
                }
            } else if (typeof error === 'string') {
                this.adapter.log.error(`${msg} – ${error}`);
            } else {
                this.adapter.log.error(`[dumpError()] : wrong error argument: ${JSON.stringify(error)}`);
            }
        }
    }

    /**
     * Checks if Array or String is not undefined, null or empty.
     * Array, object, or string containing just white spaces or >'< or >"< or >[< or >]< is considered empty
     * 18-Jun-2020: added check for { and } to also catch empty objects.
     * 08-Sep-2019: added check for [ and ] to also catch arrays with empty strings.
     * @param  {any}  inputVar   Input Array or String, Number, etc.
     * @return {boolean} True if it is undefined/null/empty, false if it contains value(s)
     */
    isLikeEmpty(inputVar) {
        if (typeof inputVar !== 'undefined' && inputVar !== null) {
            let strTemp = JSON.stringify(inputVar);
            strTemp = strTemp.replace(/\s+/g, ''); // remove all white spaces
            strTemp = strTemp.replace(/"+/g, '');  // remove all >"<
            strTemp = strTemp.replace(/'+/g, '');  // remove all >'<
            strTemp = strTemp.replace(/\[+/g, '');  // remove all >[<
            strTemp = strTemp.replace(/\]+/g, '');  // remove all >]<
            strTemp = strTemp.replace(/\{+/g, '');  // remove all >{<
            strTemp = strTemp.replace(/\}+/g, '');  // remove all >}<
            if (strTemp !== '') {
                return false;
            } else {
                return true;
            }
        } else {
            return true;
        }
    }

    /**
     * Checks whether variable is number
     * isNumber ('123'); // true
     * isNumber ('123abc'); // false
     * isNumber (5); // true
     * isNumber ('q345'); // false
     * isNumber(null); // false
     * isNumber(undefined); // false
     * isNumber(false); // false
     * isNumber('   '); // false
     * @source https://stackoverflow.com/questions/1303646/check-whether-variable-is-number-or-string-in-javascript
     * @param {any} n     Variable, die zu prüfen ist auf Zahl
     * @return {boolean}  true falls Zahl, false falls nicht.
     */
    isNumber(n) {
        return /^-?[\d.]+(?:e-?\d+)?$/.test(n);
    }


    /**
     * Remove Duplicates from Array
     * @source https://stackoverflow.com/questions/23237704/nodejs-how-to-remove-duplicates-from-array
     * @param  {array} inputArray        Array to process
     * @return {array}                  Array without duplicates.
     */
    uniqueArray(inputArray) {
        return inputArray.filter(function(elem, pos) {
            return inputArray.indexOf(elem) == pos;
        });
    }


    /**
     * Check if an array contains duplicate values
     * https://stackoverflow.com/a/34192063
     *
     * @param {*} myArray   - The given array
     * @return {boolean}    - true if it is unique, false otherwise.
     */
    isArrayUnique(myArray) {
        return myArray.length === new Set(myArray).size;
    }

    /**
     * Rounds the given timestamp to the nearest minute
     * Inspired by https://github.com/date-fns/date-fns/blob/master/src/roundToNearestMinutes/index.js
     *
     * @param {number}  ts   a timestamp
     * @return {number}      the resulting timestamp
     */
    roundTimeStampToNearestMinute(ts) {

        const date = new Date(ts);
        const minutes = date.getMinutes() + date.getSeconds() / 60;
        const roundedMinutes = Math.floor(minutes);
        const remainderMinutes = minutes % 1;
        const addedMinutes = Math.round(remainderMinutes);
        return new Date(
            date.getFullYear(),
            date.getMonth(),
            date.getDate(),
            date.getHours(),
            roundedMinutes + addedMinutes
        ).getTime();

    }

}

module.exports = Generic;
