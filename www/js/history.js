


// function showDay() {
//     let today = new Date();

//     let year = today.getFullYear();
//     let month = today.getMonth() + 1;
//     let date = today.getDate();
//     let uru = year % 4;

//     if (uru == 0 && month == 2 && date >= 29) {
//         month += 1;
//         date -= 29;
//     }
//     if (month == 2 && date >= 28) {
//         month += 1;
//         date -= 28;
//     } else if (month == 4 && date >= 30 || month == 6 && date >= 30 || month == 9 && date >= 30 || month == 11 && date >= 30) {
//         month += 1;
//         date -= 30;
//     } else if (month == 1 && date >= 31 || month == 3 && date >= 31 || month == 5 && date >= 31 || month == 7 && date >= 31 || month == 8 && date >= 31 || month == 10 && date >= 31) {
//         month += 1;
//         date -= 31;
//     } else if (month == 12 && date >= 31) {
//         month -= 11;
//         date -= 31;
//     }

//     let day = month + '/' + date;
//     return day;
// }
window.addEventListener('load', () => {

    var applicationKey = "5b860744c00c138eecdcd0c0cd388247850c31abeac7efbd8e259ae1c14c0450";
    var clientKey = "c071bad9b72a08d21b4aa7b51686065a2d85c0fe4f7b458b201be32bea8bdb81";
    var ncmb = new NCMB(applicationKey, clientKey);

    var Omikuji = ncmb.DataStore("Histry");
    Omikuji.fetchAll().then(function (objects) {
        for (let i = (objects.length - 1); i >= 0; i--) {

            let time = objects[i].createDate;

            let times = time.split('-');
            let times2 = times[2].split('T');

            $('.box6').append(`<h3>${times[1] + "/" + times2[0]}</h3>`);
            let first = objects[i].first;
            $('.box6').append(`<p>${first}</p>`);
            let second = objects[i].second;
            $('.box6').append(`<p>${second}</p>`);
            let thaard = objects[i].thaard;
            $('.box6').append(`<p>${thaard}</p>`);
            let force = objects[i].force;
            $('.box6').append(`<p>${force}</p>`);
        }
    }).catch(function (error) {
        //取得失敗
        alert("error : " + error.code);
    });
});

window.addEventListener('load', favoriteFood);//ページ読み込み時に起動


//DBから取得し表示
function favoriteFood() {
    //APIキー
    var applicationKey = "5b860744c00c138eecdcd0c0cd388247850c31abeac7efbd8e259ae1c14c0450";
    var clientKey = "c071bad9b72a08d21b4aa7b51686065a2d85c0fe4f7b458b201be32bea8bdb81";
    var ncmb = new NCMB(applicationKey, clientKey);
    //処理
    var Favorite = ncmb.DataStore("favorite");
    Favorite.fetchAll().then(function (objects) {
        //配列で取得
        // 取得成功時
        // 乱数番目のデータを取得(何行目か？)
        var food = [];
        var reference = [];

        for (i = 0; i < objects.length; i++) {
            // food フィールドの値を取得(データベースの列の名前の値を取得)
            food.push(objects[i].food_name);
            reference.push(objects[i].reference);
        }

        // 画面上の要素をクリア
        document.getElementById("base").innerHTML = "";

        let num = 0;
        // for文で繰り返し、取得した food の値を画面上の要素に表示
        for (i = 0; i < food.length; i++) {
            // 新しい要素を作成(要素を入れる場所を下に作成)
            //↓タブの追加
            // console.log(document.createTextNode(food[i]));
            // onclick='location.href="favoriteDisplay.html?food=${food[i]}&reference=${reference[i]}"'
            $('.base').append(`
            <div class="base-child">
                <input name="select" class="check" type="checkbox" id="check" data-objectId=${objects[i].objectId}>
                <span class='modal-toggle modal-span' data-modal='popup${food[i]}' onclick="location.href='favoriteDisplay.html?food=${food[i]}&reference=${reference[i]}'">${food[i]}</span>
            </div>
            `);
            

            let string = "";
            var foodDB = ncmb.DataStore(reference[i]);
            foodDB.equalTo("food_name", food[i]).
                fetchAll().then(function (obj) {
                    try{
                        obj[0].material.forEach((e) => {
                            string = string + `<p>${e}</p>`;
                            //要素をappend
                        });
                    }catch(error){
                        string = "<p>この料理は冷凍食品です。</p>";
                    }
                /*セレクト文*/
                // console.log(i);
                $('.base').append(`
                    <div id='popup${food[num++]}' class='modal-outer'>
                        <div class='modal-inner'>
                        <div class='modal-inner-header'><span class='close-btn-top'>×</span></div>
                        <div class='modal-inner-container'>


                            <div class='close-btn-bottom'><button class=''>閉じる</button></div>
                        </div>
                        </div>
                    </div>
                `);
        console.log(num);
            });
        }
    });
}



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
