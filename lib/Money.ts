import Big from 'big.js'
import isString from 'lodash.isstring'
import { MoneyJSON } from './MoneyJSON'
import { CurrencyMismatchError } from './CurrencyMismatchError'

type Biggable = number | string | Big
type RoundingMode = 'down' | 'half-even' | 'half-up' | 'up'

export class Money {
  cents: Big
  currency: string

  constructor (cents: Biggable, currency = 'USD') {
    this.cents = new Big(cents)
    this.currency = currency
  }

  static fromAmount (amount: Biggable, currency = 'USD'): Money {
    if (isString(amount)) {
      amount = amount.replace(/,/, '')
    }

    const dollars = new Big(amount)
    return new Money(dollars.times(100), currency)
  }

  static fromJSON (json: MoneyJSON): Money {
    return new Money(json.cents, json.currency)
  }

  static zero (currency = 'USD'): Money {
    return new Money(0, currency)
  }

  get units (): Big {
    return this.cents.div(100)
  }

  toJSON (): MoneyJSON {
    return {
      cents: this.cents.toFixed(0),
      currency: this.currency
    }
  }

  toFixed (size = 2): string {
    return this.units.toFixed(size)
  }

  roundToUnit (mode: RoundingMode = 'half-up'): Money {
    return Money.fromAmount(this.units.round(0, roundingMode(mode)), this.currency)
  }

  roundToCent (mode: RoundingMode = 'half-up'): Money {
    return new Money(this.cents.round(0, roundingMode(mode)), this.currency)
  }

  plus (other: Biggable | Money): Money {
    if (other instanceof Money) {
      if (other.currency !== this.currency) {
        throw new CurrencyMismatchError()
      }

      return this.plus(other.cents)
    }

    return new Money(this.cents.plus(other), this.currency)
  }

  minus (other: Biggable | Money): Money {
    if (other instanceof Money) {
      if (other.currency !== this.currency) {
        throw new CurrencyMismatchError()
      }

      return this.minus(other.cents)
    }

    return new Money(this.cents.minus(other), this.currency)
  }

  times (other: Biggable | Money): Money {
    if (other instanceof Money) {
      if (other.currency !== this.currency) {
        throw new CurrencyMismatchError()
      }

      return this.times(other.units)
    }

    return new Money(this.cents.times(other), this.currency)
  }

  div (other: Biggable | Money): Money {
    if (other instanceof Money) {
      if (other.currency !== this.currency) {
        throw new CurrencyMismatchError()
      }

      return this.div(other.units)
    }

    return new Money(this.cents.div(other), this.currency)
  }

  eq (other: Biggable | Money): boolean {
    if (other instanceof Money) {
      if (other.currency !== this.currency) {
        return false
      }

      return this.gt(other.cents)
    }

    return this.cents.gt(other)
  }

  gt (other: Biggable | Money): boolean {
    if (other instanceof Money) {
      if (other.currency !== this.currency) {
        throw new CurrencyMismatchError()
      }

      return this.gt(other.cents)
    }

    return this.cents.gt(other)
  }

  lt (other: Biggable | Money): boolean {
    if (other instanceof Money) {
      if (other.currency !== this.currency) {
        throw new CurrencyMismatchError()
      }

      return this.lt(other.cents)
    }

    return this.cents.lt(other)
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
