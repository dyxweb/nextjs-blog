## http缓存
> http缓存主要是针对html,css,img等静态资源，常规情况下不会去缓存一些动态资源，因为缓存动态资源的话，数据的实时性就会不太好，所以我们一般都只会去缓存一些不太容易被改变的静态资源。

### http缓存的优点
- 缓存可以让服务器不去处理这个请求，客户端也可以拿到数据。节省带宽。
- 更快的加载页面。
- 减少服务器负载。
### 强缓存和协商缓存的区别
> 强缓存与协商缓存的共同点是如果命中，都是从客户端缓存中加载资源，而不是从服务器加载资源。区别是强缓存不发请求到服务器，协商缓存会发请求到服务器。

### 强缓存
> 强缓存是利用Expires或者Cache-Control这两个响应头实现的，它们都用来表示资源在客户端缓存的有效期。这两个响应头可以只启用一个，也可以同时启用，同时存在时，Cache-Control优先级高于Expires。Cache-Control是Expires的完全替代方案，能用Cache-Control就不要用Expires。

#### Expires
> Expires是HTTP 1.0提出的一个表示资源过期时间的响应头，它描述的是一个绝对时间，由服务器返回。由于是一个绝对时间当客户端的时间被修改后或者客户端时间不准时就会影响缓存命中的结果。

1. 浏览器第一次请求某一资源，如果response的header加上了Expires的header，浏览器会将资源和header都缓存下来。
2. 再次请求此资源时，找到此资源后，用Expires的时间和当前时间对比，没有过期则使用缓存的资源，如果过期重新请求资源后会更新Expires。
#### Cache-Control
> 一个相对时间，在配置缓存的时候，以秒为单位，用数值表示，如：Cache-Control:max-age=24000000000。Cache-Control描述的是一个相对时间，在进行缓存命中的时候，都是利用客户端时间进行判断，所以相比较Expires，Cache-Control的缓存管理更准确一些。

1. 浏览器第一次请求某一资源，如果response的header加上Cache-Control的header，浏览器会将资源和header都缓存下来。
2. 再次请求此资源时，找到此资源后，根据它**第一次**的请求时间和Cache-Control设定的有效期，计算出一个资源过期时间，过期时间和当前时间对比没有过期则使用缓存的资源，如果过期重新请求资源后会更新Cache-Control。
#### Cache-Control的参数
- max-age: 决定客户端资源被缓存多久，在多少秒内有效，是一个相对时间，这样比Expires具体的时间就更精确了。
- s-maxage: 决定代理服务器缓存的时长，并只对 public 缓存有效。
- no-cache：表示是强制进行协商缓存。
- no-store：表示禁止任何缓存策略，每次用户请求该资源，都会向服务器发送一个请求，每次都会下载完整的资源。
- public：表示资源即可以被浏览器缓存也可以被代理服务器缓存。
- private：表示资源只能被浏览器缓存。
#### no-cache和no-store
> no-cache是Cache-control的一个属性。no-cache的意思是强制进行协商缓存。如果某一资源的Cache-control中设置了no-cache，那么该资源会直接跳过强缓存的校验，直接去服务器进行协商缓存。而no-store就是禁止所有的缓存策略了。no-cache和no-store是一组互斥属性，它们两个不能同时出现在响应头的Cache-control字段中。

#### public和private
> public和private就是决定资源是否可以在代理服务器进行缓存的属性。public表示资源在客户端和代理服务器都可以被缓存。private则表示资源只能在客户端被缓存，拒绝资源在代理服务器缓存。如果这两个属性值都没有被设置，则默认为private。public和private也是一组互斥属性，它们两个不能同时出现在响应头的Cache-control字段中。

#### max-age和s-maxage
> max-age表示的时间资源在客户端缓存的时长，而s-maxage表示的是资源在代理服务器可以缓存的时长。s-maxage因为是代理服务端的缓存时长，它必须和上面说的public属性一起使用（public属性表示资源可以在代理服务器中缓存）。max-age和s-maxage并不互斥。它们可以一起使用。

