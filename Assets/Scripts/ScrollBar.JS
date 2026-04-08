
// Constants
const body = document.body;
const rootElement = document.documentElement;

const elementOptions = {
    ScrollBar: {
        TagName: "div",
        ElementID: "scrollBar",
        Classes: ["row"],
    },

    ThumbTopContainer: {
        TagName: "div",
        ElementID: "thumbTopContainer",
        Classes: ["row", "content"],
    },

    ScrollThumbTop: {
        TagName: "img",
        ElementID: "scrollThumbTop",
        Source: "Assets/Images/MagnetRed.png",
        OtherProperties: {"draggable": "false"},
    },

    ScrollThumbBottom: {
        TagName: "img",
        ElementID: "scrollThumbBottom",
        Classes: ["row", "footer"],
        Source: "Assets/Images/MagnetBlue.png",
        OtherProperties: {"draggable": "false"},
    },
};

// Variables
var canScroll = false;

// Create Elements
function createElement(myElementOptions, parentElement) {
    var myElement = document.createElement(myElementOptions.TagName);
    myElement.id = myElementOptions.ElementID;

    // Add Classes
    var myClassList = myElement.classList;
    var myClasses = myElementOptions.Classes;

    if (myClasses) {
        myClasses.forEach(className => {
            myClassList.add(className);
        });
    };

    // Add Source
    var mySource = myElementOptions.Source;
    if (mySource) {myElement.src = mySource};

    // Add Other Properties
    var otherProperties = myElementOptions.OtherProperties
    if (otherProperties) {
        for (const [propertyName, propertyValue] of Object.entries(otherProperties)) {
            myElement.setAttribute(propertyName, propertyValue)
        };
    };

    // Append To Parent
    parentElement.appendChild(myElement);

    // Return New Element
    return myElement;
};

function getScrollBar() {
    // Scroll Bar Container
    var scrollBar = document.getElementById("scrollBar");
    if (!scrollBar) {scrollBar = createElement(elementOptions.ScrollBar, body)};

    // Thumb Top Container
    var topContainer = document.getElementById("thumbTopContainer");
    if (!topContainer) {topContainer = createElement(elementOptions.ThumbTopContainer, scrollBar)};

    // Thumb Top
    var thumbTop = document.getElementById("scrollThumbTop");
    if (!thumbTop) {thumbTop = createElement(elementOptions.ScrollThumbTop, topContainer)};

    // Thumb Bottom
    var thumbBottom = document.getElementById("scrollThumbBottom");
    if (!thumbBottom) {thumbBottom = createElement(elementOptions.ScrollThumbBottom, scrollBar)};

    return {
        ScrollBar: scrollBar,
        ThumbTopContainer: topContainer,
        ScrollThumbTop: scrollThumbTop,
        ScrollThumbBottom: scrollThumbBottom,
    };
};

// Utility
function getMaxScrollY(isMousePosition) {
    const windowHeight = window.innerHeight;
    if (isMousePosition) {return windowHeight};
    
    const scrollHeight = rootElement.scrollHeight;
    return (scrollHeight - windowHeight);
};

// Main
function moveScrollBar(scrollPositionY, isMousePosition) {
    // Get ScrollBar Elements
    var scrollElements = getScrollBar();

    // Assign Element Variables
    var thumbTop = scrollElements.ScrollThumbTop;
    var scrollBar = scrollElements.ScrollBar;
    var scrollStyle = scrollBar.style;
    var thumbTopSyle = thumbTop.style;
    var thumbTopHeight = scrollThumbTop.height;

    // Get Scroll Variables
    var maxScrollY = getMaxScrollY(isMousePosition);
    canScroll = (maxScrollY > 0);

    // Check For Scroll Possibility
    //scrollStyle.setProperty("visibility", (canScroll ? "visible" : "hidden"));
    if (!canScroll) {return};

    // Get New Position
    var percentageModifier = 0;
    var scrollPercentage = ((scrollPositionY / maxScrollY) * 100);
    if (scrollPercentage >= 50) {percentageModifier = thumbTopHeight};
    var newPosition = `calc(${scrollPercentage}% - ${percentageModifier}px)`

    // Set New Position
    thumbTopSyle.setProperty("top", newPosition)
    return scrollPercentage
};

function addClickListener() {
    // Get ScrollBar Elements
    var scrollElements = getScrollBar();

    // Assign Variables
    var scrollThumbTop = scrollElements.ScrollThumbTop;
    var scrollBar = scrollElements.ScrollBar;
    var mouseDown = false;

    // Activate Scroll Bar
    function activate(Event, wasClicked) {
        if ( !(mouseDown || wasClicked) ) {return};

        // Move Scroll Bar
        var positionPercentage = moveScrollBar(Event.clientY, true);
        if ( !(positionPercentage && canScroll) ) {return};

        // Scroll Page
        var maxScrollY = getMaxScrollY();
        var newPositionY = (maxScrollY * (positionPercentage / 100))

        window.scrollTo(0, newPositionY);
    };

     // Detect Mouse Button
     scrollBar.onclick = function(Event) {activate(Event, true)};
     scrollThumbTop.onmousedown = function() {mouseDown = true};
     
     window.onmouseleave = function() {mouseDown = false};
     window.onmouseup = function(Event) {mouseDown = false; activate(Event)};

     // Detect Mouse Move
     body.onmousemove = activate;
};

// Set Initial Position
moveScrollBar(body.scrollHeight);

// Move Position When Scrolled
window.addEventListener("scroll", (event) => {moveScrollBar(this.scrollY)});

// Move Position When Clicked / Dragged
addClickListener();

// Change Visibility On Zoom
window.addEventListener("resize", function (event) {
    var scrollElements = getScrollBar(); var maxScrollY = getMaxScrollY();
    scrollElements.ScrollBar.style.setProperty("visibility", ((maxScrollY > 0) ? "visible" : "hidden"));
});