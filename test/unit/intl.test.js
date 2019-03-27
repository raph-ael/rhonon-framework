import I18n from '../../src/js/hybrid-apps/i18n/index.js'

it('Invalid configuration test', () => {
  // test with empty configuration
  expect(() => {
    new I18n()
  }).toThrow(/There is no translation data/);

  // test with missing fallback locale
  expect(() => {
    new I18n({
      fallbackLocale: null,
      locale: 'es',
    })
  }).toThrow(/The fallback locale is mandatory/)

  // test with missing data for the fallback locale
  expect(() => {
    new I18n({
      fallbackLocale: 'es',
      data: {},
    })
  }).toThrow(/The fallback locale must necessarily have translation data/)
})

it('Working configuration test', () => {
  const intl = new I18n({
    fallbackLocale: 'es',
    locale: 'es',
    data: {
      en: {
        welcome: 'Hola',
      },
      es: {
        welcome: 'Hello',
      }
    }
  })

  intl.setLocale('en')

  expect(intl.getLocale()).toMatch('en')
})

it('Automatic locale fallback test', () => {
  const intl = new I18n({
    fallbackLocale: 'es',
    locale: 'es',
    data: {
      en: {
        welcome: 'Hello',
      },
      es: {
        welcome: 'Hola',
      }
    }
  })

  intl.setLocale('invalid')

  expect(intl.getLocale()).toMatch('es')
})

it('Language collection test', () => {
  const intl = new I18n({
    fallbackLocale: 'es',
    locale: 'es',
    data: {
      en: {
        welcome: 'Hola',
      },
      es: {
        welcome: 'Hello',
      }
    }
  })

  expect(intl.getLanguages()).toContain('en', 'es')
})

it('Translations test', () => {
  const intl = new I18n({
    fallbackLocale: 'es',
    locale: 'es',
    data: {
      en: {
        welcome: 'Hola',
        welcomePerson: 'Hola :name',
      },
      es: {
        welcome: 'Hello',
        welcomePerson: 'Hello :name',
      }
    }
  })

  expect(intl.translate()).toHaveProperty('welcome', 'Hello')
  expect(intl.translate(['undefined'])).toMatchObject({})
  // expect(intl.translate(['undefined', 'welcome'])).toHaveLength(1)
  expect(intl.translate('welcome')).toMatch('Hello')
  expect(intl.translate('undefined')).toBeUndefined()
  expect(intl.translate('welcomePerson', {name: 'Ben'})).toMatch('Hello Ben')
})

/*
it('Html update test', () => {
  const intl = new I18n({
    fallbackLocale: 'es',
    locale: 'es',
    data: {
      en: {
        welcome: 'Hola',
        welcomePerson: 'Hola :name',
      },
      es: {
        welcome: 'Hello',
        welcomePerson: 'Hello :name',
      }
    }
  })

  expect(intl.updateHtml(null)).toBeUndefined()
  expect(intl.updateHtml(document.body)).toBeUndefined()
  expect(intl.updateHtml(document.querySelector('.invalid'))).toBeUndefined()
})
*/