#### Cache-control设置多个值
> Cache-control:max-age=10000,s-maxage=200000,public

### 协商缓存
> 当浏览器对某个资源的请求没有命中强缓存，就会发一个请求到服务器，验证协商缓存是否命中，如果协商缓存命中，请求响应返回的http状态为304并且会显示一个Not Modified的字符串。协商缓存是利用的是【Last-Modified，If-Modified-Since】和【ETag、If-None-Match】这两对header来管理的。协商缓存跟强缓存不一样，强缓存不发请求到服务器，所以有时候资源更新了浏览器还不知道，但是协商缓存会发请求到服务器，所以资源是否更新，服务器肯定知道。这两个header可以只启用一个，也可以同时启用，同时存在时，ETag优先级高于Last-Modified。ETag并不是last-modified的完全替代方案。而是last-modified的补充方案。项目中到底是用ETag还是last-modified完全取决于业务场景更合适使用哪个。

#### 【Last-Modified，If-Modified-Since】
> 如果服务器上资源有变化，但是最后修改时间却没有变化时就会影响协商缓存的可靠性。Last-Modified 能够感知的单位时间是秒，如果文件在 1 秒内改变了多次，那么这时候的 Last-Modified 并没有体现出修改了。性能上，Last-Modified优于ETag。

1. 浏览器第一次请求某一资源，如果response的header加上Last-Modified的header，这个header表示这个资源在服务器上的最后修改时间。
2. 再次请求此资源时，在request的header上加上If-Modified-Since的header，这个header的值就是上一次请求时返回的Last-Modified的值。
3. 服务器再次收到资源请求时，根据浏览器传过来If-Modified-Since和资源在服务器上的最后修改时间判断资源是否有变化，如果没有变化则返回304 Not Modified，但是不会返回资源内容，response header中不会再添加Last-Modified的header，因为资源没有变化，Last-Modified不会改变；如果有变化，就正常返回资源内容。
4. 浏览器收到304的响应后，就会从缓存中加载资源。
5. 如果协商缓存没有命中，浏览器直接从服务器加载资源时，Last-Modified Header在重新加载的时候会被更新，下次请求时，If-Modified-Since会启用上次返回的Last-Modified值。
#### 【ETag、If-None-Match】
> ETag就是比较文件指纹(根据文件内容计算出的唯一哈希值)。文件内容一旦改变则指纹改变。ETag需要计算文件指纹意味着服务端需要更多的计算开销。

