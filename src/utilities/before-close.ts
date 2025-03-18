export const messageBeforeClose = () => {
  window.addEventListener('beforeunload', event => {
    event.preventDefault();
    event.returnValue = "Veuillez ne pas quitter cette page avant que l'analyse ne soit terminée.";
  });
};
