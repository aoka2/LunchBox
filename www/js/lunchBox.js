
    //プルダウンオープン
let clickNumber = 0;
let clickNumber2 = 0;
let firstFileName;
let secondFileName ;
let thaardFileName;
let forceFileName;
let filteringAllergy = [];
let filteringMaterial = [];
function pulldownOpen(){/*フィルター表示*/
    
    if(clickNumber == 1){
        $("#filter-content").toggleClass("none");
    }else{
        $("#filter-content").toggleClass("show");
    }
    if(clickNumber == 0){
        allergyDisplay();
        clickNumber = 1;
    }
}


function pulldownOpenMaterial(){/*フィルター表示*/
    if(clickNumber2 == 1){
        $("#material-content").toggleClass("none");
    }else{
        $("#material-content").toggleClass("show");
    }
    if(clickNumber2 == 0){
        materialDisplay();
        clickNumber2 = 1;
    }

}
function materialDisplay(){/*使用食材一覧取得*/
     //データベースAPIキー
    var applicationKey = "5b860744c00c138eecdcd0c0cd388247850c31abeac7efbd8e259ae1c14c0450";
    var clientKey = "c071bad9b72a08d21b4aa7b51686065a2d85c0fe4f7b458b201be32bea8bdb81";
    var ncmb = new NCMB(applicationKey,clientKey);
    let element = $(".material-content-style");
    
    //DB取り出し
        var Foods = ncmb.DataStore("material");
        
        Foods.fetchAll().then(function(objects){
            //objectsは配列
            //データ取得成功時
            for(let i = 0;i < objects.length;i++){
                var object = objects[i];
                const name = object.material;
                if(i % 2 == 0){
                    element.append(`<label for="${i+'m'}" style="width:40%;"><input type="checkbox" class="filter-content-button"id="${i+'m'}"name="checkbox-2" value="${name}">${name}</label>`);
                }else{
                    element.append(`<label for="${i+'m'}" style="width:40%;"><input type="checkbox" class="filter-content-button"id="${i+'m'}"name="checkbox-2" value="${name}">${name}</label>`);
                    element.append("<br>");
                }
            }
            element.prepend('<br><br>');
        }).catch(function(error){
            //取得失敗
            alert("error: " + error.code);
        });
}

function allergyDisplay(){/*アレルギー一覧取得*/
    let element = $(".filter-content-style");
    //データベースAPIキー
    var applicationKey = "5b860744c00c138eecdcd0c0cd388247850c31abeac7efbd8e259ae1c14c0450";
    var clientKey = "c071bad9b72a08d21b4aa7b51686065a2d85c0fe4f7b458b201be32bea8bdb81";
    var ncmb = new NCMB(applicationKey,clientKey);
    
     //DB取り出し
        var allergyFoods = ncmb.DataStore("allergy");
        
        allergyFoods.fetchAll().then(function(objects){
            //objectsは配列
            //データ取得成功時
            for(let i = 0;i < objects.length;i++){
                var object = objects[i];
                const name = object.foodName;
                if(i % 2 == 0){
                    element.append(`<label for="${i}" style="width:40%;"><input type="checkbox" class="filter-content-button checkbox-2" name="checkbox-2" id="${i}" value="${name}">${name}</label>`);
                }else{
                    element.append(`<label for="${i}" style="width:40%;"><input type="checkbox" class="filter-content-button checkbox-2" name="checkbox-2" id="${i}" value="${name}">${name}</label>`);
                    element.append("<br>");
                }
            }
            element.prepend('<br><br>');
        }).catch(function(error){
            //取得失敗
            alert("error: " + error.code);
        });
}

function filterHyde(){
    $('.final-check').css('display','block');
    $('#filter').css('display','none');
}

function lunchMake(){ /*フィルター情報格納・弁当画面遷移*/

    /*フィルター情報格納*/
    $("input:checkbox.filter-content-button").each(function(index , element){
        if($(this).prop("checked")){
            filteringAllergy.push($(this).val());
        }
    });
    $("input:checkbox.material-content-button").each(function(index , element){
        if($(this).prop("checked")){
            filteringMaterial.push($(this).val());
        }
    });

    /*画面遷移*/
    $('.final-check').css('display','none');
    $('#lunch-make').css('display','block');
    repickFirst();
    repickSecond();
    repickThaad();
    repickForce();
}

function filterToBack(){
    $('.final-check').css('display','none');
    $('#filter').css('display','block');
    $('.usRadio').css('display','flex');
    $('.checkbox-2').css('display','flex');
}


