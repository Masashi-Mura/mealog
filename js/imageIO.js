//アップロード実行時の処理
document.getElementById("upload").addEventListener("submit", (e) => {
    e.preventDefault();

    //アップロードファイル作成
    const file = document.getElementById("inputedPicture").files[0];

    //ファイルが選択されているか確認
    if (file == null) {
        alert("写真を選択してください");
        return;
    }

    const formData = new FormData();
    formData.append("picture-test", file);

    //アップロード設定
    const uploadEndpoint = "https://us-central1-mealog-423100.cloudfunctions.net/uploadPicture";
    const param = {
        method: "POST",
        body: formData
    }

    //ロード画面表示
    const loading = document.querySelector(".loading");
    loading.classList.remove("hide");

    //アップロード実行
    fetch(uploadEndpoint, param)
        .then(response => {
            if (!response.ok) {
                throw new Error('投稿失敗しました。');
            }
            alert('投稿完了しました。');
            document.getElementById("inputedPicture").value = "";
            resetPreview();
        })
        .catch(error => {
            console.error('Error:', error);
            alert('投稿失敗しました。');
        })
        .finally(() => {
            //ロード画面非表示
            loading.classList.add("hide");
        });
});


//ファイル選択時プレビュー表示
document.getElementById("inputedPicture").addEventListener("change", function (e) {
    resetPreview();
    const file = e.target.files[0];
    if (file == null) {
        return;
    }

    let reader = new FileReader();
    reader.onload = function (event) {
        let previewImage = document.getElementById("previewImage");
        previewImage.src = event.target.result;
        previewImage.style.display = "inline-block";
    };
    reader.readAsDataURL(file);
});


//ファイルのプレビューリセット
function resetPreview() {
    // style属性を削除
    const previewImage = document.getElementById("previewImage");
    previewImage.src = "";
    previewImage.removeAttribute("style");
}

//写真のダウンロードと表示(１枚のみのテスト用)
document.addEventListener("DOMContentLoaded", function() {
    const imgElement = document.getElementById('latest-image');

    fetch("https://us-central1-mealog-423100.cloudfunctions.net/GetLatestImage")
        .then(response => {
            if (!response.ok) {
                throw new Error('サーバーエラー' + response.statusText);
            }
            return response.blob();
        })
        .then(blob => {
            const imageUrl = URL.createObjectURL(blob);
            imgElement.src = imageUrl;
        })
        .catch(error => {
            console.error('写真の読み込みに失敗しました。', error);
        });
});


//写真のダウンロードと表示
let iterator = 0; //cloudStorageから取得する写真の開始位置
document.getElementById("loadPicture").addEventListener("click", function () {
    const imgContainer = document.getElementById('pictureContainer');
    const downloadUrl = "https://us-central1-mealog-423100.cloudfunctions.net/DownloadPictures";
    const numImages = "5"; //１度に取得する写真の枚数設定

    fetch(`${downloadUrl}?iterator=${iterator}&numImages=${numImages}`)
        .then(response => response.json())
        .then(data => {
            //各写真に対し<div class="card"><img src= alt= ></div>の作成
            data.forEach(image => {
                const divElement = document.createElement('div'); 
                divElement.classList.add('card'); 
                const imgElement = document.createElement('img');
                imgElement.src = image.url;
                imgElement.alt = image.name;
                divElement.appendChild(imgElement); 
                imgContainer.appendChild(divElement); 
            });
            iterator += numImages; //次の写真取得開始位置を設定
        })
        .catch(error => console.error('Error:', error));
});