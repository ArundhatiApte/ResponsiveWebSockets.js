## ResposiveWebSockets

Отправляющая запросы и незапрашивающие сообщения обертка для Web Sockets.
Клиент работает в браузере и node.js. Модуль использует легковесныйй формат сообщений.
Для запросов и ответов заголовок размером 3 байта, для незапрашивающих сообщений - 1 байт.

### Обзор

Стандартный веб сокет имеет метод для отправки сообщения и событие входящего сообщения,
без возможности отправки запроса.
Может возникнуть мысль сделать что-либо подобное:
```js
const connection = new WebSocket("wss://example.com/translator");
// ...
const response = await connection.send("translate this");
```

Модуль предоставляет возможность для отправки запросов и получения ответов
через веб сокеты и отправки сообщений без ожидания ответа:
```js
const responseData = await connection.sendTextRequest("запрос");
const {message, contentType} = responseData;
const startIndex = connection.startIndexOfBodyInTextResponse;
console.log("ответ: ", message.slice(startIndex));
```
### Установка

Скачайте пакет со страницы выпусков. В каталоге вашего проекта установите модуль менеджером пакетов:
`npm install path/to/ResponsiveWebSockets.package.tar.gz`.

### Использование

#### Пример:

```js
"use strict";

import ResponsiveWebSocketServer from "ResponsiveWebSockets/Server";
import ResponsiveWebSocketClient from "ResponsiveWebSockets/Client";
import W3CWebSocketClient from "ResponsiveWebSockets/W3CWebSocketClient";
import uWebSockets from "ResponsiveWebSockets/uWebSockets";

// const ResponsiveWebSocketServer = require("ResponsiveWebSockets/Server");
// const ResponsiveWebSocketClient = require("ResponsiveWebSockets/Client");
// const W3CWebSocketClient = requre("ResponsiveWebSockets/W3CWebSocketClient");
// const uWebSockets = requre("ResponsiveWebSockets/uWebSockets");

(async () => {
  const server = new ResponsiveWebSocketServer({
    compression: uWebSockets.DISABLED
  });
  const port = 8443;
  await server.listen(port);

  ResponsiveWebSocketClient.setWebSocketClientClass(W3CWebSocketClient);
  const client = new ResponsiveWebSocketClient();

  const connectionToClient = await new Promise((resolve, reject) => {
    server.setConnectionListener(async (connectionToClient) => {
      console.log("cleint connected, url: ", connectionToClient.url);
      await connectingClient;
      resolve(connectionToClient);
    });
    const connectingClient = client.connect("ws://127.0.0.1:" + port + "/room/12345");
  });

  connectionToClient.setTextRequestListener((message, startIndex, responseSender) => {
    const body = message.slice(startIndex);

    if (body === "get some text") {
      responseSender.sendTextResponse("Lorem Ipsum");
      return;
    }
    if (body === "What is the answer on everything?") {
      const response = new ArrayBuffer(1);
      const dataView = new DataView(response);
      dataView.setUint8(0, 42);
      responseSender.sendBinaryResponse(response);
    }
  });

  {
    const {
      message,
      contentType
    } = await client.sendTextRequest("get some text");
    const startIndex = client.startIndexOfBodyInTextResponse;
    console.log("get some text -> ", message.slice(startIndex));
  }

  {
    const {
      message,
      contentType
    } = await client.sendTextRequest("What is the answer on everything?");
    const startIndex = client.startIndexOfBodyInBinaryResponse;
    const number = new DataView(message).getUint8(startIndex);
    console.log("The answer on everything is ", number);
  }

  {
    client.setUnrequestingTextMessageListener((message, startIndex) => {
      console.log("message: ", message.slice(startIndex, 40), " ...");
    });

    const smallHeader = "abcd";
    const bigBody = "Avoid allocation of memory. 0x0123".repeat(20);
    connectionToClient.sendFragmentsOfUnrequestingTextMessage(smallHeader, bigBody);
  }
})();
```

#### Использование в браузере

```js
"use strict";

import ResponsiveWebSocketClient from "ResponsiveWebSockets/Client";
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

- скачать исходный код проекта со страницы выпусков
- установить зависимости: `npm install`
- запустить тесты: `npm test`

### Лицензия

[Apache-2.0](http://www.apache.org/licenses/LICENSE-2.0)

### Поддержка

- Bitcoin Cash: qruf96kpx63dqz46flu453xxkpq5e7wlpgpl2zdnx8
- Ethereum: 0x8dF38FfBd066Ba49EE059cda8668330304CECD57
- Litecoin: ltc1quygsxll92wwn88hx2rper3p9eq0ez49qu4tj5w
- Polkadot: 14GqUGDwGzowm92n9xaiD5R2miPxrEdtXPxgkCtar2vw18yn
