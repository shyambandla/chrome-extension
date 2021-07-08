const config = {
    observerSelector: ".blob-code",
    matchSelector: ".blob-code-inner",
    match: function (element) {
        const $element = $(element);
        const text = $element
            .html()
            .replace(/\<span class=\"[^\"]+\"\>|<\/span>/g, "");
        const matches = text.match(this.regexp);

        if (matches) {
            const comment = matches[0];
            const type = matches[2];
            const id = matches[3];
            const $icon = $(
                `<div class="speacode-icon speacode-icon-${type}" data-id="${id}"></div>`
            );

            $icon.prependTo($element);

            console.log("Found " + comment);
            console.log(`Type: ${type}, ID: ${id}`);
        }
    },
};

new App(config);
