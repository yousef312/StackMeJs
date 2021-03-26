
/**
 * StackMe.js 1.0.0
 *
 * Copyright 2021, yousef neji
 * Licensed under the MIT license.
 */
(function (root, StackMe) {
    'uses strict';
    if (typeof define === 'function' && define.amd) {
        define([], build);
    } else if (typeof module === 'object' && module.exports) {
        module.exports = StackMe;
        root.StackMe = StackMe;
    } else {
        root.StackMe = StackMe;
    }

}(this, function StackMe() {

    function is(type,value,def){
        if( typeof type === 'string')
        return typeof value === type ? value : def;
        else if( type instanceof Array)
        return type.indexOf(value) !== -1 ? value : def;
    }

    var algos = ['clearpath','insertion','lineare'];

    /**
     * A small API that handle doing stack undo and redo actions, it's collapsable and also expandable.
     * Pretty usefull to use it with canvas element and rendering!
     * @author Yousef Neji
     */
    function StackMe(max,algo) {
        /**
         * The stacks container
         * @type {Array}
         */
        this.stack = [];

        /**
         * Current stack/state index 
         * @type {number} 
         */
        this.current = -1;

        /**
         * Maximum number of stacks that can be held.
         * @type {number}
         */
        this.maximum = is('number', max, 20);

        /**
         * The algorithme to use when stacking, or the stacking method, may be one of those:
         *  - `clearpath` : once you undo and push new stack the forward stacks will be removed.
         *  - `insertion` : once you undo and push new stack the new one will be inserted in front of the forward stacks.
         *  - `lineare` : once you push new stack it will be always added to the end of the stacks list.
         * 
         * by defaults its `clearpath`
         * @type {string}
         */
        this.algo = is(algos,algo,'clearpath');
    }
    StackMe.prototype = {
        /**
         * Push new stack/state into the stacks list
         * @method StackMe#push
         * @param {any} elm
         * @returns {number} the current state index
         */
        push: function (elm) {
            if( this.algo === 'lineare' )
            {
                this.current = this.stack.push(elm) - 1;
            }
            else if( this.algo === 'clearpath' )
            {
                if( this.stack[this.current + 1] !== undefined )
                {
                    this.stack.splice(this.current + 1 , this.stack.length);
                }
                this.current = this.stack.push(elm) - 1;
            }
            else if( this.algo === 'insertion' )
            {
                this.stack.insert(elm,this.current + 1);
            }

            // respect maximum term
            if( this.stack.length > this.maximum )
            {
                this.stack.shift();
            }

            return this.current;
        },
        /**
         * Undo the last change or state/stack
         * @method StackMe#undo
         * @param {number} stack how much states to undo; default to 1
         * @returns {any} the last state content
         */
        undo: function (stack = 1) {
            if (this.current - stack > -1) {
                this.current -= stack;
                return this.stack[this.current]
            } else {
                return this.stack[0]
            }
        },
        /**
         * Redo the last change or state/stack
         * @method StackMe#redo
         * @param {number} stack how much states to redo; default to 1
         * @returns {any} the last state content
         */
        redo: function (stack = 1) {
            if (this.stack[this.current + stack] !== undefined) {
                this.current += stack;
                return this.stack[this.current]
            } else {
                return this.stack[this.current]
            }

        },
        /**
         * Expand the stack maximum length.
         * @method StackMe#expand
         */
        expand: function (value) {
            this.maximum = is('number', value, this.maximum);
            return this
        },
        /**
         * Clear the stack content
         * @method StackMe#freeUp
         */
        freeUp: function () {
            this.stack = [];
            return this
        },
        /**
         * Change the current stack/state to a specified one
         * @method StackMe#moveTo
         * @param {number} i 
         * @returns {any} the wanted stack content or the string `out-of-rang`
         */
        moveTo: function (i) {
            if (i > -1 && i < this.maximum) {
                this.current = i;
                return this.stack[i];
            } else {
                return 'out-of-rang'
            }
        },
        /**
         * Change the `algo` property value, seed documentation to check the allowed values!
         * @method StackMe#setAlgorithme
         * @param {string} algo 
         * @returns {boolean} true if accepeted and false otherwise
         */
        setAlgorithme : function( algo ) {
            if( algos.indexOf(algo) !== -1 )
            {
                this.algo = algo;
                return true
            }
            return false
        },
        /**
         * Import the stacks from an object, pretty usefull when you want to save the stacks on the user
         * computer then retrieve it back!
         * @method StackMe#import
         * @param {object} obj 
         * @returns {any} the current stack after import is done.
         */
        import : function( obj ) {
            this.maximum = is('number',obj.maximum,20);
            this.stack = obj.stack instanceof Array ? obj.stack : [] ;
            this.current = is('number',obj.current,0);
            this.algo = is(algos,obj.algo,'clearpath');

            // nowing fixing any errored values
            if( this.stack.length > this.maximum)
            {
                // fixing the length
                this.stack.splice(this.maximum - 1,this.stack.length);
            }
            // fixing current
            this.current = this.current > this.maximum - 1 ? this.maximum - 1 : this.current < 0 ? 0 : this.current; 

            return this.stack[this.current];
        }
    }
    return StackMe;
}))
