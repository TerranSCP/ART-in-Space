//model



class imagesLinks {

    constructor(options, headers, pictures,path) {


        this.path = 'http://localhost:3000/';



        this.pictures = [
            `${this.path}img/arts/mona-lisa.jpg`,
            `${this.path}img/arts/goya-swing.jpg`,
            `${this.path}img/arts/monet-sunflower.jpg`,
            `${this.path}img/arts/venus-de-milo.jpg`,
            `${this.path}img/arts/bartolini-dirce.jpg`,
            `${this.path}img/arts/benua-kingswalk.jpg`,
            `${this.path}img/arts/bernini-basiliquestpierre.jpg`,
            `${this.path}img/arts/bradley-expansion.jpg`,
            `${this.path}img/arts/cox-peacock.jpg`,
            `${this.path}img/arts/dali-thepersistanceofmemory.jpg`,
            `${this.path}img/arts/vangoch-starnight.jpg`,
            `${this.path}img/arts/michaelangello-adamscreation.jpg`,
            `${this.path}img/arts/michaelangello-pieta.jpg`,
            `${this.path}img/arts/picasso-firstcommunion.jpg`,
            `${this.path}img/arts/rembrandt-nightwatch.jpg`,
            `${this.path}img/arts/shishkin-oaks.jpg`,
            `${this.path}img/arts/unknown-nika.jpg`,
            `${this.path}img/arts/lol-gingercat.jpg`,
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
