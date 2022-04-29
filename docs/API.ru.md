# Responsive Web Sockets API

#### Содержание

- [Класс: ResponsiveWebSocketConnection](#класс-responsivewebsocketconnection)
    * close([code, reason])
    * static contentTypesOfMessages
    * sendBinaryRequest(bytes[, maxTimeMsToWaitResponse])
    * sendTextRequest(text[, maxTimeMsToWaitResponse])
    * sendUnrequestingBinaryMessage(bytes)
    * sendUnrequestingTextMessage(text)
    * setBinaryRequestListener(listener)
    * setTextRequestListener(listener)
    * setCloseListener(listener)
    * setMalformedBinaryMessageListener(listener)
    * setMalformedTextMessageListener(listener)
    * setMaxTimeMsToWaitResponse(timeMs)
    * setUnrequestingBinaryMessageListener(listener)
    * setUnrequestingTextMessageListener(listener)
    * startIndexOfBodyInBinaryResponse
    * startIndexOfBodyInTextResponse
    * terminate()
    * static class TimeoutToReceiveResponseError
- [Класс: ResponsiveWebSocketClient](#класс-responsivewebsocketclient)
    * new ResponsiveWebSocketClient([protocols[, options]])
    * connect(url)
    * static setWebSocketClientClass(W3CWebSocketClient)
- [Класс: ResponsiveWebSocketServer](#класс-responsivewebSocketserver)
    * new ResponsiveWebSocketServer()
    * close()
    * listen(port)
    * setConnectionListener(listener)
    * setUpgradeListener(listener)
- [Класс: ResponsiveWebSocketServerConnection](#класс-responsivewebsocketserverconnection)
    * getRemoteAddress()
    * sendFragmentsOfBinaryRequest(...fragments)
    * sendFragmentsOfTextRequest(...fragments)
    * sendFragmentsOfUnrequestingBinaryMessage(...fragments)
    * sendFragmentsOfUnrequestingTextMessage(...fragments)
    * url
    * userData
- [Класс: ResponseSender](#класс-responsesender)
    * sendBinaryResponse(response)
    * sendTextResponse(response)
- [Класс: ServerResponseSender](#класс-serverresponsesender)
    * sendFragmentsOfBinaryResponse(...fragments)
    * sendFragmentsOfTextResponse(...fragments)
- [Класс: ResponseData](#класс-responsedata)
- [Класс: HandshakeAction](класс-handshakeaction)
    * acceptConnection([userData])
    * cancelConnection()

## Класс: ResponsiveWebSocketConnection

Супер класс для соединения с клиентом и клиента.
Предоставляет возможность отправки сообщений с ожиданием и без ожидания ответа.

### close([code, reason])

* `code` `<integer>`
* `reason` `<string>`

Закрывает соединение.

### статичное свойтсво contentTypesOfMessages

Объект со следующими свойствами:
* `binary <number>` тип двоичного сообщения
* `text <number>` тип текстового сообщения

### sendBinaryRequest(bytes[, maxTimeMsToWaitResponse])

* `bytes <ArrayBuffer>`  
Клиент принимает `<ArrayBuffer>`.
Серверное соединение принимает `<string|ArrayBuffer|Uint8Array|Int8Array|Uint16Array|Int16Array|Uint32Array|Int32Array|Float32Array|Float64Array>`.
* `maxTimeMsToWaitResponse <number>`  
опционально, по умолчанию равно значению, установленному методом `setMaxTimeMsToWaitResponse`.
* Возвращает `<Promise<ResponseData>>`
 
Отправляет двоичное сообщение, ожидающее ответ.
Получатель имеет возможность отправить ответ,
установив обработчик события binaryRequest методом `setBinaryRequestListener`.
Если ответ не придет в течении maxTimeMsToWaitResponse миллисекунд,
Promise завершится исключением `TimeoutToReceiveResponseError`.  
Пример использования см. в [sendingRequests.mjs](./examples/sendingRequests.mjs)

### sendTextRequest(text[, maxTimeMsToWaitResponse])

* `text <string>`  
Клиент принимает `<string>`.
Серверное соединение принимает `<string|ArrayBuffer|Uint8Array|Int8Array|Uint16Array|Int16Array|Uint32Array|Int32Array|Float32Array|Float64Array>`.
* `maxTimeMsToWaitResponse <number>`  
опционально, по умолчанию равно значению, установленному методом `setMaxTimeMsToWaitResponse`.
* Возвращает `<Promise<ResponseData>>`

Отправляет текстовое сообщение, ожидающее ответ.
Получатель имеет возможность отправить ответ,
установив обработчик события textRequest методом `setTextRequestListener`.
Если ответ не придет в течении maxTimeMsToWaitResponse миллисекунд,
Promise завершится исключнием TimeoutToReceiveResponseError.  
Пример использования см. в [sendingRequests.mjs](./examples/sendingRequests.mjs)

### sendUnrequestingBinaryMessage(bytes)

* `bytes <ArrayBuffer>`  
Клиент принимает `<ArrayBuffer>`.
Серверное соединение принимает `<string|ArrayBuffer|Uint8Array|Int8Array|Uint16Array|Int16Array|Uint32Array|Int32Array|Float32Array|Float64Array>`.

Отправляет двоичное сообщение без ожидания ответа.
При поступлении сообщения получателю, генерируется событие unrequestingBinaryMessage.
 
### sendUnrequestingTextMessage(text)

* `text <string>`
Клиент принимает `<string>`.
Серверное соединение принимает `<string|ArrayBuffer|Uint8Array|Int8Array|Uint16Array|Int16Array|Uint32Array|Int32Array|Float32Array|Float64Array>`.

Отправляет текстовое сообщение без ожидания ответа.
При поступлении сообщения получателю, генерируется событие unrequestingTextMessage.

### setBinaryRequestListener(listener)

* `listener <function>`  
сигнатура обработчика: `(bytes, startIndex, responseSender)`, где
    * `bytes <ArrayBuffer>`  
    сообщение, cодержащее заголовок и переданное отправителем тело
    * `startIndex <number>`  
    индекс первого байта тела сообщения
    * `responseSender <ResponseSender>`  
    объект для отправки бинарного или текстового ответа  

Устанавливает обработчик события, возникающего при двоичного получении сообщения,
отправитель которого ожидает ответ.
Ссылка `this` внутри обработчика указывает на экземпляр класса `ResponsiveWebSocketConnection`.
`listener` может быть `null` или `undefined`.  
Пример использования см. в [sendingRequests.mjs](./examples/sendingRequests.mjs)

### setTextRequestListener(listener)

* `listener <function>`  
сигнатура обработчика: `(text, startIndex, responseSender)`, где
    * `text <string>`  
    сообщение, cодержащее заголовок и переданное отправителем тело
    * `startIndex <number>`  
    индекс первого символа в строке text, с которого начинается тело сообщения
    * `responseSender <ResponseSender>`    
    объект для отправки текстового или бинарного ответа  

Устанавливает обработчик события, возникающего при получении текстового cообщения,
отправитель которого ожидает ответ.
Ссылка `this` внутри обработчика указывает на экземпляр класса `ResponsiveWebSocketConnection`.
`listener` может быть `null` или `undefined`.  
Пример использования см. в [sendingRequests.mjs](./examples/sendingRequests.mjs))

### setCloseListener(listener)

* `listener <function>`  
сигнатура обработчика: `(event)`, где
    * `event <Object>`
        * `code <number>`
        * `reason <string>`
        * `wasClean <bool>`

Устанавливает обработчик закрытия WebSocket соединения.
Ссылка `this` внутри обработчика указывает на экземпляр класса `ResponsiveWebSocketConnection`.
`listener` может быть `null` или `undefined`.

### setMalformedBinaryMessageListener(listener)

* `listener <function>`  
сигнатура обработчика: `(message)`
    * `message <ArrayBuffer>`

Устанавливает обработчик события, возникающего при получении двоичного сообщения без верного заголовка.
Ссылка `this` внутри обработчика указывает на экземпляр класса `ResponsiveWebSocketConnection`.
`listener` может быть `null` или `undefined`.

Пример:  
в node.js:
```js
serverConnection.setMalformedBinaryMessageListener(function() {
  this.terminate();
});
```
в браузере:
```js
const webSocketClient = new WebSocket("wss://example.com");

webSocketClient.onopen = function() {
  webSocketClient.send(new Uint8Array([0, 1, 2, 3, 4]).buffer);
};
```

Заметки:

* если первый байт сообщения равен 1 (как беззнаковое целое) и сообщение длиннее двух байт,
то сообщение расценивается как запрос
* если первый байт сообщения равен 2 (как беззнаковое целое) и сообщение длиннее двух байт,
то сообщение расценивается как ответ
* если первый байт сообщения равен 3 (как беззнаковое целое),
то сообщение расценивается как сообщение без ожидания ответа

### setMalformedTextMessageListener(listener)

* `listener <function>`  
сигнатура обработчика: `(message)`
    * `message <string>`

Устанавливает обработчик события, возникающего при получении текстового сообщения без верного заголовка.
Ссылка `this` внутри обработчика указывает на экземпляр класса `ResponsiveWebSocketConnection`.
`listener` может быть `null` или `undefined`.

Пример:  
в node.js:
```js
serverConnection.setMalformedTextMessageListener(function() {
  this.terminate();
});
```
в браузере:
```js
const webSocketClient = new WebSocket("wss://example.com");

webSocketClient.onopen = function() {
  webSocketClient.send("zyxw");
};
```

### setMaxTimeMsToWaitResponse(timeMs)

* `timeMs <number>`

Задает максимальное время в миллисекундах ожидания ответа по умолчанию для отправленных сообщений
с помощью методов sendBinaryRequest и sendTextRequest.
Можно переопределить во 2-м парметре метода для отправки ожидающего ответа сообщения.
По умолчанию 2000.

### setUnrequestingBinaryMessageListener(listener)

* `listener <function>`  
сигнатура обработчика: `(bytes, startIndex)`, где
    * `bytes <ArrayBuffer>`  
    сообщение, cодержащее заголовок и переданное отправителем тело
    * `startIndex <number>`  
    индекс первого байта тела сообщения

Устанавливает обработчик события, возникающего при получении двоичного cообщения, без ожидания ответа отправителем.
Ссылка `this` внутри обработчика указывает на экземпляр класса `ResponsiveWebSocketConnection`.
`listener` может быть `null` или `undefined`.  
Пример использования см. в [sendingUnrequestingMessages.mjs](./examples/sendingUnrequestingMessages.mjs).

### setUnrequestingTextMessageListener(listener)

* `listener <function>`  
сигнатура обработчика: `(text, startIndex)`, где
    * `text <string>`  
    сообщение, cодержащее заголовок и переданное отправителем тело
    * `startIndex <number>`  
    индекс первого символа в строке text, с которого начинается тело сообщения

Устанавливает обработчик события, возникающего при получении текстового cообщения, без ожидания ответа отправителем.
Ссылка `this` внутри обработчика указывает на экземпляр класса `ResponsiveWebSocketConnection`.
`listener` может быть `null` или `undefined`.  
Пример использования см. в [sendingUnrequestingMessages.mjs](./examples/sendingUnrequestingMessages.mjs).

### startIndexOfBodyInBinaryResponse

* `<number>`

Первый индекс байта в ответе, с которого начинается тело сообщения.

### startIndexOfBodyInTextResponse

* `<number>`

Первый индекс символа в ответе, с которого начинается тело сообщения.

### terminate()

Разрывает соединение. У экземпляров класса ResponsiveWebSocketClient в браузере данный метод отсутствует.

### Cтатичный класс TimeoutToReceiveResponseError

Исключение возникает, когда ответ на запрос не пришел за отведённое время maxTimeMsToWaitResponse.

## Класс ResponsiveWebSocketClient

Наследует `ResponsiveWebSocketConnection`.

### new ResponsiveWebSocketClient([protocols[, options]])

* `protocols <string[]>` список протоколов
* `options <Object>` только для ResponsiveWebSocketClient в node.js
    * `followRedirects <boolean>` по умoлчанию `false`
    * `generateMask <function>`
    функция, используемая для создания маски, вызывается перед отправкой каждого сообщения.
    Принимает `<Buffer>`, который должен быть заполнен синхронно.
    По умолчанию в `<Buffer>` записывается случайные байты, созданные криптографически стойким алгоритмом.
    * `handshakeTimeout <number>`
    максимальное время в миллисекундах ожидания запроса рукопожатия.
    * `maxPayload <number>`
    максимальный размер сообщения в байтах. По умолчанию 100 MiB (104857600 байт).
    * `maxRedirects <number>`
    максимальное количество перенаправлений. По умолчанию 10.
    * `origin <string>`
    значение заголовка `Origin` или `Sec-WebSocket-Origin` в зависимости от `protocolVersion`.
    * `protocolVersion <number>`
    значение заголовка `Sec-WebSocket-Version`
    * `skipUTF8Validation <boolean>`
    указывает пропускать ли проверку текста в UTF-8 для сообщений.
    По умoлчанию`false`.

Cоздает объекта класс ResponsiveWebSocketClient.

### connect(url)

* `url <string>` адрес сервера
* Возвращает `<Promise>`

Подключается к WebSocket серверу.

### static setWebSocketClientClass(W3CWebSocketClient)

* `W3CWebSocketClient <function>`  
класс реализующий интерфейс WebSocketClient от W3C

Устанавливает класс WebSocket, на основе которого будут создаваться объекты класса ResponsiveWebSocketClient.
Метод нужно вызвать перед первым вызовом конструктора new ResponsiveWebSocketClient().

Функция позволяет использовать ResponsiveWebSocketClient в браузере и node.js.  
Пример:  
в node.js:  
```js
import ResponsiveWebSocketServer from "ResponsiveWebSockets/Server";
import W3CWebSocketClient from "ResponsiveWebSockets/W3CWebSocketClient";
import ResponsiveWebSocketClient from "ResponsiveWebSockets/Client";

ResponsiveWebSocketClient.setWebSocketClientClass(W3CWebSocketClient);
```  
в браузере:
```js
import ResponsiveWebSocketClient from "ResponsiveWebSockets/Client";

ResponsiveWebSocketClient.setWebSocketClientClass(window.WebSocket);
```  

## Класс ResponsiveWebSocketServer

### new ResponsiveWebSocketServer([options])

* `options <Object>` [uWebSockets.js doc](https://unetworking.github.io/uWebSockets.js/generated/interfaces/WebSocketBehavior.html)  
    * `compression <number>`
    * `idleTimeout <number>`
    * `maxBackpressure <number>`
    * `maxPayloadLength <number>`
    * `sendPingsAutomatically `
    * `server` `<App>` или `<SSLApp>` модуля uWebSockets.js  
По умолчанию создается новый http сервер.
    * `url <string>`  
Адрес подключения к webSocket серверу. Пример: "/wsAPI/*", "/room/*".  
По умолчанию "/*".

Создает отзывчивый WebSocket сервер.

### close()

Закрывает http или https сервер, к которому прикреплен WebSocket сервер.

### listen(port)

* `port <number>`
* Возвращает `<Promise>`

Начинает прослушивание указаного порта.

### setConnectionListener(httpRequest, listener)

* `listener <function>`  
сигнатура обработчика: `(connection)`
    * `connection <ResponsiveWebSocketServerConnection>` соединение с клиентом

Событие connection возникает при подключении WebSocket клиента к серверу.
Ссылка `this` внутри обработчика указывает на экземпляр класса `ResponsiveWebServer`.
`listener` может быть `null` или `undefined`.

### setUpgradeListener(listener)

* `listenet <function>`
сигнатура обработчика: `(httpRequest, handshakeAction)`
    * `httpRequest <HttpRequest>` запрос из модуля uWebSockets.js
    * `handshakeAction <HandshakeAction>`
    объект, позволяющий принять или отклонить запрос на создание WebSocket соединения

Устанавливает обработчик события, происходящего при запросе на создание WebSocket соединения.
По умолчанию все подключения принимаются.
Ссылка `this` внутри обработчика указывает на объект экземпляра `ResponsiveWebSocketServer`.
`listener` может быть `null` или `undefined`.

## Класс ResponsiveWebSocketServerConnection

Наследует ResponsiveWebSocketConnection. Соединение с клиентом.

### getRemoteAddress()

* Возвращает `<ArrayBuffer>`

Метод для получения IP двоичного адреса. IPv4 адрес состоит из 4 байт и может быть переведен в текст,
путем печати каждого байта как числа от 0 до 256. IPv4 адрес состоит из 16 байт и может быть переведен в текст,
путем печати каждого байта как числа от 0 до 256 в шестнадцатеричной системе счисления.

### sendFragmentsOfBinaryRequest(...fragments)

* `...fragments <string|ArrayBuffer|Uint8Array|Int8Array|Uint16Array|Int16Array|Uint32Array|Int32Array|Float32Array|Float64Array>` части запроса
* Возвращает `<Promise<ResponseData>>`

Отправляет двоичный запрос, также как `sendBinaryRequest`.
Метод посылает данные фрагментами, без соединения частей в одно тело, избегая выделения памяти для всего запроса.  
Пример использования:
```js
const smallHeader = new Uint8Array([1, 2, 3, 4]).buffer;
const bigBody = new Uint8Array([10, 20, 30, 40, 50, 60, 70, 80, 90, 100, 1, 2, 3, 4, 5, 6, 7, 8, 9]).buffer;
const responseData = await connection.sendFragmentsOfBinaryRequest(smallHeader, bigBody);
```

### sendFragmentsOfTextRequest(...fragments)

* `...fragments <string|ArrayBuffer|Uint8Array|Int8Array|Uint16Array|Int16Array|Uint32Array|Int32Array|Float32Array|Float64Array>` части запроса
* Возвращает `<Promise<ResponseData>>`

Отправляет текстовый запрос, также как `sendTextRequest`.
Метод посылает данные фрагментами, без соединения частей в одно тело, избегая выделения памяти для всего запроса.  
Пример использования:
```js
const smallHeader = "abcd";
const bigBody = "Lorem Ipsum. ".repeat(20);
const responseData = await connection.sendFragmentsOfTextRequest(smallHeader, bigBody);
```

### sendFragmentsOfUnrequestingBinaryMessage(...fragments)

* `...fragments <string|ArrayBuffer|Uint8Array|Int8Array|Uint16Array|Int16Array|Uint32Array|Int32Array|Float32Array|Float64Array>` части сообщения

Отправляет двоичное сообщение, без ожидания ответа, также как `sendUnrequestingBinaryMessage`.
Метод посылает данные фрагментами, без соединения частей в одно тело, избегая выделения памяти для всего сообщения.

### sendFragmentsOfUnrequestingTextMessage(...fragments)

* `...fragments <string|ArrayBuffer|Uint8Array|Int8Array|Uint16Array|Int16Array|Uint32Array|Int32Array|Float32Array|Float64Array>` части сообщения

Отправляет текстовое сообщение, без ожидания ответа, также как `sendUnrequestingTextMessage`.
Метод посылает данные фрагментами, без соединения частей в одно тело, избегая выделения памяти для всего сообщения.

### url

* `<string>`

Адрес подключения WebSocket клиента.

### userData

* `<any>`

Опциональное поле, для сведений, прикреплённых к объекту соединения с клиентом,
при вызове метода `acceptConnection(userData)` экземпляра `HandshakeAction`.

## Класс ResponseSender

Объект, передаваемый обработчикам событий 'binaryRequest' и 'textRequest'.
На двоичный запрос можно оправить двоичный или текстовый ответ.
На текстовый запрос можно оправить текстовый или двоичный ответ.
Метод для отправки ответа (sendBinaryResponse или sendTextResponse) вызывается только 1 раз.

### sendBinaryResponse(bytes)

* `bytes <ArrayBuffer>` ответ.
Клиент принимает `<ArrayBuffer>`.
Серверное соединение принимает `<string|ArrayBuffer|Uint8Array|Int8Array|Uint16Array|Int16Array|Uint32Array|Int32Array|Float32Array|Float64Array>`.

Отправляет двоичный ответ.

### sendTextResponse(text)

* `text <string>` ответ.
Клиент принимает `<string>`.
Серверное соединение принимает `<string|ArrayBuffer|Uint8Array|Int8Array|Uint16Array|Int16Array|Uint32Array|Int32Array|Float32Array|Float64Array>`.

Отправляет текстовый ответ.

### Класс ServerResponseSender

Наследует `ResponseSender`.

### sendFragmentsOfBinaryResponse(...fragments)

* `...fragments <string|ArrayBuffer|Uint8Array|Int8Array|Uint16Array|Int16Array|Uint32Array|Int32Array|Float32Array|Float64Array>` части ответа

Отправляет двоичный ответ, также как `sendBinaryResponse`.
Метод посылает данные фрагментами, без соединения частей в одно тело, избегая выделения памяти для всего ответа.

### sendFragmentsOfTextyResponse(...fragments)

* `...fragments <string|ArrayBuffer|Uint8Array|Int8Array|Uint16Array|Int16Array|Uint32Array|Int32Array|Float32Array|Float64Array>` части ответа

Отправляет текстовый ответ, также как `sendTextResponse`.
Метод посылает данные фрагментами, без соединения частей в одно тело, избегая выделения памяти для всего ответа.

## Класс ResponseData

Информация об ответе на запрос.

### contentType

* `<number>`

Тип контента ответного сообщения. Значение перечисления contentTypesOfMessages binary или text.
    
### message

* `<ArrayBuffer>` или `<string>`

Ответ, полученный по веб сокету, содержащий служебный заголовок и тело.

## Класс HandshakeAction

Класс, принимающий, или отклоняющий запросы на создание WebSocket соединения.

### acceptConnection([userData])

* `userData <any>`
данные, прикрепляемые к объекту соединеия с клиентом. Опциональный параметр.

Принимает запрос на создание WebSocket соединения.

### cancelConnection()

Отклоняет запрос на создание WebSocket соединения.
