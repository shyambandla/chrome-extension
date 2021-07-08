const config = {
    observerSelector: ".view-lines,.diff-chunk-inner",
    matchSelector: ".code-diff,.view-line > span > span",
    match: function (element) {
        const $element = $(element);
        const text = $element.html().replace(/\&nbsp\;/g, " ");
        const matches = text.match(this.regexp);

        if (matches) {
            const comment = matches[0];
            const type = matches[2];
            const id = matches[3];
            const icon = `<div class="speacode-icon speacode-icon-${type}" data-id="${id}"></div>`;

            $element.html(
                text
                    .replace(
                        this.regexp,
                        "[[speacode_icon_placeholder]]" + comment
                    )
                    .replace(/ /g, "&nbsp;")
                    .replace("[[speacode_icon_placeholder]]", icon)
            );

            console.log("Found " + comment);
            console.log(`Type: ${type}, ID: ${id}`);
        }
    },
};

new App(config);
