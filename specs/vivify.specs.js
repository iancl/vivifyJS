/**
 * INCOMPLETE TESTS !
 */

describe('Query Elements', function() {

    it("Vivify should be a constructor function", function() {
        expect(typeof window.Vivify).toBe("function");
    });

    it("$v should be a constructor function", function() {
        expect(typeof window.$v).toBe("function");
    });

    it("Not passing a string selector, array or html element v$() should cause an error to be thrown",function(){
        expect(function(){ $v(); }).toThrow(new Error("[Vivify] constructor params invalid or undefined."));
    });

    it('passing a empty string selector $v("") should cause an error to be thrown',function(){
        expect(function(){ $v(); }).toThrow(new Error("[Vivify] constructor params invalid or undefined."));
    });

    it('passing a empty string selector $v([]) should cause an error to be thrown',function(){
        expect(function(){ $v([]); }).toThrow(new Error("[Vivify] constructor params not supported."));
    });

    it('passing an html element should return a vivify instance with 1 element',function(){
        var a = $v(document.createElement("div"));
        expect(a.length).toBe(1);
    });

    it('passing an array containing 1 html element should return vivify instance with 1 element',function(){
        var a = $v([document.createElement("div")]);
        expect(a.length).toBe(1);
    });

    it('passing an array containing 4 html elements should return vivify instance with 4 elements',function(){
        var a = $v([document.createElement("div"), document.createElement("div"), document.createElement("div"), document.createElement("div")]);
        expect(a.length).toBe(4);
    });

});

describe('Animate Params', function() {

    var instance;

    beforeEach(function(){
        instance = $v(document.createElement("div"));
    });

    afterEach(function(){
        instance.release();
        instance = null;
    });

    it('not passing params objects should throw an error',function(){
        expect(function(){ instance.animate()}).toThrow(new Error("[Vivify] cannot read animate params."));
    });

    it('passing only one conf object should throw an error',function(){
        expect(function(){ instance.animate({"foo": "foo"})}).toThrow(new Error("[Vivify] cannot read animate params."));
    });

});

describe('Override Params', function() {

    var instance;

    beforeEach(function(){
        instance = $v(document.createElement("div"));
    });

    afterEach(function(){
        instance.release();
        instance = null;
    });

    it('not passing params objects should throw an error',function(){
        expect(function(){ instance.override()}).toThrow(new Error("[Vivify] cannot read override params."));
    });

    it('passing only one conf object should throw an error',function(){
        expect(function(){ instance.override({"foo": "foo"})}).toThrow(new Error("[Vivify] cannot read override params."));
    });

});

/**
 * TODO:
 * CHECK THAT CALLBACKS ARE EXECUTED ON TIME
 * AND AFTER EVERY LOOP
 * GLOBAL CALLBACK SHOULD NOT BE CALLED ON LOOP INFINITE
 * ANIMATION BLOCK CALLBACK SHOULD BE CALLED AFTER EVERY RUN
 */

describe('Global callback', function() {

});

describe('Animation block callback', function() {

});

