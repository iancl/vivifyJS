//smskip:validation
/**
 * Vivify JS
 * Version: 2.0.1
 * Ian Calderon
 * For Say Media
 * Many variable/param names are short so we can reduce the file size
*/
(function(window, document, undefined){
    /*jslint loopfunc: true, validthis: true */
'use strict';
var
/***********************************************************************************************************
 * LOCAL VARS
 ***********************************************************************************************************/
CONST = {
    types: {node: "html", str: "str", arr: "arr" }, // supported types
    needPrefixRegex: (/border-image|box-reflect|box-sizing|filter|mask-image|transform|transition/i), // props that require prefix
    easingFunctions: {
        "linear": "linear",
        "ease": "ease",
        "ease-in": "ease-in",
        "ease-out": "ease-out",
        "ease-in-out": "ease-in-out",
        "ease-in-quad": "cubic-bezier(0.550, 0.085, 0.680, 0.530)",
        "ease-out-quad": "cubic-bezier(0.250, 0.460, 0.450, 0.940)",
        "ease-in-out-quad": "cubic-bezier(0.455, 0.030, 0.515, 0.955)",
        "ease-in-sine": "cubic-bezier(0.470, 0.000, 0.745, 0.715)",
        "ease-out-sine":"cubic-bezier(0.390, 0.575, 0.565, 1.000)",
        "ease-in-out-sine": "cubic-bezier(0.445, 0.050, 0.550, 0.950)"
    },
},
_delay = { // time in ms
    min: 0,
    begin: 0,
    loop: 20
},
_globalconf = {}; // global browser conf will be stored here


/***********************************************************************************************************
 * UTILS AND HELPER FN
 ***********************************************************************************************************/

/**
 * Takes a string with dashes, remove the dashes and uppercases the char that was next to the dash
 * @param  {[type]} str A css prop string
 * @return {String}     "Camel cased" string.
 */
function toCamelCase(str) {
    /**
     * TODO:
     * this is an extremeley ugly fix for internet explorer. Try to find a better solution
     */
    str = (/-ms-/g).test(str) ? str.substring(1, str.length) : str;
    return str.toLowerCase().replace(/-(.)/g, function(match, group1) {
        return group1.toUpperCase();
    });
}


/**
 * Creates a animation model object with default values.
 * @return {Object} Animation model with default values
 */
function createAnimModel(){
    return {
        p: [],                                                  // property name
        pV: [],                                                 // property value
        t: toCamelCase(_globalconf.cssPref+"transition"),       // transition name
        tV: "none"                                              // transition value
    };
}

/**
 * Iterates through each element of the current context.
 * @param  {Function} fn The callback for each iteration. Required Param.
 * @param  {Object}   c  The context that will be set for the callback. Optional Param.
 * @return {Void}
 */
function local_each (fn, c){
    var i;
    c = c || window;
    for (i = 0; i < this.length; i++) {
        fn.call(c, this[i], i);
    }
}

/**
 * Executes the callback after the specified delay.
 * @param  {Function} fn The callback for each iteration. Required Param.
 * @param  {Number}   t  Time in milliseconds. Required Param.
 * @param  {Object}   c  The context that will be set for the callback. Optional Param.
 * @return {Interval}    Returns a interval object.
 */
function local_delay (fn, t, c){
    c = c || window;
    return setTimeout(fn.bind(c), t);
}

/**
 * Merges two arrays and return the merged array.
 * @param  {Array} t Target array. Required Param.
 * @param  {Array} s Source array, if this param is not passed, it will use the current context. Optional Param
 * @return {Array}   The merged array.
 */
function merge_arrays (t, s){
    s = s || this;
    local_each.call(t, function(arg){
        s.push(arg);
    });
    return s;
}

/**
 * Throws an exception using the param string.
 * @param  {String} msg Information about the exeption.
 * @return {Void}
 */
function complain (msg){
    throw new Error("[Vivify] "+msg+".");
}

/**
 * Determines the type of the param. Vivify supports strings, arrays and html elements.
 * @param  {Object} o An object.
 * @return {String}   Contains the name of the object based on the CONST.types definition.
 */
function getType(o){
    var type;

    if(!!o.nodeName){
        type = CONST.types.node;
    } else if(typeof o === "string"){
        type = CONST.types.str;
    } else if(o.length){
        type = CONST.types.arr;
    }

    return type;
}

/**
 * Determines if a prefix should be applied to the specified css property param.
 * @param  {String} p A css property name
 * @return {Bool}   Returns true if a prefix should be applied, else false. This will be deternined using the CONST.needPrefixRegex definition.
 */
function shouldApplyPrefix(p){
    return !!(p.match(CONST.needPrefixRegex));
}

/**
 * Gets and store the current css styles in the conf attribute of the specified Vivify instance.
 * @param  {Vivify} self A Vivify instance containing a collection of elements.
 * @return {Void}
 */
function storeCurrentStyles(self){
    local_each.call(self, function(el){
        var key, pKey,

        style = window.getComputedStyle(el, null),
        foo = createAnimModel();

        for (key in self.conf.props){
            pKey = (shouldApplyPrefix(key) === true) ? _globalconf.cssPref+key : key;
            foo.p.push(pKey);
            foo.pV.push(style.getPropertyValue(key));
        }

        self.conf.initialStyles.push(foo);
    }, self);
}

/**
 * Applies the stored styles to the elements in the instance.
 * @param  {Vivify} self Vivify intance.
 * @return {Void}
 */
function applyInitialStyles(self){
    var style = self.conf.initialStyles,
        s;

      local_each.call(self, function(el, i){
        var model;

        for(s in style){
            model = style[s];
            el.style[model.t] = model.tV;

            local_each.call(model.p, function(p, i){
                el.style[p] = model.pV[i];
            }, self);
        }
    }, self);
}

/**
 * Stops all the timers in the instance.
 * @param  {Vivify} self Vivify instance.
 * @return {Void}
 */
function clearTimers(self){
    clearTimeout(self.conf.delayT);
    clearTimeout(self.conf.durationT);
    clearTimeout(self.conf.beginDOMRefresh);
    clearTimeout(self.conf.applyAnimationsDOMRefresh);
}

/**
 * Validates and stores the configuration object of the Begin method.
 * @param  {vivify} self Vivify instance.
 * @param  {Object} conf configuration object.
 * @return {Void}
 */
function processBeginConf(self, conf){
    conf = conf || {};

    if(typeof conf.loop !== "undefined"){
        if (!isNaN(conf.loop)){
            self.conf.loopCount = conf.loop - 1;
        } else {
            self.conf.loopCount = conf.loop;
        }
    }
    if (typeof conf.onComplete !== "undefined") self.callback = conf.onComplete;
    if (typeof conf.autorelease !== "undefined") self.conf.shouldAutorelease = conf.autorelease;
}

/***********************************************************************************************************
 * GLOBAL CONF SETUP
 ***********************************************************************************************************/

/**
 * Runs on script load.
 * @return {Void}
 */
function globalSetup(){
    detectBrowser();
    applyBrowserFixes();
}

/**
 * Detects the current browser prefix.
 * @return {Void}
 */
function detectBrowser(){
    var info = _globalconf.browser = Array.prototype.slice.call(
      document.defaultView.getComputedStyle(document.body, "")
    )
    .join("")
    .match(/(?:-(moz|webkit|ms|khtml)-)/);

    _globalconf.cssPref = info[0];
}

/**
 * Modifies variables depending on the Browser.
 * @return {Void}
 */
function applyBrowserFixes(){
    switch(_globalconf.browser[1]){
        case "moz":
            _delay.begin = 50;
        break;
    }
}

/**
 * Resets the animations of all the elements in the instance.
 * @param  {Vivify} self A vivify instance.
 * @return {Void}
 */
function resetAnimations(self){
    local_delay(function(){
        applyInitialStyles(self);
    }, _delay.min, this);
}

/**
 * Stops the animations and sets stored initial values.
 * @param  {Vivify} self A vivify instance.
 * @return {Void}
 */
function reset(self){
    resetAnimations(self);
    self.conf.isAnimating = false;
    self.conf.currentIndex = -1;
    self.conf.completedLoops = 0;
}
/**
 * Clears the animation queue, and intial styles of all elements in the instance.
 * Cannot clear queue if animations are running.
 * unless you override the lock by passing true as a param.
 * @param  {Vivify} self       A vivify instance.
 * @param  {Bool} overrideLock If true, it will clear the queue even if the animation is running.
 * @return {Void}
 */
function clear(self, overrideLock){
    if (self.conf.isAnimating === false || overrideLock === true){
        self.conf.initialStyles = [];
        self.conf.animations = [];
        self.conf.currentAnimation = null;
    }
}

/***********************************************************************************************************
 * INSTANCE SETUP
 ***********************************************************************************************************/

/**
 * Sets up all the configuration initial vualues.
 * Setting undefined values just to keep track of all the properties of the conf
 * @return {Void}
 */
function buildConf(){
    this.conf = {};
    this.conf.animations = [];
    this.conf.props = {};
    this.conf.initialStyles = [];
    this.conf.currentIndex = -1;
    this.conf.loopCount = 0;
    this.conf.completedLoops = 0;
    this.conf.isAnimating = false;
    this.conf.shouldAutorelease = true;
    this.conf.currentAnimation = undefined;
    this.conf.delayT = undefined;
    this.conf.durationT = undefined;
    this.conf.beginDOMRefresh = undefined;
    this.conf.applyAnimationsDOMRefresh = undefined;
}

/**
 * Builds the element array and stores the selected elements.
 * @param  {Array} args Contains selectors or HTML elements.
 * @return {Vivify}     Builds array list and retuns current context.
 */
function makeArray (args){
    this.length = 0;
    this.splice = Array.prototype.splice;
    this.push = Array.prototype.push;

    local_each.call(args, function(arg){
        switch(getType(arg)){
            case CONST.types.node:
                this.push(arg);
            break;

            case CONST.types.str:
                if (arg.length === 0) complain("string selector is empty");
                merge_arrays.call(this, document.querySelectorAll(arg));
            break;

            case CONST.types.arr:
                merge_arrays.call(this, arg);
            break;

            default:
                complain("constructor params not supported");
            break;
        }
    }, this);

    return this;
}

/**
 * Turns arguments into array and returns instance with queried elements.
 * @return {Vivify} Vivify instance with element list.
 */
function makeObject(){
    var args = Array.prototype.slice.call(arguments, 0)[0],
        s = merge_arrays.call([], args);

    if (s.length === 0) {
        complain("constructor params invalid or undefined");
    }

    return makeArray.call(this, s);
}

/***********************************************************************************************************
 * ANIMATION SETUP
 ***********************************************************************************************************/

/**
 * Gets the user params and stores them.
 * @param  {Object} anim Configuration object.
 * @param  {Object} conf Configuration object.
 * @return {Void}
 */
function buildAnimOptions(anim, conf){
    anim.duration = conf.duration;
    anim.delay = conf.delay;
    anim.easing = CONST.easingFunctions[conf.easing] || CONST.easingFunctions.linear;
    anim.onComplete = conf.onComplete;
}

/**
 * Generates css animation and stores it.
 * @param  {Object} anim  Configuration object.
 * @param  {Object} props Configuration object.
 * @param  {Object} conf  Configuration object.
 * @return {Void}
 */
function generateAnimation(anim, props, conf){
    var pref = _globalconf.cssPref,
        model = createAnimModel(),
        trans = "",
        key, pKey;

    for(key in props){
        pKey = (shouldApplyPrefix(key) === true) ? pref+key : key;
        trans += pKey+" "+anim.duration+"ms "+anim.easing+",";
        model.p.push(toCamelCase(pKey));
        model.pV.push(props[key]);

        // Keeping track of the used properties
        if(typeof this.conf.props[key] === "undefined"){
            this.conf.props[key] = props[key];
        }
    }

    trans = trans.substring(0, trans.length - 1);
    model.tV = trans;
    anim.transition = model;
    anim.callback = conf.onComplete;
}

/**
 * Calls other methods that process the animation configuration and stores the processed data.
 * @param  {Object props Configuration object.
 * @param  {Object} conf Configuration object.
 * @return {Void}
 */
function buildAnimation(props, conf){
    var anim = {};

    buildAnimOptions(anim, conf);
    generateAnimation.call(this, anim, props, conf);
    this.conf.animations.push(anim);
}

/***********************************************************************************************************
 * PRIVATE ANIMATION CORE
 ***********************************************************************************************************/

/**
 * Selects the next animation in the queue.
 * @param  {Vivify} self A Vivify instance.
 * @return {Bool}        True if it's the last animation in the queue.
 */
function selectNextAnimation(self){
    var shouldAnimate = true;

    self.conf.currentIndex++;

    if (self.conf.currentIndex > self.conf.animations.length - 1) {
        self.conf.currentIndex = 0;
        shouldAnimate = false;
    }

    self.conf.currentAnimation = self.conf.animations[self.conf.currentIndex];

    return shouldAnimate;
}

/**
 * When an animation block is complete.
 * @param  {Vivify} self A Vivify instance.
 * @return {void}
 */
function onCurrentAnimationComplete(self){
    if (self.conf.currentAnimation.callback) self.conf.currentAnimation.callback.call(self);

    runLoop(self);
}

/**
 * Calculates when the current animation is ready.
 * @param  {Vivify} self A Vivify instance.
 * @return {Void}
 */
function calculateCompletion(self){
    self.conf.durationT = local_delay(function(){
        onCurrentAnimationComplete(self);
    }, self.conf.currentAnimation.duration, self);
}

/**
 * Applies the animation to each element in the instance.
 * @param  {Vivify} self A Vivify instance.
 * @return {Void}
 */
function applyAnimations(self){
    local_each.call(self, function(el){
        var model = self.conf.currentAnimation.transition;

        el.style[model.t] = model.tV;

        local_each.call(model.p, function(p, i){
            el.style[p] = model.pV[i];
        }, self);
    }, self);

    self.conf.applyAnimationsDOMRefresh = local_delay(function(){
       calculateCompletion(self);
    }, _delay.min, self);
}

/**
 * Applies the specified delay to the animations.
 * @param  {Vivify} self A Vivify instance.
 * @return {Void}
 */
function beginAnimation(self){
    if (self.conf.currentAnimation.delay > 0) {
        self.conf.delayT = local_delay(function(){
            applyAnimations(self);
        }, self.conf.currentAnimation.delay, self);
    } else {
        applyAnimations(self);
    }
}

/**
 * When the whole animation set is complete.
 * @param  {Vivify} self A Vivify instance.
 * @return {Void}
 */
function onAnimationSetComplete(self){
    reset(self);

    if (self.callback) self.callback.call(self);

    if (self.conf.shouldAutorelease !== false) {
        self.release();
    }
}

/**
 * Prepares the configuration to run a new loop
 * @param  {Vivify} self A Vivify instance.
 * @return {Void
 */
function prepareForNewLoop(self){
    resetAnimations(self);

    local_delay(function(){
        self.conf.currentIndex = -1;
        self.conf.completedLoops++;
        runLoop(self);
    }, _delay.loop, self);
}

/**
 * Determines if the animations should keep running, if they should loop or if they are complete.
 * @param  {Vivify} self A Vivify instance.
 * @return {Void
 */
function runLoop(self){
    if(selectNextAnimation(self) === true){
        beginAnimation(self);
    } else {
        if ((self.conf.loopCount < 1 || self.conf.completedLoops === self.conf.loopCount) && self.conf.loopCount !== "infinite") {
            onAnimationSetComplete(self);
        } else {
            prepareForNewLoop(self);
        }
    }
}

/**
 * Forces the loop to restart
 * Used for overriding animations
 * @param  {Vivify} self A Vivify instance.
 * @return {Void
 */
function forceRunLoop(self){
    self.conf.currentIndex = -1;
    runLoop(self);
}

/**
 * Deletes the current animation queue and sets up a new one based on the new params passed by the user.
 * @param  {Vivify} self A Vivify instance.
 * @param  {Object} props A configuration object.
 * @param  {Object} conf  A configuration object.
 * @return {Void}
 */
function overrideAnimationQueue(self, props, conf){
    clearTimers(self);
    clear(self, true);
    buildAnimation.call(self, props, conf);
    storeCurrentStyles(self);
    applyInitialStyles(self);
    forceRunLoop(self);
}

/***********************************************************************************************************
 * PUBLIC
 ***********************************************************************************************************/
var Vivify = function(){
    return new Vivify.fn.initialize(arguments);
};

Vivify.fn = Vivify.prototype = {
    constructor: Vivify,
    vivify_version: "2.0.1",
    vivify_author: "Ian Calderon",
    /**
     * Initializes the new instance.
     * Should only run once
     * @return {Vivify} A Vivify instance.
     */
    initialize: function(){
        // don't initialize if it was already initialized
        if (typeof this.conf !== "undefined") return;
        
        buildConf.apply(this, arguments);

        return makeObject.apply(this, arguments);
    },
    /**
     * Receives a configuration object with css properties, timing and easing.
     * @param  {Object} props An object that contains css properties and values: { "cssProperty": "cssValue", ... }
     * @param  {Object} conf  An object that contains duration(required), delay(optional), easing(optional), onComplete callback(optional): {duration:number, delay:number, easing:"easingName", onComplete:function(){}}
     * @return {Vivify}       Current instance.
     */
    animate: function(props, conf){
        if (!props || !conf) {
            complain("cannot read animate params");
        }

        buildAnimation.apply(this, arguments);

        return this;
    },
    /**
     * Receives a configuration file, process it and then starts the runloop.
     * @param  {[type]} conf An object with configuration values loop(optional), autorelease(optional) and onComplete(optional): {loop:number, autorelease:bool, onComplete:function(){}}
     * @return {Vivify}      Current Civify instance.
     */
    begin: function(conf){
        if (this.conf.isAnimating === true) return;

        this.conf.isAnimating = true;
        storeCurrentStyles(this);
        processBeginConf(this, conf);

        this.conf.beginDOMRefresh = local_delay(function(){
            runLoop(this);
        }, _delay.begin, this);

        return this;
    },
    /**
     * Stops the current animation and applies initial values.
     * @return {Vivify} Current Vivify instance.
     */
    stop: function(){
        clearTimers(this);
        reset(this);

        return this;
    },
    /**
     * Clears the current animation queue if the animations are not running.
     * @return {Vivify} Current Vivify instance.
     */
    clear: function(){
        if (this.conf.isAnimating === true) return;

        clear(this);

        return this;
    },
    /**
     * Stops and captures the current css values, clears the current animation queue and creates and new animation queue based on the user's params.
     * Also updates the begin configuration if necessary.
     * @param  {Object} props     An object that contains css properties and values: { "cssProperty": "cssValue", ... }
     * @param  {[type]} animConf  An object that contains duration(required), delay(optional), easing(optional), onComplete callback(optional): {duration:number, delay:number, easing:"easingName", onComplete:function(){}}
     * @param  {[type]} beginConf An object with configuration values loop(optional), autorelease(optional) and onComplete(optional): {loop:number, autorelease:bool, onComplete:function(){}}
     * @return {Vivify}           Current instance.
     */
    override: function(props, animConf, beginConf){
        if (!props || !animConf) {
            complain("cannot read override params");
        }

        overrideAnimationQueue(this, props, animConf);
        processBeginConf(this, beginConf);

        return this;
    },
    /**
     * Returns a bool value depending if there are any animations running
     * @return {Bool} true if the instance is being animated, else false.
     */
    isAnimating: function(){
        return this.conf.isAnimating;
    },
    /**
     * Releases all DOM references
     * @return {Object} a null object.
     */
    release: function(){
        var i;

        if (this.conf.isAnimating === true) return;

        for(i=0; i<this.length; i++){
            this[i] = null;
            delete this[i];
        }

        this.length = 0;
        this.conf.animations = null;
        this.conf.initialStyles = null;
        this.callback = null;

        return null;
    }
};

globalSetup();
Vivify.fn.initialize.prototype = Vivify.fn;
window.Vivify = window.$v = Vivify;

}(this, document));