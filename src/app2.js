import './app2.css';
import $ from 'jquery';


const eventBus = $({});
const localKey = 'app2.index';
//数据相关放到M
const m = {
    data: {
        index: parseInt(localStorage.getItem(localKey)) || 0
    },
    create() {
    },
    delete() {
    },
    update(data) {
        Object.assign(m.data, data);
        eventBus.trigger('m:update');
        localStorage.setItem('index', m.data.index.toString())
    },
    get() {
    }
}
//视图相关放到V
const v = {
    html: (index) => {//可以把html变成函数，就可以传参，可以用data-index做标记
        return `
    <!--tap切换-->
    <div>
        <ol class="tab-bar">
            <li class="${index === 0 ? 'selected' : ''}" data-index="0">1</li>
            <li class="${index === 1 ? 'selected' : ''}" data-index="1">2</li>
        </ol>
        <ol class="tab-content">
            <li class="${index === 0 ? 'active' : ''}">内容1</li>
            <li class="${index === 1 ? 'active' : ''}">内容2</li>
        </ol>
    </div>
`
    },
    render(container, index) {
        $(container).empty();
        $(v.html(index)).appendTo($(container));
    }
}
// 其他放到C
const c = {
    init(container) {
        v.render(container, m.data.index);
        c.autoBindEvents(container);
        eventBus.on('m:update', () => {//点击就更新
            v.render(container, m.data.index)
        })
    },
    events: {
        'click .tab-bar li': 'add',
    },
    add(e) {
        const index = parseInt(e.currentTarget.dataset.index);
        const newD = {index:index};
        m.update(newD);

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
