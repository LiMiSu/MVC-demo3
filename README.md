
# 体验MVC

把四个模块的代码用MVC设计模式重构一下代码
分为M、V、C三个模块
怎么分呢
可以先把代码分成几个主要逻辑：无非就是搭好架子——找材料——渲染材料——添加功能
```
import './app1.css';
import $ from 'jquery';

//初始化html页面
const html = `
 <!--计算器-->
    <section id="app1">
        <div class="output">
            <span id="number">100</span>
        </div>
        <div class="actions">
            <button id="add1">+1</button>
            <button id="minus1">-1</button>
            <button id="mul2">*2</button>
            <button id="divide2">/2</button>
        </div>
    </section>
`
const $element = $(html).appendTo($('body>.page'));
//寻找重要的元素
const $button1 = $('#add1');
const $button2 = $('#minus1');
const $button3 = $('#mul2');
const $button4 = $('#divide2');
const $number = $('#number');

//初始化数据
const n = localStorage.getItem('n');//刷新还是原来求结果后的数字

//将数据渲染到页面
$number.text(n || 100);//初始化

//绑定鼠标事件
$button1.on('click', () => {
    let n = parseInt($number.text());
    n += 1;
    localStorage.setItem('n', n);
    $number.text(n);
})
$button2.on('click', () => {
    let n = parseInt($number.text());
    n -= 1;
    $number.text(n);
    localStorage.setItem('n', n);
})
$button3.on('click', () => {
    let n = parseInt($number.text());
    n *= 2;
    $number.text(n);
    localStorage.setItem('n', n);
})
$button4.on('click', () => {
    let n = parseInt($number.text());
    n /= 2;
    $number.text(n);
    localStorage.setItem('n', n);
})
```
然后把所有跟数据相关的组合到M——对象
所有跟视图相关的都放到V——对象
其他放到C——对象
寻找重要的元素，是DOM元素，不是数据，那放到哪个呢？看目的，找到这些元素的目的是绑定事件，绑定事件不是用户看得见的地方，所以放到C
雏形：
```
import './app1.css';
import $ from 'jquery';
//数据相关放到M
const m = {
    data: {
        //初始化数据
        n : localStorage.getItem('n'),
    }
}
//视图相关放到V
const v = {
    //初始化html页面,
    html: `
    <section id="app1">
        <div class="output">
            <span id="number">100</span>
        </div>
        <div class="actions">
            <button id="add1">+1</button>
            <button id="minus1">-1</button>
            <button id="mul2">*2</button>
            <button id="divide2">/2</button>
        </div>
    </section>
`,
    update(){
        //将数据渲染到页面
        c.ui.number.text(m.data.n || 100);
    },
    render() {
        const $element = $(v.html).appendTo($('body>.page'));
    }
}
// 其他放到C
const c = {
    ui: {
        //寻找重要的元素
        button1: $('#add1'),
        button2: $('#minus1'),
        button3: $('#mul2'),
        button4: $('#divide2'),
        number: $('#number'),
    },
    bindEvents(){
        //绑定鼠标事件
        c.ui.button1.on('click', () => {
            let n = parseInt(c.ui.number.text());
            n += 1;
            localStorage.setItem('n', n);
            c.ui.number.text(n);
        })
        c.ui.button2.on('click', () => {
            let n = parseInt(c.ui.number.text());
            n -= 1;
            c.ui.number.text(n);
            localStorage.setItem('n', n);
        })
        c.ui.button3.on('click', () => {
            let n = parseInt(c.ui.number.text());
            n *= 2;
            c.ui.number.text(n);
            localStorage.setItem('n', n);
        })
        c.ui.button4.on('click', () => {
            let n = parseInt(c.ui.number.text());
            n /= 2;
            c.ui.number.text(n);
            localStorage.setItem('n', n);
        })
    }
}
//第一次渲染html
v.render();
c.bindEvents();
```
但是一系列的重要元素`botton`获取得太早了，还没`render`到页面呢，所以点击没有效果
写一个初始化init方法，先`render`再初始化
```
import './app1.css';
import $ from 'jquery';
//数据相关放到M
const m = {
    data: {
        //初始化数据
        n: localStorage.getItem('n'),
    }
}
//视图相关放到V
const v = {
    //初始化html页面,
    html: `
    <section id="app1">
        <div class="output">
            <span id="number">100</span>
        </div>
        <div class="actions">
            <button id="add1">+1</button>
            <button id="minus1">-1</button>
            <button id="mul2">*2</button>
            <button id="divide2">/2</button>
        </div>
    </section>
