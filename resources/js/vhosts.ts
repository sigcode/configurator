class vhosts {
    someElement: any;
    constructor() {
        this.startListeners();
        this.appendState();
    }

    appendState() {
        if (document.getElementById("dashboard") !== null) {
            this.getStatus("apacheState", "leftDashboard", "apache2");
            this.getStatus("codeserverState", "rightDashboard", "codeserver3");
            this.getStatus("mysqlState", "leftDashboardSecond", "mysql");
            this.getStatus("confState", "rightDashboardSecond", "confer");
        }
    }
    codeserverRestart() {
        this.serviceCommand(
            "codeserver3",
            "restart",
            "codeserverState",
            "rightDashboard"
        );
    }

    codeserverStart() {
        this.serviceCommand(
            "codeserver3",
            "start",
            "codeserverState",
            "rightDashboard"
        );
    }

    codeserverStop() {
        this.serviceCommand(
            "codeserver3",
            "stop",
            "codeserverState",
            "rightDashboard"
        );
    }

    apacheRestart() {
        this.serviceCommand(
            "apache2",
            "restart",
            "apacheState",
            "leftDashboard"
        );
    }

    apacheStart() {
        this.serviceCommand("apache2", "start", "apacheState", "leftDashboard");
    }

    apacheStop() {
        this.serviceCommand("apache2", "stop", "apacheState", "leftDashboard");
    }
    mysqlRestart() {
        this.serviceCommand(
            "mysql",
            "restart",
            "mysqlState",
            "leftDashboardSecond"
        );
    }

    mysqlStart() {
        this.serviceCommand(
            "mysql",
            "start",
            "mysqlState",
            "leftDashboardSecond"
        );
    }

    mysqlStop() {
        this.serviceCommand(
            "mysql",
            "stop",
            "mysqlState",
            "leftDashboardSecond"
        );
    }

    confAll() {
        $(".ui.modal").modal("show");
    }

    serviceCommand(
        service: string,
        command: string,
        statusSpan: string,
        contentdiv: string
    ) {
        const that = this;
        $.ajaxSetup({
            beforeSend: function (xhr, type) {
                if (!type.crossDomain) {
                    xhr.setRequestHeader(
                        "X-CSRF-Token",
                        $('meta[name="csrf-token"]').attr("content")
                    );
                }
            }
        });
        $.ajax({
            url: "/vhosts/variousAjax",
            method: "POST",
            data: { type: "serviceCommand", name: service, command: command },
            dataType: "json"
        }).done(function (res) {
            that.getStatus(statusSpan, contentdiv, service);
        });
    }

    getStatus(statusSpan: string, contentdiv: string, servicename: string) {
        $.ajaxSetup({
            beforeSend: function (xhr, type) {
                if (!type.crossDomain) {
                    xhr.setRequestHeader(
                        "X-CSRF-Token",
                        $('meta[name="csrf-token"]').attr("content")
                    );
                }
            }
        });
        $.ajax({
            url: "/vhosts/variousAjax",
            method: "POST",
            data: { type: "getServiceState", name: servicename },
            dataType: "json"
        }).done(function (res) {
            $("." + contentdiv).empty();
            $("." + contentdiv).append(res);
            if (res.match(/Active: active \(running\)/g)) {
                $("." + statusSpan)
                    .find("i")
                    .addClass("green");
                $("." + statusSpan)
                    .find("i")
                    .addClass("play");
                $("." + statusSpan)
                    .find("i")
                    .removeClass("red");
                $("." + statusSpan)
                    .find("i")
                    .removeClass("stop");
            } else {
                $("." + statusSpan)
                    .find("i")
                    .removeClass("green");
                $("." + statusSpan)
                    .find("i")
                    .removeClass("play");
                $("." + statusSpan)
                    .find("i")
                    .addClass("red");
                $("." + statusSpan)
                    .find("i")
                    .addClass("stop");
            }
        });
    }

    startListeners() {
        const that = this;
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

        $(".newVhost").unbind();
        $(".newVhost").on("click", function () {
            that.newVhost();
        });

        $(".submitNewVhost").unbind();
        $(".submitNewVhost").on("click", function () {
            that.newVhostSubmit();
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
        let observer = new MutationObserver(this.scrollToBottom);
        // Tell it to look for new children that will change the height.
        let config = { childList: true };
        if (document.getElementById("console") !== null) {
            observer.observe(this.someElement, config);
        }
    }

    commandApachectl(command: string) {
        $.ajaxSetup({
            beforeSend: function (xhr, type) {
                if (!type.crossDomain) {
                    xhr.setRequestHeader(
                        "X-CSRF-Token",
                        $('meta[name="csrf-token"]').attr("content")
                    );
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
    }

    initRenameVhost(element: HTMLElement) {
        const header = $(element).parent().find(".headerName")[0];
        const that = this;
        const oldname: string = header.innerHTML;
        $(header).hide();
        $(element).addClass("hideForce");
        const inp: HTMLInputElement = document.createElement("input");
        inp.type = "text";
        inp.className = "appendedTextInput";
        let shotsFired = 0;
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
    }

    renameVhost(
        oldName: string,
        newName: string,
        iElement: HTMLElement,
        inputElement: HTMLElement,
        headerElement: HTMLElement
    ) {
        $.ajaxSetup({
            beforeSend: function (xhr, type) {
                if (!type.crossDomain) {
                    xhr.setRequestHeader(
                        "X-CSRF-Token",
                        $('meta[name="csrf-token"]').attr("content")
                    );
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
    }

    restartApache() {
        $("#console").append("\n$: apachectl restart");
        this.commandApachectl("restart");
    }

    startApache() {
        $("#console").append("\n$: apachectl start");
        this.commandApachectl("start");
    }

    stopApache() {
        $("#console").append("\n$: apachectl stop");
        this.commandApachectl("stop");
    }
    apacheConfigtest() {
        $("#console").append("\n$: apachectl configtest");
        this.commandApachectl("configtest");
    }

    animateScroll(duration) {
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
            return (
                (-change / 2) * (currentTime * (currentTime - 2) - 1) + start
            );
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
    }

    scrollToBottom() {
        this.someElement = document.querySelector("#console");
        console.log(this.someElement.scrollHeight);
        this.someElement.scrollTop = this.someElement.scrollHeight;
        var duration = 300; // Or however many milliseconds you want to scroll to last
        animateScroll(duration, this.someElement);
    }

    newVhost() {
        $(".ui.modal").modal("show");
    }

    newVhostSubmit() {
        const name: string = <string>(<unknown>$(".newVhostName").val());
        const valid: boolean = /\.(conf)$/i.test(name);
        if (valid) {
            $.ajaxSetup({
                beforeSend: function (xhr, type) {
                    if (!type.crossDomain) {
                        xhr.setRequestHeader(
                            "X-CSRF-Token",
                            $('meta[name="csrf-token"]').attr("content")
                        );
                    }
                }
            });
            $.ajax({
                url: "/vhosts/variousAjax",
                method: "POST",
                data: { type: "addVhost", name: name },
                dataType: "json"
            }).done(function (res) {
                $("#console").append("\n$: " + res);
                $(".ui.modal").modal("hide");
                location.reload();
            });
        } else {
            $(".fileendingIncorrect").transition("scale");
            $(".fileendingIncorrect").on("click", function () {
                $(".fileendingIncorrect").transition("scale");
            });
        }
    }

    deleteVhost(element: HTMLElement) {
        const name = $(element).attr("data-name");
        const that = this;
        $.ajaxSetup({
            beforeSend: function (xhr, type) {
                if (!type.crossDomain) {
                    xhr.setRequestHeader(
                        "X-CSRF-Token",
                        $('meta[name="csrf-token"]').attr("content")
                    );
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
    }

    startStopVhost(element: HTMLElement, start: boolean) {
        const name = $(element).attr("data-name");
        const that = this;
        console.log((start ? "start: " : "stop: ") + name);
        $.ajaxSetup({
            beforeSend: function (xhr, type) {
                if (!type.crossDomain) {
                    xhr.setRequestHeader(
                        "X-CSRF-Token",
                        $('meta[name="csrf-token"]').attr("content")
                    );
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
                    const i = document.createElement("i");
                    $(i).addClass("stop").addClass("icon");
                    $(element)
                        .removeClass("startVhost")
                        .addClass("stopVhost")
                        .empty()
                        .append(i)
                        .append("deactivate");
                } else {
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
                    const i = document.createElement("i");
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
    }
}

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
