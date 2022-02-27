(function () {

    const FPS = 1200;
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
        if (e.key === 'ArrowLeft') {
            skier.mudarDirecao(-1);
        } else if (e.key === 'ArrowRight') {
            skier.mudarDirecao(+1);
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

        mudarDirecao(giro) {
            if (this.direcao + giro >= 0 && this.direcao + giro <= 2) {
                this.direcao += giro;
                this.element.className = this.direcoes[this.direcao];
            }
        }

        andar() {
            if (this.direcao === 0) {
                this.element.style.left = `${parseInt(this.element.style.left) - 1}px`;
            }
            if (this.direcao === 2) {
                this.element.style.left = `${parseInt(this.element.style.left) + 1}px`;
            }
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
        arvores.forEach((a) => {
            a.element.style.top = `${parseInt(a.element.style.top) - 1}px`;
        })
        skier.andar();
    }


    init();
})();