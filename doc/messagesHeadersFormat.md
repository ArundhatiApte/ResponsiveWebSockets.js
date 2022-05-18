## Responsive Web Sockets format of messages headers

Responsive Web Sockets use 3 types of messages: requests, responses and unrequesting messages.
At the beginning of the message there is a header indicating the type, then there is the body.
The header of request and response also contains a 16 bit number of message.

The first byte of the binary request header is 1, the next 2 bytes contain the message number.
Example: `0b00000001_00101010_01100110` (message number - 10854).

The first byte of the binary response header is 2, the next 2 bytes contain the message number.
Example: `0b00000010_00101010_01100110` (message number - 10854).

The header of unrequesting message consists of 1 byte, which equal to 3.
