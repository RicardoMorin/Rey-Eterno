const versiculos = [

{
texto:"Porque de tal manera amó Dios al mundo, que ha dado a su Hijo unigénito, para que todo aquel que en él cree, no se pierda, mas tenga vida eterna.",
referencia:"Juan 3:16"
},

{
texto:"Todo lo puedo en Cristo que me fortalece.",
referencia:"Filipenses 4:13"
},

{
texto:"El Señor es mi pastor; nada me faltará.",
referencia:"Salmo 23:1"
},

{
texto:"Fíate de Jehová de todo tu corazón, y no te apoyes en tu propia prudencia.",
referencia:"Proverbios 3:5"
},

{
texto:"No temas, porque yo estoy contigo; no desmayes, porque yo soy tu Dios que te esfuerzo.",
referencia:"Isaías 41:10"
},

{
texto:"Lámpara es a mis pies tu palabra, y lumbrera a mi camino.",
referencia:"Salmo 119:105"
},

{
texto:"Clama a mí, y yo te responderé, y te enseñaré cosas grandes y ocultas que tú no conoces.",
referencia:"Jeremías 33:3"
},

{
texto:"Buscad primeramente el reino de Dios y su justicia, y todas estas cosas os serán añadidas.",
referencia:"Mateo 6:33"
},

{
texto:"Echando toda vuestra ansiedad sobre él, porque él tiene cuidado de vosotros.",
referencia:"1 Pedro 5:7"
},

{
texto:"Esforzaos todos vosotros los que esperáis en Jehová, y tome aliento vuestro corazón.",
referencia:"Salmo 31:24"
},

{
texto:"Jehová es mi luz y mi salvación; ¿de quién temeré?",
referencia:"Salmo 27:1"
},

{
texto:"Encomienda a Jehová tu camino, y confía en él; y él hará.",
referencia:"Salmo 37:5"
},

{
texto:"Bienaventurados los de limpio corazón, porque ellos verán a Dios.",
referencia:"Mateo 5:8"
},

{
texto:"El gozo de Jehová es vuestra fuerza.",
referencia:"Nehemías 8:10"
},

{
texto:"La paz os dejo, mi paz os doy.",
referencia:"Juan 14:27"
}

];


document.getElementById("shareVerse").addEventListener("click", async () => {

    const texto = document.getElementById("verse-text").textContent;

    const referencia = document.getElementById("verse-reference").textContent;

    const compartir = `${texto}

📖 ${referencia}

https://rey-eterno.com`;

    if (navigator.share) {

        try{

            await navigator.share({

                title:"Versículo del día",

                text:compartir,

                url:"https://rey-eterno.com"

            });

        }catch(e){}

    }else{

        navigator.clipboard.writeText(compartir);

        alert("Versículo copiado al portapapeles.");

    }

});