/* Versículos del día de Rey Eterno.
   Para agregar o cambiar versículos, edita SOLO esta lista: la usan la página principal y la mini-app "Versículo del día".
   Cada línea es ["texto","Libro capítulo:versículo"]. Cambia de versículo cada día (hora de Monterrey). */
var VERS=[
  ["Jehová es mi pastor; nada me faltará.","Salmo 23:1"],
  ["Todo lo puedo en Cristo que me fortalece.","Filipenses 4:13"],
  ["Porque de tal manera amó Dios al mundo, que ha dado a su Hijo unigénito, para que todo aquel que en él cree, no se pierda, mas tenga vida eterna.","Juan 3:16"],
  ["Fíate de Jehová de todo tu corazón, y no te apoyes en tu propia prudencia.","Proverbios 3:5"],
  ["Bástate mi gracia; porque mi poder se perfecciona en la debilidad.","2 Corintios 12:9"],
  ["Mira que te mando que te esfuerces y seas valiente; no temas ni desmayes, porque Jehová tu Dios estará contigo dondequiera que vayas.","Josué 1:9"],
  ["Venid a mí todos los que estáis trabajados y cargados, y yo os haré descansar.","Mateo 11:28"],
  ["Los que esperan a Jehová tendrán nuevas fuerzas; levantarán alas como las águilas.","Isaías 40:31"],
  ["Jehová es mi luz y mi salvación; ¿de quién temeré?","Salmo 27:1"],
  ["Echando toda vuestra ansiedad sobre él, porque él tiene cuidado de vosotros.","1 Pedro 5:7"],
  ["Y la paz de Dios, que sobrepasa todo entendimiento, guardará vuestros corazones y vuestros pensamientos en Cristo Jesús.","Filipenses 4:7"],
  ["Bueno es Jehová a los que en él esperan, al alma que le busca.","Lamentaciones 3:25"],
  ["Porque yo sé los pensamientos que tengo acerca de vosotros, dice Jehová, pensamientos de paz, y no de mal, para daros el fin que esperáis.","Jeremías 29:11"],
  ["Clama a mí, y yo te responderé, y te enseñaré cosas grandes y ocultas que tú no conoces.","Jeremías 33:3"]
];

function hoyMty(){return new Date(new Date().toLocaleString("en-US",{timeZone:"America/Monterrey"}))}
function numeroDia(d){return Math.floor((d-new Date(d.getFullYear(),0,0))/864e5)}