1. 浏览器第一次请求某一资源，如果response的header加上ETag的header，这个header是服务器根据当前请求的资源生成的一个唯一标识，这个唯一标识是一个字符串，只要资源有变化这个字符串就不同，跟最后修改时间没有关系。
2. 再次请求此资源时，在request的header上加上If-None-Match的header，这个header的值就是上一次请求时返回的ETag的值。
3. 服务器再次收到资源请求时，根据浏览器传过来If-None-Match和然后再根据资源生成一个新的ETag，如果这两个值相同就说明资源没有变化，否则就是有变化；如果没有变化则返回304 Not Modified，但是不会返回资源内容；如果有变化，就正常返回资源内容。与Last-Modified不一样的是，当服务器返回304 Not Modified的响应时，由于ETag重新生成过，response header中还会把这个ETag返回，即使这个ETag跟之前的没有变化。
4. 浏览器收到304的响应后，就会从缓存中加载资源。
5. 如果协商缓存没有命中，浏览器直接从服务器加载资源时，ETag Header在重新加载的时候会被更新，下次请求时，If-None-Match会启用上次返回的ETag值。
#### 协商缓存使用注意事项
1. 分布式系统里多台机器间文件的Last-Modified必须保持一致，以免负载均衡到不同机器导致比对失败。
2. 分布式系统尽量关闭掉ETag(每台机器生成的ETag都会不一样）。
### 检查缓存过程
1. 浏览器在加载资源时，先判断它是否命中强缓存，强缓存如果命中，浏览器直接从自己的缓存中读取资源，不会发请求到服务器。
2. 当强缓存没有命中的时候，浏览器一定会发送一个请求到服务器，通过服务器端依据资源的另外一些http header验证这个资源是否命中协商缓存，如果协商缓存命中，服务器会将这个请求返回，但是不会返回这个资源的数据，而是告诉客户端可以直接从缓存中加载这个资源，于是浏览器就又会从自己的缓存中去加载这个资源。
3. 当协商缓存也没有命中的时候，浏览器直接从服务器加载资源数据。
### 最佳实践
> 由于强缓存可能会导致获取不到最新的内容(前端内容是旧的内容，后端是新的内容，这时候页面逻辑可能会崩溃)，但是协商缓存每一次都要请求服务器，也不太理想，借助构建工具可以做到每一次构建后的前端静态文件的名字不同(文件的名带有hash)，所以请求资源时请求的路径也就不同，相当于第一次请求，不存在缓存的问题。

- HTML：使用协商缓存。
- CSS&JS&图片：使用强缓存，文件命名带上hash值。
**设置 Cache-Control: private，这可以禁用掉所有 Public Cache（比如代理），这就减少了攻击者跨界访问到公共内存的可能性。**
```
// nginx配置示例
location / {

  # 其它配置
  ...

  if ($request_uri ~* .*[.](js|css|map|jpg|png|svg|ico)$) {
    #非html缓存1个月
    add_header Cache-Control "private, max-age=2592000";
  }

  if ($request_filename ~* ^.*[.](html|htm)$) {
    #html文件使用协商缓存
    add_header Cache-Control "private, no-cache";
  }
}
```
### 不同刷新的请求执行过程
1. 浏览器地址栏中写入URL，回车
> 浏览器发现缓存中有这个文件了，不用继续请求了，直接去缓存拿。

2. F5
> 采用协商缓存的形式。

3. Ctrl+F5
> 把缓存中的文件删除，然后再去服务器请求个完整的资源文件下来。于是客户端就完成了强行更新的操作。

### 缓存位置
#### 优先级从高到低 (操作系统的常理：先读内存，再读硬盘。)
1. Service Worker
2. Memory Cache
3. Disk Cache
4. Push Cache
#### Service Worker
> Service Worker 借鉴了 Web Worker的 思路，即让 JS 运行在主线程之外，由于它脱离了浏览器的窗体，因此无法直接访问DOM。虽然如此，但它仍然能帮助我们完成很多有用的功能，比如离线缓存、消息推送和网络代理等功能。其中的离线缓存就是 Service Worker Cache。这个缓存是永久性的，关闭 TAB 或者浏览器，下次打开依然还在。有两种情况会导致这个缓存中的资源被清除：手动调用 API cache.delete(resource) 或者容量超过限制，被浏览器全部清空。

#### Memory Cache
> Memory Cache指的是内存缓存，从效率上讲它是最快的。但是从存活时间来讲又是最短的，**当渲染进程结束后，内存缓存也就不存在了, 关闭 TAB 或者浏览器缓存就不在了**。

#### Disk Cache
> Disk Cache就是存储在磁盘中的缓存，从存取效率上讲是比内存缓存慢的，但是他的优势在于存储容量和存储时长。
好，现在问题来了，既然两者各有优劣，那浏览器如何决定将资源放进内存还是硬盘呢？主要策略如下：

#### 区别
> 比较大的JS、CSS文件会直接被丢进磁盘，反之丢进内存，内存使用率比较高的时候，文件优先进入磁盘。

#### Push Cache
> 推送缓存，这是浏览器缓存的最后一道防线。它是 HTTP/2 中的内容。

#### 访问缓存优先级
1. 先在内存中查找,如果有,直接加载。
2. 如果内存中不存在,则在磁盘中查找,如果有直接加载。
3. 如果磁盘中也没有,那么就进行网络请求。
4. 请求获取的资源缓存到硬盘和内存。
