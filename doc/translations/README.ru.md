## ResponsiveWebSockets

Отправляющая запросы и незапрашивающие сообщения обертка для WebSockets.
Клиент работает в браузере и node.js. Модуль использует легковесный формат сообщений.
Для запросов и ответов заголовок размером 3 байта, для незапрашивающих сообщений - 1 байт.

### Краткий обзор

Стандартный веб сокет имеет метод для отправки сообщения и событие входящего сообщения,
без возможности отправки запроса.

сообщение WebSocket

```
client|           |server
      |  message  |
      |---------->|
      |           |
      |  message  |
      |<----------|
```

Может возникнуть мысль сделать что-либо подобное:

```js
const connection = new WebSocket("wss://example.com/translator");
// ...
const response = await connection.sendRequest(message);
```

запрос/ответ HTTP

```
client|           |server
      |  request  |
      |---------->|
      |  response |
      |<----------|
```

запрос/ответ в ResponsiveWebSockets

```
client|             |server
      |  request A  |
      |------------>|
      |             |
      |  response A |
      |<------------|
```

Модуль предоставляет возможность для отправки запросов и получения ответов
через веб сокеты и отправки сообщений без ожидания ответа:

```js
const response = await connection.sendBinaryRequest(new Uint8Array([1, 2, 3, 4]).buffer);
const startIndex = connection.startIndexOfBodyInBinaryResponse;
console.log("ответ: ", new Uint8Array(response, startIndex));
```

ResponsiveWebSockets также могут отправлять более 1-го запроса за раз.

```
client|             |server
      |  request A  |
      |------------>|
      |             |
      |  request B  |
      |------------>|
      |             |
      |  response A |
      |<------------|
      |             |
      |  request C  |
      |------------>|
      |             |
      |  response C |
      |<------------|
      |             |
      |  response B |
      |<------------|
```

