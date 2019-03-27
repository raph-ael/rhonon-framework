/*
 * Internationalisation setup
 */
const i18n = phonon.i18n({
  fallbackLocale: 'en',
  locale: 'en',
  bind: true,
  data: {
    en: {
      welcome: 'Welcome',
      order: 'Order',
      back: 'Back',
      backOk: 'Now you can leave!',
      orderModalMessage: 'Please cancel or confirm your order before leaving this page.',
    },
    en_US: {
      welcome: 'Welcome',
      order: 'Order',
      back: 'Back',
      backOk: 'Now you can leave!',
      orderModalMessage: 'Please cancel or confirm your order before leaving this page.',
    },
    fr: {
      welcome: 'Bienvenue',
      order: 'Commande',
      back: 'Retour',
      backOk: 'Maintenant vous pouvez partir !',
      orderModalMessage: 'Veuillez annuler ou confirmer votre commande avant de quitter la page.',
    },
  },
});

/*
 * Pager setup
 */
const pager = phonon.pager({
  hashPrefix: '#!',
  useHash: true,
  defaultPage: 'home',
  animatePages: true,
});

/*
 * With the second page called Order,
 * we will use events to control the behavior of the page
 * The user must click on cancel or buy to quit the order page
 */
let userCanQuit = false;

function setPizza(pizza) {
  document.querySelector('.order').innerHTML = pizza;
}

function canQuit() {
  userCanQuit = true;
  document.querySelector('.back-ok').style.display = 'block';
}

const orderPage = pager.getPage('order');

orderPage.setRoute('/order/{pizza}');
orderPage.addEvents({
  show: (params) => {
    // reset
    userCanQuit = false;
    document.querySelector('.back-ok').style.display = 'none';
    setPizza(params.pizza);
  },
  hash: (params) => {
    setPizza(params.pizza);
  },
});

orderPage.preventTransition(() => {
  if (!userCanQuit) {
    phonon.modal({
      title: i18n.translate('order'),
      message: i18n.translate('orderModalMessage'),
      cancelable: false,
      buttons: [
        { event: 'cancel', text: 'Cancel', dismiss: true, class: 'btn btn-secondary' },
        { event: 'confirm', text: 'Confirm', dismiss: true, class: 'btn btn-primary' },
      ],
      onCancel: () => {
        userCanQuit = true;
        canQuit();
      },
      onConfirm: () => {
        canQuit();
      },
    }).show();
  }

  return !userCanQuit;
});

pager.start();
