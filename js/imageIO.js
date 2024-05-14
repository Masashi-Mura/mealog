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
    let file = e.target.files[0];
    if(file == null) {
        return;
    }

    let reader = new FileReader();
    reader.onload = function(event) {
        let previewImage = document.getElementById("previewImage");
        previewImage.src = event.target.result;
        previewImage.style.display = "inline-block";
    };
    reader.readAsDataURL(file);
});


//ファイルのプレビューリセット
function resetPreview() {
    // プレビュー領域に含まれる子要素を削除する
    let previewImage = document.getElementById("previewImage");
    previewImage.src = "";
    previewImage.removeAttribute("style");
}