ResponsiveWebSocket сервер обёртывает [uWebSockets.js](https://github.com/uNetworking/uWebSockets.js)
версии 20.x.x.
ResponsiveWebSocket клиент использует класс,
реализующий интерфейс [WebSocket от W3C](https://developer.mozilla.org/en-US/docs/Web/API/WebSocket).

### Установка

Скачайте репозиторий.
Перейдя в папку project/buildingNpmPackage, запустите скрипт createPackage.sh,
после чего появится файл ResponsiveWebSockets.package.tar.gz.
В каталоге вашего проекта установите модуль менеджером пакетов:
`npm install path/to/ResponsiveWebSockets.package.tar.gz`.

### Использование

Использование методов для отправки запросов, незапрашивающих сообщений и ответов имеет различие
между клиентом и серверным соединением.
Пример использования серверного соединения:

```js
let message = new Uint8Array([11, 22, 33, 44]);
const binaryResponse = await serverConnection.sendBinaryRequest(message);
console.log("двоичный ответ: ", new Uint8Array(
  binaryResponse,
  serverConnection.startIndexOfBodyInBinaryResponse
));

message = new Uint8Array([55, 66]);
serverConnection.sendUnrequestingBinaryMessage(message);

serverConnection.setBinaryRequestListener(function echo(messageWithHeader, startIndex, responseSender) {
  responseSender.sendBinaryResponse(new Uint8Array(messageWithHeader, startIndex));
});
```

Серверное соединение принимает типизированные массивы или `ArrayBuffer` в качестве параметра,
клиентское - только `ArrayBuffer`. Поскольку у WebSocket'а в браузере отсутствует способ отправки
сообщения частями, в разных фреймах, в целях производительности клиентское соединение при отправке
запроса, незапрашивающего сообщения или ответа ожидает получить `ArrayBuffer` с пустым местом в начале
для заголовка. (Избегание выделения нового блока памяти для заголовок + тело сообщения)
Пример использования клиентского соединения:

```js
{
  const sizeOfHeader = client.sizeOfHeaderForBinaryRequest;
  const sizeOfBody = 4;
  const message = new ArrayBuffer(sizeOfHeader + sizeOfBody);
  // заполнить message, начиная с индекса равному sizeOfBody
  const binaryResponse = await client.sendBinaryRequest(message);
  console.log("двоичный ответ: ", new Uint8Array(
    binaryResponse,
    client.startIndexOfBodyInBinaryResponse
  ));
}
{
  const sizeOfHeader = client.sizeOfHeaderForUnrequestingBinaryMessage;
  const sizeOfBody = 2;
  const message = new ArrayBuffer(sizeOfHeader + sizeOfBody);
  // заполнить message, начиная с индекса равному sizeOfBody
  client.sendUnrequestingBinaryMessage(message);
}

client.setBinaryRequestListener((messageWithHeader, startIndex, responseSender) => {
  const sizeOfHeader = client.sizeOfHeaderForBinaryResponse;
  const sizeOfBody = 4;
  const message = new ArrayBuffer(sizeOfHeader + sizeOfBody);
  // заполнить message, начиная с индекса равному sizeOfBody
  responseSender.sendBinaryResponse(message);
});
```

Примеры:
[sendingBinaryRequests.mjs](project/examples/sendingBinaryRequests.mjs),
[sendingUnrequestingBinaryMessages.mjs](project/examples/sendingUnrequestingBinaryMessages.mjs)

#### Текстовые сообщения

У отзывчивых WebSocket'ов отсутствуют методы для отправки текстовых запросов, незапрашивающих сообщений или ответов,
принимающие в качестве параметра строку, по причинам производительности
(строки неизменяемы в отличии от `ArrayBuffer`, клиенту придётся выделять блок памяти для сообщения).
Для отправки текста помогут классы
[TextEncoder](https://developer.mozilla.org/en-US/docs/Web/API/TextEncoder)
и
[TextDecoder](https://developer.mozilla.org/en-US/docs/Web/API/TextDecoder),
позволяющие заполнить `ArrayBuffer` байтами строки в UTF-8.
Пример отправки текстового запроса клиентом:

```js
const textEncoder = new TextEncoder("utf-8");
const textDecoder = new TextDecoder("utf-8");

const stringMessage = "hello";
const byteSizeOfStringMesageInUTF8 = 5;
const sizeOfHeader = client.sizeOfHeaderForBinaryRequest;
const message = new ArrayBuffer(sizeOfHeader + byteSizeOfStringMesageInUTF8);

const startIndex = sizeOfHeader;
textEncoder.encodeInto(stringMessage, new Uint8Array(message, startIndex));

const binaryResponse = await client.sendBinaryRequest(message);
console.log("текст в ответе: ", textDecoder.decode(new Uint8Array(
  binaryResponse,
  client.startIndexOfBodyInBinaryResponse
)));
```

Пример отправки текстового запроса серверным соединением:

```js
const textEncoder = new TextEncoder("utf-8");
const textDecoder = new TextDecoder("utf-8");

const message = textEncoder.encode("hello");

const binaryResponse = await serverConnection.sendBinaryRequest(message);
console.log("текст в ответе: ", textDecoder.decode(new Uint8Array(
  binaryResponse,
  serverConnection.startIndexOfBodyInBinaryResponse
)));
```

Пример: [sendingTextInBinaryRequests.mjs](project/examples/sendingTextInBinaryRequests.mjs)

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

#### Заметка об отправке большого количества запросов за раз

Внутренне соединение отзывчивого WebSocket использует 16 битный номер для распознавания сообщений запроса и ответа.
При одномоментной отправке большого количества запросов может произойти отправка 2-ух запросов с одинаковым
идентификатором, что приведёт к потере одного из ответов
(и распознаванию ответа на первый запрос как ответа на второй, если ответ на первый придёт раньше).
Описания проблема появится если:

* Соединение отправило N запросов и ожидает получение ответов на них, после чего было отправлено еще более
65536 - N запросов.
* Соединение не ожидает ответов на запросы и отправило более 65536 запросов.

### Совместимая реализация на другом языке

- [Описание формата заголовков сообщений](/doc/translations/messagesHeadersFormat.ru.md)
- [ResponsiveWebSockets на Java](https://github.com/ArundhatiApte/ResponsiveWebSockets)

### Ссылки:

- [Документация по API](/doc/translations/API.ru.md)
- [Примеры использования](project/examples)

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
