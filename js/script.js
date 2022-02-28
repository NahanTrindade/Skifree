(function () {

    const FPS = 50;
    const TAMX = 300;
    const TAMY = 400;
    const PROB_ARVORE = 5;

    let montanha;
    let skier;
    let painel;
    let gameLoop;
    let velocidade = 2;

    const arvores = [];

    function init() {
        montanha = new Montanha();
        skier = new Skier();
        painel = new Painel();

        gameLoop = setInterval(run, 1000 / FPS);
        setInterval(() => {
            painel.atualizaMetros(velocidade)
        }, 1000);
    }

    window.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft') {
            skier.mudarDirecao(-1);

        } else if (e.key === 'ArrowRight') {
            skier.mudarDirecao(+1);
        }
    });

    window.addEventListener('keydown', (e) => {
        if (e.key === 'f' && velocidade === 2) {
            ++velocidade;
        } else if (e.key === 'f' && velocidade === 3) {
            --velocidade;
        }
    });

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
            this.vidas = 3;
        }

        mudarDirecao(giro) {
            if (this.direcao + giro >= 0 && this.direcao + giro <= 2) {
                this.direcao += giro;
                this.element.className = this.direcoes[this.direcao];
            }
        }

        andar() {
            if (this.direcao === 0) {
                this.element.style.left = `${parseInt(this.element.style.left) - velocidade}px`;
            }
            if (this.direcao === 2) {
                this.element.style.left = `${parseInt(this.element.style.left) + velocidade}px`;
            }
        }

        controleLaterais() {
            if(parseInt(skier.element.style.left) <= 0 && this.direcao == 0){
                this.direcao = 1;
                this.element.className = this.direcoes[this.direcao];
            }
            if(parseInt(skier.element.style.left) >= 285 && this.direcao == 2){
                this.direcao = 1;
                this.element.className = this.direcoes[this.direcao];
            }
        }
    }

    class Painel {
        constructor() {
            this.element = document.getElementById('painel');
            this.marcador_vidas = document.getElementById('vidas');
            this.marcador_metros = document.getElementById('metros');
            this.vida = 3;
            this.metros = 0;

            this.marcador_vidas.innerHTML = `Vidas: ${this.vida}`
            this.marcador_metros.innerHTML = `Metros: ${this.metros}`
        }

        tirarVida() {
            this.vidas.innerHTML = `Vidas: ${this.vida}`
        }

        atualizaMetros(velocidade) {
            this.metros += velocidade * 10;
            this.marcador_metros.innerHTML = `Metros: ${this.metros}`
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
            a.element.style.top = `${parseInt(a.element.style.top) - velocidade}px`;
        })
        skier.controleLaterais();
        skier.andar();
    }


    init();
})();