const LINE_ACCESS_TOKEN = 'YOUR TOKEN';
const OLLAMA_API_URL = 'YOUR WEB.ngrok-free.app/v1'; 
const MAX_HISTORY_LENGTH = 5;

function doPost(e) {
  try {
    const contents = JSON.parse(e.postData.contents);
    
    if (contents.events && contents.events.length === 0) {
      return ContentService.createTextOutput(JSON.stringify({status: 'ok'}))
        .setMimeType(ContentService.MimeType.JSON)
        .setStatusCode(200);
    }

    const event = contents.events[0];
    const replyToken = event.replyToken;
    let userMessage = event.message.text;
    const url = 'https://api.line.me/v2/bot/message/reply';
    const chatId = event.source.userId;

    startLoadingAnimation(chatId);

    if (userMessage === undefined) {
      userMessage = '？？？';
    }


    let conversationHistory = getConversationHistory(chatId);
    

    conversationHistory.push({"role": "user", "content": userMessage});


    const requestOptions = {
      "method": "post",
      "headers": {
        "Content-Type": "application/json"
      },
      "payload": JSON.stringify({
        "model": "llama3.1",
        "messages": [
          ...conversationHistory
        ]
      })
    };


    const response = UrlFetchApp.fetch(`${OLLAMA_API_URL}/chat/completions`, requestOptions);
    const responseText = response.getContentText();
    const json = JSON.parse(responseText);
    const text = json['choices'][0]['message']['content'].trim();

    conversationHistory.push({"role": "assistant", "content": text});

    saveConversationHistory(chatId, conversationHistory);

    UrlFetchApp.fetch(url, {
      'headers': {
        'Content-Type': 'application/json; charset=UTF-8',
        'Authorization': 'Bearer ' + LINE_ACCESS_TOKEN,
      },
      'method': 'post',
      'payload': JSON.stringify({
        'replyToken': replyToken,
        'messages': [{
          'type': 'text',
          'text': text,
        }]
      })
    });

    return ContentService.createTextOutput(JSON.stringify({status: 'ok'}))
      .setMimeType(ContentService.MimeType.JSON)
      .setStatusCode(200);

  } catch (error) {
    console.error('Error in doPost:', error);
    return ContentService.createTextOutput(JSON.stringify({status: 'error', message: error.toString()}))
      .setMimeType(ContentService.MimeType.JSON)
      .setStatusCode(200);
  }
}

function startLoadingAnimation(chatId) {
  const url = 'https://api.line.me/v2/bot/chat/loading/start';
  UrlFetchApp.fetch(url, {
    'method': 'post',
    'headers': {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + LINE_ACCESS_TOKEN,
    },
    'payload': JSON.stringify({
      'chatId': chatId,
      'loadingSeconds': 5
    })
  });
}

function getConversationHistory(chatId) {
  const userProperties = PropertiesService.getUserProperties();
  const history = userProperties.getProperty(chatId);
  return history ? JSON.parse(history) : [];
}

function saveConversationHistory(chatId, history) {
  const userProperties = PropertiesService.getUserProperties();

  if (history.length > MAX_HISTORY_LENGTH) {
    history = history.slice(-MAX_HISTORY_LENGTH);
  }
  userProperties.setProperty(chatId, JSON.stringify(history));
}
