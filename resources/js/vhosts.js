var vhosts = /** @class */ (function () {
    function vhosts() {
        this.startListeners();
    }
    vhosts.prototype.startListeners = function () {
        var that = this;
        $(".startVhost").unbind();
        $(".startVhost").on("click", function () {
            that.startStopVhost(this, true);
        });
        $(".stopVhost").unbind();
        $(".stopVhost").on("click", function () {
            that.startStopVhost(this, false);
        });
        $(".deleteVhost").unbind();
        $(".deleteVhost").on("click", function () {
            that.deleteVhost(this);
        });
        $(".restartApache").unbind();
        $(".restartApache").on("click", function () {
            that.restartApache();
        });
        $(".startApache").unbind();
        $(".startApache").on("click", function () {
            that.startApache();
        });
        $(".apacheConfigtest").unbind();
        $(".apacheConfigtest").on("click", function () {
            that.apacheConfigtest();
        });
        $(".stopApache").unbind();
        $(".stopApache").on("click", function () {
            that.stopApache();
        });
        $(".editPencilVHost").unbind();
        $(".editPencilVHost").on("click", function () {
            that.initRenameVhost(this);
        });
        // Get a reference to the div you want to auto-scroll.
        this.someElement = document.querySelector("#console");
        // Create an observer and pass it a callback.
        var observer = new MutationObserver(this.scrollToBottom);
        // Tell it to look for new children that will change the height.
        var config = { childList: true };
        observer.observe(this.someElement, config);
    };
    vhosts.prototype.commandApachectl = function (command) {
        $.ajaxSetup({
            beforeSend: function (xhr, type) {
                if (!type.crossDomain) {
                    xhr.setRequestHeader("X-CSRF-Token", $('meta[name="csrf-token"]').attr("content"));
                }
            }
        });
        $.ajax({
            url: "/vhosts/apachectl",
            method: "POST",
            data: { command: command },
            dataType: "json"
        }).done(function (res) {
            $("#console").append("\n$: " + res);
        });
    };
    vhosts.prototype.initRenameVhost = function (element) {
        var header = $(element).parent().find(".headerName")[0];
        var that = this;
        var oldname = header.innerHTML;
        $(header).hide();
        $(element).addClass("hideForce");
        var inp = document.createElement("input");
        inp.type = "text";
        inp.className = "appendedTextInput";
        var shotsFired = 0;
        inp.addEventListener("blur", function () {
            if (shotsFired == 0) {
                that.renameVhost(oldname, inp.value, element, inp, header);
                shotsFired++;
            }
        });
        inp.addEventListener("keypress", function (e) {
            if (e.key === "Enter") {
                if (shotsFired == 0) {
                    that.renameVhost(oldname, inp.value, element, inp, header);
                }
                shotsFired++;
            }
        });
        $(inp).insertBefore($(header));
    };
    vhosts.prototype.renameVhost = function (oldName, newName, iElement, inputElement, headerElement) {
        $.ajaxSetup({
            beforeSend: function (xhr, type) {
                if (!type.crossDomain) {
                    xhr.setRequestHeader("X-CSRF-Token", $('meta[name="csrf-token"]').attr("content"));
                }
            }
        });
        $.ajax({
            url: "/vhosts/variousAjax",
            method: "POST",
            data: { type: "rename", old: oldName, new: newName },
            dataType: "json"
        }).done(function (res) {
            $("#console").append("\n$: " + res);
            $(iElement).removeClass("hideForce");
            $(inputElement).remove();
            $(headerElement).empty();
            $(headerElement).append(newName);
            $(headerElement).show();
        });
    };
    vhosts.prototype.restartApache = function () {
        $("#console").append("\n$: apachectl restart");
        this.commandApachectl("restart");
    };
    vhosts.prototype.startApache = function () {
        $("#console").append("\n$: apachectl start");
        this.commandApachectl("start");
    };
    vhosts.prototype.stopApache = function () {
        $("#console").append("\n$: apachectl stop");
        this.commandApachectl("stop");
    };
    vhosts.prototype.apacheConfigtest = function () {
        $("#console").append("\n$: apachectl configtest");
        this.commandApachectl("configtest");
    };
    vhosts.prototype.animateScroll = function (duration) {
        var start = this.someElement.scrollTop;
        var end = this.someElement.scrollHeight;
        var change = end - start;
        var increment = 20;
        function easeInOut(currentTime, start, change, duration) {
            // by Robert Penner
            currentTime /= duration / 2;
            if (currentTime < 1) {
                return (change / 2) * currentTime * currentTime + start;
            }
            currentTime -= 1;
            return ((-change / 2) * (currentTime * (currentTime - 2) - 1) + start);
        }
        function animate(elapsedTime) {
            elapsedTime += increment;
            var position = easeInOut(elapsedTime, start, change, duration);
            this.someElement.scrollTop = position;
            if (elapsedTime < duration) {
                setTimeout(function () {
                    animate(elapsedTime);
                }, increment);
            }
        }
        animate(0);
    };
    vhosts.prototype.scrollToBottom = function () {
        this.someElement = document.querySelector("#console");
        console.log(this.someElement.scrollHeight);
        this.someElement.scrollTop = this.someElement.scrollHeight;
        var duration = 300; // Or however many milliseconds you want to scroll to last
        animateScroll(duration, this.someElement);
    };
    vhosts.prototype.deleteVhost = function (element) {
        var name = $(element).attr("data-name");
        var that = this;
        $.ajaxSetup({
            beforeSend: function (xhr, type) {
                if (!type.crossDomain) {
                    xhr.setRequestHeader("X-CSRF-Token", $('meta[name="csrf-token"]').attr("content"));
                }
            }
        });
        $.ajax({
            url: "/vhosts/variousAjax",
            method: "POST",
            data: { type: "deleteVhost", name: name },
            dataType: "json"
        }).done(function (res) {
            $("#console").append("\n$: " + res);
            document.getElementById(name).remove();
        });
    };
    vhosts.prototype.startStopVhost = function (element, start) {
        var name = $(element).attr("data-name");
        var that = this;
        console.log((start ? "start: " : "stop: ") + name);
        $.ajaxSetup({
            beforeSend: function (xhr, type) {
                if (!type.crossDomain) {
                    xhr.setRequestHeader("X-CSRF-Token", $('meta[name="csrf-token"]').attr("content"));
                }
            }
        });
        $.ajax({
            url: "/vhosts/startStopVhost",
            method: "POST",
            data: { name: name, type: start },
            dataType: "json"
        })
            .done(function (res) {
            if (res.substring(0, 13) == "Enabling site") {
                $(element)
                    .parent()
                    .parent()
                    .parent()
                    .parent()
                    .find(".vhostStatusLabel")
                    .removeClass("red")
                    .addClass("green")
                    .empty()
                    .append("Active");
                var i = document.createElement("i");
                $(i).addClass("stop").addClass("icon");
                $(element)
                    .removeClass("startVhost")
                    .addClass("stopVhost")
                    .empty()
                    .append(i)
                    .append("deactivate");
            }
            else {
                $(element)
                    .parent()
                    .parent()
                    .parent()
                    .parent()
                    .find(".vhostStatusLabel")
                    .removeClass("green")
                    .addClass("red")
                    .empty()
                    .append("Inactive");
                var i = document.createElement("i");
                $(i).addClass("play").addClass("icon");
                $(element)
                    .removeClass("stopVhost")
                    .addClass("startVhost")
                    .empty()
                    .append(i)
                    .append("activate");
            }
            that.startListeners();
            $("#console").append("\n$: " + res);
        })
            .fail(function (res) {
            console.log(res);
        });
    };
    return vhosts;
}());
function animateScroll(duration, someElement) {
    var start = someElement.scrollTop;
    var end = someElement.scrollHeight;
    var change = end - start;
    var increment = 20;
    function easeInOut(currentTime, start, change, duration) {
        // by Robert Penner
        currentTime /= duration / 2;
        if (currentTime < 1) {
            return (change / 2) * currentTime * currentTime + start;
        }
        currentTime -= 1;
        return (-change / 2) * (currentTime * (currentTime - 2) - 1) + start;
    }
    function animate(elapsedTime) {
        elapsedTime += increment;
        var position = easeInOut(elapsedTime, start, change, duration);
        someElement.scrollTop = position;
        if (elapsedTime < duration) {
            setTimeout(function () {
                animate(elapsedTime);
            }, increment);
        }
    }
    animate(0);
}
document.addEventListener("DOMContentLoaded", function (event) {
    window["vhosts"] = new vhosts();
});
