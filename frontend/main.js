function codeInjection() {
  var name = getRequestParameter('name');
  var message = 'Hola, ' + name + '! Bienvenido a nuestro sitio web.';
  document.write('<h1>' + message + '</h1>');
}

codeInjection();
