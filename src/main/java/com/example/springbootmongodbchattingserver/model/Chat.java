package com.example.springbootmongodbchattingserver.model;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Data
@Document(collection = "chat")
public class Chat {

    @Id
    private String id;

    private String message;

    private String sender;    // 발신자

    private String receiver;  // 수신자

    private LocalDateTime createdAt;

}
