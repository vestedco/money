import { Money, CurrencyMismatchError } from '../lib'
import Big from 'big.js'

describe('Money.constructor', () => {
  it('casts units to a Big', () => {
    const money = new Money(200, 'USD')
    expect(money.units).toBeInstanceOf(Big)
    expect(money.units.eq('200')).toBe(true)
    expect(money.cents.eq('20000')).toBe(true)
  })

  it('defaults to USD as the currency', () => {
    const money = new Money(100)

    expect(money.currency).toBe('USD')
  })

  it('strips commas', () => {
    const money = new Money('1,000,000')

    expect(money.units).toEqual(new Big('1000000'))
  })

  it('throws if given invalid units', () => {
    expect(() => {
      // eslint-disable-next-line no-new
      new Money('WRONG')
    }).toThrow()
  })
})

describe('Money.fromCents', () => {
  it('casts cents to a Big', () => {
    const money = Money.fromCents(200, 'USD')
    expect(money.cents).toBeInstanceOf(Big)
  })

  it('defaults to USD as the currency', () => {
    const money = Money.fromCents(100)

    expect(money.currency).toBe('USD')
  })

  it('throws if given invalid cents', () => {
    expect(() => {
      // eslint-disable-next-line no-new
      Money.fromCents('WRONG')
    }).toThrow()
  })
})

describe('Money.fromAmount()', () => {
  it('converts whole dollars to cents', () => {
    const money = Money.fromAmount(200, 'USD')
    expect(money.cents.toString()).toBe('20000')
  })

  it('removes any commas from the dollars', () => {
    const money = Money.fromAmount('400,000', 'USD')
    expect(money.cents.toString()).toBe('40000000')
  })

  it('defaults to USD as the currency', () => {
    const money = Money.fromAmount(100)

    expect(money.currency).toBe('USD')
  })

  it('throws if given invalid dollars', () => {
    expect(() => {
      // eslint-disable-next-line no-new
      Money.fromAmount('WRONG')
    }).toThrow()
  })
})

describe('Money.fromJSON()', () => {
  it('creates a Money object from a MoneyJSON object', () => {
    const json = {
      cents: 2000,
      currency: 'EUR'
    }

    const money = Money.fromJSON(json)

    expect(money.cents.toString()).toEqual('2000')
    expect(money.currency.toString()).toEqual('EUR')
  })

  it('accepts a MoneyJSON object with units', () => {
    const json = {
      units: '20',
      cents: '2000',
      currency: 'EUR'
    }

    const money = Money.fromJSON(json)

    expect(money.cents.toString()).toEqual('2000')
    expect(money.currency.toString()).toEqual('EUR')
  })

  it('throws if the JSON does not provide cents', () => {
    const json = {
      cents: 'nope',
      currency: 'EUR'
    }

    expect(() => {
      Money.fromJSON(json)
    }).toThrow()
  })
})

describe('Money.zero()', () => {
  it('creates a Money object with zero as the amount', () => {
    const money = Money.zero('EUR')

    expect(money.cents.toString()).toEqual('0')
  })

  it('defaults to USD as the currency', () => {
    const money = Money.zero()

    expect(money.cents.toString()).toEqual('0')
    expect(money.currency).toEqual('USD')
  })
})

describe('Money.prototype.toString()', () => {
  it('returns a string representation of the Money object', () => {
    const money = Money.fromAmount('12.34', 'EUR')

    expect(money.toString()).toEqual('12.34 EUR')
  })
})

describe('Money.prototype.toJSON()', () => {
  it('returns a JSON represneation of the money object', () => {
    const money = Money.fromAmount('20', 'EUR')
    expect(money.toJSON()).toEqual({
      units: '20.00',
      cents: '2000',
      currency: 'EUR'
    })
  })
})

describe('Money.prototype.toFixed()', () => {
  it('returns a string of the units to a given 2 decimal places by default', () => {
    const money = Money.fromCents('12345', 'EUR')
    expect(money.toFixed()).toEqual('123.45')
  })

  it('gives a string to any specified decimal places', () => {
    const money = Money.fromCents('12345', 'EUR')
    expect(money.toFixed(3)).toEqual('123.450')
  })
})

describe('Money.prototype.roundToUnit()', () => {
  it('rounds to the nearest unit', () => {
    const money = Money.fromAmount('19.99', 'USD')
    const rounded = money.roundToUnit()

    expect(rounded.units.toString()).toEqual('20')
  })

  it('allows rounding down', () => {
    const money = Money.fromAmount('19.99', 'USD')
    const rounded = money.roundToUnit('down')

    expect(rounded.units.toString()).toEqual('19')
  })

  it('allows rounding half-up', () => {
    const money = Money.fromAmount('18.50', 'USD')
    const rounded = money.roundToUnit('half-up')

    expect(rounded.units.toString()).toEqual('19')
  })

  it('allows rounding half-even', () => {
    const money = Money.fromAmount('18.50', 'USD')
    const rounded = money.roundToUnit('half-even')

    expect(rounded.units.toString()).toEqual('18')
  })

  it('allows rounding up', () => {
    const money = Money.fromAmount('19.01', 'USD')
    const rounded = money.roundToUnit('up')

    expect(rounded.units.toString()).toEqual('20')
  })
})

