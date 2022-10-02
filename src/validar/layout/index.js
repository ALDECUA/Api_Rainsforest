const fs = require("fs");

async function layoutHtml(path, data, subpath, subdata) {
    let layout = await new Promise((resolve, reject) =>
        fs.readFile(
            `./src/validar/layout/${path}.html`,
            "utf8",
            (err, data) => {
                //if has error reject, otherwise resolve
                return err ? reject(err) : resolve(data);
            }
        )
    );

    if (subpath) {
        const subLayout = await new Promise((resolve, reject) =>
            fs.readFile(
                `./src/validar/layout/${subpath}.md`,
                "utf8",
                (err, data) => {
                    //if has error reject, otherwise resolve
                    return err ? reject(err) : resolve(data);
                }
            )
        );
        Object.keys(subdata).forEach(function(key) {
            const find = new RegExp(`<//${key}//>`, 'g');
            layout = layout.replace(find, subLayout);
        });
    }

    if (data) {
        Object.keys(data).forEach(function(key) {
            const find = new RegExp(`<%${key}%>`, 'g');
            layout = layout.replace(find, data[key]);
        });
    }

    return layout;
}

module.exports = { layoutHtml };