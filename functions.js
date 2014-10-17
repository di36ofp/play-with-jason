(function(funcName, baseObj) {
    // The public function name defaults to window.docReady
    // but you can pass in your own object and own function name and those will be used
    // if you want to put them in a different namespace
    funcName = funcName || "docReady";
    baseObj = baseObj || window;
    var readyList = [];
    var readyFired = false;
    var readyEventHandlersInstalled = false;

    // call this when the document is ready
    // this function protects itself against being called more than once
    function ready() {
        if (!readyFired) {
            // this must be set to true before we start calling callbacks
            readyFired = true;
            for (var i = 0; i < readyList.length; i++) {
                // if a callback here happens to add new ready handlers,
                // the docReady() function will see that it already fired
                // and will schedule the callback to run right after
                // this event loop finishes so all handlers will still execute
                // in order and no new ones will be added to the readyList
                // while we are processing the list
                readyList[i].fn.call(window, readyList[i].ctx);
            }
            // allow any closures held by these functions to free
            readyList = [];
        }
    }

    function readyStateChange() {
        if ( document.readyState === "complete" ) {
            ready();
        }
    }

    // This is the one public interface
    // docReady(fn, context);
    // the context argument is optional - if present, it will be passed
    // as an argument to the callback
    baseObj[funcName] = function(callback, context) {
        // if ready has already fired, then just schedule the callback
        // to fire asynchronously, but right away
        if (readyFired) {
            setTimeout(function() {callback(context);}, 1);
            return;
        } else {
            // add the function and context to the list
            readyList.push({fn: callback, ctx: context});
        }
        // if document already ready to go, schedule the ready function to run
        if (document.readyState === "complete") {
            setTimeout(ready, 1);
        } else if (!readyEventHandlersInstalled) {
            // otherwise if we don't have event handlers installed, install them
            if (document.addEventListener) {
                // first choice is DOMContentLoaded event
                document.addEventListener("DOMContentLoaded", ready, false);
                // backup is window load event
                window.addEventListener("load", ready, false);
            } else {
                // must be IE
                document.attachEvent("onreadystatechange", readyStateChange);
                window.attachEvent("onload", ready);
            }
            readyEventHandlersInstalled = true;
        }
    }
})("docReady", window);

docReady(function() {
    var cars;
    var table = document.getElementById('table');
    var http_request = new XMLHttpRequest();
    http_request.open("GET", "https://gist.githubusercontent.com/enriclluelles/e59c3234d036257a2e9d/raw/db11275dacb4428a87023522f7dea72ec76c8b58/cars.json", true);
    http_request.onreadystatechange = function () {
      var done = 4, ok = 200;
      if (http_request.readyState === done && http_request.status === ok) {
          cars = JSON.parse(http_request.responseText);
          init();
      }
    };
    http_request.send(null)

  function init(){
    cars.forEach(function ( index ) {
      draw(index);
    })
  }

  function draw( obj ) {
    var tr = document.createElement('tr');
    var tdId = document.createElement('td');
    var tdName = document.createElement('td');
    var tdCode = document.createElement('td');
    var tdEngine = document.createElement('td');
    var tdDoors = document.createElement('td');
    var tdPrice = document.createElement('td');
    tdId.innerHTML = obj.id;
    tdName.innerHTML = obj.name;
    tdCode.innerHTML = obj.code;
    tdEngine.innerHTML = obj.engine;
    tdDoors.innerHTML = obj.doors;
    tdPrice.innerHTML = obj.price;

    tr.appendChild(tdId);
    tr.appendChild(tdName);
    tr.appendChild(tdCode);
    tr.appendChild(tdEngine);
    tr.appendChild(tdDoors);
    tr.appendChild(tdPrice);
    table.appendChild(tr);
  }
});