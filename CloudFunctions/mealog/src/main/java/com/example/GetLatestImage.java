package com.example;

import com.google.cloud.functions.HttpFunction;
import com.google.cloud.functions.HttpRequest;
import com.google.cloud.functions.HttpResponse;
import com.google.cloud.storage.Blob;
import com.google.cloud.storage.Storage;
import com.google.cloud.storage.StorageOptions;
import java.io.IOException;
import java.util.logging.Logger;

public class GetLatestImage implements HttpFunction {
    private static final Logger logger = Logger.getLogger(GetLatestImage.class.getName());
    private static final Storage storage = StorageOptions.getDefaultInstance().getService();

    @Override
    public void service(HttpRequest request, HttpResponse response) throws IOException {
        logger.info("ログ ここから写真読み込み関数スタート");

        response.appendHeader("Access-Control-Allow-Origin", "*");

        String bucketName = "bucketName";
        Blob latestBlob = storage.list(bucketName).iterateAll().iterator().next();

        byte[] content = latestBlob.getContent();

        logger.info("取得したファイル名=" + latestBlob.getName());

        response.setContentType("image/jpeg");
        response.setStatusCode(200);
        response.getOutputStream().write(content);
        logger.info("ログ 写真読み込み関数終了");
    }
}