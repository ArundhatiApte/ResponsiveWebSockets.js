## Содержание

- [Класс: ResponsiveWebSocketConnection](#класс-responsivewebsocketconnection)
    * close([code, reason])
    * static contentTypesOfMessages
    * sendBinaryRequest(bytes[, maxTimeMsToWaitResponse])
    * sendTextRequest(text[, maxTimeMsToWaitResponse])
    * sendUnrequestingBinaryMessage(bytes)
    * sendUnrequestingTextMessage(text)
    * setBinaryRequestListener(listener)
    * setCloseListener(listener)
    * setMaxTimeMsToWaitResponse(timeMs)
    * setUnrequestingBinaryMessageListener(listener)
    * setUnrequestingTextMessageListener(listener)
    * startIndexOfBodyInBinaryResponse
    * startIndexOfBodyInTextResponse
    * terminate()
    * static class TimeoutToReceiveResponseException
- [Класс: ResponsiveWebSocketClient](#класс-responsivewebsocketclient)
    * new ResponsiveWebSocketClient()
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
    * url
- [Класс: ResponseSender](#класс-responsesender)
- [Класс: ResponseData](#класс-responsedata)

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
* `maxTimeMsToWaitResponse <number>`  
опционально, по умолчанию равно значению свойства maxTimeMsToWaitResponse
* Возвращает `<Promise<ResponseData>>`
 
Отправляет бинарное сообщение, ожидающее ответ.
Получатель имеет возможность отправить ответ, установив обработчик события 'binaryRequest'.
Если ответ не придет в течении maxTimeMsToWaitResponse миллисекунд, Promise завершится исключением `TimeoutToReceiveResponseException`.  
Пример использования см. в [sendingRequests.mjs](./examples/sendingRequests.mjs)

### sendTextRequest(text[, maxTimeMsToWaitResponse])

* `text <string>`
* `maxTimeMsToWaitResponse <number>`  
опционально, по умолчанию равно значению свойства maxTimeMsToWaitResponse
* Возвращает `<Promise<ResponseData>>`

Отправляет текстовое сообщение, ожидающее ответ.
Получатель имеет возможность отправить ответ, установив обработчик события 'textRequest'.
Если ответ не придет в течении maxTimeMsToWaitResponse миллисекунд, Promise завершится исключнием TimeoutToReceiveResponseException.  
Пример использования см. в [sendingRequests.mjs](./examples/sendingRequests.mjs)

### sendUnrequestingBinaryMessage(bytes)
* `bytes <ArrayBuffer>`

Отправляет бинарное сообщение без ожидания ответа.
При поступлении сообщения получателю, генерируется событие UnrequestingBinaryMessage.
 
### sendUnrequestingTextMessage(text)

* `text <string>`

Отправляет текстовое сообщение без ожидания ответа.
При поступлении сообщения получателю, генерируется событие UnrequestingTextMessage.

### setBinaryRequestListener(listener)

* `listener <function>`  
сигнатура обработчика: `(bytes, startIndex, responseSender)`, где
    * `bytes <ArrayBuffer>`  
    сообщение, cодержащее заголовок и переданное отправителем тело
    * `startIndex <number>`  
    индекс первого байта тела сообщения
    * `responseSender <ResponseSender>`  
    объект для отправки бинарного или текстового ответа  

Устанавливает обработчик события, возникающего при бинарного получении сообщения, отправитель которого ожидает ответ.
Ссылка `this` внутри обработчика указывает на экземпляр класса `ResponsiveWebSocketConnection`.
`listener` может быть `null` или `undefined`.  
Пример использования см. в [sendingRequests.mjs](./examples/sendingRequests.mjs)

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

### setMaxTimeMsToWaitResponse(timeMs)

* `timeMs <number>`

Задает максимальное время в миллисекундах ожидания ответа по умолчанию для отправленных сообщений с помощью методов sendBinaryRequest и sendTextRequest.
Можно переопределить во 2-м парметре метода для отправки ожидающего ответа сообщения.
По умолчанию 2000.

### setTextRequestListener(listener)

* `listener <function>`  
сигнатура обработчика: `(text, startIndex, responseSender)`, где
    * `text <string>`  
    сообщение, cодержащее заголовок и переданное отправителем тело
    * `startIndex <number>`  
    индекс первого символа в строке text, с которого начинается тело сообщения
    * `responseSender <ResponseSender>`    
    объект для отправки текстового или бинарного ответа  

Устанавливает обработчик события, возникающего при получении текстового cообщения, отправитель которого ожидает ответ.
Ссылка `this` внутри обработчика указывает на экземпляр класса `ResponsiveWebSocketConnection`.
`listener` может быть `null` или `undefined`.  
Пример использования см. в [sendingRequests.mjs](./examples/sendingRequests.mjs))

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

### Cтатичный класс TimeoutToReceiveResponseException

Исключение возникает, когда ответ не пришел за время maxTimeMsToWaitResponse.

## Класс ResponsiveWebSocketClient

### new ResponsiveWebSocketClient()

Cоздает объекта класс ResponsiveWebSocketClient, без параметров

### connect(url)

* `url <string>` адрес сервера
* Возвращает `<Promise>`

Подключается к webSocket серверу.

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

* options <Object>  
    * `compression <number>` [См.](https://unetworking.github.io/uWebSockets.js/generated/interfaces/WebSocketBehavior.html#compression)
    * `idleTimeout <number>` [См.](https://unetworking.github.io/uWebSockets.js/generated/interfaces/WebSocketBehavior.html#idleTimeout)
    * `maxBackpressure <number>` [См.](https://unetworking.github.io/uWebSockets.js/generated/interfaces/WebSocketBehavior.html#maxBackpressure)
    * `maxPayloadLength <number>` [См.](https://unetworking.github.io/uWebSockets.js/generated/interfaces/WebSocketBehavior.html#maxPayloadLength)
    * `sendPingsAutomatically ` [См.](https://unetworking.github.io/uWebSockets.js/generated/interfaces/WebSocketBehavior.html#sendPingsAutomatically)
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
сигнатура обработчика: `function(connection)`
    * `connection <ResponsiveWebSocketServerConnection>` соединение с клиентом

Событие 'connection' возникает при подключении WebSocket клиента к серверу.
Ссылка `this` внутри обработчика указывает на экземпляр класса `ResponsiveWebServer`.
`listener` может быть `null` или `undefined`.

### setUpgradeListener(listener)

* `listenet <function>`
сигнатура обработчика: `function(httpRequest, upgradeAcceptor)`
    * `httpRequest <HttpRequest>` запрос из модуля uWebSockets.js
    * `upgradeAcceptor <UpgradeAcceptor>`
    объект, позволяющий принять или отклонить запрос на создание WebSocket соединения

Устанавливает обработчик запроса для создания WebSocket соединения.
По Умолчанию все запросы принимаются.
Ссылка `this` внутри обработчика указывает на объект экземпляра `ResponsiveWebSocketServer`.
`listener` может быть `null` или `undefined`.

## Класс ResponsiveWebSocketServerConnection

Наследует ResponsiveWebSocketConnection. Соединение с клиентом.

### getRemoteAddress()

* Возвращает `<ArrayBuffer>`

Метод для получения IP двоичного адреса. IPv4 адрес состоит из 4 байт и может быть переведен в текст,
путем печати каждого байта как числа от 0 до 256. IPv4 адрес состоит из 16 байт и может быть переведен в текст,
путем печати каждого байта как числа от 0 до 256 в шестнадцатеричной системе счисления.

### url

* `<string>`

Адрес подключения WebSocket клиента.

## Класс ResponseSender

Объект, передаваемый обработчикам событий 'binaryRequest' и 'textRequest'.
На двоичный запрос можно оправить двоичный или текстовый ответ.
На текстовый запрос можно оправить текстовый или двоичный ответ.
Метод для отправки ответа (sendBinaryResponse или sendTextResponse) вызывается только 1 раз.

### sendBinaryResponse(bytes)

* `bytes <ArrayBuffer>` ответ

### sendTextResponse(text)

* `text <string>` ответ

## Класс ResponseData

Информация об ответе на запрос.

### contentType

* `<number>`

Тип контента ответного сообщения. Значение перечисления contentTypesOfMessages binary или text.
    
### message

* `<ArrayBuffer>` или `<string>`

Ответ, полученный по веб сокету, содержащий служебный заголовок и тело.
