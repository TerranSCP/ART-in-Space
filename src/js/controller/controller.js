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