function checkLunch(){/*弁当選択・必要食材確定*/
    //メモに必要素材追加、及びDB初期化
    
    var applicationKey = "5b860744c00c138eecdcd0c0cd388247850c31abeac7efbd8e259ae1c14c0450";
    var clientKey = "c071bad9b72a08d21b4aa7b51686065a2d85c0fe4f7b458b201be32bea8bdb81";
    var ncmb = new NCMB(applicationKey,clientKey);
    var memoData = ncmb.DataStore('memo');
    var memoDeleteData = new memoData();

    memoData.fetchAll().then(function(object){
        for(let i = 0; i < object.length; i++){
            memoDeleteData.set("objectId",object[i].objectId).delete().catch(function(error){
                console.log(error);
            });
            console.log(object[i].objectId);
        }
    });
    
    //選択していないチェックボックスを配列に格納
    var uncheckBox = [];
    $("input:checkbox.materialChecked").each(function(index , element){
        if(!$(this).prop("checked")){
            uncheckBox.push($(this).val());
        }
    });
    console.log(uncheckBox);
    var foodset = new Set();
    for(let i = 0; i < uncheckBox.length;i++){
        //レシピ内材料数 表示削除
        let item = uncheckBox[i].split(":");
        foodset.add(item[0]);
    }
    //重複のない材料格納、登録
    for(let item of foodset){
        memoSaveing(item);
    } 
    // console.log(foodset);
    // for(let i = 0; i < foodset.length; i++){
    //     memoSaveing(foodset.get(i));
    // }

    if($(`.farstCookingStar`).val() == "★"){
        favoriteEntry("farstCooking");
    }
    if($(`.secondCookingStar`).val() == "★"){
        favoriteEntry("secondCooking");
    }
    if($(`.thaardCookingStar`).val() == "★"){
        favoriteEntry("thaardCooking");
    }
    if($(`.forceCookingStar`).val() == "★"){
        favoriteEntry("forceCooking");
    }

    success();
}

function success(){
    inputHistory();

    
    $('.cooking-detail').css('display','none');
    $('.success').css('display','block');
}

function inputHistory(){
    var applicationKey = "5b860744c00c138eecdcd0c0cd388247850c31abeac7efbd8e259ae1c14c0450";
    var clientKey = "c071bad9b72a08d21b4aa7b51686065a2d85c0fe4f7b458b201be32bea8bdb81";
    var ncmb = new NCMB(applicationKey,clientKey);
    var historyData = ncmb.DataStore('Histry');

    /*それぞれの値取得*/
    let firstCooking = $('.farstCookingCheck').children('h3').text();
    let secondCooking = $('.secondCookingCheck').children('h3').text();
    let thaardCooking = $('.thaardCookingCheck').children('h3').text();
    let forceCooking = $('.forceCookingCheck').children('h3').text();
    /*データベースにセーブ*/
    var historySave = new historyData();

    historySave.set('first',firstCooking).
    set('second',secondCooking).
    set('thaard',thaardCooking).
    set('force',forceCooking).
    save();
}

function memoSaveing(material){
    var applicationKey = "5b860744c00c138eecdcd0c0cd388247850c31abeac7efbd8e259ae1c14c0450";
    var clientKey = "c071bad9b72a08d21b4aa7b51686065a2d85c0fe4f7b458b201be32bea8bdb81";
    var ncmb = new NCMB(applicationKey,clientKey);
    var memoData = ncmb.DataStore('memo');

    var memoClassSave = new memoData();
        memoClassSave.
        set("name",material).
        set("checkFlg",false).save();
}



function repickFirst(){
    if(document.reitoForm.yes.checked){
        randomGetFood("frozenAndMaindishMix","farstCooking");
    }else{
        randomGetFood("Maindish","farstCooking");
    }
}
function repickSecond(){
    if(document.reitoForm.yes.checked){
        randomGetFood("frozenAndSidedishMix","secondCooking");
    }else{
        randomGetFood("Sidedish","secondCooking");
    }
}
function repickThaad(){
    if(document.reitoForm.yes.checked){
        randomGetFood("frozenAndMaindishMix","thaardCooking");
    }else{
        randomGetFood("Maindish","thaardCooking");
    }
}
function repickForce(){
    if(document.reitoForm.yes.checked){
        randomGetFood("frozenAndSidedishMix","forceCooking");
    }else{
        randomGetFood("Sidedish","forceCooking");
    }
}

//画像取得メソッド
function randomGetFood(storeName,ClassName){
    var applicationKey = "5b860744c00c138eecdcd0c0cd388247850c31abeac7efbd8e259ae1c14c0450";
    var clientKey = "c071bad9b72a08d21b4aa7b51686065a2d85c0fe4f7b458b201be32bea8bdb81";
    var ncmb = new NCMB(applicationKey,clientKey);
    //引数で受け取ったDB取得
    var food = ncmb.DataStore(storeName);
    var reader = new FileReader();
    //ファイルストアURLを取得
    reader.onload = function(e){
        var dataUrl = reader.result;
        let element = $(`.${ClassName}`);
        element.attr('src',dataUrl);
    }


    //↓↓ここにフィルター機能を追加↓↓
    food.fetchAll().then(function(objects){
        //ランダムで値を取得
        let randomNum = Math.floor(Math.random() * objects.length);
        //フィルタリング
        randomNum = allergyfiltering(randomNum,objects);
        let cookingName = objects[randomNum].food_name;
        let fileName = objects[randomNum].image;
        //イメージ取得
        ncmb.File.download(fileName,"blob")
            .then(function(blob){
                reader.readAsDataURL(blob);
            })
            .catch(function(err){
                console.log("img error: " + err);
            });

            $(`.${ClassName}`).attr('id',cookingName);
            $(`.${ClassName}`).attr('name',storeName);
        return objects[randomNum];
    });
    // .catch(function(error){
    //     alert("error code at imageMake " + error);
    // });
}

