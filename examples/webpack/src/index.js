const Modal = require('../../../dist/js/components/modal');

function showModal() {
  const modal = new Modal({
    title: 'Modal title',
    message: 'Modal body text goes here.',
  });

  modal.show();
}

document.querySelector('#createModal').addEventListener('click', showModal);
