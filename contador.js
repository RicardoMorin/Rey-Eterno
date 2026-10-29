/* Contador de visitas y clics (GoatCounter). No cambia nada visible en la página.
   1) Pon tu código abajo (ej. "reyeterno").
   2) Pega TODO este contenido al final de reyconfig.js (así no tocas index.html). */
(function(){
  var CODIGO = "rey-eterno";
  if(!CODIGO) return;

  var s = document.createElement("script");
  s.async = true;
  s.src = "https://gc.zgo.at/count.js";
  s.setAttribute("data-goatcounter", "https://" + CODIGO + ".goatcounter.com/count");
  document.head.appendChild(s);

  function evento(nombre){
    try{
      if(window.goatcounter && window.goatcounter.count){
        window.goatcounter.count({path: "clic/" + nombre, title: nombre, event: true});
      }
    }catch(e){}
  }

  document.addEventListener("click", function(e){
    var el = e.target.closest("a, button");
    if(!el) return;
    var href = el.getAttribute("href") || "";
    var id = el.id || "";
    if(el.classList.contains("wa")) return evento("whatsapp-boton-flotante");
    if(href.indexOf("wa.me") > -1) return evento("whatsapp");
    if(href.indexOf("google.com/maps") > -1) return evento("como-llegar");
    if(href.indexOf("facebook.com") > -1) return evento("facebook");
    if(href.indexOf("instagram.com") > -1) return evento("instagram");
    if(href.indexOf("tiktok.com") > -1) return evento("tiktok");
    if(href.indexOf("mailto:") === 0) return evento("correo");
    if(href.indexOf("album.html") > -1) return evento("album-fotos");
    if(el.classList.contains("btn-instalar")) return evento("instalar-app");
    if(el.classList.contains("reel")) return evento("video-reel");
    if(id === "btnCal") return evento("agregar-calendario");
    if(id === "vCompartir") return evento("compartir-versiculo");
    if(id === "vCopiar") return evento("copiar-versiculo");
    if(id === "masFotos") return evento("ver-mas-fotos");
    if(id === "oEnviar") return evento("enviar-peticion-oracion");
  }, true);
})();
