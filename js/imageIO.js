
document.getElementById("upload").addEventListener("submit", (e) => {
    e.preventDefault();

    //アップロードファイル作成
    const file = document.getElementById("inputedPicture").files[0];
    const formData = new FormData();
    formData.append("picture-test", file);

    //アップロード設定
    const uploadEndpoint = "https://us-central1-mealog-423100.cloudfunctions.net/uploadPicture";
    const param = {
        method: "POST",
        body: formData
    }

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
        });
});