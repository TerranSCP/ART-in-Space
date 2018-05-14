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
            'http://localhost:3000/img/arts/venus-de-milo.jpg',
            'http://localhost:3000/img/arts/bartolini-dirce.jpg',
            'http://localhost:3000/img/arts/benua-kingswalk.jpg',
            'http://localhost:3000/img/arts/bernini-basiliquestpierre.jpg',
            'http://localhost:3000/img/arts/bradley-expansion.jpg',
            'http://localhost:3000/img/arts/cox-peacock.jpg',
            'http://localhost:3000/img/arts/dali-thepersistanceofmemory.jpg',
            'http://localhost:3000/img/arts/vangoch-starnight.jpg',
            'http://localhost:3000/img/arts/michaelangello-adamscreation.jpg',
            'http://localhost:3000/img/arts/michaelangello-pieta.jpg',
            'http://localhost:3000/img/arts/picasso-firstcommunion.jpg',
            'http://localhost:3000/img/arts/rembrandt-nightwatch.jpg',
            'http://localhost:3000/img/arts/shishkin-oaks.jpg',
            'http://localhost:3000/img/arts/unknown-nika.jpg',
            'http://localhost:3000/img/arts/lol-gingercat.jpg',
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
    constructor(element,backgrounds) {
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
          const random =  this._randomizer(cells);
         
         for( let i = 0; i<cells.length;i++){

            if(cells.length === 25 && i === 12){
                cells[12].style.visibility = 'hidden';    
                continue;
            }
            let glink = sessionStorage.getItem(`link-${random[i]}`);
            cells[i].insertAdjacentHTML('afterbegin',`<img class="image"  src=${glink}></img> <div class = "choke"></div>`);
            
         }

         cells[24].firstElementChild.src = sessionStorage.getItem(`link-${random[12]}`);
        
    }


    _randomizer(cells){
    
        this.cells = cells;

        const arr = [];
        for(let c = 0; c<cells.length/2;c++ ){
           arr.push(c);
           arr.push(c);
        }

        if(cells.length == 25){
            arr.pop();
            arr.pop();
        }

        return arr.sort(()=>{
               return 0.5-Math.random();
        });
        
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



//cell controller,  , running-line controller , running-line-render, score render , score controller 