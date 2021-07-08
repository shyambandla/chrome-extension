chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    switch (request.action) {
        case "get_speacode_domain":
            chrome.cookies.getAll(
                { domain: "speacode.com" },
                function (cookies) {
                    for (let i = 0; i < cookies.length; i++) {
                        let cookie = cookies[i];
                        if (cookie.name === "extension_domain") {
                            sendResponse({ domain: cookie.value });
                            break;
                        }
                    }
                    sendResponse({ domain: "" });
                }
            );

            return true;

            break;

        case "open_speacode_link":
            getDomain((domain) => {
                const url = domain
                    ? `https://${domain}/${request.id}`
                    : "https://speacode.com";
                chrome.tabs.create({
                    url: url,
                    active: true,
                });
            });

            return true;

            break;
    }
});

chrome.browserAction.onClicked.addListener(function (tab) {
    openSettingsPage();
});

chrome.runtime.onInstalled.addListener(function (details) {
    if (details.reason == "install") {
        openSettingsPage();
    }
});

function getDomain(callback) {
    chrome.storage.sync.get(
        {
            domain: "",
        },
        function (settings) {
            if (settings.domain) {
                callback.call(null, `${settings.domain}.speacode.com`);
                return;
            } else {
                chrome.cookies.getAll(
                    { domain: "speacode.com" },
                    function (cookies) {
                        for (let i = 0; i < cookies.length; i++) {
                            let cookie = cookies[i];
                            if (cookie.name === "extension_domain") {
                                callback.call(null, cookie.value);
                                return;
                            }
                        }
                        callback.call(null, null);
                        return;
                    }
                );
            }
        }
    );
}

chrome.storage.onChanged.addListener(function (changes, namespace) {
    for (let [key, { oldValue, newValue }] of Object.entries(changes)) {
        if (key === "domain" && namespace === "sync") {
            toggleBrowserActionIcon(newValue);
        }
    }
});

function openSettingsPage() {
    if (chrome.runtime.openOptionsPage) {
        chrome.runtime.openOptionsPage();
    } else {
        window.open(chrome.runtime.getURL("options.html"));
    }
}

function toggleBrowserActionIcon(value) {
    console.log(value);
    if (value) {
        chrome.browserAction.setIcon({ path: "assets/img/icon16.png" });
    } else {
        chrome.browserAction.setIcon({
            path: "assets/img/icon16-redscale.png",
        });
    }
}

chrome.storage.sync.get(
    {
        domain: "",
    },
    function (settings) {
        toggleBrowserActionIcon(settings.domain);
    }
);