`,
    update() {
        //将数据渲染到页面
        c.ui.number.text(m.data.n || 100);
    },
    render() {
        const $element = $(v.html).appendTo($('body>.page'));
    }
}
// 其他放到C
const c = {
    init() {
        c.ui = {
            //寻找重要的元素
            button1: $('#add1'),
            button2: $('#minus1'),
            button3: $('#mul2'),
            button4: $('#divide2'),
            number: $('#number'),
        };
        c.bindEvents();
    },
    bindEvents() {
        //绑定鼠标事件
        c.ui.button1.on('click', () => {
            let n = parseInt(c.ui.number.text());
            n += 1;
            localStorage.setItem('n', n);
            c.ui.number.text(n);
        })
        c.ui.button2.on('click', () => {
            let n = parseInt(c.ui.number.text());
            n -= 1;
            c.ui.number.text(n);
            localStorage.setItem('n', n);
        })
        c.ui.button3.on('click', () => {
            let n = parseInt(c.ui.number.text());
            n *= 2;
            c.ui.number.text(n);
            localStorage.setItem('n', n);
        })
        c.ui.button4.on('click', () => {
            let n = parseInt(c.ui.number.text());
            n /= 2;
            c.ui.number.text(n);
            localStorage.setItem('n', n);
        })
    }
}
//第一次渲染html
v.render();
c.init();

```
刷新不保存数据，渲染的时候渲染的是一个固定的`v.html`，没有使用到`n`，给个占位符`{{n}}`，然后替换`replace('{{n}}', m.data.n))`
```
import './app1.css';
import $ from 'jquery';
//数据相关放到M
const m = {
    data: {
        //初始化数据
        n: parseInt(localStorage.getItem('n')),//把字符串转换一下
    }
}
//视图相关放到V
const v = {
    //初始化html页面,
    html: `
    <section id="app1">
        <div class="output">
            <span id="number">{{n}}</span>
        </div>
        <div class="actions">
            <button id="add1">+1</button>
            <button id="minus1">-1</button>
            <button id="mul2">*2</button>
            <button id="divide2">/2</button>
        </div>
    </section>
