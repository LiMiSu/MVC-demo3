import './app1.css';
import $ from 'jquery';


const eventBus = $({});
//数据相关放到M
const m = {
    data: {
        n: parseInt(localStorage.getItem('n')) || 0
    },
    create() {
    },
    delete() {
    },
    update(data) {
        Object.assign(m.data, data);
        eventBus.trigger('m:update');
        localStorage.setItem('n', m.data.n.toString())
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
            const value = c[c.events[key]];
            $(container).on(part1, part2, value);
        }
    }
}

export default c;






