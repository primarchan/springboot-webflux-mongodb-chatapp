// 로그인 시스템 구현 전 데모 버전
let username = prompt("아이디를 입력하세요.");
let roomNum = prompt("채팅방 번호를 입력하세요.");

//
document.querySelector("#username").innerHTML = "USERNAME : " + username;
document.querySelector("#room-no").innerHTML = "CHATTING NO : " + roomNum;

// SSE 연결하기
const eventSource = new EventSource(`http://localhost:8080/chat/roomNum/${roomNum}`);

eventSource.onmessage = (event) => {
    const data = JSON.parse(event.data);

    if (data.sender === username) {  // 로그인 한 유저가 보낸 메시지
        // 파란 채팅 상자 (오른쪽)
        initMyMessage(data);
    } else {
        // 회색 채팅 상자 (왼쪽)
        initReceiveMessage(data);
    }
}

// 파란 채팅 상자 생성 (오른쪽, 사용자가 보낸 메시지)
function getSendMessageBox(data) {
    return `<div class="sent_msg">
                <p>${data.message}</p>
                <span class="time_date"> ${convertTime(data.createdAt)} / <b>${data.sender}</b> </span>
            </div>`;
}

// 회색 채팅 상자 생성 (왼쪽, 사용자가 받은 메시지)
function getReceiveMessageBox(data) {
    return `<div class="received_withd_msg">
                <p>${data.message}</p>
                <span class="time_date"> ${convertTime(data.createdAt)} / <b>${data.sender}</b> </span>
            </div>`;
}

/**
 * 최초 채팅방이 초기화될 때, 1번 방에 3건이 있을 경우 3건 모두 가져옴
 * addMessage() 함수 호출 시 DB 에 insert 되고, 그 데이터가 자동으로 흘러들어옴 (SSE)
 */
// 파란 채팅 상자 초기화 (오른쪽, 사용자가 보낸 메시지)
function initMyMessage(data) {
    let chatBox = document.querySelector("#chat-box");

    let chatSendBox = document.createElement("div");
    chatSendBox.className = "outgoing_msg";

    chatSendBox.innerHTML = getSendMessageBox(data);
    chatBox.append(chatSendBox);

    document.documentElement.scrollTop = document.body.scrollHeight;  // 스크롤 기능
}

// 회색 채팅 상자 초기화 (왼쪽, 사용자가 받은 메시지)
function initReceiveMessage(data) {
    let chatBox = document.querySelector("#chat-box");

    let chatReceiveBox = document.createElement("div");
    chatReceiveBox.className = "received_msg";

    chatReceiveBox.innerHTML = getReceiveMessageBox(data);
    chatBox.append(chatReceiveBox);

    document.documentElement.scrollTop = document.body.scrollHeight;  // 스크롤 기능
}

// Ajax 채팅 메시지 전송
async function addMessage() {
    let msgInput = document.querySelector("#chat-outgoing-msg")

    let chat = {
        sender: username,
        roomNum: roomNum,
        message: msgInput.value
    }

    fetch("http://localhost:8080/chat", {
        method: "post",  // HTTP POST 메서드
        body: JSON.stringify(chat),  // JS -> JSON
        headers: {
            "Content-Type": "application/json;charset=utf-8"
        }
    });

    msgInput.value = "";  // 입력창 비우기
}

// 서버로부터 응답받은 메시지 시간 포맷 변환
function convertTime(time) {
    let md = time.substring(5, 10);
    let tm = time.substring(11, 16);
    let convertTime = tm + " | " + md;
    return convertTime;
}

// 전송 버튼 클릭 시 입력한 메시지 전송
document.querySelector("#chat-send").addEventListener("click", ()=>{
    addMessage();
})

// 입력창 입력 후 엔터 키 클릭 시 입력한 메시지 전송
document.querySelector("#chat-outgoing-msg").addEventListener("keydown", (e)=>{
    if (e.keyCode === 13) {
        addMessage();
    }
})