describe('Money.prototype.roundToCent()', () => {
  it('rounds to the nearest unit', () => {
    const money = Money.fromAmount('0.999', 'USD')
    const rounded = money.roundToCent()

    expect(rounded.cents.toString()).toEqual('100')
  })

  it('allows rounding down', () => {
    const money = Money.fromAmount('0.999', 'USD')
    const rounded = money.roundToCent('down')

    expect(rounded.cents.toString()).toEqual('99')
  })

  it('allows rounding half-up', () => {
    const money = Money.fromAmount('0.985', 'USD')
    const rounded = money.roundToCent('half-up')

    expect(rounded.cents.toString()).toEqual('99')
  })

  it('allows rounding half-even', () => {
    const money = Money.fromAmount('0.985', 'USD')
    const rounded = money.roundToCent('half-even')

    expect(rounded.cents.toString()).toEqual('98')
  })

  it('allows rounding up', () => {
    const money = Money.fromAmount('0.991', 'USD')
    const rounded = money.roundToCent('up')

    expect(rounded.cents.toString()).toEqual('100')
  })
})

describe('Money.prototype.plus', () => {
  it('adds two Money objects', () => {
    const money = Money.fromCents('200', 'USD')
    const other = Money.fromCents('300', 'USD')

    expect(money.plus(other)).toEqual(Money.fromCents(500, 'USD'))
  })

  it('throws if adding a different currency', () => {
    const money = Money.fromCents('1234', 'USD')
    const other = Money.fromCents('1234', 'EUR')

    expect(() => {
      money.plus(other)
    }).toThrow(CurrencyMismatchError)
  })
})

describe('Money.prototype.minus', () => {
  it('subtracts two Money objects', () => {
    const money = Money.fromCents('1234', 'USD')
    const other = Money.fromCents('1230', 'USD')

    expect(money.minus(other)).toEqual(Money.fromCents(4, 'USD'))
  })

  it('throws if subtracting a different currency', () => {
    const money = Money.fromCents('1234', 'USD')
    const other = Money.fromCents('1234', 'EUR')

    expect(() => {
      money.minus(other)
    }).toThrow(CurrencyMismatchError)
  })
})

describe('Money.prototype.times', () => {
  it('multiplies two Money objects', () => {
    const money = Money.fromCents('400', 'USD')
    const other = Money.fromCents('200', 'USD')

    expect(money.times(other)).toEqual(Money.fromCents('800', 'USD'))
  })

  it('multiplies the current unit by the other number', () => {
    const money = Money.fromCents('300', 'USD')

    expect(money.times('2')).toEqual(Money.fromCents(600, 'USD'))
  })

  it('throws if multiplying a different currency', () => {
    const money = Money.fromCents('1234', 'USD')
    const other = Money.fromCents('1234', 'EUR')

    expect(() => {
      money.times(other)
    }).toThrow(CurrencyMismatchError)
  })
})

describe('Money.prototype.div', () => {
  it('divides two Money objects', () => {
    const money = Money.fromCents('300', 'USD')
    const other = Money.fromCents('200', 'USD')

    expect(money.div(other)).toEqual(Money.fromCents('150', 'USD'))
  })

  it('divides the current unit by the other number', () => {
    const money = Money.fromCents('300', 'USD')

    expect(money.div('2')).toEqual(Money.fromCents(150, 'USD'))
  })

  it('throws if dividing a different currency', () => {
    const money = Money.fromCents('1234', 'USD')
    const other = Money.fromCents('1234', 'EUR')

    expect(() => {
      money.div(other)
    }).toThrow(CurrencyMismatchError)
  })
})

