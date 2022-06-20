# API Отзывчивых WebSockets

#### Содержание

- [Класс: ResponsiveWebSocketConnection](#класс-responsivewebsocketconnection)
    * close([code[, reason]])
    * setCloseListener(listener)
    * setErrorListener(listener)
    * setMalformedBinaryMessageListener(listener)
    * setMaxTimeMsToWaitResponse(timeMs)
    * setUnrequestingBinaryMessageListener(listener)
    * startIndexOfBodyInBinaryResponse
    * terminate()
    * static class TimeoutToReceiveResponseError
    * url
- [Класс: ResponsiveWebSocketClient](#класс-responsivewebsocketclient)
    * new ResponsiveWebSocketClient([protocols[, options]])
    * connect(url)
    * sendBinaryRequest(message[, maxTimeMsToWaitResponse])
    * sendUnrequestingBinaryMessage(message)
    * setBinaryRequestListener(listener)
    * setTextMessageListener(listener)
    * static setWebSocketClientClass(W3CWebSocketClient)
    * sizeOfHeaderForBinaryRequest
    * sizeOfHeaderForBinaryResponse
    * sizeOfHeaderForUnrequestingBinaryMessage
- [Клаcc: ClientResponseSender](#класс-clientresponsesender)
    * sendBinaryResponse(message)
- [Класс: ResponsiveWebSocketServer](#класс-responsivewebsocketserver)
    * new ResponsiveWebSocketServer([options])
    * close()
    * listen(port)
    * setConnectionListener(listener)
    * setUpgradeListener(listener)
- [Класс: HandshakeAction](класс-handshakeaction)
    * acceptConnection([userData])
    * rejectConnection()
- [Класс: ResponsiveWebSocketServerConnection](#класс-responsivewebsocketserverconnection)
    * getRemoteAddress()
    * sendBinaryRequest(message[, maxTimeMsToWaitResponse])
    * sendFragmentsOfBinaryRequest(...fragments)
    * sendFragmentsOfUnrequestingBinaryMessage(...fragments)
    * sendUnrequestingBinaryMessage(message)
    * setBinaryRequestListener(listener)
    * setTextMessageListener(listener)
    * url
    * userData
- [Класс: ServerConnectionResponseSender](#класс-serverresponsesender)
    * sendBinaryResponse(message)
    * sendFragmentsOfBinaryResponse(...fragments)

## Класс: ResponsiveWebSocketConnection

Базовый класс для серверного соединения и клиента.

### close([code[, reason]])

* `code <integer>`
* `reason <string>`

Начинает процедуру закрытия соединения.

### setCloseListener(listener)

* `listener <function>`  
сигнатура обработчика: `(event)`
    * `event <Object>`
        * `code <number>`
        * `reason <string>`
        * `wasClean <bool>`

Устанавливает обработчик закрытия WebSocket соединения.
Ссылка `this` внутри обработчика указывает на экземпляр класса `ResponsiveWebSocketConnection`.
`listener` может быть равен `null`.

### setErrorListener(listener)

* `listener <function>`  
сигнатура обработчика: `(error)`
    * `error <Error>`

Устанавливает обработчик ошибок внутреннего WebSocket соединения.

### setMalformedBinaryMessageListener(listener)

* `listener <function>`  
сигнатура обработчика: `(message)`
    * `message <ArrayBuffer>`

Устанавливает обработчик события, возникающего при получении двоичного сообщения без верного заголовка.
Ссылка `this` внутри обработчика указывает на экземпляр класса `ResponsiveWebSocketConnection`.
`listener` может быть равен `null`.

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

### setMaxTimeMsToWaitResponse(timeMs)

* `timeMs <number>` Максимальное время ожидания ответа

Задает максимальное время в миллисекундах ожидания ответа по умолчанию для отправленных сообщений
с помощью метода `sendBinaryRequest`.
Можно переопределить во 2-ом параметре метода для отправки ожидающего ответа сообщения.
По умолчанию 2000.

### setUnrequestingBinaryMessageListener(listener)

* `listener <function>`  
сигнатура обработчика: `(bytes, startIndex)`
    * `bytes <ArrayBuffer>` Сообщение, содержащее заголовок и переданное отправителем тело
    * `startIndex <number>` Индекс первого байта тела сообщения

Устанавливает обработчик события, возникающего при получении двоичного сообщения без ожидания ответа отправителем.
Ссылка `this` внутри обработчика указывает на экземпляр класса `ResponsiveWebSocketConnection`.  
Пример использования: [sendingUnrequestingBinaryMessages.mjs](/examples/sendingUnrequestingBinaryMessages.mjs).

### startIndexOfBodyInBinaryResponse

* `<number>`

Первый индекс байта в двоичном ответе, с которого начинается тело сообщения.

### terminate()

Разрывает соединение без процедуры закрытия.
У экземпляров класса `ResponsiveWebSocketClient` в браузере данный метод отсутствует.

### Cтатичный класс TimeoutToReceiveResponseError

Исключение, возникающее при вызове метода `sendBinaryRequest`,
когда ответ на запрос не пришёл за отведённое время maxTimeMsToWaitResponse.

### url

* `<string>`

Адрес WebSocket соединения.

## Класс ResponsiveWebSocketClient

Наследует `ResponsiveWebSocketConnection`.

### new ResponsiveWebSocketClient([protocols[, options]])

* `protocols <string[]>` Список протоколов
* `options <Object>` Только для ResponsiveWebSocketClient в node.js
    * `followRedirects <boolean>` По умoлчанию `false`
    * `generateMask <function>`
    Функция, используемая для создания маски, вызывается перед отправкой каждого сообщения.
    Принимает `<Buffer>`, который должен быть заполнен синхронно.
    По умолчанию в `<Buffer>` записывается случайные байты, созданные криптографически-стойким алгоритмом.
    * `handshakeTimeout <number>`
    Максимальное время в миллисекундах ожидания запроса рукопожатия.
    * `maxPayload <number>`
    Максимальный размер сообщения в байтах. По умолчанию 100 MiB (104857600 байт).
    * `maxRedirects <number>`
    Максимальное количество перенаправлений. По умолчанию 10.
    * `origin <string>`
    Значение заголовка `Origin` или `Sec-WebSocket-Origin` в зависимости от `protocolVersion`.
    * `protocolVersion <number>`
    Значение заголовка `Sec-WebSocket-Version`
    * `skipUTF8Validation <boolean>`
    Указывает пропускать ли проверку текста в UTF-8 для сообщений.
    По умoлчанию `false`.

Создает объекта класса `ResponsiveWebSocketClient`.

### connect(url)

* `url <string>` Адрес сервера
* Возвращает `<Promise>`

Подключается к WebSocket серверу.

### sendBinaryRequest(message[, maxTimeMsToWaitResponse])

* `message <ArrayBuffer>`
Сообщение запроса, содержащее в начале свободное место для заголовка.
Размер заголовка равен значению свойства `sizeOfHeaderForBinaryRequest`.
* `maxTimeMsToWaitResponse <number>`
Максимальное время ожидания ответа.
Опционально, по умолчанию равно значению, установленному методом `setMaxTimeMsToWaitResponse`.
* Возвращает `<Promise<ArrayBuffer>>`

Отправляет двоичное сообщение, ожидающее ответ.
Получатель имеет возможность отправить ответ, установив обработчик события методом `setBinaryRequestListener`.
Если ответ не придет в течении `maxTimeMsToWaitResponse` миллисекунд,
Promise завершится исключением `TimeoutToReceiveResponseError`.  
Пример использования: [sendingBinaryRequests.mjs](/examples/sendingBinaryRequests.mjs)

### sendUnrequestingBinaryMessage(message)

* `message <ArrayBuffer>`
Сообщение, содержащее в начале свободное место для заголовка.
Размер заголовка равен значению свойства `sizeOfHeaderForUnrequestingBinaryMessage`.

Отправляет двоичное сообщение без ожидания ответа.
Получатель имеет возможность увидеть данные,
установив обработчик события методом `setUnrequestingBinaryMessageListener`.  
Пример использования: [sendingUnrequestingBinaryMessages.mjs](/examples/sendingUnrequestingBinaryMessages.mjs).

### setBinaryRequestListener(listener)

* `listener <function>`  
сигнатура обработчика: `(bytes, startIndex, responseSender)`
    * `bytes <ArrayBuffer>` Сообщение, содержащее заголовок и переданное отправителем тело
    * `startIndex <number>` Индекс первого байта тела сообщения
    * `responseSender <ClientResponseSender>` Объект для отправки ответа

Устанавливает обработчик события, возникающего при получении двоичного сообщения, отправитель которого ожидает ответ.
Ссылка `this` внутри обработчика указывает на экземпляр класса `ResponsiveWebSocketClient`.  
Пример использования: [sendingBinaryRequests.mjs](/examples/sendingBinaryRequests.mjs)

### setTextMessageListener(listener)

* `listener <function>`
сигнатура обработчика: `(message)`
    * `message <string>` Текстовое сообщение, полученное WebSocket-ом

Устанавливает обработчик события, возникающего при получении текстового сообщения.
Ссылка `this` внутри обработчика указывает на экземпляр класса `ResponsiveWebSocketClient`.
`listener` может быть равен `null`.

### static setWebSocketClientClass(W3CWebSocketClient)

* `W3CWebSocketClient <function>` Класс, реализующий интерфейс
[WebSocketClient](https://developer.mozilla.org/en-US/docs/Web/API/WebSocket) от W3C

Устанавливает класс `WebSocket`, на основе которого будут создаваться объекты класса `ResponsiveWebSocketClient`.
Метод нужно вызвать перед первым использованием конструктора `ResponsiveWebSocketClient`.

Функция позволяет использовать `ResponsiveWebSocketClient` в браузере и node.js.  
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

### sizeOfHeaderForBinaryRequest

* `<number>`

Размер заголовка для двоичного запроса.

### sizeOfHeaderForBinaryResponse

* `<number>`

Размер заголовка для двоичного ответа.

### sizeOfHeaderForUnrequestingBinaryMessage

* `<number>`

Размер заголовка для незапрашивающего двоичного сообщения.

## Класс ClientResponseSender

Класс на стороне клиента, отправляющий ответ на запрос.
Метод для отправки ответа вызывается только 1 раз.

### sendBinaryResponse(message)

* `message <ArrayBuffer>` Сообщение, содержащее в начале свободное место для заголовка.
Размер заголовка равен значению свойства `sizeOfHeaderForBinaryResponse` объекта класса `ResponsiveWebSocketClient`.

Отправляет двоичный ответ. Пример использования: [sendingBinaryRequests.mjs](/examples/sendingBinaryRequests.mjs).

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
    Адрес подключения к webSocket серверу. Пример: "/wsAPI/*", "/room/*". По умолчанию "/*".

Создает отзывчивый WebSocket сервер.

### close()

Закрывает http или https сервер, к которому прикреплен WebSocket сервер.

### listen(port)

* `port <number>`
* Возвращает `<Promise>`

Начинает прослушивание указанного порта.

### setConnectionListener(listener)

* `listener <function>`  
сигнатура обработчика: `(connection)`
    * `connection <ResponsiveWebSocketServerConnection>` Соединение с клиентом

Событие connection возникает при подключении WebSocket клиента к серверу.
Ссылка `this` внутри обработчика указывает на экземпляр класса `ResponsiveWebServer`.
`listener` может быть равен `null`.

### setUpgradeListener(listener)

* `listenet <function>`
сигнатура обработчика: `(httpRequest, handshakeAction)`
    * `httpRequest <HttpRequest>` Запрос из модуля uWebSockets.js
    * `handshakeAction <HandshakeAction>`
    Объект, позволяющий принять или отклонить запрос на создание WebSocket соединения

Устанавливает обработчик события, происходящего при запросе на создание WebSocket соединения.
По умолчанию все подключения принимаются.
Ссылка `this` внутри обработчика указывает на объект экземпляра `ResponsiveWebSocketServer`.
`listener` может быть равен `null`.

## Класс HandshakeAction

Класс, принимающий или отклоняющий запросы на создание WebSocket соединения.

### acceptConnection([userData])получении

* `userData <any>`
Данные, прикрепляемые к объекту серверного соединения с клиентом. Опциональный параметр.

Принимает запрос на создание WebSocket соединения.

### rejectConnection()

Отклоняет запрос на создание WebSocket соединения.

## Класс ResponsiveWebSocketServerConnection

Наследует `ResponsiveWebSocketConnection`. Соединение с клиентом.

### getRemoteAddress()

* Возвращает `<ArrayBuffer>`

Метод для получения IP двоичного адреса. IPv4 адрес состоит из 4 байт и может быть переведен в текст,
путем печати каждого байта как числа от 0 до 256. IPv4 адрес состоит из 16 байт и может быть переведен в текст,
путем печати каждого байта как числа от 0 до 256 в шестнадцатеричной системе счисления.

### sendBinaryRequest(message[, maxTimeMsToWaitResponse])

* `message <ArrayBuffer|Uint8Array|Int8Array|Uint16Array|Int16Array|Uint32Array|Int32Array|Float32Array|Float64Array>`
Сообщение запроса
* `maxTimeMsToWaitResponse <number>`
Максимальное время ожидания ответа.
Опционально, по умолчанию равно значению, установленному методом `setMaxTimeMsToWaitResponse`.
* Возвращает `<Promise<ArrayBuffer>>`

Отправляет двоичное сообщение, ожидающее ответ.
Метод ожидает получить тело сообщения без свободного места для заголовка в отличии от
`sendBinaryRequest` класса `ResponsiveWebSocketClient`.
Получатель имеет возможность отправить ответ, установив обработчик события методом `setBinaryRequestListener`.
Если ответ не придет в течение `maxTimeMsToWaitResponse` миллисекунд,
Promise завершится исключением `TimeoutToReceiveResponseError`.  
Пример использования: [sendingBinaryRequests.mjs](/examples/sendingBinaryRequests.mjs)

### sendFragmentsOfBinaryRequest(...fragments)

* `...fragments <ArrayBuffer|Uint8Array|Int8Array|Uint16Array|Int16Array|Uint32Array|Int32Array|Float32Array|Float64Array>`
Части запроса
* Возвращает `<Promise<ArrayBuffer>>`

Отправляет двоичный запрос, также как `sendBinaryRequest`.
Метод посылает данные фрагментами, без соединения частей в одно тело, избегая выделения памяти для всего запроса.  
Пример использования:

```js
const smallHeader = new Uint8Array([1, 2, 3, 4]).buffer;
const bigBody = new Uint8Array([10, 20, 30, 40, 50, 60, 70, 80, 90, 100, 1, 2, 3, 4, 5, 6, 7, 8, 9]).buffer;
const responseData = await connection.sendFragmentsOfBinaryRequest(smallHeader, bigBody);
```

### sendFragmentsOfUnrequestingBinaryMessage(...fragments)

* `...fragments <ArrayBuffer|Uint8Array|Int8Array|Uint16Array|Int16Array|Uint32Array|Int32Array|Float32Array|Float64Array>`
Части сообщения

Отправляет двоичное сообщение, без ожидания ответа, также как `sendUnrequestingBinaryMessage`.
Метод посылает данные фрагментами, без соединения частей в одно тело, избегая выделения памяти для всего сообщения.

### sendUnrequestingBinaryMessage(message)

* `message <string|ArrayBuffer|Uint8Array|Int8Array|Uint16Array|Int16Array|Uint32Array|Int32Array|Float32Array|Float64Array>`
Сообщение

Отправляет двоичное сообщение без ожидания ответа.
Метод ожидает получить тело сообщения без свободного места для заголовка в отличии от
`sendUnrequestingBinaryMessage` класса `ResponsiveWebSocketClient`.
Получатель имеет возможность увидеть данные,
установив обработчик события методом `setUnrequestingBinaryMessageListener`.

### setBinaryRequestListener(listener)

* `listener <function>`  
сигнатура обработчика: `(bytes, startIndex, responseSender)`
    * `bytes <ArrayBuffer>` Сообщение, содержащее заголовок и переданное отправителем тело
    * `startIndex <number>` Индекс первого байта тела сообщения
    * `responseSender <ServerConnectionResponseSender>` Объект для отправки ответа

Устанавливает обработчик события, возникающего при получении двоичного сообщения, отправитель которого ожидает ответ.
Ссылка `this` внутри обработчика указывает на экземпляр класса `ResponsiveWebSocketServerConnection`.  
Пример использования: [sendingBinaryRequests.mjs](/examples/sendingBinaryRequests.mjs)

### setTextMessageListener(listener)

* `listener <function>`
сигнатура обработчика: `(message)`
    * `message <ArrayBuffer>` Двоичные данные с текстовом сообщением в кодировке UTF-8, полученным WebSocket-ом

Устанавливает обработчик события, возникающего при получении текстового сообщения.

### userData

* `<any>`

Опциональное поле для сведений, прикреплённых к объекту соединения с клиентом,
при вызове метода `acceptConnection(userData)` объекта `HandshakeAction`.

### Класс ServerConnectionResponseSender

Класс на стороне сервера, отправляющий ответ на запрос. Метод для отправки ответа вызывается только 1 раз.

### sendBinaryResponse(message)

* `message <ArrayBuffer|Uint8Array|Int8Array|Uint16Array|Int16Array|Uint32Array|Int32Array|Float32Array|Float64Array>`
Ответ

Отправляет двоичный ответ. Метод ожидает получить только тело сообщения, без свободного места для заголовка
в отличии от `sendBinaryResponse` класса `ClientResponseSender`.

### sendFragmentsOfBinaryResponse(...fragments)

* `...fragments <ArrayBuffer|Uint8Array|Int8Array|Uint16Array|Int16Array|Uint32Array|Int32Array|Float32Array|Float64Array>`
Части ответа

Отправляет двоичный ответ, также как `sendBinaryResponse`.
Метод посылает данные фрагментами, без соединения частей в одно тело, избегая выделения памяти для всего ответа.