`,
    // update() {
    //     //将数据渲染到页面
    //     v.render();
    // },
    render() {
        const $element = $(v.html.replace('{{n}}', m.data.n)).appendTo($('body>.page'));
    }
}
// 其他放到C
const c = {
    init() {
        c.ui = {
            //寻找重要的元素
            button1: $('#add1'),
            button2: $('#minus1'),
            button3: $('#mul2'),
            button4: $('#divide2'),
            number: $('#number'),
        };
        c.bindEvents();
    },
    bindEvents() {
        //绑定鼠标事件
        c.ui.button1.on('click', () => {
            // let n = m.data.n;
            // n += 1;
            // m.data.n = n;
            //简写
            m.data.n += 1;
            //然后重新渲染视图，每次都渲染更新，那就不需要update函数了
            v.render();
        })
        c.ui.button2.on('click', () => {
            let n = m.data.n;
            n -= 1;
            c.ui.number.text(n);
            localStorage.setItem('n', n);
        })
        c.ui.button3.on('click', () => {
            let n = m.data.n;
            n *= 2;
            c.ui.number.text(n);
            localStorage.setItem('n', n);
        })
        c.ui.button4.on('click', () => {
            let n = m.data.n;
            n /= 2;
            c.ui.number.text(n);
            localStorage.setItem('n', n);
        })
    }
}
//第一次渲染html
v.render();
c.init();
```
但是每次渲染都没有改原来的而是再创建一个新的`.appendTo($('body>.page'));`里面，所以每次都生成一个app1插进去。
![image.png](https://upload-images.jianshu.io/upload_images/12081122-a898589ae1cf864c.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)
做个标记替换
```
import './app1.css';
import $ from 'jquery';
//数据相关放到M
const m = {
    data: {
        n: parseInt(localStorage.getItem('n')),
    }
}
//视图相关放到V
const v = {
    //标记视图有没有app1
    el: null,
    html: `
    <section id="app1">
        <div class="output">
            <span id="number">{{n}}</span>
        </div>
        <div class="actions">
            <button id="add1">+1</button>
            <button id="minus1">-1</button>
            <button id="mul2">*2</button>
            <button id="divide2">/2</button>
        </div>
    </section>
`,
    render() {
        if (v.el === null){
            v.el = $(v.html.replace('{{n}}', m.data.n)).appendTo($('body>.page'));
        } else {
            v.el = v.el.replaceWith($(v.html.replace('{{n}}', m.data.n)));//左边新的替换旧的，右边是把el的值更新
        }
    }
}
// 其他放到C
const c = {
    init() {
        c.ui = {
            button1: $('#add1'),
            button2: $('#minus1'),
            button3: $('#mul2'),
            button4: $('#divide2'),
            number: $('#number'),
        };
        c.bindEvents();
    },
    bindEvents() {
        c.ui.button1.on('click', () => {
            m.data.n += 1;
            v.render();
        })
        c.ui.button2.on('click', () => {
            let n = m.data.n;
            n -= 1;
            c.ui.number.text(n);
            localStorage.setItem('n', n);
        })
        c.ui.button3.on('click', () => {
            let n = m.data.n;
            n *= 2;
            c.ui.number.text(n);
            localStorage.setItem('n', n);
        })
        c.ui.button4.on('click', () => {
            let n = m.data.n;
            n /= 2;
            c.ui.number.text(n);
            localStorage.setItem('n', n);
        })
    }
}
//第一次渲染html
v.render();
c.init();
```
但是只能点一次，因为每次渲染一次整个app1的所有元素都是全新的，生成的button不是之前的button，没有绑定点击事件。
所以我们可以利用事件委托，在更新的app1元素外面再包一层父元素，当然这个父元素必须是外面定好的传进来的才不会一渲染就被替换。
那怎么让外部传进来呢：把自己暴露出去让别人调用，把他有的东西传给我
```
import './app1.css';
import $ from 'jquery';
//数据相关放到M
const m = {
    data: {
        n: parseInt(localStorage.getItem('n')),
    }
}
//视图相关放到V
const v = {
    //标记视图有没有app1
    el: null,
    html: `
    <section id="app1">
        <div class="output">
            <span id="number">{{n}}</span>
        </div>
        <div class="actions">
            <button id="add1">+1</button>
            <button id="minus1">-1</button>
            <button id="mul2">*2</button>
            <button id="divide2">/2</button>
        </div>
    </section>
`,
    render(container) {
        if (v.el === null){
            v.el = $(v.html.replace('{{n}}', m.data.n)).appendTo($('container'));
        } else {
            v.el = v.el.replaceWith($(v.html.replace('{{n}}', m.data.n)));//左边新的替换旧的，右边是把el的值更新
        }
    }
}
// 其他放到C
const c = {
    init(container) {
        v.render(container);
        c.ui = {
            button1: $('#add1'),
            button2: $('#minus1'),
            button3: $('#mul2'),
            button4: $('#divide2'),
            number: $('#number'),
        };
        c.bindEvents();
    },
    bindEvents() {
        c.ui.button1.on('click', () => {
            m.data.n += 1;
            v.render();
        })
        c.ui.button2.on('click', () => {
            let n = m.data.n;
            n -= 1;
            c.ui.number.text(n);
            localStorage.setItem('n', n);
        })
        c.ui.button3.on('click', () => {
            let n = m.data.n;
            n *= 2;
            c.ui.number.text(n);
            localStorage.setItem('n', n);
        })
        c.ui.button4.on('click', () => {
            let n = m.data.n;
            n /= 2;
            c.ui.number.text(n);
            localStorage.setItem('n', n);
        })
    }
}

export default c;
```
那main.js引入的app1.js就要变成：
![image.png](https://upload-images.jianshu.io/upload_images/12081122-08a33f1b666c7928.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)
所以每次渲染被替换更新的都只是父元素里面我自己的元素，父元素本身不更新
给这个父元素绑定事件
这块不是很懂：
![image.png](https://upload-images.jianshu.io/upload_images/12081122-9aca844cbe4200b2.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

```
import './app1.css';
import $ from 'jquery';
//数据相关放到M
const m = {
    data: {
        n: parseInt(localStorage.getItem('n')),
    }
}
//视图相关放到V
const v = {
    //标记视图有没有app1
    el: null,
    html: `
    <div>
        <div class="output">
            <span id="number">{{n}}</span>
        </div>
        <div class="actions">
            <button id="add1">+1</button>
            <button id="minus1">-1</button>
            <button id="mul2">*2</button>
            <button id="divide2">/2</button>
        </div>
    </div>
`,
    render(container) {
        if (v.el === null) {
            v.el = $(v.html.replace('{{n}}', m.data.n)).appendTo($(container));
        } else {
            //这里很是看不懂
            const newEl = $(v.html.replace('{{n}}', m.data.n));//每次n更新生成的html
            v.el.replaceWith(newEl);//更新原来的html
            v.el = newEl;//这一次等与下一次的html
        }
    }
}
// 其他放到C
const c = {
    init(container) {
        v.render(container);
        c.ui = {
            button1: $('#add1'),
            button2: $('#minus1'),
            button3: $('#mul2'),
            button4: $('#divide2'),
            number: $('#number'),
        };
        c.bindEvents(container);
    },
    bindEvents(container) {
        $(container).on('click', '#add1', () => {
            m.data.n += 1;
            v.render();
        })
        c.ui.button2.on('click', () => {
            let n = m.data.n;
            n -= 1;
            c.ui.number.text(n);
            localStorage.setItem('n', n);
        })
        c.ui.button3.on('click', () => {
            let n = m.data.n;
            n *= 2;
            c.ui.number.text(n);
            localStorage.setItem('n', n);
        })
        c.ui.button4.on('click', () => {
            let n = m.data.n;
            n /= 2;
            c.ui.number.text(n);
            localStorage.setItem('n', n);
        })
    }
}

export default c;

```
同样其他事件，就不用选主要元素了，而且el也可以通过判断父元素
```
import './app1.css';
import $ from 'jquery';
//数据相关放到M
const m = {
    data: {
        n: parseInt(localStorage.getItem('n')),
    }
}
//视图相关放到V
const v = {
    //标记视图有没有app1
    html: `
    <div>
        <div class="output">
            <span id="number">{{n}}</span>
        </div>
        <div class="actions">
            <button id="add1">+1</button>
            <button id="minus1">-1</button>
            <button id="mul2">*2</button>
            <button id="divide2">/2</button>
        </div>
    </div>
`,
    render(container) {
        // if ($(container).children.length===0) {
        // } else {
        //     $(container).empty();
        // }
        // $(v.html.replace('{{n}}', m.data.n)).appendTo($(container));
        //简写
        // if ($(container).children.length!==0) $(container).empty();
        // $(v.html.replace('{{n}}', m.data.n)).appendTo($(container));

        $(container).empty();
        $(v.html.replace('{{n}}', m.data.n)).appendTo($(container));
    }
}
// 其他放到C
const c = {
    init(container) {
        v.render(container);
        c.bindEvents(container);
    },
    bindEvents(container) {
        $(container).on('click', '#add1', () => {
            console.log(1)
            m.data.n += 1;
            v.render(container);
        })
        $(container).on('click', '#minus1', () => {
            m.data.n -= 1;
            v.render(container);
        })
        $(container).on('click', '#mul2', () => {
            m.data.n *= 2;
            v.render(container);
        })
        $(container).on('click', '#divide2', () => {
            m.data.n /= 2;
            v.render(container);
        })
    }
}

export default c;

```
所以MVC基本的结构属性：
![image.png](https://upload-images.jianshu.io/upload_images/12081122-b8a3560998c245bf.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)


到目前，MVC倒是没有给我们带来多大的好处，反而是更痛苦了，以前的代码只是一些简单逻辑，现在是从一个非常高的思想告诉你说你应该用MVC，但你并没有得到好处，因为现在的代码还处于比较初级的阶段，有点小题大做。
能不能让代码更加简化
![image.png](https://upload-images.jianshu.io/upload_images/12081122-847add50bbb63ae5.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)
![image.png](https://upload-images.jianshu.io/upload_images/12081122-f95d7733906bf097.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

所有的视图就是把数据给渲染一下
原生js的数据渲染操作：js读dom数据、js设置数据、js把数据给dom、dom渲染数据，每次更新都要做一遍这个操作。
![image.png](https://upload-images.jianshu.io/upload_images/12081122-d65613f890e00bcd.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)
但是MVC（React）认为每次都要这样操作很麻烦
它是这样：
![image.png](https://upload-images.jianshu.io/upload_images/12081122-2962b3264e1a34f0.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)
那就改一下我们的代码
最小知识原则，v里面不知道m的存在，所以`m.data.n`变成一个传入的参数
```
import './app1.css';
import $ from 'jquery';
//数据相关放到M
const m = {
    data: {
        n: parseInt(localStorage.getItem('n')),
    }
}
//视图相关放到V
const v = {
    //标记视图有没有app1
    html: `
    <div>
        <div class="output">
            <span id="number">{{n}}</span>
        </div>
        <div class="actions">
            <button id="add1">+1</button>
            <button id="minus1">-1</button>
            <button id="mul2">*2</button>
            <button id="divide2">/2</button>
        </div>
    </div>
`,
    render(container,n) {
        $(container).empty();
        $(v.html.replace('{{n}}', m.data.n)).appendTo($(container));
    }
}
// 其他放到C
const c = {
    init(container) {
        v.render(container,m.data.n);//第一次视图等于渲染数据 view = render(data)
        c.bindEvents(container);
    },
    bindEvents(container) {
        $(container).on('click', '#add1', () => {
            console.log(1)
            m.data.n += 1;
            v.render(container,m.data.n);
        })
        $(container).on('click', '#minus1', () => {
            m.data.n -= 1;
            v.render(container,m.data.n);
        })
        $(container).on('click', '#mul2', () => {
            m.data.n *= 2;
            v.render(container,m.data.n);
        })
        $(container).on('click', '#divide2', () => {
            m.data.n /= 2;
            v.render(container,m.data.n);
        })
    }
}

export default c;
```
点击操作很多重复代码，简化：声名一个events对象（其实就是数据结构的哈希表！）和点击函数，不再用到render----只提不重复代码，重复代码一律不抄
```
import './app1.css';
import $ from 'jquery';
//数据相关放到M
const m = {
    data: {
        n: parseInt(localStorage.getItem('n')),
    }
}
//视图相关放到V
const v = {
    //标记视图有没有app1
    html: `
    <div>
        <div class="output">
            <span id="number">{{n}}</span>
        </div>
        <div class="actions">
            <button id="add1">+1</button>
            <button id="minus1">-1</button>
            <button id="mul2">*2</button>
            <button id="divide2">/2</button>
        </div>
    </div>
`,
    render(container, n) {
        $(container).empty();
        $(v.html.replace('{{n}}', m.data.n)).appendTo($(container));
    }
}
// 其他放到C
const c = {
    init(container) {
        v.render(container, m.data.n);//第一次视图等于渲染数据 view = render(data)
        c.autoBindEvents(container);
    },
    events: {
        'click #add1': 'add',
        'click #minus1': 'minus',
        'click mul2': 'mul',
        'click #divide2': 'divide'
    },
    add() {
        m.data.n += 1
    },
    minus() {
        m.data.n -= 1;
    },
    mul() {
        m.data.n *= 2;
    },
    divide() {
        m.data.n /= 2;
    },
    autoBindEvents() {
       for (let key in c.events) {
           console.log(key)
       }
    }
}

export default c;
```
![image.png](https://upload-images.jianshu.io/upload_images/12081122-7181de7a47791a6f.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)
然后操作这个哈希表
![image.png](https://upload-images.jianshu.io/upload_images/12081122-9532b7389c9fcde2.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)
然后拼凑
```
import './app1.css';
import $ from 'jquery';
//数据相关放到M
const m = {
    data: {
        n: parseInt(localStorage.getItem('n')),
    }
}
//视图相关放到V
const v = {
    //标记视图有没有app1
    html: `
    <div>
        <div class="output">
            <span id="number">{{n}}</span>
        </div>
        <div class="actions">
            <button id="add1">+1</button>
            <button id="minus1">-1</button>
            <button id="mul2">*2</button>
            <button id="divide2">/2</button>
        </div>
    </div>
`,
    render(container, n) {
        $(container).empty();
        $(v.html.replace('{{n}}', m.data.n)).appendTo($(container));
    }
}
// 其他放到C
const c = {
    init(container) {
        v.render(container, m.data.n);//第一次视图等于渲染数据 view = render(data)
        c.autoBindEvents(container);
    },
    events: {
        'click #add1': 'add',
        'click #minus1': 'minus',
        'click mul2': 'mul',
        'click #divide2': 'divide'
    },
    add() {
        m.data.n += 1
    },
    minus() {
        m.data.n -= 1;
    },
    mul() {
        m.data.n *= 2;
    },
    divide() {
        m.data.n /= 2;
    },
    autoBindEvents(container) {
        for (let key in c.events) {
            const spaceIndex = key.indexOf(' ')
            const part1 = key.slice(0, spaceIndex);
            const part2 = key.slice(spaceIndex + 1);
            // console.log(c[c.events[key]])
            const value = c[c.events[key]];
            $(container).on(part1, part2, value);
        }
    }
}

export default c;

```
这就是表驱动编程
![image.png](https://upload-images.jianshu.io/upload_images/12081122-7c0b55adfe920a36.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)
![image.png](https://upload-images.jianshu.io/upload_images/12081122-b5fca833441ded6f.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

但是不会更新，只能又再每个函数里render，又回到了最初的重复代码，有什么好办法呢：需求就是，如果n一变就自动更新视图
可以监听n的变化，方法有两种，一种是用Vue，现在先来将另一种：eventBus 对象间通信
![image.png](https://upload-images.jianshu.io/upload_images/12081122-e48da1e991e7a31f.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

![image.png](https://upload-images.jianshu.io/upload_images/12081122-2c6c1e2813d435f5.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)
![image.png](https://upload-images.jianshu.io/upload_images/12081122-b4c66bfca35ff6fd.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)
![image.png](https://upload-images.jianshu.io/upload_images/12081122-7370f5551d76552f.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)
可以监听事件和触发事件，一个地方监听，一个地方触发，形成通信。（巧妙的jQuery运用方式，其实就是原生JS原型链上最顶端的原型对象）
对m的n监听，那就可以给m增加一些增删改查方法
```
import './app1.css';
import $ from 'jquery';


const eventBus = $({});
//数据相关放到M
const m = {
    data: {
        n: parseInt(localStorage.getItem('n')) || 0 //n要给个初始值
    },
    create() {
    },
    delete() {
    },
    update(data) {
        Object.assign(m.data, data);//Object.assign方法：把data的所有属性一个一个复制给m.data
        //然后就触发一个更新函数
        eventBus.trigger('m:update');
        localStorage.setItem('n', m.data.n.toString())//更新的时候顺便存一下localStorage
    },
    get() {
    }
}
//视图相关放到V
const v = {
    html: `
    <div>
        <div class="output">
            <span id="number">{{n}}</span>
        </div>
        <div class="actions">
            <button id="add1">+1</button>
            <button id="minus1">-1</button>
            <button id="mul2">*2</button>
            <button id="divide2">/2</button>
        </div>
    </div>
`,
    render(container, n) {
        $(container).empty();
        $(v.html.replace('{{n}}', m.data.n)).appendTo($(container));
    }
}
// 其他放到C
const c = {
    init(container) {
        v.render(container, m.data.n);
        c.autoBindEvents(container);
        //监听m
        eventBus.on('m:update', () => {
            v.render(container, m.data.n)
        })
    },
    events: {
        'click #add1': 'add',
        'click #minus1': 'minus',
        'click #mul2': 'mul',
        'click #divide2': 'divide'
    },
    add() {
        const newD = {n: m.data.n + 1};
        m.update(newD)
    },
    minus() {
        const newD = {n: m.data.n - 1};
        m.update(newD)
    },
    mul() {
        const newD = {n: m.data.n * 2};
        m.update(newD)
    },
    divide() {
        const newD = {n: m.data.n / 2};
        m.update(newD)
    },
    autoBindEvents(container) {
        for (let key in c.events) {
            const spaceIndex = key.indexOf(' ')
            const part1 = key.slice(0, spaceIndex);
            const part2 = key.slice(spaceIndex + 1);
            // console.log(c[c.events[key]])
            const value = c[c.events[key]];
            $(container).on(part1, part2, value);
        }
    }
}

export default c;


```
把同样的代码格式放到第二、三、四个模块试试

