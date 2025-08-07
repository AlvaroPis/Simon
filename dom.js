const Colores = ["Rojo","Verde","Amarillo","Azul"];
let Secuencia = [];
let Jugador = [];
let Comenzar = false;
let Nivel = 0;
let Puntuacion = 0;
let Tiempo = 0;
let secuenciaEnProgreso = false;
let tiempoInicio = 0;
let intervaloContador;
let penalizacionPorSegundo = 0.1;
const PUNTOS_POR_NIVEL = 50;



const botonComenzar = document.getElementById("Comenzar");
botonComenzar.addEventListener("click", ComenzarJuego);
const botonReset = document.getElementById("Reset");
botonReset.addEventListener("click",Resetear)
const botonRojo = document.querySelector(".Rojo");
botonRojo.addEventListener("click", manejoDeBotones);
const botonVerde = document.querySelector(".Verde");
botonVerde.addEventListener("click", manejoDeBotones);
const botonAmarillo = document.querySelector(".Amarillo");
botonAmarillo.addEventListener("click", manejoDeBotones);
const botonAzul = document.querySelector(".Azul");
botonAzul.addEventListener("click", manejoDeBotones);
const turnoTexto = document.getElementById("turno-texto");
const botonRanking = document.getElementById("VerRanking");
const popupRanking = document.getElementById("ranking-popup");
const closeBtn = document.querySelector(".close-btn");
const rankingList = document.getElementById("ranking-list");


document.addEventListener('DOMContentLoaded', function() {
    const btnJuego = document.getElementById('btn-juego');
    const btnContacto = document.getElementById('btn-contacto');
    const juegoSection = document.getElementById('juego-section');
    const contactoSection = document.getElementById('contacto-section');
    
    const contactoForm = document.getElementById('contacto-form');
    const nombreInput = document.getElementById('nombre');
    const emailInput = document.getElementById('email');
    const mensajeInput = document.getElementById('mensaje');
    
    btnJuego.addEventListener('click', function() {
        juegoSection.classList.remove('hidden');
        contactoSection.classList.add('hidden');
        btnJuego.classList.add('active');
        btnContacto.classList.remove('active');
    });
    
    btnContacto.addEventListener('click', function() {
        juegoSection.classList.add('hidden');
        contactoSection.classList.remove('hidden');
        btnJuego.classList.remove('active');
        btnContacto.classList.add('active');
    });
    
    nombreInput.addEventListener('input', validarNombre);
    emailInput.addEventListener('input', validarEmail);
    mensajeInput.addEventListener('input', validarMensaje);
    
    contactoForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        if (validarNombre() && validarEmail() && validarMensaje()) {
            const nombre = nombreInput.value;
            const email = emailInput.value;
            const mensaje = mensajeInput.value;
            
            const subject = `Mensaje de ${nombre} desde Simon Game`;
            const mailtoLink = `mailto:alvaropistelli@outlook.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(mensaje + "\n\nEnviado por: " + email)}`;
            window.location.href = mailtoLink;
            
            contactoForm.reset();
            document.getElementById('nombre-error').textContent = '';
            document.getElementById('email-error').textContent = '';
            document.getElementById('mensaje-error').textContent = '';
        }
    });
    
    function validarNombre() {
        const nombre = nombreInput.value.trim();
        const regex = /^[a-zA-Z0-9\s]+$/;
        
        if (!nombre) {
            document.getElementById('nombre-error').textContent = 'El nombre es requerido';
            return false;
        } else if (!regex.test(nombre)) {
            document.getElementById('nombre-error').textContent = 'Solo se permiten caracteres alfanuméricos';
            return false;
        } else {
            document.getElementById('nombre-error').textContent = '';
            return true;
        }
    }
    
    function validarEmail() {
        const email = emailInput.value.trim();
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        
        if (!email) {
            document.getElementById('email-error').textContent = 'El email es requerido';
            return false;
        } else if (!regex.test(email)) {
            document.getElementById('email-error').textContent = 'Ingrese un email válido';
            return false;
        } else {
            document.getElementById('email-error').textContent = '';
            return true;
        }
    }
    
    function validarMensaje() {
        const mensaje = mensajeInput.value.trim();
        
        if (!mensaje) {
            document.getElementById('mensaje-error').textContent = 'El mensaje es requerido';
            return false;
        } else if (mensaje.length < 5) {
            document.getElementById('mensaje-error').textContent = 'El mensaje debe tener al menos 5 caracteres';
            return false;
        } else {
            document.getElementById('mensaje-error').textContent = '';
            return true;
        }
    }

    botonRanking.addEventListener("click", mostrarRanking);
    closeBtn.addEventListener("click", cerrarPopup);
    document.getElementById("sort-by").addEventListener("change", mostrarRanking);
});

function ColorRandom(){
    const randomColor = Math.floor(Math.random() * Colores.length);
    return Colores[randomColor];
}

function ComenzarJuego() {
    if (!Comenzar) {
        Comenzar = true;
        Secuencia = [];
        Jugador = [];
        Nivel = 0;
        Puntuacion = 0;
        tiempoInicio = Date.now();
        iniciarContador();
        nextLevel();
        botonComenzar.disabled = true;
        botonReset.disabled = false;
    }
}


function iniciarContador() {
    clearInterval(intervaloContador); 
    intervaloContador = setInterval(actualizarTiempo, 1000);
}


function actualizarTiempo() {
    const tiempoTranscurrido = Math.floor((Date.now() - tiempoInicio) / 1000);
    document.getElementById("tiempo-titulo").textContent = `| Tiempo: ${tiempoTranscurrido}s`;
}


function nextLevel() {
    Nivel++;
    updateLevelText();
    const nextColor = ColorRandom();
    Secuencia.push(nextColor);
    animarSecuencia();
    Jugador = [];
}

