// Por ahora el formulario solo confirma en pantalla. No guarda ni envía nada.
document.getElementById('apartado').addEventListener('submit', function (e) {
  e.preventDefault();
  document.getElementById('mensaje').textContent = 'Recibido';
});
