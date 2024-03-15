## WebSocket心跳
### WebSocket心跳包机制
> WebSocket心跳包是WebSocket协议的保活机制，用于维持长连接。有效的心跳包可以防止长时间不通讯时WebSocket自动断开连接。

- 客户端定时向服务器发送心跳数据包，以保持长连接。
- 服务器定时向客户端发送心跳数据包，以检测客户端连接是否正常。
- 双向发送心跳数据包。
### WebSocket心跳机制作用
- 使WebSocket连接保持长连接，保持WebSocket连接不被断开。
- 检测WebSocket连接状态，及时处理异常情况。
- 减少WebSocket连接及服务器资源的消耗。
### 前端实现WebSocket心跳机制的方式
- 使用setInterval定时发送心跳包。
> 会对服务器造成很大的压力，因为即使WebSocket连接正常，也要定时发送心跳包，从而消耗服务器资源。

- 在监听到WebSocket的onclose()事件时，重新创建WebSocket连接。
> 这种方式虽然减轻了服务器的负担，但是在重连时可能会丢失一些数据。

### WebSocket重连机制
> WebSocket在发送和接收数据时，可能会因为网络原因、服务器宕机等因素而断开连接，此时需要使用WebSocket重连机制进行重新连接。

- 前端监听WebSocket的onclose()事件，重新创建WebSocket连接。
- 使用WebSocket插件或库，例如Sockjs、Stompjs等。
- 使用心跳机制检测WebSocket连接状态，自动重连。
- 使用断线重连插件或库，例如ReconnectingWebSocket等。
