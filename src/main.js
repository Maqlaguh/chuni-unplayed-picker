// CHUNITHM Unplayed Picker V2

(function () {
    "use strict";

    const STORAGE_KEY = "chuni_unplayed_database";

    const App = {
        data: null,
        ui: {},
        state: {
            difficulty: "BOTH"
        }
    };

    init();

    function init() {
        App.data = loadData();
        createUI();
        updateStatus();
    }

    function loadData() {
        try {
            const json = localStorage.getItem(STORAGE_KEY);

            if (!json) {
                return {
                    MASTER: [],
                    ULTIMA: []
                };
            }

            return JSON.parse(json);

        } catch (e) {

            return {
                MASTER: [],
                ULTIMA: []
            };

        }
    }

    function saveData() {
        localStorage.setItem(
            STORAGE_KEY,
            JSON.stringify(App.data)
        );
    }

function createUI() {

    var box = document.createElement("div");

    box.style.cssText =
        "position:fixed;" +
        "top:20px;" +
        "right:20px;" +
        "width:330px;" +
        "background:#222;" +
        "color:white;" +
        "padding:20px;" +
        "z-index:999999;" +
        "border-radius:15px;" +
        "border:2px solid white;" +
        "box-shadow:0 0 15px #000";


    box.innerHTML =
        "CHUNITHM 未プレイ抽選<br>" +
        "<div id='st'><br></div>" +
        "<button id='update'>🔄 一括更新</button>" +
        "<button id='u'>⚙ Utility</button>" +
        "<br><br>" +
        "<div id='a'></div>" +
        "<br>" +
        "曲数：<input id='c' value='3' style='width:50px'>" +
        "<button id='b'>抽選</button>" +
        "<div id='r' style='margin-top:15px'></div>";


    document.body.appendChild(box);

    App.ui.box = box;


    var select = document.createElement("select");

    select.style.cssText =
        "width:300px;" +
        "height:40px;" +
        "font-size:16px";


    [
        ["BOTH","MASTER + ULTIMA"],
        ["MASTER","MASTERのみ"],
        ["ULTIMA","ULTIMAのみ"]
    ].forEach(function(x){

        var option=document.createElement("option");

        option.value=x[0];
        option.textContent=x[1];

        select.appendChild(option);

    });


    box.querySelector("#a").appendChild(select);


    App.ui.select = select;
    App.ui.result = box.querySelector("#r");


    box.querySelector("#b").onclick=function(){

        var result=pickRandom(
            Number(box.querySelector("#c").value)||3
        );

        drawCards(result);

    };


    box.querySelector("#update").onclick=function(){

        updateAll();

    };

    select.onchange=function(){

    App.state.difficulty=this.value;

    };

    }

    function updateStatus() {

    if(!App.ui.box)return;

    var d=App.data;

    App.ui.box.querySelector("#st").innerHTML =
        "MASTER: " + d.MASTER.length + "曲<br>" +
        "ULTIMA: " + d.ULTIMA.length + "曲";

}
function pickRandom(count) {

    var pool = [];

    var mode = App.state.difficulty;


    ["MASTER", "ULTIMA"].forEach(function(diff){

        if (
            mode === "BOTH" ||
            mode === diff
        ) {

            App.data[diff].forEach(function(song){

                pool.push({
                    diff: diff,
                    name: song.name,
                    genre: song.genre
                });

            });

        }

    });


    var result = [];


    while (
        result.length < count &&
        pool.length > 0
    ) {

        var index = Math.floor(
            Math.random() * pool.length
        );

        result.push(
            pool.splice(index,1)[0]
        );

    }


    return result;

}
function drawCards(list) {

    App.ui.result.innerHTML =
        list.map(function(x){

            var bg =
                x.diff === "MASTER"
                ? "rgb(191,106,255)"
                : "rgb(35,35,35)";


            var border =
                x.diff === "MASTER"
                ? "white"
                : "rgb(255,58,58)";


            return (
                "<div style='" +
                "background:"+bg+";" +
                "border:2px solid "+border+";" +
                "padding:12px;" +
                "margin-top:8px;" +
                "border-radius:10px;" +
                "color:white'>" +

                "<div style='" +
                "display:inline-block;" +
                "background:rgba(0,0,0,.35);" +
                "padding:3px 8px;" +
                "border-radius:5px;" +
                "font-size:13px;" +
                "font-weight:bold'>" +
                x.diff +
                " / " +
                x.genre +
                "</div>" +

                "<div style='" +
                "font-size:17px;" +
                "font-weight:bold;" +
                "margin-top:8px'>" +
                x.name +
                "</div>" +

                "</div>"
            );

        }).join("");

}

function fetchMaster() {

    return fetch(
        "https://new.chunithm-net.com/chuni-mobile/html/mobile/record/musicGenre/master"
    )
    .then(function(res){

        return res.text();

    })
    .then(function(html){

        return parseMusicList(html);

    });

}


function fetchUltima() {

    return fetch(
        "https://new.chunithm-net.com/chuni-mobile/html/mobile/record/musicGenre/ultima"
    )
    .then(function(res){

        return res.text();

    })
    .then(function(html){

        return parseMusicList(html);

    });

}

function updateAll() {

    Promise.all([
        fetchMaster(),
        fetchUltima()
    ])
    .then(function(result){

        App.data.MASTER = result[0];
        App.data.ULTIMA = result[1];

        saveData();

        updateStatus();

        alert(
            "更新完了\n" +
            "MASTER: " + App.data.MASTER.length + "曲\n" +
            "ULTIMA: " + App.data.ULTIMA.length + "曲"
        );

    })
    .catch(function(e){

        console.error(e);

        alert(
            "取得失敗しました"
        );

    });

}

function parseMusicList(html) {

    var parser = new DOMParser();

    var doc = parser.parseFromString(
        html,
        "text/html"
    );


    var songs = [];

    var genre = "";


    doc.querySelectorAll(".genre,.musiclist_box")
    .forEach(function(e){

        if(e.classList.contains("genre")){

            genre = e.innerText.trim();

        }
        else {

            var form = e.closest("form");

            if(
                form &&
                form.innerText.includes("HIGH SCORE")
            ){
                return;
            }


            var title = e.querySelector(".music_title");


            if(title){

                songs.push({

                    name: title.innerText.trim(),

                    genre: genre

                });

            }

        }

    });


    console.log(
        "解析結果:",
        songs.length,
        songs
    );


    return songs;

}

})();