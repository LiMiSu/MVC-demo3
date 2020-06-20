import './app3.css';
import $ from 'jquery';

const eventBus = $({});
const localKey = 'active';

//数据相关放到M
const m = {
    data: {
        active: localStorage.getItem(localKey) || 'yes',

    },
    create() {
    },
    delete() {
    },
    update(data) {
        Object.assign(m.data, data);
        eventBus.trigger('m:update');
        // localStorage.setItem(localKey, m.data.active)
    },
    get() {
    }
}
//视图相关放到V
const v = {
    html: (active) => {
        return `
       <div>
        <div class="${active === 'yes' ? 'square active' : 'square'}" ></div>
       </div>
        `
    },
    render(container, active) {
        $(container).empty();
        $(v.html(active)).appendTo($(container));
    }
}
// 其他放到C
const c = {
    init(container) {
        v.render(container, m.data.active);
        c.autoBindEvents(container);
        //监听m
        eventBus.on('m:update', () => {
            v.render(container, m.data.active)
        })
    },
    events: {
        'click .square': 'move',
    },
    move() {
        localStorage.getItem(localKey) === 'yes' ? localStorage.setItem(localKey, 'no') : localStorage.setItem(localKey, 'yes');
        const active = localStorage.getItem(localKey);
        const newD = {active: active}
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
