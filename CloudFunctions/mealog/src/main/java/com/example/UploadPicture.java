package com.example;

import com.google.cloud.functions.HttpFunction;
import com.google.cloud.functions.HttpRequest;
import com.google.cloud.functions.HttpResponse;
import java.io.IOException;
import java.net.HttpURLConnection;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.util.logging.Logger;
import com.google.cloud.storage.BlobId;
import com.google.cloud.storage.BlobInfo;
import com.google.cloud.storage.Storage;
import com.google.cloud.storage.StorageOptions;

public class UploadPicture implements HttpFunction {
    private static final Logger logger = Logger.getLogger(UploadPicture.class.getName());
    private static final Storage storage = StorageOptions.getDefaultInstance().getService();

    @Override
    public void service(HttpRequest request, HttpResponse response)
            throws IOException {
        logger.info("ログ ここから関数スタート");

        response.appendHeader("Access-Control-Allow-Origin", "*");

        if (!"POST".equals(request.getMethod())) {
            response.setStatusCode(HttpURLConnection.HTTP_BAD_REQUEST);
            logger.info("ログ NOT POSTのため終了");
            return;
        }
        logger.info("ログ POST通過");
        for (HttpRequest.HttpPart httpPart : request.getParts().values()) {
            String filename = httpPart.getFileName().orElse(null);
            if (filename == null) {
                logger.info("ログ ファイルネーム無");
                continue;
            }

            logger.info("ログ ファイルネーム有り");
            logger.info("Processed file: " + filename);

            // jpg,png以外はreturn;
            if (!(filename.endsWith(".jpg") || filename.endsWith(".png"))) {
                response.setStatusCode(HttpURLConnection.HTTP_BAD_REQUEST);
                logger.info("ログ NOT jpg pngのため終了");
                return;
            }

            //ファイル名に登録時刻を付与
            LocalDateTime now = LocalDateTime.now(ZoneId.of("Asia/Tokyo"));
            DateTimeFormatter formatter = DateTimeFormatter.ofPattern("_yyyyMMdd-HHmmssSSS");
            String timestamp = now.format(formatter);
            filename += timestamp;

            // ファイルをCloud Storageに保存
            String bucketName = "bucketName";
            BlobId blobId = BlobId.of(bucketName, filename);
            BlobInfo blobInfo = BlobInfo.newBuilder(blobId).build();
            storage.create(blobInfo, httpPart.getInputStream().readAllBytes());
            response.setStatusCode(HttpURLConnection.HTTP_OK);
            logger.info("ログ ファイル保存実施完了");
        }
    }
}