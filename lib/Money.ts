import Big from 'big.js'
import isString from 'lodash.isstring'
import { MoneyJSON } from './MoneyJSON'
import { CurrencyMismatchError } from './CurrencyMismatchError'

type Biggable = number | string | Big
type RoundingMode = 'down' | 'half-even' | 'half-up' | 'up'

export class Money {
  readonly units: Big
  readonly currency: string

  constructor (units: Biggable, currency = 'USD') {
    if (isString(units)) {
      units = units.replace(/,/g, '')
    }

    this.units = new Big(units)
    this.currency = currency

    Object.freeze(this)
  }

  static fromCents (cents: Biggable, currency = 'USD'): Money {
    cents = new Big(cents)
    return new this(cents.div(100), currency)
  }

  static fromAmount (amount: Biggable, currency = 'USD'): Money {
    return new this(amount, currency)
  }

  static fromJSON (json: MoneyJSON): Money {
    if (json.units) {
      return Money.fromAmount(json.units, json.currency)
    }

    return Money.fromCents(json.cents, json.currency)
  }

  static zero (currency = 'USD'): Money {
    return Money.fromAmount(0, currency)
  }

  get cents (): Big {
    return this.units.times(100)
  }

  toJSON (): MoneyJSON {
    return {
      units: this.toFixed(),
      cents: this.cents.toFixed(0),
      currency: this.currency
    }
  }

  toFixed (size = 2): string {
    return this.units.toFixed(size)
  }

  roundToUnit (mode: RoundingMode = 'half-up'): Money {
    return new Money(this.units.round(0, roundingMode(mode)), this.currency)
  }

  roundToCent (mode: RoundingMode = 'half-up'): Money {
    return Money.fromCents(this.cents.round(0, roundingMode(mode)), this.currency)
  }

  plus (other: Money): Money {
    if (other.currency !== this.currency) {
      throw new CurrencyMismatchError()
    }

    return Money.fromAmount(this.units.plus(other.units), this.currency)
  }

  minus (other: Money): Money {
    if (other.currency !== this.currency) {
      throw new CurrencyMismatchError()
    }

    return Money.fromAmount(this.units.minus(other.units), this.currency)
  }

  times (other: Biggable | Money): Money {
    if (other instanceof Money) {
      if (other.currency !== this.currency) {
        throw new CurrencyMismatchError()
      }

      return this.times(other.units)
    }

    return Money.fromAmount(this.units.times(other), this.currency)
  }

  div (other: Biggable | Money): Money {
    if (other instanceof Money) {
      if (other.currency !== this.currency) {
        throw new CurrencyMismatchError()
      }

      return this.div(other.units)
    }

    return Money.fromAmount(this.units.div(other), this.currency)
  }

  eq (other: Biggable | Money): boolean {
    if (other instanceof Money) {
      if (other.currency !== this.currency) {
        return false
      }

      return this.eq(other.units)
    }

    return this.units.eq(other)
  }

  gt (other: Biggable | Money): boolean {
    if (other instanceof Money) {
      if (other.currency !== this.currency) {
        throw new CurrencyMismatchError()
      }

      return this.gt(other.units)
    }

    return this.units.gt(other)
  }

  lt (other: Biggable | Money): boolean {
    if (other instanceof Money) {
      if (other.currency !== this.currency) {
        throw new CurrencyMismatchError()
      }

      return this.lt(other.units)
    }

    return this.units.lt(other)
  }
}

function roundingMode (str: RoundingMode): number {
  if (str === 'down') {
    return 0
  }
  if (str === 'half-even') {
    return 2
  }
  if (str === 'up') {
    return 3
  }

  return 1
}
