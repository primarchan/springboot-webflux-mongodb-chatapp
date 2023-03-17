package com.example.springbootmongodbchattingserver.controller;

import com.example.springbootmongodbchattingserver.model.Chat;
import com.example.springbootmongodbchattingserver.repository.ChatRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;
import reactor.core.scheduler.Schedulers;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

@Slf4j
@RestController
@RequiredArgsConstructor
public class ChatController {

    private final ChatRepository chatRepository;

    /**
     * TEXT_EVENT_STREAM_VALUE : SSE 프로토콜, Response 가 끊기지 않고 계속 유지 됨
     */
    @GetMapping(value = "/sender/{sender}/receiver/{receiver}", produces = MediaType.TEXT_EVENT_STREAM_VALUE)
    public Flux<Chat> getMessage(@PathVariable String sender, @PathVariable String receiver) {
        return chatRepository.mFindBySender(sender, receiver).subscribeOn(Schedulers.boundedElastic());
    }

    @PostMapping("/chat")
    public Mono<Chat> sendMessage(@RequestBody Chat chat) {  // Mono : 요청 1건 당 응답 1건
        chat.setCreatedAt(LocalDateTime.now());
        return chatRepository.save(chat);
    }

}
