function favoriteFood() {
    var Favorite = ncmb.DataStore("favorite");
    Favorite.fetchAll().then(function (objects) {
        var food = [];

        for (i = 0; i < objects.length; i++) {
            food.push(objects[i].food_name);
        }

        document.getElementById("base").innerHTML = "";

        for (i = food.length - 1; i >= 0; i--) {
            var newElement = document.createElement("div");
            newElement.setAttribute("class", "base-child");
            var popup = document.createElement("a");
            popup.setAttribute("href", "#popup");
            popup.setAttribute("id", i);
            popup.setAttribute("onclick", `getId(${i})`); // 修正
            const input1 = document.createElement("input");
            input1.setAttribute("name", "select");
            input1.setAttribute("class", "check");
            input1.setAttribute("type", "checkbox");
            input1.setAttribute("id", "check");

            input1.setAttribute("data-objectId", objects[i].objectId);

            newElement.appendChild(popup);
            popup.appendChild(input1);
            popup.appendChild(document.createTextNode(food[i]));
            document.getElementById("base").appendChild(newElement);
        }
    }).catch(function (error) {
        alert("error : " + error.code);
    });
}

window.addEventListener('load', favoriteFood);

function getId(clickedId) {
    console.log(clickedId);
    var Favorite2 = ncmb.DataStore("favorite");
    Favorite2.fetchAll().then(function (objects) {
        var food = "";
        var reference = "";
        //var input = "";
        var a = document.getElementById(clickedId); // 修正
        var input = a.querySelector('input');
        console.log(input);
        document.getElementById("food_name").innerHTML = "";
        document.getElementById("material").innerHTML = "";

        for (i = 0; i < objects.length; i++) {
            if (input && input.getAttribute("data-objectId") === objects[i].objectId) {
                food = objects[i].food_name;
                reference = objects[i].reference;
                break;
            }
        }

        var DB = ncmb.DataStore(reference);
        DB.fetchAll().then(function (objects) {
            var food_name = "";
            var URL = "";
            var material = "";

            for (i = 0; i < objects.length; i++) {
                if (food === objects[i].food_name) {
                    food_name = objects[i].food_name;
                    URL = objects[i].URL;
                    var URL2 = document.getElementById("URL");
                    URL2.setAttribute("class", URL);
                    if (objects[i].material == null) {
                        material = "冷凍商品です";
                    } else {
                        material = objects[i].material;
                    }
                }
            }

            document.getElementById("food_name").appendChild(document.createTextNode(food_name));


            console.log(material);

            // document.getElementById("material").appendChild(document.createTextNode("aiueo"));

            let element = document.getElementById("material");

            //materialを材料ごとに分割(冷凍商品なら分割しない)
            if (material != "冷凍商品です") {
                for (let i = 0; i < material.length; i++) {
                    let p = document.createElement("p");
                    p.textContent = material[i];
                    element.appendChild(p);
                }
            } else {
                let p = document.createElement("p");
                p.textContent = material;
                element.appendChild(p);
            }
        }).catch(function (error) {
            alert("error : " + error.code);
        });

    }).catch(function (error) {
        alert("error : " + error.code);
    });
}

//URL
function newtab() {
    var URL3 = document.getElementById("URL");
    var link = URL3.getAttribute("class");
    window_A = window.open(link, "google");
}

//function DB(){}


const items = document.querySelectorAll('.item');
const checkbox2 = document.getElementsByName("select")
let element = document.querySelector('.base');
let echildren = element.children;


document.getElementById("myButton").addEventListener("click", function () {
    if (this.textContent != "削除する") {
        this.textContent = "削除する";

        for (i = 0; i < checkbox2.length; i++) {
            checkbox2[i].style.display = 'inline-block';
        }

        document.getElementById("cancelButton").style.display = 'inline-block';
    } else {
        for (i = 0; i < checkbox2.length; i++) {
            if (checkbox2[i].checked) {
                call();
            }
        }
    }
});

function call() {
    Swal.fire({
        title: '選択した項目を削除しますか?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes!'
    }).then(function (result) {
        if (result.isConfirmed) {

            for (i = checkbox2.length - 1; i > -1; i--) {
                if (checkbox2[i].checked) {
                    // チェックされた項目のobjectIdを取得
                    var objectId = checkbox2[i].getAttribute("data-objectId");
                    // 対応する項目をデータベースから削除
                    var Favorite = ncmb.DataStore("favorite");
                    Favorite.equalTo("objectId", objectId)
                        .fetchAll()
                        .then(function (objects) {
                            if (objects.length > 0) {
                                objects[0].delete()
                                    .then(function () {
                                        Swal.fire('削除しました!');
                                    })
                                    .catch(function (error) {
                                        alert("削除エラー: " + error);
                                    });
                            }
                        })
                        .catch(function (error) {
                            alert("検索エラー: " + error);
                        });

                    // HTML上からも削除
                    checkbox2[i].closest('.base-child').remove();
                }
            }
        }
    });
}

function cancel() {
    for (i = 0; i < checkbox2.length; i++) {
        checkbox2[i].style.display = 'none';
    }

    document.getElementById("myButton").innerHTML = '<img src="images/dust.png" width="50" height="50" class="button-image">';
    document.getElementById("cancelButton").style.display = 'none';

    for (i = 0; i < checkbox2.length; i++) {
        checkbox2[i].checked = false
    }
}


//APIキー
var applicationKey = "5b860744c00c138eecdcd0c0cd388247850c31abeac7efbd8e259ae1c14c0450";
var clientKey = "c071bad9b72a08d21b4aa7b51686065a2d85c0fe4f7b458b201be32bea8bdb81";
var ncmb = new NCMB(applicationKey, clientKey);
//処理

