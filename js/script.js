(function () {

    const FPS = 30;
    const TAMX = 300;
    const TAMY = 400;
    const PROB_ARVORE = 2;

    let montanha;
    let skier;
    let gameLoop;

    const arvores = [];

    function init() {
        montanha = new Montanha();
        skier = new Skier();
        gameLoop = setInterval(run, 1000 / FPS);
    }

    window.addEventListener('keydown', (e) => {
        if(e.key === 'ArrowRight'){
            
        }
    })

    class Montanha {
        constructor() {
            this.element = document.getElementById('montanha');
            this.element.style.width = `${TAMX}px`
            this.element.style.height = `${TAMY}px`;
        }
    }

    class Skier {
        constructor() {
            this.element = document.getElementById('skier');
            this.direcoes = ['para-esquerda', 'para-frente', 'para-direita'];
            this.direcao = 1;
            this.element.className = this.direcoes[this.direcao];
            this.element.style.top = '20px';
            this.element.style.left = `${parseInt(TAMX / 2) - 8}px`;
        }
    }

    class Arvore {
        constructor() {
            this.element = document.createElement('div');
            montanha.element.appendChild(this.element);
            this.element.className = 'arvore';
            this.element.style.top = `${TAMY}px`;
            this.element.style.left = `${Math.floor(Math.random() * TAMX)}px`;
        }
    }

    function run() {
        const random = Math.random() * 100;
        if (random <= PROB_ARVORE) {
            const arvore = new Arvore();
            arvores.push(arvore);
        }
        arvores.forEach((a) =>{
            a.element.style.top = `${parseInt(a.element.style.top) - 1}px`;
        })
    }


    init();
})();