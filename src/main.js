// CHUNITHM Random Picker

(function () {
    "use strict";

    var STORAGE_KEY = "chuni_unplayed_database";
    var SETTINGS_KEY = "chuni_random_picker_settings";
    var GENRE_ENTRY_URL =
        "/chuni-mobile/html/mobile/record/musicGenre/";
    var LEVEL_ENTRY_URL =
        "/chuni-mobile/html/mobile/record/musicLevel/";
    var MIN_LEVEL_VALUE = 12; // LEVEL 10
    var SSS_SCORE = 1007500;
    var UNLOCK_REQUIRED_CHARTS = [
        ["プリズム△▽リズム", "MASTER"],
        ["ARAIS", "MASTER"],
        ["勦滅", "MASTER"],
        ["Individual on parade!", "MASTER"],
        ["アイシング・ドリーム", "MASTER"],
        ["いちげき！のテーマ", "MASTER"],
        ["Pastel Sprinkles", "MASTER"],
        ["Honey Bear", "MASTER"],
        ["ALLNIGHT_DANCER", "MASTER"],
        ["Garakuta Doll Play(sasakure.UK clutter remix)", "MASTER"],
        ["神鳴", "MASTER"],
        ["Tru'nembra", "MASTER"],
        ["Everything Will Be One", "MASTER"],
        ["ナラク・オン・エア", "MASTER"],
        ["システム", "MASTER"],
        ["恋伯色", "MASTER"],
        ["OUTRAGE", "MASTER"],
        ["Warp Speed", "MASTER"],
        ["In the Straying Story", "MASTER"],
        ["PhenomenoN", "MASTER"],
        ["輪廻玲々", "MASTER"],
        ["hyperreality", "MASTER"],
        ["Deep Blue", "MASTER"],
        ["DEvourER", "MASTER"],
        ["創 -汝ら新世界へ歩む者なり-", "MASTER"],
        ["魔法に照らされたアンコール", "MASTER"],
        ["ジナ", "MASTER"],
        ["Road to Aventura", "MASTER"],
        ["☆をつなぐシュトラール", "MASTER"],
        ["MOMOCO68000", "MASTER"],
        ["〚回帰〛 ～Scherzo ~フォルトゥーナの悪戯~", "MASTER"],
        ["tHE uNcontRollaBle ciNdeRella", "MASTER"],
        ["轆轤首", "MASTER"],
        ["天地のうた", "MASTER"],
        ["Aether Wind", "MASTER"],
        ["そして春めくモノローグ", "MASTER"],
        ["Sweet & Sour", "MASTER"],
        ["パステル・シタイ！", "MASTER"],
        ["彩祭ワンダーワン！", "MASTER"],
        ["Fly Better!", "MASTER"],
        ["Phantom Crisis", "MASTER"],
        ["Beenden", "MASTER"],
        ["EFX", "MASTER"],
        ["薄明のクオリア", "MASTER"],
        ["月葬", "MASTER"],
        ["YOUNITHM", "MASTER"],
        ["YOUNITHM", "ULTIMA"],
        ["Melodiniq", "MASTER"],
        ["Melodiniq", "ULTIMA"],
        ["Linked Tune", "MASTER"],
        ["ひなたでワチャチャ", "MASTER"],
        ["白昼熱演", "MASTER"],
        ["絶対一生これで生きていく！", "MASTER"],
        ["Luminous CANDY", "MASTER"],
        ["SOMA TONE", "MASTER"],
        ["Tachy∅n", "MASTER"],
        ["ちゅ、お注射。", "MASTER"],
        ["チュウニペンギンのテーマ～左下より愛をこめて～", "MASTER"]
    ];

    var MODE_DEFINITIONS = {
        UNPLAYED: {
            title: "CHUNITHM UNPLAYED PICKER",
            label: "未プレイ",
            theme: {
                accent: "#e7473d",
                accentDark: "#9f2924",
                panel: "#2a2020",
                text: "#ffffff",
                buttonText: "#ffffff"
            }
        },
        SSS_CHALLENGE: {
            title: "CHUNITHM SSS CHALLENGE",
            label: "SSS未達成",
            theme: {
                accent: "#68127f",
                accentDark: "#3b0a49",
                panel: "#261b2a",
                text: "#ffffff",
                buttonText: "#ffffff"
            }
        },
        AJ_CHALLENGE: {
            title: "CHUNITHM AJ CHALLENGE",
            label: "AJ未達成",
            theme: {
                accent:
                    "linear-gradient(135deg,rgba(255,255,255,.38)," +
                    "rgba(193,213,173,.32))," +
                    "repeating-conic-gradient(from 18deg at 30% 45%," +
                    "#e8efd7 0deg 14deg,#cbd9eb 14deg 27deg," +
                    "#ddd1eb 27deg 39deg,#d4e7cf 39deg 53deg)",
                accentDark: "#98aaa2",
                panel:
                    "linear-gradient(145deg,rgba(250,253,240,.94)," +
                    "rgba(225,234,247,.92) 48%,rgba(233,242,218,.94))," +
                    "repeating-conic-gradient(from 22deg at 35% 35%," +
                    "#edf3dc 0deg 12deg,#d2dced 12deg 25deg," +
                    "#e2d7ed 25deg 38deg,#d7ead1 38deg 52deg)",
                surface: "rgba(255,255,255,.68)",
                control: "rgba(244,248,242,.9)",
                text: "#172125",
                muted: "#4d5c62",
                buttonBackground: "#d8e6d7",
                buttonBorder: "#9fb2a8",
                buttonText: "#172125"
            }
        },
        ALL_TRACKS: {
            title: "CHUNITHM RANDOM PICKER",
            label: "全曲",
            theme: {
                accent:
                    "linear-gradient(110deg,rgba(0,112,28,.78) 0%," +
                    "rgba(2,20,8,.74) 23%,rgba(176,0,0,.82) 42%," +
                    "rgba(90,0,18,.82) 65%,rgba(0,0,116,.86) 100%)," +
                    "repeating-conic-gradient(from 35deg at 25% 55%," +
                    "#063f10 0deg 12deg,#061507 12deg 24deg," +
                    "#780606 24deg 38deg,#23050b 38deg 51deg," +
                    "#080858 51deg 65deg,#020617 65deg 78deg)",
                accentDark: "#01040a",
                panel:
                    "linear-gradient(145deg,#0b111a,#04070d 60%,#101324)",
                surface: "rgba(0,0,0,.32)",
                control: "#182231",
                text: "#ffffff",
                muted: "#c9d3df",
                buttonBackground: "#131d2c",
                buttonBorder: "#3157c8",
                buttonText: "#ffffff"
            }
        }
    };

    var App = {
        data: null,
        settings: null,
        ui: {},
        state: {
            difficulty: "BOTH",
            mode: "UNPLAYED",
            candidates: [],
            busy: false
        }
    };

    init();
    installDeveloperTools();

    function init() {
        removePreviousUI();
        App.settings = loadSettings();
        App.data = normalizeStoredData(loadData());
        createUI();
        refreshMode();
        updateDisplay();
    }

    function removePreviousUI() {
        var previous = document.getElementById("chuni-random-picker");
        var utility = document.getElementById("chuni-random-picker-utility");

        if (previous) previous.remove();
        if (utility) utility.remove();
    }

    function emptyData() {
        return {
            MASTER: [],
            ULTIMA: []
        };
    }

    function loadData() {
        try {
            var json = localStorage.getItem(STORAGE_KEY);
            return json ? JSON.parse(json) : emptyData();
        } catch (error) {
            return emptyData();
        }
    }

    function loadSettings() {
        try {
            var json = localStorage.getItem(SETTINGS_KEY);
            var settings = json ? JSON.parse(json) : {};

            return {
                hideLocked: settings.hideLocked === true
            };
        } catch (error) {
            return {
                hideLocked: false
            };
        }
    }

    function saveSettings() {
        localStorage.setItem(
            SETTINGS_KEY,
            JSON.stringify(App.settings)
        );
    }

    function normalizeStoredData(data) {
        var normalized = emptyData();

        ["MASTER", "ULTIMA"].forEach(function (difficulty) {
            var list = data && Array.isArray(data[difficulty])
                ? data[difficulty]
                : [];

            normalized[difficulty] = list.map(function (song) {
                if (typeof song === "string") {
                    var legacyRequiresUnlock =
                        isUnlockRequired(difficulty, song);

                    return {
                        name: song,
                        genre: "不明",
                        level: "不明",
                        score: null,
                        played: false,
                        lamp: null,
                        hasAJ: false,
                        requiresUnlock: legacyRequiresUnlock,
                        locked: legacyRequiresUnlock
                    };
                }

                var name = song.name || "";
                var requiresUnlock =
                    isUnlockRequired(difficulty, name);
                var played = typeof song.played === "boolean"
                    ? song.played
                    : typeof song.score === "number";

                return {
                    name: name,
                    genre: song.genre || "不明",
                    level: song.level || "不明",
                    score: typeof song.score === "number"
                        ? song.score
                        : null,
                    played: played,
                    lamp: song.lamp || null,
                    hasAJ: song.hasAJ === true ||
                        song.lamp === "ALL_JUSTICE" ||
                        song.lamp === "ALL_JUSTICE_CRITICAL",
                    requiresUnlock: requiresUnlock,
                    locked: requiresUnlock && !played
                };
            }).filter(function (song) {
                return song.name;
            });
        });

        return normalized;
    }

    function saveData(data) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    }

    function createUI() {
        var box = document.createElement("div");
        box.id = "chuni-random-picker";
        box.style.cssText =
            "position:fixed;top:10px;right:10px;width:min(360px," +
            "calc(100vw - 20px));max-height:calc(100vh - 20px);" +
            "overflow:auto;box-sizing:border-box;background:#171c23;" +
            "color:#fff;padding:0;z-index:2147483646;border-radius:14px;" +
            "border:2px solid #e7473d;box-shadow:0 10px 30px rgba(0,0,0,.55);" +
            "font-family:-apple-system,BlinkMacSystemFont,'Segoe UI'," +
            "'Noto Sans JP',sans-serif;font-size:14px;line-height:1.5;";

        box.innerHTML =
            "<div id='crp-accent' style='height:6px;background:#e7473d'></div>" +
            "<div style='padding:16px'>" +
                "<div style='position:relative;min-height:25px'>" +
                    "<div id='crp-title' style='min-width:0;padding:0 30px;" +
                        "font-size:16px;font-weight:800;letter-spacing:.015em;" +
                        "line-height:1.35;text-align:center;" +
                        "overflow-wrap:anywhere'></div>" +
                    "<button id='crp-close' type='button' title='閉じる' " +
                        "style='position:absolute;top:0;right:0;width:26px;" +
                        "height:26px;padding:0;border:0;background:transparent;" +
                        "color:#fff;font-size:19px;line-height:1;cursor:pointer'>×</button>" +
                "</div>" +
                "<div id='crp-status' style='margin-top:12px;padding:10px 12px;" +
                    "background:rgba(0,0,0,.25);border-radius:9px'></div>" +
                "<div id='crp-message' style='min-height:21px;margin-top:8px;" +
                    "font-size:12px;color:#d7dce3'></div>" +
                "<div style='display:flex;gap:8px;margin-top:10px'>" +
                    "<button id='crp-update' type='button' " +
                        "style='flex:1;padding:9px;border:0;border-radius:8px;" +
                        "font-weight:700;cursor:pointer'>一括更新</button>" +
                    "<button id='crp-utility' type='button' " +
                        "style='padding:9px 12px;border:1px solid #687383;" +
                        "border-radius:8px;background:#252d38;color:#fff;" +
                        "cursor:pointer'>Utility</button>" +
                "</div>" +
                "<select id='crp-difficulty' style='width:100%;height:40px;" +
                    "margin-top:12px;border:1px solid #687383;border-radius:8px;" +
                    "background:#252d38;color:#fff;padding:0 10px;font-size:14px'>" +
                    "<option value='BOTH'>MASTER + ULTIMA</option>" +
                    "<option value='MASTER'>MASTERのみ</option>" +
                    "<option value='ULTIMA'>ULTIMAのみ</option>" +
                "</select>" +
                "<div style='display:flex;gap:8px;align-items:center;margin-top:10px'>" +
                    "<label for='crp-count' style='white-space:nowrap'>曲数</label>" +
                    "<input id='crp-count' inputmode='numeric' value='3' " +
                        "style='width:60px;height:38px;box-sizing:border-box;" +
                        "border:1px solid #687383;border-radius:8px;" +
                        "background:#252d38;color:#fff;padding:0 8px'>" +
                    "<button id='crp-pick' type='button' " +
                        "style='flex:1;height:38px;border:0;border-radius:8px;" +
                        "font-weight:800;cursor:pointer'>抽選</button>" +
                "</div>" +
                "<div id='crp-result' style='margin-top:12px'></div>" +
            "</div>";

        document.body.appendChild(box);

        App.ui.box = box;
        App.ui.title = box.querySelector("#crp-title");
        App.ui.accent = box.querySelector("#crp-accent");
        App.ui.status = box.querySelector("#crp-status");
        App.ui.message = box.querySelector("#crp-message");
        App.ui.update = box.querySelector("#crp-update");
        App.ui.utility = box.querySelector("#crp-utility");
        App.ui.pick = box.querySelector("#crp-pick");
        App.ui.result = box.querySelector("#crp-result");
        App.ui.difficulty = box.querySelector("#crp-difficulty");
        App.ui.count = box.querySelector("#crp-count");
        App.ui.close = box.querySelector("#crp-close");

        box.querySelector("#crp-close").onclick = function () {
            box.remove();
        };

        box.querySelector("#crp-utility").onclick = createUtilityUI;

        App.ui.difficulty.onchange = function () {
            App.state.difficulty = this.value;
            updateDisplay();
        };

        App.ui.pick.onclick = function () {
            var count = Number(App.ui.count.value) || 3;
            drawCards(pickRandom(count));
        };

        App.ui.update.onclick = updateAll;
    }

    function createUtilityUI() {
        var previous = document.getElementById(
            "chuni-random-picker-utility"
        );
        if (previous) previous.remove();

        var utility = document.createElement("div");
        utility.id = "chuni-random-picker-utility";
        utility.style.cssText =
            "position:fixed;top:16px;right:16px;width:min(330px," +
            "calc(100vw - 32px));box-sizing:border-box;background:#171c23;" +
            "color:#fff;padding:16px;z-index:2147483647;border-radius:14px;" +
            "border:2px solid #8b96a6;box-shadow:0 10px 30px rgba(0,0,0,.55);" +
            "font-family:-apple-system,BlinkMacSystemFont,'Segoe UI'," +
            "'Noto Sans JP',sans-serif;font-size:14px;";

        utility.innerHTML =
            "<div style='font-size:17px;font-weight:800'>Utility</div>" +
            "<div style='margin-top:12px'>MASTER: " +
                App.data.MASTER.length + "曲<br>ULTIMA: " +
                App.data.ULTIMA.length + "曲</div>" +
            "<label style='display:flex;gap:8px;align-items:flex-start;" +
                "margin-top:14px;padding:10px;background:rgba(0,0,0,.2);" +
                "border-radius:8px;cursor:pointer'>" +
                "<input id='crp-hide-locked' type='checkbox' " +
                    (App.settings.hideLocked ? "checked" : "") + ">" +
                "<span>解禁が必要な曲を抽選から除外</span>" +
            "</label>" +
            "<div style='display:flex;gap:8px;margin-top:16px'>" +
                "<button id='crp-delete' type='button' style='flex:1;" +
                    "padding:9px;border:1px solid #dc5b5b;border-radius:8px;" +
                    "background:#3a2024;color:#fff'>データ削除</button>" +
                "<button id='crp-util-close' type='button' style='flex:1;" +
                    "padding:9px;border:1px solid #687383;border-radius:8px;" +
                    "background:#252d38;color:#fff'>閉じる</button>" +
            "</div>";

        document.body.appendChild(utility);

        utility.querySelector("#crp-util-close").onclick = function () {
            utility.remove();
        };

        utility.querySelector("#crp-hide-locked").onchange = function () {
            App.settings.hideLocked = this.checked;
            saveSettings();
            refreshMode();
            updateDisplay();
            App.ui.result.innerHTML = "";
            setMessage(
                this.checked
                    ? "解禁が必要な曲を抽選対象から除外しました"
                    : "解禁が必要な曲を抽選対象へ戻しました"
            );
        };

        utility.querySelector("#crp-delete").onclick = function () {
            if (!window.confirm("保存データを削除しますか？")) return;
            localStorage.removeItem(STORAGE_KEY);
            App.data = emptyData();
            refreshMode();
            updateDisplay();
            utility.remove();
            setMessage("保存データを削除しました");
        };
    }

    function refreshMode() {
        var all = flattenSongs().filter(function (song) {
            return !App.settings.hideLocked || !song.locked;
        });
        var unplayed = all.filter(function (song) {
            return !song.played;
        });
        var belowSSS = all.filter(function (song) {
            return song.played && song.score < SSS_SCORE;
        });
        var withoutAJ = all.filter(function (song) {
            return !song.hasAJ;
        });

        if (unplayed.length > 0 || all.length === 0) {
            App.state.mode = "UNPLAYED";
            App.state.candidates = unplayed;
        } else if (belowSSS.length > 0) {
            App.state.mode = "SSS_CHALLENGE";
            App.state.candidates = belowSSS;
        } else if (withoutAJ.length > 0) {
            App.state.mode = "AJ_CHALLENGE";
            App.state.candidates = withoutAJ;
        } else {
            App.state.mode = "ALL_TRACKS";
            App.state.candidates = all;
        }
    }

    function flattenSongs() {
        var result = [];

        ["MASTER", "ULTIMA"].forEach(function (difficulty) {
            App.data[difficulty].forEach(function (song) {
                result.push({
                    difficulty: difficulty,
                    name: song.name,
                    genre: song.genre,
                    level: song.level,
                    score: song.score,
                    played: song.played,
                    lamp: song.lamp,
                    hasAJ: song.hasAJ,
                    requiresUnlock: song.requiresUnlock === true,
                    locked: song.locked === true
                });
            });
        });

        return result;
    }

    function candidatesForDifficulty() {
        var difficulty = App.state.difficulty;

        return App.state.candidates.filter(function (song) {
            return difficulty === "BOTH" ||
                song.difficulty === difficulty;
        });
    }

    function updateDisplay() {
        if (!App.ui.box) return;

        var definition = MODE_DEFINITIONS[App.state.mode];
        var theme = definition.theme;
        var masterCount = App.state.candidates.filter(function (song) {
            return song.difficulty === "MASTER";
        }).length;
        var ultimaCount = App.state.candidates.filter(function (song) {
            return song.difficulty === "ULTIMA";
        }).length;
        var lockedCount = App.state.candidates.filter(function (song) {
            return song.locked;
        }).length;

        App.ui.title.textContent = definition.title;
        App.ui.box.style.borderColor = theme.accentDark;
        App.ui.box.style.background = theme.panel;
        App.ui.box.style.color = theme.text;
        App.ui.accent.style.background = theme.accent;
        App.ui.title.style.color = theme.text;
        App.ui.close.style.color = theme.text;
        App.ui.status.style.background =
            theme.surface || "rgba(0,0,0,.25)";
        App.ui.status.style.color = theme.text;
        App.ui.message.style.color = theme.muted || "#d7dce3";

        [App.ui.update, App.ui.pick].forEach(function (button) {
            button.style.background =
                theme.buttonBackground || theme.accent;
            button.style.color = theme.buttonText;
            button.style.borderStyle = "solid";
            button.style.borderWidth = "1px";
            button.style.borderColor =
                theme.buttonBorder || "transparent";
        });

        [App.ui.utility, App.ui.difficulty, App.ui.count]
            .forEach(function (control) {
                control.style.background = theme.control || "#252d38";
                control.style.color = theme.text;
                control.style.borderColor = theme.accentDark;
            });

        App.ui.status.innerHTML =
            "<div style='font-size:12px;opacity:.8'>" +
                escapeHTML(definition.label) + "対象</div>" +
            "<div style='display:grid;grid-template-columns:1fr auto;" +
                "gap:2px 14px;margin:4px auto 0;max-width:180px;" +
                "font-variant-numeric:tabular-nums'>" +
                "<span>MASTER</span><strong>" + masterCount + "曲</strong>" +
                "<span>ULTIMA</span><strong>" + ultimaCount + "曲</strong>" +
                "<span>合計</span><strong>" +
                    (masterCount + ultimaCount) + "曲</strong>" +
                (lockedCount > 0
                    ? "<span>🔒 解禁要</span><strong>" +
                        lockedCount + "曲</strong>"
                    : "") +
            "</div>";

        App.ui.update.disabled = App.state.busy;
        App.ui.pick.disabled = App.state.busy;
        App.ui.update.style.opacity = App.state.busy ? ".55" : "1";
        App.ui.pick.style.opacity = App.state.busy ? ".55" : "1";
    }

    function setMessage(message) {
        if (App.ui.message) {
            App.ui.message.textContent = message || "";
        }
    }

    function setBusy(busy) {
        App.state.busy = busy;
        updateDisplay();
    }

    function pickRandom(count) {
        var pool = candidatesForDifficulty().slice();
        var result = [];

        while (result.length < count && pool.length > 0) {
            var index = Math.floor(Math.random() * pool.length);
            result.push(pool.splice(index, 1)[0]);
        }

        if (result.length === 0) {
            setMessage("選択中の難易度に抽選対象曲がありません");
        } else {
            setMessage("");
        }

        return result;
    }

    function drawCards(list) {
        if (!list.length) {
            App.ui.result.innerHTML = "";
            return;
        }

        App.ui.result.innerHTML = list.map(function (song, index) {
            var isMaster = song.difficulty === "MASTER";
            var difficultyBackground = isMaster
                ? "#9d20df"
                : "#111214";
            var difficultyBorder = isMaster
                ? "#b845ee"
                : "#30343a";
            var ultimaStripeLeft =
                "linear-gradient(45deg,transparent 0 18%," +
                "#ff3151 19% 34%,#6f6870 35% 40%," +
                "#ff3151 41% 56%,transparent 57% 100%)";
            var ultimaStripeRight =
                "linear-gradient(-45deg,transparent 0 18%," +
                "#ff3151 19% 34%,#6f6870 35% 40%," +
                "#ff3151 41% 56%,transparent 57% 100%)";

            return (
                "<div style='box-sizing:border-box;background:#fff;" +
                    "padding:5px;margin-top:9px;border-radius:7px;" +
                    "box-shadow:0 4px 10px rgba(0,0,0,.24)'>" +
                    "<div style='display:grid;grid-template-columns:auto " +
                        "minmax(0,1fr);gap:7px;align-items:center;" +
                        "min-height:29px;box-sizing:border-box;padding:4px 7px;" +
                        "background:#1d2b3a;color:#fff;overflow:hidden'>" +
                        "<span style='white-space:nowrap;font-size:12px;" +
                            "font-weight:900;letter-spacing:.02em'>" +
                            "TRACK " + (index + 1) + "</span>" +
                        "<div style='position:relative;min-width:0;overflow:hidden;" +
                            "box-sizing:border-box;background:" +
                            difficultyBackground + ";border:1px solid " +
                            difficultyBorder + ";min-height:22px;" +
                            "padding:2px 34px;border-radius:4px;" +
                            "font-size:11px;font-weight:900;text-align:center;" +
                            "line-height:1.35;box-shadow:inset 0 -1px 0 " +
                            "rgba(0,0,0,.2)'>" +
                            (!isMaster
                                ? "<span style='position:absolute;left:0;top:0;" +
                                    "bottom:0;width:34px;background:" +
                                    ultimaStripeLeft + "'></span>" +
                                  "<span style='position:absolute;right:0;top:0;" +
                                    "bottom:0;width:34px;background:" +
                                    ultimaStripeRight + "'></span>"
                                : "") +
                            "<span style='position:relative;z-index:1;" +
                                "overflow-wrap:anywhere;word-break:break-word'>" +
                                escapeHTML(song.difficulty) + " / " +
                                escapeHTML(song.genre || "不明") +
                            "</span>" +
                            (song.locked
                                ? "<span title='解禁が必要な可能性があります' " +
                                    "aria-label='解禁が必要な可能性があります' " +
                                    "style='position:absolute;top:50%;right:5px;" +
                                    "transform:translateY(-50%);white-space:nowrap;" +
                                    "z-index:2;background:rgba(0,0,0,.55);" +
                                    "padding:1px 4px;border-radius:4px;" +
                                    "font-size:11px'>🔒</span>"
                                : "") +
                        "</div>" +
                    "</div>" +
                    "<div style='position:relative;display:flex;align-items:center;" +
                        "justify-content:flex-start;min-height:44px;" +
                        "background:#faf9d9;color:#080808;" +
                        "padding:8px 48px 8px 12px;box-sizing:border-box'>" +
                        "<div style='min-width:0;width:100%;font-size:16px;" +
                            "font-weight:800;line-height:1.35;text-align:left;" +
                            "overflow-wrap:anywhere;word-break:break-word'>" +
                            escapeHTML(song.name) + "</div>" +
                        "<span style='position:absolute;top:50%;right:0;" +
                            "transform:translateY(-50%);white-space:nowrap;" +
                            "background:" + difficultyBackground + ";" +
                            "border:1px solid " + difficultyBorder + ";" +
                            "color:#fff;padding:3px 7px;border-radius:5px;" +
                            "font-size:13px;font-weight:900'>" +
                            escapeHTML(song.level || "不明") + "</span>" +
                    "</div>" +
                "</div>"
            );
        }).join("");
    }

    function updateAll() {
        if (App.state.busy) return;

        setBusy(true);
        setMessage("取得準備中…");

        Promise.all([
            fetchAllSongs(),
            fetchLevelMap()
        ]).then(function (result) {
            var freshData = result[0];
            var levelMap = result[1];

            ["MASTER", "ULTIMA"].forEach(function (difficulty) {
                freshData[difficulty].forEach(function (song) {
                    var key = songKey(difficulty, song.name);
                    song.level = levelMap[key] || "不明";
                });
            });

            saveData(freshData);
            App.data = freshData;
            refreshMode();
            App.ui.result.innerHTML = "";
            setMessage(
                "更新完了：MASTER " + freshData.MASTER.length +
                "曲 / ULTIMA " + freshData.ULTIMA.length + "曲"
            );
        }).catch(function (error) {
            console.error("[CHUNITHM Random Picker]", error);
            setMessage(
                "取得に失敗しました。CHUNITHM-NETへのログイン状態を" +
                "確認してください。既存データは保持されています。"
            );
        }).then(function () {
            setBusy(false);
        });
    }

    function fetchAllSongs() {
        setMessage("楽曲一覧の入口を取得中…");

        return fetchHTML(GENRE_ENTRY_URL).then(function (entry) {
            assertNotErrorPage(entry);

            var select = entry.doc.querySelector("select[name='genre']");
            var form = select && select.closest("form");

            if (!form) {
                throw new Error("ジャンル検索フォームが見つかりません");
            }

            var params = formParameters(form);
            params.set("genre", "99");

            setMessage("MASTERを取得中…");

            return postHTML(
                "/chuni-mobile/html/mobile/record/musicGenre/sendMaster",
                params
            ).then(function (master) {
                assertNotErrorPage(master);
                setMessage("ULTIMAを取得中…");

                return postHTML(
                    "/chuni-mobile/html/mobile/record/musicGenre/sendUltima",
                    params
                ).then(function (ultima) {
                    assertNotErrorPage(ultima);

                    return {
                        MASTER: parseMusicList(master.doc, "MASTER"),
                        ULTIMA: parseMusicList(ultima.doc, "ULTIMA")
                    };
                });
            });
        });
    }

    function parseMusicList(doc, difficulty) {
        var songs = [];
        var genre = "不明";

        Array.from(
            doc.querySelectorAll(".genre,.musiclist_box")
        ).forEach(function (element) {
            if (element.classList.contains("genre")) {
                genre = element.textContent.trim() || "不明";
                return;
            }

            var title = element.querySelector(".music_title");
            if (!title) return;

            var scoreElement =
                element.querySelector(".play_musicdata_highscore");
            var score = scoreElement
                ? parseScore(scoreElement.textContent)
                : null;
            var lamp = parseLamp(element);
            var name = title.textContent.trim();
            var played = score !== null;
            var requiresUnlock =
                isUnlockRequired(difficulty, name);

            songs.push({
                name: name,
                genre: genre,
                level: "不明",
                score: score,
                played: played,
                lamp: lamp,
                hasAJ: lamp === "ALL_JUSTICE" ||
                    lamp === "ALL_JUSTICE_CRITICAL",
                requiresUnlock: requiresUnlock,
                locked: requiresUnlock && !played
            });
        });

        if (songs.length === 0) {
            throw new Error(difficulty + "の楽曲が取得できませんでした");
        }

        return songs;
    }

    function parseScore(text) {
        var match = String(text).match(/([0-9][0-9,]*)/);
        if (!match) return null;

        var score = Number(match[1].replace(/,/g, ""));
        return isFinite(score) ? score : null;
    }

    function parseLamp(element) {
        var files = Array.from(element.querySelectorAll("img"))
            .map(function (image) {
                return image.src.split("/").pop().split("?")[0];
            });

        if (files.indexOf("icon_alljusticecritical.png") !== -1) {
            return "ALL_JUSTICE_CRITICAL";
        }
        if (files.indexOf("icon_alljustice.png") !== -1) {
            return "ALL_JUSTICE";
        }
        if (files.indexOf("icon_fullcombo.png") !== -1) {
            return "FULL_COMBO";
        }
        if (files.indexOf("icon_clear.png") !== -1) {
            return "CLEAR";
        }

        return null;
    }

    function fetchLevelMap() {
        setMessage("レベル検索フォームを取得中…");

        return fetchHTML(LEVEL_ENTRY_URL).then(function (entry) {
            assertNotErrorPage(entry);

            var select = entry.doc.querySelector("select[name='level']");
            var form = select && select.closest("form");

            if (!form) {
                throw new Error("レベル検索フォームが見つかりません");
            }

            var levels = Array.from(select.options)
                .map(function (option) {
                    return {
                        value: option.value,
                        label: option.textContent
                            .replace(/^LEVEL\s*/i, "")
                            .trim()
                    };
                }).filter(function (level) {
                    return Number(level.value) >= MIN_LEVEL_VALUE;
                });

            var params = formParameters(form);
            var action = form.action ||
                "/chuni-mobile/html/mobile/record/musicLevel/sendSearch/";
            var map = {};
            var index = 0;

            function next() {
                if (index >= levels.length) {
                    return Promise.resolve(map);
                }

                var level = levels[index++];
                var currentParams = new URLSearchParams(params.toString());
                currentParams.set("level", level.value);
                setMessage(
                    "レベル " + level.label + " を取得中（" +
                    index + "/" + levels.length + "）"
                );

                return postHTML(action, currentParams)
                    .then(function (result) {
                        assertNotErrorPage(result);
                        collectLevels(result.doc, level.label, map);
                        return next();
                    });
            }

            return next();
        });
    }

    function collectLevels(doc, level, map) {
        Array.from(doc.querySelectorAll(".musiclist_box"))
            .forEach(function (box) {
                var difficulty = null;
                var container =
                    box.closest("form") || box.parentElement || box;

                if (
                    box.classList.contains("bg_master") ||
                    container.querySelector(".bg_master")
                ) {
                    difficulty = "MASTER";
                } else if (
                    box.classList.contains("bg_ultima") ||
                    container.querySelector(".bg_ultima")
                ) {
                    difficulty = "ULTIMA";
                }

                if (!difficulty) return; // EXPERTなどは除外

                var title = box.querySelector(".music_title");
                if (!title) return;

                map[songKey(difficulty, title.textContent)] = level;
            });
    }

    function songKey(difficulty, title) {
        return difficulty + "\u0000" +
            String(title).replace(/\s+/g, " ").trim();
    }

    function isUnlockRequired(difficulty, title) {
        var key = songKey(difficulty, title);

        return UNLOCK_REQUIRED_CHARTS.some(function (entry) {
            return songKey(entry[1], entry[0]) === key;
        });
    }

    function formParameters(form) {
        var params = new URLSearchParams();

        Array.from(form.querySelectorAll("input,select"))
            .forEach(function (element) {
                if (element.name) {
                    params.set(element.name, element.value);
                }
            });

        return params;
    }

    function fetchHTML(url) {
        return fetch(url, {
            credentials: "same-origin"
        }).then(readHTMLResponse);
    }

    function postHTML(url, params) {
        return fetch(url, {
            method: "POST",
            credentials: "same-origin",
            headers: {
                "Content-Type":
                    "application/x-www-form-urlencoded;charset=UTF-8"
            },
            body: params.toString()
        }).then(readHTMLResponse);
    }

    function readHTMLResponse(response) {
        return response.text().then(function (html) {
            return {
                response: response,
                html: html,
                doc: new DOMParser().parseFromString(html, "text/html")
            };
        });
    }

    function assertNotErrorPage(result) {
        var text = result.doc.body
            ? result.doc.body.textContent
            : "";
        var isError = /Error Code:|不正なアクセスです/.test(text);

        if (!result.response.ok || isError) {
            throw new Error(
                "CHUNITHM-NET error: " +
                result.response.status + " " +
                result.response.url
            );
        }
    }

    function installDeveloperTools() {
        var previewSongs = {
            UNPLAYED: [
                createPreviewSong(
                    "MASTER",
                    "未プレイ確認用楽曲",
                    "POPS & ANIME",
                    "12+",
                    null,
                    false
                ),
                createPreviewSong(
                    "ULTIMA",
                    "非常に長い曲名が入った場合の折り返し表示確認用楽曲",
                    "ORIGINAL",
                    "14",
                    null,
                    false,
                    true
                )
            ],
            SSS_CHALLENGE: [
                createPreviewSong(
                    "MASTER",
                    "SSSチャレンジ確認用楽曲",
                    "niconico",
                    "13+",
                    1007000,
                    false
                ),
                createPreviewSong(
                    "ULTIMA",
                    "SSS未達成のULTIMA確認用楽曲",
                    "VARIETY",
                    "14+",
                    1005000,
                    false
                )
            ],
            AJ_CHALLENGE: [
                createPreviewSong(
                    "MASTER",
                    "AJチャレンジ確認用楽曲",
                    "東方Project",
                    "14",
                    1009000,
                    false
                ),
                createPreviewSong(
                    "ULTIMA",
                    "SSS達成済み・AJ未達成確認用楽曲",
                    "ORIGINAL",
                    "15",
                    1009500,
                    false
                )
            ],
            ALL_TRACKS: [
                createPreviewSong(
                    "MASTER",
                    "全曲抽選確認用楽曲",
                    "ゲキマイ",
                    "13",
                    1010000,
                    true
                ),
                createPreviewSong(
                    "ULTIMA",
                    "RANDOM PICKER EXTRAテーマ確認用楽曲",
                    "イロドリミドリ",
                    "15+",
                    1010000,
                    true
                )
            ]
        };

        window.CHUNITHM_PICKER_DEV = {
            preview: function (mode) {
                var normalizedMode = String(mode || "").toUpperCase();

                if (!previewSongs[normalizedMode]) {
                    throw new Error(
                        "mode must be UNPLAYED, SSS_CHALLENGE, " +
                        "AJ_CHALLENGE, or ALL_TRACKS"
                    );
                }

                App.state.mode = normalizedMode;
                App.state.candidates = previewSongs[normalizedMode].slice();
                App.state.difficulty = "BOTH";
                App.ui.difficulty.value = "BOTH";
                updateDisplay();
                drawCards(App.state.candidates);
                setMessage(
                    "表示確認モードです。保存データは変更されていません。"
                );

                return normalizedMode;
            },

            restore: function () {
                refreshMode();
                updateDisplay();
                App.ui.result.innerHTML = "";
                setMessage("通常表示へ戻しました");
                return App.state.mode;
            },

            runModeTests: runModeTests,
            unlockReport: getUnlockReport
        };
    }

    function getUnlockReport() {
        var rows = UNLOCK_REQUIRED_CHARTS.map(function (entry) {
            var name = entry[0];
            var difficulty = entry[1];
            var song = App.data[difficulty].filter(function (item) {
                return songKey(difficulty, item.name) ===
                    songKey(difficulty, name);
            })[0];

            return {
                name: name,
                difficulty: difficulty,
                found: !!song,
                played: song ? song.played : null,
                locked: song ? song.locked : null
            };
        });

        return {
            definitions: rows.length,
            found: rows.filter(function (row) {
                return row.found;
            }).length,
            locked: rows.filter(function (row) {
                return row.locked;
            }).length,
            unmatched: rows.filter(function (row) {
                return !row.found;
            }),
            rows: rows
        };
    }

    function createPreviewSong(
        difficulty,
        name,
        genre,
        level,
        score,
        hasAJ,
        locked
    ) {
        return {
            difficulty: difficulty,
            name: name,
            genre: genre,
            level: level,
            score: score,
            played: score !== null,
            lamp: hasAJ ? "ALL_JUSTICE" : null,
            hasAJ: hasAJ,
            requiresUnlock: locked === true,
            locked: locked === true
        };
    }

    function runModeTests() {
        var originalData = App.data;
        var originalMode = App.state.mode;
        var originalCandidates = App.state.candidates;
        var tests = [
            {
                name: "未プレイ曲があればUNPLAYED",
                expectedMode: "UNPLAYED",
                expectedCount: 1,
                data: {
                    MASTER: [
                        createStoredTestSong(null, false),
                        createStoredTestSong(1009000, true)
                    ],
                    ULTIMA: []
                }
            },
            {
                name: "全曲プレイ後はSSS_CHALLENGE",
                expectedMode: "SSS_CHALLENGE",
                expectedCount: 1,
                data: {
                    MASTER: [
                        createStoredTestSong(1007000, false),
                        createStoredTestSong(1008000, false)
                    ],
                    ULTIMA: []
                }
            },
            {
                name: "全曲SSS後はAJ_CHALLENGE",
                expectedMode: "AJ_CHALLENGE",
                expectedCount: 1,
                data: {
                    MASTER: [
                        createStoredTestSong(1008000, false),
                        createStoredTestSong(1009000, true)
                    ],
                    ULTIMA: []
                }
            },
            {
                name: "全曲AJ後はALL_TRACKS",
                expectedMode: "ALL_TRACKS",
                expectedCount: 2,
                data: {
                    MASTER: [
                        createStoredTestSong(1009000, true)
                    ],
                    ULTIMA: [
                        createStoredTestSong(1010000, true)
                    ]
                }
            }
        ];

        var results = tests.map(function (test) {
            App.data = test.data;
            refreshMode();

            return {
                name: test.name,
                expectedMode: test.expectedMode,
                actualMode: App.state.mode,
                expectedCount: test.expectedCount,
                actualCount: App.state.candidates.length,
                passed:
                    App.state.mode === test.expectedMode &&
                    App.state.candidates.length === test.expectedCount
            };
        });

        App.data = originalData;
        App.state.mode = originalMode;
        App.state.candidates = originalCandidates;

        return {
            passed: results.every(function (test) {
                return test.passed;
            }),
            results: results
        };
    }

    function createStoredTestSong(score, hasAJ) {
        return {
            name: "TEST",
            genre: "TEST",
            level: "14",
            score: score,
            played: score !== null,
            lamp: hasAJ ? "ALL_JUSTICE" : null,
            hasAJ: hasAJ,
            requiresUnlock: false,
            locked: false
        };
    }

    function escapeHTML(value) {
        return String(value == null ? "" : value)
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#39;");
    }
})();
