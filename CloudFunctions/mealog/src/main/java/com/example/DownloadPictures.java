package com.example;

import com.google.cloud.functions.HttpFunction;
import com.google.cloud.functions.HttpRequest;
import com.google.cloud.functions.HttpResponse;
import com.google.cloud.storage.Blob;
import com.google.cloud.storage.Storage;
import com.google.cloud.storage.StorageOptions;
import com.google.gson.JsonArray;
import com.google.gson.JsonObject;

import java.io.BufferedWriter;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.logging.Logger;

public class DownloadPictures implements HttpFunction {
    private static final Logger logger = Logger.getLogger(DownloadPictures.class.getName());
    private static final Storage storage = StorageOptions.getDefaultInstance().getService();

    @Override
    public void service(HttpRequest request, HttpResponse response) throws IOException {
        logger.info("ログ ここから写真読み込み関数スタート");

        response.appendHeader("Access-Control-Allow-Origin", "*");

        // バケットからすべてのBlobを取得
        String bucketName = "bucketName";
        Iterable<Blob> blobs = storage.list(bucketName).iterateAll();
        logger.info("ログ Blob取得完了");

        // リクエストからiteratorの値を取得
        String iteratorParam = request.getFirstQueryParameter("iterator").orElse("0");
        int iterator = Integer.parseInt(iteratorParam);
        String numImages = request.getFirstQueryParameter("numImages").orElse("10");
        int downloadSize = Integer.parseInt(numImages);
        logger.info("ログ クエリ取得完了 iteratorは" + iterator + " downloadSizeは" + downloadSize);

        // Blobをリストに変換
        List<Blob> blobList = new ArrayList<>();
        for (Blob blob : blobs) {
            blobList.add(blob);
        }
        logger.info("ログ Blobリスト変換完了");

        //blobListをソート（LIFO方式）
        //ここにコードを記載

        //blobをjsonに変換
        JsonArray jsonArray = new JsonArray();
        for (int i = iterator; i < iterator + downloadSize; i++) {
            JsonObject jsonObject = new JsonObject();
            if (i >= blobList.size()) {
                break;
            }
            jsonObject.addProperty("name", blobList.get(i).getName());
            jsonObject.addProperty("url", blobList.get(i).getMediaLink());
            jsonArray.add(jsonObject);
        }
        logger.info("ログ json変換完了");

        BufferedWriter writer = response.getWriter();
        response.setContentType("application/json");
        writer.write(jsonArray.toString());
        logger.info("ログ 写真読み込み関数終了");
    }
}
