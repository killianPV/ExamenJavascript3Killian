let jugador1 = [];
let jugador2 = [];
let torn = 1;  // 1 para jugador1, 2 para jugador2

fetch('personajes.json')
    .then(response => response.json())
    .then(data => {
        data = data.sort(() => Math.random() - 0.5);
        jugador1 = data.slice(0, 5);
        jugador2 = data.slice(5, 10);
        renderitzaCartes('jugador1', jugador1);
        renderitzaCartes('jugador2', jugador2);
    })
    .catch(error => console.error('Error al cargar el archivo JSON:', error));

function renderitzaCartes(jugadorId, cartes) {
    const jugadorElement = document.getElementById(jugadorId);
    jugadorElement.innerHTML = `<h2>${jugadorId === 'jugador1' ? 'Jugador 1' : 'Jugador 2'}</h2>`;
    
    cartes.forEach(carta => {
        const cartaElement = document.createElement('div');
        cartaElement.classList.add('carta');
        cartaElement.innerHTML = `
            <h3>${carta.nom}</h3>
            <img src="${carta.imatge}" alt="${carta.nom}" class="imatge-carta"/>
            <div class="atributs">
                <p><strong>Atac:</strong> ${carta.atac}</p>
                <p><strong>Defensa:</strong> ${carta.defensa}</p>
                <p><strong>Velocitat:</strong> ${carta.velocitat}</p>
                <p><strong>Salut:</strong> ${carta.salut}</p>
            </div>
        `;
        cartaElement.onclick = () => seleccionaCarta(jugadorId, carta);
        jugadorElement.appendChild(cartaElement);
    });
}

function seleccionaCarta(jugadorId, carta) {
    const jugadorElement = document.getElementById(jugadorId);
    const cartes = jugadorElement.getElementsByClassName('carta');
    
    // Remover la clase 'seleccionada' de todas las cartas
    Array.from(cartes).forEach(cartaElement => {
        cartaElement.classList.remove('seleccionada');
    });
    
    // Encontrar la carta seleccionada y agregar la clase 'seleccionada'
    const cartaSeleccionada = Array.from(cartes).find(cartaElement => {
        return cartaElement.getElementsByTagName('h3')[0].innerText === carta.nom;
    });

    if (cartaSeleccionada) {
        cartaSeleccionada.classList.add('seleccionada');
    }
}

function iniciaCombat() {
    const interval = setInterval(() => {
        const cartaJugador1 = getCartaSeleccionada('jugador1');
        const cartaJugador2 = getCartaSeleccionada('jugador2');
        
        if (cartaJugador1 && cartaJugador2) {
            // Compara las velocidades y determina el orden de ataque
            if (cartaJugador1.velocitat > cartaJugador2.velocitat) {
                combat(cartaJugador1, cartaJugador2);
            } else {
                combat(cartaJugador2, cartaJugador1);
            }
            
            determinaGanador(); // Comprueba el ganador después de cada turno
        } else {
            clearInterval(interval);
            alert('La batalla ha finalizado. Volved a seleccionar una carta cada jugador.');
        }
    }, 2000); // Intervalo de 2 segundos (puedes ajustar según tu preferencia)
}

function getCartaSeleccionada(jugadorId) {
    const cartaSeleccionada = document.getElementById(jugadorId).getElementsByClassName('seleccionada')[0];
    if (cartaSeleccionada) {
        const nomCarta = cartaSeleccionada.getElementsByTagName('h3')[0].innerText;
        return jugadorId === 'jugador1' ? jugador1.find(carta => carta.nom === nomCarta) : jugador2.find(carta => carta.nom === nomCarta);
    }
    return null;
}

function determinaGanador() {
    const jugadoresSinSalud = {
        jugador1: jugador1.every(carta => carta.salut <= 0),
        jugador2: jugador2.every(carta => carta.salut <= 0)
    };

   if (jugadoresSinSalud.jugador1) {
        // Jugador 1 se queda sin salud, Jugador 2 gana.
        alert("¡El Jugador 2 es el ganador!");
        reiniciaJoc(); // Reinicia el juego cuando hay un ganador
    } else if (jugadoresSinSalud.jugador2) {
        // Jugador 2 se queda sin salud, Jugador 1 gana.
        alert("¡El Jugador 1 es el ganador!");
        reiniciaJoc(); // Reinicia el juego cuando hay un ganador
    }
    // No es necesario agregar una alerta para el empate si no quieres.
}


function combat(carta1, carta2) {
    const atacant = torn === 1 ? carta1 : carta2;
    const defensor = torn === 1 ? carta2 : carta1;

    const diferenciaAtacDefensa = atacant.atac - defensor.defensa;
    const puntsAtac = diferenciaAtacDefensa > 0 ? diferenciaAtacDefensa : 10;

    defensor.salut -= puntsAtac;

    alert(`${atacant.nom} ataca a ${defensor.nom} y le hace ${puntsAtac} de daño.`);

    if (defensor.salut <= 0) {
        alert(`${defensor.nom} ha quedado sin salud. ${atacant.nom} gana!`);
        reiniciaJoc();
    } else {
        alert(`${defensor.nom} tiene ${defensor.salut} puntos de salud restantes.`);
        torn = torn === 1 ? 2 : 1;
    }
}

function reiniciaJoc() {
    torn = 1;
    jugador1 = [];
    jugador2 = [];
    document.getElementById('jugador1').innerHTML = '';
    document.getElementById('jugador2').innerHTML = '';
    fetch('personajes.json')
        .then(response => response.json())
        .then(data => {
            data = data.sort(() => Math.random() - 0.5);
            jugador1 = data.slice(0, 5);
            jugador2 = data.slice(5, 10);
            renderitzaCartes('jugador1', jugador1);
            renderitzaCartes('jugador2', jugador2);
        })
        .catch(error => console.error('Error al cargar el archivo JSON:', error));
}

