## encodeURI和encodeURIComponent的异同
### 相同点
- encodeURI和encodeURIComponent作用对象都是URL，把URL上的特殊字符转换成特殊的code。
### 差异点
- encodeURI会对URL保留字符编码，不会对以下字符进行编码 ASCII字母 数字 ~!*()’@#$&=:/,;?+
- encodeURIComponent不会对URL保留字符编码，也不会对以下字符进行编码 ASCII字母 数字 ~!*()’
### encodeURIComponent比encodeURI的编码范围更大
- encodeURIComponent会把http:// 编码成 http%3A%2F%2F 而encodeURI却不会。
- encodeURI编码后的URL仍可以使用，如果还需要使用编码后的URL进行网络传输则可以使用encodeURI。例如URL出现了中文，中文在网络中无法直接传输，则URL需要编码。事实上我们在浏览器中输入一个含有中文参数的URL，在发出请求后，会自动使用encodeURI进行编码。
- 对于URL上的参数进行编码使用encodeURIComponent更好，如果URL上的参数中包含:/?=&这些字符，如果不加处理，会解析错误。
### 总结
- 对完整URL进行编码使用encodeURI，对URL上的参数进行编码使用encodeURIComponent。
### URL保留字符
> 保留字符是在URL中具有特殊含义或用途的字符。它们在URL的结构和解析中扮演着重要的角色，用于指示URL的不同部分或执行特定操作。

- 冒号（:）：在URL中用于分隔协议和主机名，例如 http://。
- 正斜杠（/）：在URL中用于分隔不同的路径段，例如 /path/to/resource。
- 问号（?）：在URL中用于分隔路径和查询参数，例如 /path?param=value。
- 井号（#）：在URL中用于表示片段标识符，例如 example.com/#section1。
- 等号（=）：在URL中用于分隔查询参数的键和值，例如 param=value。
- 和号（&）：在URL中用于分隔不同的查询参数，例如 param1=value1&param2=value2。
