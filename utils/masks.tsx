import { cpf } from 'cpf-cnpj-validator'

export const validateEmail = (email: string) => {
  return email
    .toLowerCase()
    .match(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    )
}

export const generoFormatterToNumber = (value: string) => {
  switch (value) {
    case 'Masculino':
      return 1

    case 'Feminino':
      return 2

    case 'Male':
      return 1

    case 'Female':
      return 2

    case '1':
      return 'Masculino'

    case '2':
      return 'Feminino'
    default:
      break
  }
}

export const dateFormatter = (value: string | Date) => {
  const newDate = new Date(value).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric'
  })

  return newDate
}

export const dateFormatterField = (value: string | Date) => {
  const newDate = new Date(value).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  })

  return newDate
}

export const translateOrderStatus = (id: number) => {
  switch (id) {
    case 0:
      return {
        color: 'gray',
        value: 'Registrado'
      }

    case 1:
      return {
        color: 'purple',
        value: 'Aguardando Pagamento'
      }

    case 2:
      return {
        color: 'yellow',
        value: 'Em Análise'
      }

    case 3:
      return {
        color: 'green',
        value: 'Aprovado'
      }

    case 6:
      return {
        color: 'red',
        value: 'Cancelado'
      }
    default:
      break
  }
}

export const cpfMask = (value: string) => {
  return value
    .replace(/\D/g, '') // substitui qualquer caracter que nao seja numero por nada
    .replace(/(\d{3})(\d)/, '$1.$2') // captura 2 grupos de numero o primeiro de 3 e o segundo de 1, apos capturar o primeiro grupo ele adiciona um ponto antes do segundo grupo de numero
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d{1,2})/, '$1-$2')
    .replace(/(-\d{2})\d+?$/, '$1') // captura 2 numeros seguidos de um traço e não deixa ser digitado mais nada
}

export const celularMask = value => {
  return value
    .replace(/\D/g, '') // substitui qualquer caracter que nao seja numero por nada
    .replace(/^(\d{2})(\d)/g, '($1) $2')
    .replace(/(\d)(\d{4})$/, '$1-$2')
}

export const dataMask = value => {
  return value
    .replace(/\D/g, '') // substitui qualquer caracter que nao seja numero por nada
    .replace(/(\d{2})(\d)/, '$1/$2')
    .replace(/(\d{2})(\d)/, '$1/$2')
}

export const cepMask = value => {
  return value.replace(/\D/g, '').replace(/^(\d{5})(\d{3})+?$/, '$1-$2')
}

export const cartaoMask = value => {
  return value
    .replace(/\D/g, '')
    .replace(/(\d{4})(\d)/, '$1 $2')
    .replace(/(\d{4})(\d)/, '$1 $2')
    .replace(/(\d{4})(\d)/, '$1 $2')
    .replace(/( \d{4})\d+?$/, '$1')
}

export const validadeCartaoMask = value => {
  return value.replace(/\D/g, '').replace(/(\d{2})(\d)/, '$1/$2')
}

export const cpfValidator = value => {
  const cpfFormatted = value.replace('-', '').replace('.', '')

  return cpf.isValid(cpfFormatted)
}

export const verifyCardFlag = cardnumber => {
  var cardnumber = cardnumber.replace(/[^0-9]+/g, '')

  var cards = {
    visa: /^4[0-9]{12}(?:[0-9]{3})?$/,
    mastercard:
      /^5[1-5][0-9]{14}$|^2(?:2(?:2[1-9]|[3-9][0-9])|[3-6][0-9][0-9]|7(?:[01][0-9]|20))[0-9]{12}$/,
    amex: /^3[47][0-9]{13}$/,
    diners: /^3(?:0[0-5]|[68][0-9])[0-9]{11}$/,
    discover:
      /^65[4-9][0-9]{13}|64[4-9][0-9]{13}|6011[0-9]{12}|(622(?:12[6-9]|1[3-9][0-9]|[2-8][0-9][0-9]|9[01][0-9]|92[0-5])[0-9]{10})$/
  }

  let flagName = ''

  for (var flag in cards) {
    if (cards[flag].test(cardnumber)) {
      flagName = flag
    }
  }

  switch (flagName) {
    case 'amex':
      return 'https://img.icons8.com/fluency/344/amex.png'

    case 'mastercard':
      return 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a4/Mastercard_2019_logo.svg/1280px-Mastercard_2019_logo.svg.png'

    case 'visa':
      return 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Visa_Inc._logo.svg/1280px-Visa_Inc._logo.svg.png'

    case 'diners':
      return ' https://www.pikpng.com/pngl/m/208-2087430_diners-club-logo-svg-clipart.png'

    case 'discover':
      return 'https://cdn.worldvectorlogo.com/logos/elo-1.svg'

    default:
      return false
  }
}

export const translateFilter = (value: string) => {
  switch (value) {
    case 'newin':
      return 'Lançamentos'

    case 'recommends':
      return 'Recomendados'

    case 'lowest_price':
      return 'Menor Preço'

    case 'biggest_price':
      return 'Maior Preço'

    case 'name':
      return 'Nome'

    case 'best_seller':
      return 'Mais Vendidos'

    default:
      break
  }
}

export const firstLetterUpper = (value: string) => {
  return value.replace(/(?:^|\s)\S/g, function (a) {
    return a.toUpperCase()
  })
}

export const validateBirthDate = (value: string) => {
  const parts = value.split('/').map(item => parseInt(item))

  const nowDate = new Date()

  const year = nowDate.getFullYear()

  if (value.length < 10) {
    return false
  }

  if (parts[2] < 1940) {
    return false
  }

  if (parts[2] >= year - 2) {
    return false
  }

  if (parts[1] > 12 || parts[1] < 1) {
    return false
  }

  if (parts[0] < 1 || parts[0] > 31) {
    return false
  }

  return true
}

export const validateDesconto = (value: string) => {
  const parts = value.split('/').map(item => parseInt(item))

  const nowDate = new Date()

  const year = nowDate.getFullYear()

  if (value.length < 10) {
    return false
  }

  if (parts[2] < 1940) {
    return false
  }

  if (parts[1] > 12 || parts[1] < 1) {
    return false
  }

  if (parts[0] < 1 || parts[0] > 31) {
    return false
  }

  return true
}
