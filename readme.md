# Vivify.js

Add cool animations to your projects.

  - Compatible with all modern browsers including Android and iOS mobile and tablet devices.
  - Uses CSS3 transitions to ensure the performance and compatibility of the animations.
  - Minified version is only 7kb so it's perfect for mobile projects.
  - Thanks to the core of the library, you can chain and loop animations.
  - Any animatable css property can be animated using the library.
  - Support: Android 4.0+, iOS 6+ and latest Opera, Firefox, Safari and IE 10+ versions.
  - Tested in Mopro 

Get from Google Drive
-----------

https://drive.google.com/a/saymedia.com/folderview?id=0BxhoZFsYm1cDfll5U2FqVUpfOTdzM0o1UHBzYTN2SDV6djZ6SHI1cXV3QVFGeXdZMjMwN3M&usp=sharing


Demo (using outdated version of vivify)
-----------

http://tiny.saymedia.com/a5v4


Version
-----------

2.0.1

What's new?
-----------
* You can pass html elements, node lists, element arrays and css selectors now.

Bugs
-----------
* No bug reported so far.


Notes
-----------

* Vivify should be imported at the end of the body.
* Animating many elements at the same time or heavy unoptimized images might cause the performace to drop or break animations.
* Remember to set the initial state for elements. So if you are "fading in" an element, remember to set "opacity:0" in the css for that element.
* If inside Mopro, please add the code inside the onShow() method.

Mobile Browser Glitches
-----------

Your animations might not run fine on all devices or might look odd or slow. In most cases when this happens there is a way to fix them.
I would suggest you to always add the following css properties to the elements your are going to animate in your css:

* perspective:1000px;
* backface-visibility:hidden;
* transform:translateZ(0px);


How to use:
--------------

* First save the js file inside your project.
* Then import the file to your projectL <script src="path.../vivify.min.js"></script>

Here is a simple example that will show you how to "fade-in" an element:

```javascript

// select element to animate
$v("#header")

// append animation
// you can animate many properties in the same animation. They will get animated at the same time
.animate({
    "opacity":"1",
    "left": "500px"
    
},{
    duration: 500,
    delay: 200,
    easing: "ease-in"
})

// start the animation
.begin();

```

Selecting an element: Vivify(sel) or $v(sel)
--------------

You can pass CSS selectors, html elements, arrays of elements or nodelists.

```javascript

// Passing a CSS selector

$v("#header") // passing the selector

// Passing a HTML Element
var el = document.getElementById("block");

$v(el)// passing the element

// Passing a list
var els = document.querySelectorAl("div");

$v(els) // passing the list

```

Storing the instance  
--------------

When you create an animation, you can also store the instance in case you need to use any of the api methods later. If you want to use the API methods, please make sure you are familiar with the "autorelease" method first.

```javascript

// select element to animate
var animation = $v("#header")

// append animation
animation.animate({
    "opacity":"1",
    "transform":"rotate(360deg)"
},{
    duration: 500,
    delay: 200,
    easing: "ease-in"
})

// start the animation
animation.begin();

```

Chaining animations 
--------------

- Animations do not start untill the .begin() method is called. So all animations need to be added before that method is called.
- You can call the .begin() method at any moment.
- To add or chain animations you simply need to add them before the begin() method is called, and you can add as many as you need.
- Animations will run in a sequence so the each animation will get executed once the previous one is complete.
- You can chain animations even when the animation is running.


```javascript

// select element to animate
$v("#header")

// add first animation
// element will fade in first
.animate({
    "opacity":"1",
},{
    duration: 500,
    delay: 200,
    easing: "ease-in"
})

//then the element will move to the left
.animate({
    "left":"200px",
},{
    duration: 500,
    easing: "ease-out"
})

//then the element will rotate 360deg
.animate({
    "transform":"rotate(360deg)",
},{
    duration: 200,
    easing: "linear"
})

// start all the animations
.begin();

```

## API:

### Vivify(selector)

* returns the animation instance.
* The selector can be any css selector. Many selectors can be passed if separated by comma.

```javascript

// select an unique element
var anim = $v("#header");

// select many elements of a class
var anim = $v(".circles");

// select all p elements
var anim = $v("p");

// select 2 unique elements
var anim = $v("#header", "#subheader");

```

### .animate(animationProperties, AnimationConfig)
* Appends an animation to the element's animation queue.
* Takes 2 objects as params. One containing the animation properties and values, and other with the configuration.

```javascript
.animate({
    "cssProperty": "cssValue", // you can add as many as you want
    "cssProperty": "cssValue",
    "cssProperty": "cssValue"
},{
    duration: 1000,             // required
    delay: 1000,                // optional
    easing: "ease-in-out"       // optional
    onComplete: function(){}    // optional
})

```

#### Details:

* duration: Time in milliseconds.
* delay: Time in milliseconds. Default value is 0.
* easing: Easing function. Available values are: linear | ease | ease-in | ease-out | ease-in-out | ease-in-quad | ease-out-quad |ease-in-out-quad | ease-in-sine | ease-out-sine | ease-in-out-sine. Default value is "linear"
* onComplete: This callback will get executed when the current animation is complete.

---

### .begin(options)

* Starts all the animations in the animation queue in the order they were added.
* The options is an object that contains some params.

```javascript
.begin({
   autorelease: false,          // optional
   loop: 5,                     // optional
   onComplete: function(){}     // optional
})

```

#### Details:

* autorelease: Affects the lifecycle of the instance. If set to false, the animation will remain in memory for later use. Default value is true.
* loop: number argument. Value can be set to "infinite" too. Defailt value is 0.
* onComplete: This will get excecuted when all the animations in the animation queue are complete, including all the loops

---

### .stop()

* This will stop and reset the current animation

```javascript
animation.stop();

```
---

### .clear()

* This will clear all the animations in the animation queue. Will only work if the animation is stopped or not running.

```javascript
animation.clear();

```
---

### .release()

* This will release all instance references. Use it when you set the autorelease option to false.

```javascript
animation.release();

```
---

### .isRunning()

* Returs either true or false depending is the animation is running or not.

```javascript
var isRunning = animation.isRunning();

console.log(isRunning); // true or false

```
---

### .override(animationProperties, animationConfig, beginConfig)

* This method will change the course of the current animation.
* It will pause the animation, clear the current animation queue, add the provided animation, and begin the new animation.
* You can chain more animations after calling this method.
* It is not necessary to call the .begin() method after this.

#### Details:
* animationProperties: REQUIRED param. animation properties you would pass to the animate method.
* animationConfig: REQUIRED param. animation configuration you would pass to the animate method.
* beginConfig: OPTIONAL param. is the params you would pass to the begin method

```javascript
animation.override({
    "left": "400px"
},{
    duration: 200
},{
  loop: "infinite",
  autorelease: false
});

// you can chain animations if you want to.

animation.animate({
    "transform":"rotate(360deg)",
},{
    duration: 200,
    easing: "linear"
});

```
---

License
----

Created By Ian Calderon for Say Media.

&nbsp;
&nbsp;
&nbsp;
&nbsp;
&nbsp;