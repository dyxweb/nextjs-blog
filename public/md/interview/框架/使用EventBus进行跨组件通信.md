## 使用EventBus进行跨组件通信
### Vue中使用EventBus进行跨组件通信
- event-bus.js
```
import Vue from 'vue';

// 创建一个新的Vue实例作为事件总线
const EventBus = new Vue();

// 导出该实例，以便在应用程序中的其他地方使用
export default EventBus;
```
- 组件A
```
<template>
  <div>
    <button @click="emitEvent">触发事件</button>
  </div>
</template>

<script>
import EventBus from './event-bus.js';

export default {
  methods: {
    emitEvent() {
      // 使用事件总线触发名为'custom-event'的事件，并传递数据
      EventBus.$emit('custom-event', '这是传递的数据');
    }
  }
}
</script>
```
- 组件B
```
<template>
  <div>
    <p>{{ eventData }}</p>
  </div>
</template>

<script>
import EventBus from './event-bus.js';

export default {
  data() {
    return {
      eventData: ''
    };
  },
  mounted() {
    // 在组件创建时，通过事件总线监听'custom-event'事件
    EventBus.$on('custom-event', eventData => {
      // 更新组件的数据
      this.eventData = eventData;
      console.log('收到事件，数据为:', eventData);
    });
  }
}
</script>
```
### React中使用EventBus进行跨组件通信
> 在React中没有像Vue中的事件总线那样的直接内置机制。可以使用第三方库eventemitter3。

- 安装eventemitter3
```
npm install eventemitter3
```
- 创建全局的事件管理器 eventBus.js
```
import { EventEmitter } from 'eventemitter3';

const eventBus = new EventEmitter();

export default eventBus;
```
- 组件A
```
import React from 'react';
import eventBus from './eventBus';

class ComponentA extends React.Component {
  emitEvent = () => {
    eventBus.emit('custom-event', '这是传递的数据');
  };

  render() {
    return (
      <div>
        <button onClick={this.emitEvent}>触发事件</button>
      </div>
    );
  }
}

export default ComponentA;
```
- 组件B
```
import React, { useState, useEffect } from 'react';
import eventBus from './eventBus';

const ComponentB = () => {
  const [eventData, setEventData] = useState('');

  useEffect(() => {
    const eventBusListener = (data) => {
      setEventData(data);
      console.log('收到事件，数据为:', data);
    };

    eventBus.on('custom-event', eventBusListener);

    return () => {
      // 在组件卸载时取消事件监听
      eventBus.off('custom-event', eventBusListener);
    };
  }, []);

  return (
    <div>
      <p>{eventData}</p>
    </div>
  );
};

export default ComponentB;
```
### 使用EventBus进行跨组件通信优点
- 解耦组件：事件总线能够实现组件之间的解耦，使得它们不需要直接引用或依赖彼此，提高了代码的灵活性和可维护性。
- 简化通信：对于一些简单的通信需求，事件总线提供了一种相对简单的方式，避免了通过 props 和回调函数传递数据时的繁琐操作。
- 全局通信：事件总线通常是全局性的，能够在整个应用程序中的任何地方进行通信，适用于全局状态的传递和应用的整体控制。
- 跨组件通信：事件总线可以方便地实现非父子组件之间的通信，而不需要在组件之间建立直接的关联。
### 使用EventBus进行跨组件通信缺点
- 全局状态管理：使用事件总线可能引入全局状态，导致应用状态变得难以追踪和理解，特别是在大型应用中。
- 难以调试：全局性的事件监听和触发可能使得追踪代码执行流程和调试变得更加困难，尤其是在复杂的应用场景下。
- 潜在的性能问题：大量的全局事件监听和触发可能导致性能问题，尤其是在频繁触发事件的情况下。
- 不明确的数据流向：使用事件总线时，数据的流向相对不明确，可能增加代码的复杂性，使得应用程序的数据流变得更加难以理解。
- 安全性问题：由于事件总线是全局的，可能存在安全风险，例如某个组件监听了不应该被其它组件触发的敏感事件。