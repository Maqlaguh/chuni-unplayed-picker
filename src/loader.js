(function () {
    "use strict";

    var baseUrl =
        "https://maqlaguh.github.io/chuni-unplayed-picker/";
    var versionKey = "chuni_picker_code_version";

    fetch(baseUrl + "version.json?t=" + Date.now(), {
        cache: "no-store"
    })
        .then(function (response) {
            if (!response.ok) {
                throw new Error("version " + response.status);
            }
            return response.json();
        })
        .then(function (manifest) {
            var version = String(manifest.version || "");
            var script = String(manifest.script || "main.js");
            var previous = localStorage.getItem(versionKey);

            if (!version) {
                throw new Error("version is empty");
            }

            return fetch(
                baseUrl + script + "?v=" + encodeURIComponent(version),
                { cache: "no-store" }
            )
                .then(function (response) {
                    if (!response.ok) {
                        throw new Error("script " + response.status);
                    }
                    return response.text();
                })
                .then(function (code) {
                    window.CHUNITHM_PICKER_VERSION_LOADER = true;
                    try {
                        (0, eval)(code);
                    } finally {
                        delete window.CHUNITHM_PICKER_VERSION_LOADER;
                    }
                    localStorage.setItem(versionKey, version);

                    if (previous && previous !== version) {
                        var message = document.getElementById("crp-message");
                        if (message) {
                            message.textContent =
                                "最新版へ更新しました：" +
                                previous +
                                " → " +
                                version;
                        }
                    }
                });
        })
        .catch(function (error) {
            console.error("[CHUNITHM Picker Loader]", error);
            alert(
                "ブックマークレットの読み込みに失敗しました。" +
                "時間をおいて再実行してください。"
            );
        });
})();
