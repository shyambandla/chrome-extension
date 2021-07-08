class App {
    timeoutDuration = 1000;

    regexp = /(\/\/|\#|--|\<\!--|\/\*)\ *(doc|video)\ *: *(\d+)/m;

    pause = false;

    constructor(config) {
        this.observerSelector = config.observerSelector;
        this.matchSelector = config.matchSelector;
        this.match = config.match;

        this.attachEventListeners();
        this.findElements();
    }

    attachEventListeners() {
        $("html").on("click", ".speacode-icon", function (e) {
            e.preventDefault();
            chrome.runtime.sendMessage({
                action: "open_speacode_link",
                id: $(this).data("id"),
            });
        });
    }

    queueTimeout() {
        this.timeout = setTimeout(
            this.findElements.bind(this),
            this.timeoutDuration
        );
    }

    findElements() {
        $(this.observerSelector)
            .filter(function () {
                return $(this).data("processed_observer") === undefined;
            })
            .each((i, element) => {
                $(element).data("processed_observer", true);

                var observer = new MutationObserver((mutations) => {
                    this.search();
                });

                var config = {
                    attributes: false,
                    childList: true,
                    characterData: false,
                };
                observer.observe(element, config);

                this.search();
            });

        this.queueTimeout();
    }

    search() {
        if (this.pause) return;

        $(this.matchSelector)
            .filter(function () {
                return $(this).data("processed_match") === undefined;
            })
            .each((i, element) => {
                $(element).data("processed_match", true);

                this.pause = true;
                this.match.call(this, element);
                this.pause = false;
            });
    }
}
