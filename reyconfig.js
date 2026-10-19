/* Configuración de la galería administrable (Supabase).
   Pega aquí tus datos (Project Settings → API). Ver LEEME_ADMIN.md */
window.REY = {
  url: "https://ncdrchwbskplhiojfgdr.supabase.co",
  key: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5jZHJjaHdic2twbGhpb2pmZ2RyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTIzODM5NDEsImV4cCI6MjEwNzk1OTk0MX0.oR4dIJBZFOVt7eYwcy9AImnu69UGXVFFN3zG9eUB2kw"
};
/* Limpia la URL si se copió con /rest/v1/ o con diagonales al final */
window.REY.url = window.REY.url.replace(/\/rest\/v1\/?$/, "").replace(/\/+$/, "");