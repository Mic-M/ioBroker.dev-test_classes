/* eslint-disable no-trailing-spaces */
'use strict';
/**
 * ioBroker Adapter: DEV Test Classes
 * Created with @iobroker/create-adapter v1.26.3
 * @desc    Test
 * @github  https://github.com/Mic-M/ioBroker.dev-test_classes
 * @author  Mic-M <https://github.com/Mic-M/>
 * @license MIT License
 */


// ioBroker Adapter core module
const utils = require('@iobroker/adapter-core');

/**
 * Load Modules
 * For VS Code: for all NPM modules, open console, change dir to "C:\iobroker\node_modules\ioBroker.<AdapterName>",
 *              and execute "npm install <module name>", ex: npm install suncalc2
 */
const Suncalc      = require('suncalc2');           // https://github.com/andiling/suncalc2 - for developers: execute ""
const NodeSchedule = require('node-schedule');      // https://github.com/node-schedule/node-schedule
const Constants    = require('./lib/constants.js'); // Adapter constants
const Timer        = require('./lib/timer.js');     // Timer class
const Generic      = require('./lib/generic.js');   // Generic JavaScript and ioBroker Adapter methods.


/**
 * Main Adapter Class
 * @class DevTestClasses
 */
class DevTestClasses extends utils.Adapter {

    /**
     * Constructor
     * @param {Partial<utils.AdapterOptions>} [options={}] - Adapter Options
     */
    constructor(options) {

        // required for the adapter
        super( {...options, name: 'dev-test_classes'} ); // to access the object's parent
        this.on('ready',  this._asyncOnReady.bind(this));
        this.on('unload', this._onUnload.bind(this));

        // adapter-specific objects being set here for global availability in adapter.x
        this.x = {

            // Modules
            constants: Constants, // constants.js - place all your needed constants (settings) in this file
            mSuncalc:  Suncalc,
            mSchedule: NodeSchedule,
            mGeneric:  new Generic(this),
            mTimer:    new Timer(this),

            // ---- these properties will be set in _asyncOnReady() ----
            // {number} latitude  - Latitude from ioBroker system config
            // {number} longitude - Latitude from ioBroker system config
            
            // {object} timers    - All timer objects.
            timers: {
                abc: {},    // Desc
                xyz: {},    // Desc
            },
            
            // for testing only
            test: {},

        };

    }

    /**
     * Is called when databases are connected and adapter received configuration.
     */
    async _asyncOnReady() {

        // Latitude and longitude from ioBroker system config.
        this.x.latitude  = await this.x.mGeneric.asyncGetSystemConfig('latitude');
        this.x.longitude = await this.x.mGeneric.asyncGetSystemConfig('longitude');
        if (!this.x.latitude || !this.x.longitude) {
            this.log.warn('Latitude/Longitude is not defined in ioBroker main configuration, so you will not be able to use Astro functionality for schedules.');
        }

        this._asyncMain(); // Call main function


    }

    /**
     * Main function.
     * Called once adapter is ready and all preparation is completed.
     */
    async _asyncMain() {

        // TEST: Erst mal setzen wir eine Variable in adapter.x
        const txt = `[main.js - _asyncMain()]  - sunset (Sonnenuntergang) heute ist um: ${new Date(this.x.mTimer.getAstroNameTs('sunset')).toISOString()}`;
        this.x.test.test1 = txt;
        this.log.warn(txt);

        // TEST: Nach 3s Call einer Funktion in timer.js
        setTimeout(()=> {
            this.x.mTimer.testFunc();
        }, 3000);

        // TEST: Nach 6s Variable prüfen
        setTimeout(()=> {
            this.log.warn(`[main.js - _asyncMain()] - sind wieder hier.`);
            this.log.warn(`Aktueller Wert von 'adapter.x.test.test1': '${this.x.test.test1}'`);
        }, 3000);

    }

    /**
     * Called once adapter shuts down - please note that callback must be always called!
     *
     * @param {() => void} callback
     */
    _onUnload(callback) {
        try {
            // Here you must clear all timeouts or intervals that may still be active, 
            // e.g. clearTimeout(timeout1); or clearInterval(interval1);
            this.x.timer.stopAllTimers(this.x.timers);
            callback();
        } catch (error) {
            this.x.mGeneric.dumpError('Error while stopping adapter', error);
            callback();
        }
    }


}

// @ts-ignore parent is a valid property on module
if (module.parent) {
    // Export the constructor in compact mode
    /**
     * @param {Partial<utils.AdapterOptions>} [options={}]
     */
    module.exports = (options) => new DevTestClasses(options);
} else {
    // otherwise start the instance directly
    new DevTestClasses();
}