function allergyfiltering(index,object){
    let isAllergy = false;
    //アレルギのフィルタ
    
    filteringAllergy.forEach((element) => {
        let work = object[index].Arelgy;//配列が返ってくる
        work.forEach((el) => {
            if(element == el){
                isAllergy = true;
            }
        });
    });

    //入れたくない食材のフィルタ
    filteringMaterial.forEach((element)=>{
        let work = object[index].material;//コロン付きの食材配列が返ってくる
        work.forEach((ele) => {
            let workSp = ele.split(":");
            if(workSp[0] == element){
                isAllergy = true;
            }
        });
    });

    while(isAllergy){
        //いらないものが含まれていた場合
        isAllergy = false;
        index = Math.floor(Math.random() * object.length);
        //アレルギ検査
        filteringAllergy.forEach((element) => {
            let work = object[index].Arelgy;
            work.forEach((el)=>{
                if(element == el){
                    isAllergy = true;
                }
            });
        });
        //入れたくないもの検査
        filteringMaterial.forEach((element)=>{
            let work = object[index].material;
            work.forEach((ele)=>{
            let workSp = ele.split(":");
                if(workSp[0] == element){
                    isAllergy = true;
                }
            });
        });
    }
    return index;
}
function lustBoxCheck(){
    $("#lunch-make").css("display","none");
    $(".cooking-detail").css("display","block");
    $(".checkbox-1").css("display","flex");
    picMaterial("farstCooking");
    picMaterial("secondCooking");
    picMaterial("thaardCooking");
    picMaterial("forceCooking");
}
function makeToBack(){
    $(".cooking-detail").css("display","none");
    $("#lunch-make").css("display","block");
    $(".materialName").empty();
}

function picMaterial(className){/*メモ帳に保存する素材表示*/
    var applicationKey = "5b860744c00c138eecdcd0c0cd388247850c31abeac7efbd8e259ae1c14c0450";
    var clientKey = "c071bad9b72a08d21b4aa7b51686065a2d85c0fe4f7b458b201be32bea8bdb81";
    var ncmb = new NCMB(applicationKey,clientKey);
    var foodData = ncmb.DataStore($(`.${className}`).attr('name'));
    var cookingName = $(`.${className}`).attr('id');
    
    
    //冷凍食品をデータにした場合以下のエラーが出ます(これは正常です)
    //Uncaught (in promise) TypeError: Cannot read properties of undefined (reading 'length')
    foodData.equalTo("food_name" , cookingName).fetchAll().then(function(object){
        $(`.materialName`).append(`<div class="${className + "Check"}"><h3>${object[0].food_name}</h3><input class='${className+"Star"} button-2 a' type="button" onclick="starToggle('${className+"Star"}')" value="☆"></div>`);

        for(let i = 0; i < object[0].material.length ; i++){
            $(`.${className + "Check"}`).append(`<br><label for="${object[0].material[i]+className}"><input class="materialChecked checkbox-1" value="${object[0].material[i]}" type="checkbox" id="${object[0].material[i]+className}">${object[0].material[i]}</label>`);
        }

        $(`.${className + "Check"}label`).wrap(`<filedset class=""></filedset>`);
    });
}

function starToggle(className){/*☆の切り替え*/
    console.log(className);
    if($(`.${className}`).val() == "☆"){
        $(`.${className}`).val("★");
        console.log("true");
    }else{
        $(`.${className}`).val("☆");
    }
}
function favoriteEntry(className){/*favoriteの登録*/
    var applicationKey = "5b860744c00c138eecdcd0c0cd388247850c31abeac7efbd8e259ae1c14c0450";
    var clientKey = "c071bad9b72a08d21b4aa7b51686065a2d85c0fe4f7b458b201be32bea8bdb81";
    var ncmb = new NCMB(applicationKey,clientKey);
    var foodData = ncmb.DataStore($(`.${className}`).attr('name'));
    var favoriteData = ncmb.DataStore("favorite");
    var cookingName = $(`.${className}`).attr('id');
    
    let saveData = new favoriteData();
    foodData.equalTo("food_name",cookingName).fetchAll().then(function(object){
        saveData.set("food_name",object[0].food_name)
        .set("reference",$(`.${className}`).attr('name'))
        .save();
    });
}