## ResposiveWebSockets

### Введение

Стандартный веб сокет имеет метод для отправки сообщения и событие входящего сообщения, без возможности запроса, т.е. такой код - ошибочный:
```js
const connection = new WebSocket("wss://example.com/translator");
// ...
const response = await connection.send("translate this");
```
Модуль предоставляет возможность для отправки запросов и получения ответов через веб сокеты и отправки сообщений без ожидания ответа:
```js
const responseData = await connection.sendTextRequest("some request");
const {message, startIndex} = responseData;
console.log("response body: ", message.slice(startIndex));
```
### Установка

`npm install rws`

### Использование

#### Пример:

```js
"use strict";

import {
  Server as ResponsiveWebSocketServer,
  WebSocketClient
} from "rws";

import ResponsiveWebSocketClient from "rws/Client";

(async () => {
  const server = new ResponsiveWebSocketServer(),
        port = 8443;
  await server.listen(port);

  ResponsiveWebSocketClient.setWebSocketClientClass(WebSocketClient);
  const client = new ResponsiveWebSocketClient();
  
  const connectionToClient = await new Promise((resolve, reject) => {
    server.setConnectionListener(async (connectionToClient) => {
      console.log("cleint connected, url: ", connectionToClient.url);
      await connecting;
      resolve(connectionToClient);
    });
    const connecting = client.connect("ws://127.0.0.1:" + port + "/room/12345");
  });

  connectionToClient.setTextRequestListener((message, startIndex, responseSender) => {
    const body = message.slice(startIndex);

    if (body === "get some text") {
      responseSender.sendTextResponse("Lorem Ipsum");
      return;
    }
    if (body === "What is the answer on everything?") {
      const response = new ArrayBuffer(1),
            dataView = new DataView(response);
      dataView.setUint8(0, 42);
      responseSender.sendBinaryResponse(response);
    }
  });

  {
    const {
      message,
      startIndex,
      contentType
    } = await client.sendTextRequest("get some text");
    console.log("get some text -> ", message.slice(startIndex));
  }

  {
     const {
      message,
      startIndex,
      contentType
    } = await client.sendTextRequest("What is the answer on everything?");
    const number = new DataView(message).getUint8(startIndex);
    console.log("The answer on everything is ", number);
  }

  client.setUnrequestingTextMessageListener((message, startIndex) => {
    console.log(message.slice(startIndex));
  });

  connectionToClient.sendUnrequestingTextMessage("some event");
})();
```
#### Использование в браузере

```js
"use strict";

import ResponsiveWebSocketClient from "rws/Client";
ResponsiveWebSocketClient.setWebSocketClientClass(window.WebSocket);
// компилируется webpack'ом
// ...
```
После вызова setWebSocketClientClass(window.WebSocket), класс ResponsiveWebSocketClient готов к использованию.
Поскольку код ResponsiveWebSocketClient не зависит от модулей node.js, webpack скомпилирует код класса.

### Ссылки:

- [Документация по API](./docs/API.ru.md)
- [Примеры использования](./examples)

### Запуск тестов

- скачать репозиторий с github
- установить зависимости: `yarn install --production=false`
- запустить тесты: `yarn run tests`

### Лицензия

[Apache-2.0](http://www.apache.org/licenses/LICENSE-2.0)

### Поддержка

- Bitcoin Cash: qruf96kpx63dqz46flu453xxkpq5e7wlpgpl2zdnx8
- Ethereum: 0x8dF38FfBd066Ba49EE059cda8668330304CECD57
- Litecoin: ltc1quygsxll92wwn88hx2rper3p9eq0ez49qu4tj5w
- Polkadot: 14GqUGDwGzowm92n9xaiD5R2miPxrEdtXPxgkCtar2vw18yn
