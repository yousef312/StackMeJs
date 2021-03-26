# StackMe.js

## Author 
Yousef Neji

## Dependencies
none

## Why to use it?
Basically I created this library to provides the stack management for canvas rendering context 2D states,
as it's really helpfull, you can just create a new canvas draw on it you main canvas content and then push it into the stack and so on, later on you can undo and redo to get back you different canvas states and load it.

## How to use it?
The API is pretty simple...!

You first initiate the object
```JavaScript
// with node only
var StackMe = require('stackme');

var max = 20;
var algo = 'clearpath';
// intiate
var stack = new StackMe(max,algo);

// max is the maximum cells for the stack
// default is 20 and you can expand it later
// using the method expand

// algo is the algorithme to be used when pushing stacks or the stacking method which goes like that:
// if `clearpath` means when ever you push a new stack the stack you undo will vanish living a space 
// for the new ones
// if `insertion` means when ever you push a new stack it will be inserted after the undo stacks and not
// going to remove them
// if `lineare` any new stack will be always pushed at the end of the stack
```

You push new stack/state using the `push` method like so
```JavaScript

canvas.addEventListener('mouseup',function(e){
    // usuall you do something like that to register new
    // stack for canvas drawings
    var ctx = createCTX2D(); // return a fresh CanvasRenderingContext2D
    ctx.drawImage(canvas,0,0);

    // now push the stack there
    stack.push(ctx);
})
```

Now `undo` `redo` are pre-built methods that you can easily use and so on with `moveTo` which directly load a stack by it index.
```JavaScript

// to undo
var oldDrawing = stack.undo();
myContext.drawImage(oldDrawing.canvas,0,0);

// to redo
var oldDrawing = stack.undo();
myContext.drawImage(oldDrawing.canvas,0,0);

// to go to a specific stack
var oldDrawing = stack.moveTo(4);
myContext.drawImage(oldDrawing.canvas,0,0);
// moveTo method will return the string `out-of-rang` when the given index point to a cell
// that is undefined or out the maximum rang
```

To expand or minimize the `maximum` property you can use **expand**(value) where value is the new maximum
```JavaScript
stack.expand(30);
// now the stack is able to contain a thirteen stack and navigate through them
```

To empty the stack there is **freeUp**() method
```JavaScript
stack.freeUp();
// now the stack array is empty
```

Also the system provide the way to change tha algorithme used in stacking using **setAlgorithme**(algo)
```JavaScript
stack.setAlgorithme('lineare');
```

And the way import the class preferences and stack from an object using **import**(obj), this is pretty usefull when you want to save every thing in the user computer then load it back!
```JavaScript
obj = //....
// loading your app preferences from the user computer
// now importing
stack.import(obj);
```

## version 
1.0.0