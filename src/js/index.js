'use strict'
//import controller from './controller/controller.js'
//import model from './model/model.js'
//import view from './view/view.js'



//model



class imagesLinks {

    constructor(options, headers, pictures) {



        this.pictures = [
            'http://localhost:3000/img/arts/mona-lisa.jpg',
            'http://localhost:3000/img/arts/goya-swing.jpg',
            'http://localhost:3000/img/arts/monet-sunflower.jpg',
            'http://localhost:3000/img/arts/venus-de-milo.jpg'
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

let images = new imagesLinks();
let arr = images.getLinks();
images.clearLinks();






//view

class controlButtonsRender {
    constructor(element) {
        this.element = element;
    }

    render() {
        this.element.insertAdjacentHTML('afterbegin',
            '<h1 class="header--text">Find a pair!</h1>\
      <p class="description--text">Choose difficulty level by clicking button below.</p>\
     <br>\
     <button class="control--button">4x4</button> <button class="control--button">5x5</button> <button class="control--button">6x6</button>'
        );
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
         
         for( let cell of cells){
            let random = Math.floor(0 + Math.random() * (3 + 1 - 0));
            let glink = sessionStorage.getItem(`link-${random}`);
            cell.insertAdjacentHTML('afterbegin',`<img class="image" width="200px" height = "200px" src=${glink}></img>`);
         }
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
            let tablerun = new tableRender(document.querySelector('.game--container')).render(event.target); // запускает рендер таблицы
            


        }

    }
}


let bc = new ButtonController(document.querySelector('.control--container'));



//cell controller, chokes render , running-line controller , running-line-render, score render , score controller 