//model



 class imagesLinks {

    constructor(options, headers, pictures,path) {


        this.path = 'https://terranscp.github.io/ART-in-Space';



        this.pictures = [
            `${this.path}/src/img/arts/mona-lisa.jpg`,
            `${this.path}/src/img/arts/goya-swing.jpg`,
            `${this.path}/src/img/arts/monet-sunflower.jpg`,
            `${this.path}/src/img/arts/venus-de-milo.jpg`,
            `${this.path}/src/img/arts/bartolini-dirce.jpg`,
            `${this.path}/src/img/arts/benua-kingswalk.jpg`,
            `${this.path}/src/img/arts/bernini-basiliquestpierre.jpg`,
            `${this.path}/src/img/arts/bradley-expansion.jpg`,
            `${this.path}/src/img/arts/cox-peacock.jpg`,
            `${this.path}/src/img/arts/dali-thepersistanceofmemory.jpg`,
            `${this.path}/src/img/arts/vangoch-starnight.jpg`,
            `${this.path}/src/img/arts/michaelangello-adamscreation.jpg`,
            `${this.path}/src/img/arts/michaelangello-pieta.jpg`,
            `${this.path}/src/img/arts/picasso-firstcommunion.jpg`,
            `${this.path}/src/img/arts/rembrandt-nightwatch.jpg`,
            `${this.path}/src/img/arts/shishkin-oaks.jpg`,
            `${this.path}/src/img/arts/unknown-nika.jpg`,
            `${this.path}/src/img/arts/lol-gingercat.jpg`,
        ];

        this.headers = new Headers();
        this.options = {

            method: 'GET',
            headers: this.headers,
            mode: 'cors',
            cache: 'default'
        }
    }

    getLinks() {

        Promise.all(this.pictures.map(picture => fetch(picture, this.options)))
            .then(async res => {
                let i = 0
                for (let r of res) {
                    await sessionStorage.setItem(`link-${i}`, r.url);
                    i++;
                }
            })
            .catch(error => {
                new Error('Network error, please try later');
            });

    }
    clearLinks() {
        sessionStorage.clear();
    }

}

let images = new imagesLinks().getLinks();

//view


 class controlButtonsRender {
    constructor(element, backgrounds) {

        this.element = element;
        this.backgrounds = [
            'src/img/background/space0.jpg',
            'src/img/background/space1.jpg',
            'src/img/background/space2.jpg',
            'src/img/background/space3.jpg',
            'src/img/background/space4.jpg',
            'src/img/background/space5.jpg',
            'src/img/background/space6.jpg',
            'src/img/background/space7.jpg',
            'src/img/background/space8.jpg',
            'src/img/background/space9.jpg',
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
//controller


 class ButtonController {
    constructor(elem, click) {
        this.elem = elem;
        this.click = this.click.bind(this);
        elem.addEventListener('click', this.click);
    }

    click(event) {
        this.click = event;
        if (event.target.tagName == "BUTTON") {
            let tablerun = new tableRender(document.querySelector('.game--container')).render(event.target); 

        }

    }
}


let bc = new ButtonController(document.querySelector('.control--container'));


 class cellController {

    constructor() {

    }

    _event() {

        let counter = 0
        const table = document.querySelector('table');

        table.addEventListener('click', (event) => {





            if (event.target.tagName === 'DIV') {

                counter++;
                document.querySelector('.turns').innerHTML = counter;

                event.target.parentElement.classList.add('open');

                setTimeout(() => {
                    event.target.style.display = "none";
                }, 500);

                let opened = document.querySelectorAll('.open');

                if (opened.length > 1 && opened[0].firstElementChild.src !== opened[1].firstElementChild.src) {

                    setTimeout(() => {

                        for (let i = 0; i < opened.length; i++) {

                            try {
                                opened[i].classList.remove('open');
                                opened[i].lastChild.style.display = "block";
                            }
                            catch (e) {

                            }
                        }

                    }, 550)

                }

                if (opened.length > 1 && opened[0].firstElementChild.src === opened[1].firstElementChild.src) {

                    setTimeout(() => {

                        for (let i = 0; i < opened.length; i++) {
                            opened[i].firstElementChild.classList.add('opened');

                        }

                    }, 550);


                    setTimeout(() => {

                        for (let i = 0; i < opened.length; i++) {
                            opened[i].classList.remove('open');
                            opened[i].removeChild(opened[i].lastElementChild);
                            opened[i].removeChild(opened[i].firstElementChild);
                            opened[i].style.visibility = 'hidden';
                        }

                        this._destructor(table);

                    }, 850);



                }

            }

        });


    }

    _destructor(table) {

        this.table = table;

        if (document.querySelectorAll('.image').length == 0) {
            table.remove();
            const rl = new runningLineController().start();
        }

    }


}

 class runningLineController {

    constructor() {

    }

    start() {
        const start = new runningLineRender()._render();
    }

    _remove(line) {
        this.line = line;
        line.remove();
    }

}