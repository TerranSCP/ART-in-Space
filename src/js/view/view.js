//view

class controlButtonsRender {
    constructor(element, backgrounds) {

        this.element = element;
        this.backgrounds = [
            'img/background/space0.jpg',
            'img/background/space1.jpg',
            'img/background/space2.jpg',
            'img/background/space3.jpg',
            'img/background/space4.jpg',
            'img/background/space5.jpg',
            'img/background/space6.jpg',
            'img/background/space7.jpg',
            'img/background/space8.jpg',
            'img/background/space9.jpg',
        ];
    }

    render() {

        const bgLink = this.backgrounds[Math.floor(Math.random() * (9 - 0 + 1)) + 0];
        document.body.style.cssText = `background-image:url(${bgLink})`;


        this.element.insertAdjacentHTML('afterbegin',
            '<h1 class="header--text">Find a pair!</h1>\
      <p class="description--text">Choose difficulty level by clicking button below.</p>\
     <br>\
     <button class="control--button  button__4">4x4</button> <button class="control--button  button__5">5x5</button> <button class="control--button  button__6">6x6</button>'
        );

        this._score();
    }

    _score() {
        let score = new scoreRender()._render();
    }

}


class scoreRender {

    constructor() {

    }

    _render() {
        const control = document.querySelector('.control--container');
        control.insertAdjacentHTML('beforeend', '<div class = "score">Turns count: <span class = "turns">0</span></div>')
    }

}


let buttons = new controlButtonsRender(document.querySelector('.control--container'));
buttons.render();



//запуск вот этого рендера производит контроллер (строит таблицу)

class tableRender {
    constructor(gcontainer) {
        this.gcontainer = gcontainer;
    }

    render(elem) {
        //генерит динамическую таблицу, размеры основаны на парсинге текста нажатой кнопки

        if (document.querySelector('.game--container table')) {
            this.gcontainer.removeChild(document.querySelector('.game--container table'));
        }

        this.elem = elem;
        let count = parseInt(elem.innerHTML);


        let table = document.createElement('table');

        for (let r = count; r > 0; r--) {
            let row = document.createElement('tr');
            for (let c = count; c > 0; c--) {
                let cell = document.createElement('td');
                cell.classList.add('cell');
                row.appendChild(cell);
            }
            table.appendChild(row);
        }

        this.gcontainer.appendChild(table);
        this._imageRender();

    }

    _imageRender() {

        let cells = document.querySelectorAll('.cell');
        const random = this._randomizer(cells);

        for (let i = 0; i < cells.length; i++) {

            if (cells.length === 25 && i === 12) {
                cells[12].style.visibility = 'hidden';
                continue;
            }
            let glink = sessionStorage.getItem(`link-${random[i]}`);
            cells[i].insertAdjacentHTML('afterbegin', `<img class="image"  src=${glink}></img> <div class = "choke"></div>`);

        }

        if (cells.length === 25) {
            cells[24].firstElementChild.src = sessionStorage.getItem(`link-${random[12]}`);
        }


        this._initializeCells();

    }


    _randomizer(cells) {

        this.cells = cells;

        const arr = [];
        for (let c = 0; c < cells.length / 2; c++) {
            arr.push(c);
            arr.push(c);
        }

        if (cells.length == 25) {
            arr.pop();
            arr.pop();
        }

        return arr.sort(() => {
            return 0.5 - Math.random();
        });

    }

    _initializeCells() {
        const init = new cellController()._event();
    }

}

class runningLineRender {
    constructor() {

    }

    _render() {
        const parent = document.body;
        const line = document.createElement('div');
        line.innerHTML = 'SUCCESS';
        line.id = 'running--line';
        line.style.left = '0%'
        parent.appendChild(line);

        const interval = 50;
        let timePassed = 0

        const start = setInterval(() => {

            timePassed += interval;

            if (timePassed > 2299) {
                const stop = clearInterval(start);
                const remove = new runningLineController()._remove(line);
            }

            line.style.left = 2 + parseInt(line.style.left) + "%";

        }, interval);
    }
}