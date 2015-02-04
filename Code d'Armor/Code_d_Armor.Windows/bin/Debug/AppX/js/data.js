(function () {
    "use strict";

    var config = {
        'name': "Code d'Armor",
        'id': "105840950870167242716",
        'google_api': "AIzaSyBj2tvS2t-T6ZTGhDoGWsNC-N5RNVm5L2Y"
    };

    var list = new WinJS.Binding.List();
    var groupedItems = list.createGrouped(
        function groupKeySelector(item) { return item.group.key; },
        function groupDataSelector(item) { return item.group; }
    );

    // TODO: Replace the data with your real data.
    // You can add data from asynchronous sources whenever it becomes available.
    /*generateSampleData().forEach(function (item) {
        list.push(item);
    });*/

    getData();

    WinJS.Namespace.define("Data", {
        items: groupedItems,
        groups: groupedItems.groups,
        getItemReference: getItemReference,
        getItemsFromGroup: getItemsFromGroup,
        resolveGroupReference: resolveGroupReference,
        resolveItemReference: resolveItemReference
    });

    Data.nextEvent = {
        title: "",
        desc: "",
        URL: "",
        start: "",
        end: "",
        gURL: "",
        pictureURL: ""
    };

    var observedObject = WinJS.Binding.as(Data.nextEvent);
    Data.nextEventObservable = observedObject;

    WinJS.Binding.bind(observedObject,
                {
                    title: function (value) {
                        console.log(value);
                    }/*,
                    desc: function (value) {
                        element.querySelector("#content").textContent = value;
                    },
                    start: function (value) {
                        element.querySelector("#subtitle").textContent = value;
                    },
                    pictureURL: function (value) {

                    }*/
                });

    // Get a reference for an item, using the group key and item title as a
    // unique reference to the item that can be easily serialized.
    function getItemReference(item) {
        return [item.group.key, item.title];
    }

    // This function returns a WinJS.Binding.List containing only the items
    // that belong to the provided group.
    function getItemsFromGroup(group) {
        return list.createFiltered(function (item) { return item.group.key === group.key; });
    }

    // Get the unique group corresponding to the provided group key.
    function resolveGroupReference(key) {
        return groupedItems.groups.getItemFromKey(key).data;
    }

    // Get a unique item from the provided string array, which should contain a
    // group key and an item title.
    function resolveItemReference(reference) {
        for (var i = 0; i < groupedItems.length; i++) {
            var item = groupedItems.getAt(i);
            if (item.group.key === reference[0] && item.title === reference[1]) {
                return item;
            }
        }
    }

    function getData() {
        var groups = [
            { key: "group1", title: "Événements", subtitle: "À venir et passés", backgroundImage: "", description: "" },
            { key: "group2", title: "Vidéos", subtitle: "Retrouvez les vidéos des conférences", backgroundImage: "", description: "" }
        ];

        var item = { group: groups[0], title: "", subtitle: "", description: "", content: "", backgroundImage: "", googlePlusLink: "", event: "" };
        list.push(item);

        var item = { group: groups[1], title: "", subtitle: "", description: "", content: "", backgroundImage: "", googlePlusLink: "", event: "" };
        list.push(item);

        WinJS.xhr({ url: "http://gdgfresno.com/gdgfeed.php?id=" + config.id }).done(function (data) {
            list.pop();
            var data = data.responseText;
            data = JSON.parse(data);
            var now = new Date();
            for (var i = data.length - 1; i >= 0; i--) {
                var title = data[i].title;
                var desc = data[i].description;
                var subtitle = data[i].description.substring(0, 50);
                var place = data[i].location;
                var URL = data[i].link;
                var iconURL = data[i].iconUrl;
                var start = new Date(data[i].start);
                var end = new Date(data[i].end);
                var next = "pastEvent";
                var gUrl = data[i].gPlusEventLink;
                if (now < start || data[i].temporalRelation == "future") {
                    Data.nextEvent.title = title;
                    Data.nextEvent.desc = desc;
                    Data.nextEvent.URL = URL;
                    Data.nextEvent.start = start;
                    Data.nextEvent.end = end;
                    Data.nextEvent.gURL = gUrl;
                    Data.nextEvent.pictureURL = data[i].start;
                    console.log(Data.nextEvent);
                }
                var item = { group: groups[0], title: title, subtitle: subtitle, description: desc, content: desc, backgroundImage: "http://storage.googleapis.com/io13/gcs_import/images/google_developers_icon_128.png", googlePlusLink: gUrl, event: next };
                list.push(item);
            }
        });

        WinJS.xhr({ url: 'http://gdata.youtube.com/feeds/users/UC3MIXkWlQAvzQLa3ALbSqhg/uploads?alt=json-in-script&format=5' }).done(function (data) {
            list.pop();
            var jSONResponse = data.responseText.replace("gdata.io.handleScriptLoaded(", '');
            jSONResponse = jSONResponse.substr(0, jSONResponse.length - 2);
            var response = JSON.parse(jSONResponse);
            var videos = response.feed.entry;
            /*
            videos.forEach(function (index, video) {

                var id = video.id.$t;
                var published = video.published.$t;
                var update = video.updated.$t;
                var title = video.title.$t;
                var link = video.link[0].href;
                var category = video.media$group.media$description.$t;
                var thumbnail = video.media$group.media$thumbnail[0].url;

                published = published.substr(0, jSONResponse.length - 8);
                published = published.replace("T", " ");

                id = id.replace("http://gdata.youtube.com/feeds/videos/", '');

                var dataItem = { group: groups[1], title: title, subtitle: category, description: published, content: id, backgroundImage: thumbnail };
                items.push(dataItem);
                list.push(item);
            });
            */
        });
    }

})();
