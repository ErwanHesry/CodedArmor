(function () {
    "use strict";

    var ControlConstructor = WinJS.UI.Pages.define("/pages/hub/section2Page.html", {
        // This function is called after the page control contents 
        // have been loaded, controls have been activated, and 
        // the resulting elements have been parented to the DOM. 
        ready: function (element, options) {
            options = options || {};
            var binding = WinJS.Binding;
            var section = element.querySelector("#section2").winControl;

            var dataObservable = WinJS.Binding.as(Data.nextEvent);
            WinJS.Binding.bind(Data.nextEventObservable,
                {
                    title: function(value){
                        element.querySelector("#title").textContent = value;
                    },
                    desc: function(value){
                        element.querySelector("#content").textContent = value;
                    },
                    start: function(value){
                        element.querySelector("#subtitle").textContent = value;
                    },
                    pictureURL: function (value) {

                    }
                });

        },
    });

    // The following lines expose this control constructor as a global. 
    // This lets you use the control as a declarative control inside the 
    // data-win-control attribute. 

    WinJS.Namespace.define("HubApps_SectionControls", {
        Section2Control: ControlConstructor
    });
})();