function updateLevelText() {
    const levelText = document.getElementById("nivel");
    const puntosText = document.getElementById("puntuacion-titulo");
    
    levelText.textContent = Nivel;
    puntosText.textContent = `| Puntos: ${Puntuacion}`;
    
    levelText.style.transform = "scale(1.2)";
    levelText.style.color = getColorForLevel();
    setTimeout(() => {
        levelText.style.transform = "scale(1)";
    }, 300);
}

function getColorForLevel() {
    const colors = ["#FF5733", "#33FF57", "#3357FF", "#F3FF33"];
    return colors[(Nivel - 1) % colors.length];
}

function animateButton(color) {
    const button = document.querySelector(`.Boton.${color}`);
    button.classList.add("active-border");
    setTimeout(function() {
      button.classList.remove("active-border");
    }, 1000);
}

function animarSecuencia() {
    turnoTexto.textContent = "Aguarde, aún no es su turno...";
    secuenciaEnProgreso  = true;
    let i = 0;
    const interval = setInterval(function() {
        animateButton(Secuencia[i]);
        i++;
         if (i >= Secuencia.length) {
          clearInterval(interval);
          setTimeout(function() {
            secuenciaEnProgreso = false;
            turnoTexto.textContent = "Ahora es su turno";
          }, 1000);
        }
    }, 3000);
}

function manejoDeBotones(event) {
    if (!secuenciaEnProgreso){
    const color = event.target.classList[1];
    Jugador.push(color);
    animateButton(color);
    chequearSecuencia();
    }
}

function chequearSecuencia() {
    for (let i = 0; i < Jugador.length; i++) {
      if (Jugador[i] !== Secuencia[i]) {
        FinDelJuego();
        return;
      }
    }
  
    if (Jugador.length === Secuencia.length) {
       Puntuacion += PUNTOS_POR_NIVEL;
             setTimeout(function() {
                 nextLevel();
             }, 3000);
    }
}

function FinDelJuego() {
    clearInterval(intervaloContador);
    const tiempoTranscurrido = Math.floor((Date.now() - tiempoInicio) / 1000);
    const penalizacion = Math.floor(tiempoTranscurrido * penalizacionPorSegundo);
    const puntajeFinal = Math.max(0, Puntuacion - penalizacion);
    
    const nombreJugador = prompt("¡Juego terminado!\n\nNivel alcanzado: " + Nivel + 
                               "\nPuntuación final: " + puntajeFinal + 
                               "\n\nIngresa tu nombre para guardar el resultado:");
    
    if (nombreJugador) {
        guardarPartida(nombreJugador, puntajeFinal, Nivel);
    }
    
    Comenzar = false;
    Secuencia = [];
    Jugador = [];
    Nivel = 0;
    Puntuacion = 0;
    
    document.getElementById("nivel").textContent = "0";
    document.getElementById("puntuacion-titulo").textContent = "| Puntos: 0";
    document.getElementById("tiempo-titulo").textContent = "| Tiempo: 0s";
    botonComenzar.disabled = false;
    botonReset.disabled = true;
}

function guardarPartida(nombre, puntaje, nivel) {
    const partidas = JSON.parse(localStorage.getItem("simonPartidas")) || [];
    const nuevaPartida = {
        nombre,
        puntaje,
        nivel,
        fecha: new Date().toLocaleString()
    };
    
    partidas.push(nuevaPartida);
    localStorage.setItem("simonPartidas", JSON.stringify(partidas));
}

function mostrarRanking() {
    const partidas = JSON.parse(localStorage.getItem("simonPartidas")) || [];
    const sortBy = document.getElementById("sort-by").value;
    
    switch(sortBy) {
        case 'puntaje-desc':
            partidas.sort(function(a, b) { return b.puntaje - a.puntaje; });
            break;
        case 'puntaje-asc':
            partidas.sort(function(a, b) { return a.puntaje - b.puntaje; });
            break;
        case 'fecha-desc':
            partidas.sort(function(a, b) { return new Date(b.fecha) - new Date(a.fecha); });
            break;
        case 'fecha-asc':
            partidas.sort(function(a, b) { return new Date(a.fecha) - new Date(b.fecha); });
            break;
         case 'nivel-desc':
            partidas.sort(function(a, b) { return b.nivel - a.nivel; });
            break;
    }
    
    rankingList.innerHTML = `
        <div class="ranking-item-header">
            <span>#</span>
            <span>Jugador</span>
            <span>Puntaje</span>
            <span>Nivel</span>
            <span>Fecha</span>
        </div>
    `;
    
    partidas.forEach(function(partida, index) {
        const item = document.createElement("div");
        item.className = "ranking-item";
        item.innerHTML = `
            <span>${index + 1}</span>
            <span>${partida.nombre}</span>
            <span>${partida.puntaje}</span>
            <span>${partida.nivel}</span>
            <span>${partida.fecha}</span>
        `;
        rankingList.appendChild(item);
    });
    
    popupRanking.classList.remove("hidden");
}

function cerrarPopup() {
    popupRanking.classList.add("hidden");
}

popupRanking.addEventListener("click", function(e) {
    if (e.target === popupRanking) {
        cerrarPopup();
    }
});


function Resetear() {
    clearInterval(intervaloContador);
    Comenzar = false;
    Secuencia = [];
    Jugador = [];
    Nivel = 0;
    Puntuacion = 0;
    
    document.getElementById("nivel").textContent = "0";
    document.getElementById("puntuacion-titulo").textContent = "| Puntos: 0";
    document.getElementById("tiempo-titulo").textContent = "| Tiempo: 0s";
    document.getElementById("turno-texto").textContent = "";
    
    botonComenzar.disabled = false;
    botonReset.disabled = true;
}