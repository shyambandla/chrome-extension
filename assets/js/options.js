jQuery(document).ready(function ($) {
   

    $("form").on("submit", function (e) {
        e.preventDefault();

        const domain = $.trim($("#domain").val()).replace(
            /(^https?:\/\/|\.speacode\.com$)/g,
            ""
        );

        chrome.storage.sync.set(
            {
                domain: domain,
            },
            function () {
                $("#save-modal").modal("open");
                setTimeout(function () {
                    $("#save-modal").modal("close");
                }, 2000);
            }
        );
    });

    $("#domain").on("blur paste", function () {
        $("#domain").val(
            $.trim($("#domain").val()).replace(
                /(^https?:\/\/|\.speacode\.com\/?$)/g,
                ""
            )
        );
    });

    chrome.storage.sync.get(
        {
            domain: "",
        },
        function (settings) {
            
            $("#domain").val(settings.domain);

            chrome.runtime.sendMessage(
                {
                    action: "get_speacode_domain",
                },
                function (response) {
                    $("#cookie-domain").html(response.domain);
                    if(!settings.domain){
                        $("#domain").val(response.domain.replace('.speacode.com', ''));
                    }
                }
            );
        }
    );

    $(".modal").modal({
        endingTop: "50%",
    });
});