describe('Money.prototype.eq', () => {
  it('returns true if the two Money objects are the same', () => {
    const money = Money.fromAmount('2.00', 'USD')
    const other = Money.fromCents('200', 'USD')

    expect(money.eq(other)).toBe(true)
  })

  it('returns true if the Money units are the same as the passed Big', () => {
    const money = Money.fromAmount('2.00', 'USD')
    const other = new Big(2)

    expect(money.eq(other)).toBe(true)
  })

  it('returns true if the Money units are the same as the passed string', () => {
    const money = Money.fromAmount('2.00', 'USD')

    expect(money.eq('2')).toBe(true)
  })

  it('returns true if the Money units are the same as the passed number', () => {
    const money = Money.fromAmount('2.00', 'USD')

    expect(money.eq(2)).toBe(true)
  })

  it('returns false if this currency is not the same as the passed currency', () => {
    const money = Money.fromAmount('2.00', 'USD')
    const other = Money.fromCents('200', 'EUR')

    expect(money.eq(other)).toBe(false)
  })

  it('returns false if the two Money objects are not the same', () => {
    const money = Money.fromAmount('2.00', 'USD')
    const other = Money.fromCents('201', 'USD')

    expect(money.eq(other)).toBe(false)
  })

  it('returns false if the Money units are not the same as the passed Big', () => {
    const money = Money.fromAmount('2.00', 'USD')
    const other = new Big(2.01)

    expect(money.eq(other)).toBe(false)
  })

  it('returns false if the Money units are not the same as the passed string', () => {
    const money = Money.fromAmount('2.00', 'USD')

    expect(money.eq('2.01')).toBe(false)
  })

  it('returns false if the Money units are not the same as the passed number', () => {
    const money = Money.fromAmount('2.00', 'USD')

    expect(money.eq(2.01)).toBe(false)
  })
})

describe('Money.prototype.lt', () => {
  it('returns true if this Money object is less than the passed Money object', () => {
    const money = Money.fromAmount('2.00', 'USD')
    const other = Money.fromCents('201', 'USD')

    expect(money.lt(other)).toBe(true)
  })

  it('returns true if the Money units are less than the passed Big', () => {
    const money = Money.fromAmount('2.00', 'USD')
    const other = new Big(2.01)

    expect(money.lt(other)).toBe(true)
  })

  it('returns true if the Money units are less than the passed string', () => {
    const money = Money.fromAmount('2.00', 'USD')

    expect(money.lt('2.01')).toBe(true)
  })

  it('returns true if the Money units are less than the passed number', () => {
    const money = Money.fromAmount('2.00', 'USD')

    expect(money.lt(2.01)).toBe(true)
  })

  it('returns false if this Money object is not less than the passed Money object', () => {
    const money = Money.fromAmount('2.00', 'USD')
    const other = Money.fromCents('200', 'USD')

    expect(money.lt(other)).toBe(false)
  })

  it('returns false if the Money units are not less than the passed Big', () => {
    const money = Money.fromAmount('2.00', 'USD')
    const other = new Big(1.99)

    expect(money.lt(other)).toBe(false)
  })

  it('returns false if the Money units are not less than the passed string', () => {
    const money = Money.fromAmount('2.00', 'USD')

    expect(money.lt('1')).toBe(false)
  })

  it('returns false if the Money units are not less than the passed number', () => {
    const money = Money.fromAmount('2.00', 'USD')

    expect(money.lt(2)).toBe(false)
  })

  it('throws a CurrencyMismatchError if given a Money object of another currency', () => {
    const money = Money.fromAmount('2.00', 'USD')
    const other = Money.fromCents('201', 'EUR')

    expect(() => {
      money.lt(other)
    }).toThrow(CurrencyMismatchError)
  })
})

describe('Money.prototype.gt', () => {
  it('returns true if this Money object is greater than the passed Money object', () => {
    const money = Money.fromAmount('2.00', 'USD')
    const other = Money.fromCents('199', 'USD')

    expect(money.gt(other)).toBe(true)
  })

  it('returns true if the Money units are greater than the passed Big', () => {
    const money = Money.fromAmount('2.00', 'USD')
    const other = new Big(1.99)

    expect(money.gt(other)).toBe(true)
  })

  it('returns true if the Money units are greater than the passed string', () => {
    const money = Money.fromAmount('2.00', 'USD')

    expect(money.gt('1.99')).toBe(true)
  })

  it('returns true if the Money units are greater than the passed number', () => {
    const money = Money.fromAmount('2.00', 'USD')

    expect(money.gt(1.99)).toBe(true)
  })

  it('returns false if this Money object is not greater than the passed Money object', () => {
    const money = Money.fromAmount('2.00', 'USD')
    const other = Money.fromCents('200', 'USD')

    expect(money.gt(other)).toBe(false)
  })

  it('returns false if the Money units are not greater than the passed Big', () => {
    const money = Money.fromAmount('2.00', 'USD')
    const other = new Big(2.01)

    expect(money.gt(other)).toBe(false)
  })

  it('returns false if the Money units are not greater than the passed string', () => {
    const money = Money.fromAmount('2.00', 'USD')

    expect(money.gt('3')).toBe(false)
  })

  it('returns false if the Money units are not greater than the passed number', () => {
    const money = Money.fromAmount('2.00', 'USD')

    expect(money.gt(2)).toBe(false)
  })

  it('throws a CurrencyMismatchError if given a Money object of another currency', () => {
    const money = Money.fromAmount('2.00', 'USD')
    const other = Money.fromCents('199', 'EUR')

    expect(() => {
      money.gt(other)
    }).toThrow(CurrencyMismatchError)
  })
})
