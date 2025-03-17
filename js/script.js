// jsonファイルを取得し、jsの配列に変換する関数
async function fetchMenu(){ // asyncは非同期関数を宣言。関数内でawaitが使える。awaitはこの処理が終わるまで次の処理をしない。
    const response = await fetch("./menu.json"); // jsonの取得
    const menuList = await response.json(); // jsonをjsの配列に変換
    return menuList;
}

// 予算内で購入可能なメニューを取得する関数
async function findAffordableMenus(budget){
    const menuList = await fetchMenu();
    return menuList.filter(item => item.price <= budget); // jsの各項目をitemという
}

// pick up menu randomly
async function pickupMenu(budget){
    let tray= [];
    while(budget > 0){
        var affordableMenus = await findAffordableMenus(budget); 
        var menuNum = affordableMenus.length;
        if (menuNum === 0) break;
        var randomNum = Math.floor(Math.random() * menuNum);
        tray.push(affordableMenus[randomNum]);
        budget -= affordableMenus[randomNum].price;
    }
    return tray;
}

document.getElementById("priceForm").addEventListener("submit", async function(event){ // id=priceformの要素を取得、フォーム送信されるたびにfunction(event)を実行
    event.preventDefault(); // continue action without page reload.通常フォームを送信するとページがリロードされる
    const price = document.getElementById("price").value; // id=priceが付いてるinput要素を取得し、数値を取得
    const tray = await pickupMenu(price);
    console.log(tray);
    let resultHTML = `<h2 class="selected-menu">選ばれたメニュー</h2>`;
    var totalPrice = 0; 
    tray.forEach(menu => {
        resultHTML += `
        <div class="menu-item">
            <sapn class="menu-name">${menu.name}</sapn>
            <span class="menu-price">(${menu.price}円)</span>
        </div>`; // `${変数}`で変数出力</span>
        totalPrice += menu.price;
    });
    resultHTML += `<h2 class="">合計${totalPrice}円</h2>
                <h3>※価格は全て税込み表記です</h3>`;
    document.getElementById("result").innerHTML = resultHTML; // idが一致しているところのタグを取得。今回の場合<div>。innerHTMLでhtmlファイルのdivタグの中身書き換え。 
})