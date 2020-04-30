# @vested/money

A Money wrapper class for node and the browser, built on [Big.js](https://github.com/MikeMcl/big.js/), to make dealing with arbitrarily large amounts of money easy.

Each Money object is **immutable**, **infiniately large**, and **infiniately small**.

## Installation

```
yarn add @vested/money
```

## Example Usage

```js
import { Money } from '@vested/money'

const oneFifty = new Money(150, 'USD')
// => $1.50

const threeDollars = oneFifty.times(2)
// => $3.00

const threeFifty = threeDollars.plus(50)
// => $3.50

const fourDollars = threeFifty.roundUnit()
// => $4.00

const oneDollar = fourDollars.minus(threeDollars)
// => $1.00

const twoDollars = fourDollars.div(2)
// => $2.00

threeDollars.gt(twoDollars)
// => true

threeDollars.lt(twoDollars)
// => false

fourDollars.eq(twoDollars.plus(twoDollars))
// => true
```

## Methods

### new Money(cents, currency = 'USD'): Money

Builds a new Money object, taking the smallest unit (cents) as the first argument and an optional currency string as a second argument (default 'USD'). For example, the following builds a $3.50 USD Money object:

```js
const money = new Money(350, 'USD')
// => 3.50
```

You can pass a string, number, or Big as the first argument.

### Money.fromAmount(units, currency = 'USD'): Money

Builds a new Money object, taking a single unit (dollars) as the first argument and an optional currency string as a second argument (default 'USD'). For example, the following builds a $3.50 USD Money object:

```js
const money = Money.fromAmount('3.50', 'USD')
// => $3.50
```

You can pass a string, number, or Big as the first argument.

### Money.fromJSON(): Money

Builds a new Money object from a given MoneyJSON object, generally created by the `money.toJSON()` method below.

```js
const money = Money.fromJSON({
  cents: '350',
  currency: 'USD'
})
// => $3.50
```

### Money.zero(currency = 'USD'): Money

Helper method to build a zero object of a given currency (default 'USD').

```js
const money = Money.zero('USD')
// => $0.00
```

### money.cents: Big

Returns a Big object representing the cents of the Money object

```js
const money = new Money(3.50, 'EUR')
money.cents
// => '350'
```

### money.currency: string

Returns a string representing the currency.

```js
const money = Money.zero('EUR')
money.currency
// => 'EUR'
```

### money.units: Big

Returns a Big object representing the units of the Money object

```js
const money = new Money(350, 'EUR')
money.units
// => '3.50'
```

### money.toJSON(): MoneyJSON

Returns a MoneyJSON representation of a Money object

```js
const money = Money.fromAmount('3.50')
money.toJSON()
// => { cents: '350', currency: 'USD' }
```

### money.toFixed(size = 2): string

Returns a string rounded to a given number of units, using `half-up` rounding.

```js
const money = Money.fromAmount('3.50')
money.toFixed()
// => '3.50'
money.toFixed(2)
// => '3.50'
money.toFixed(1)
// => '3.5'
money.toFixed(0)
// => '4'
```

### money.roundToUnit(mode = 'half-up'): Money

Returns a new Money object rounded to the nearest unit, using the provided rounding mode.

```js
const money = Money.fromAmount('4.50')
money.roundToUnit()
// => Money<$5.00>

money.roundToUnit('down')
// => Money<$4.00>

money.roundToUnit('up')
// => Money<$5.00>

money.roundToUnit('half-up')
// => Money<$5.00>

money.roundToUnit('half-even')
// => Money<$4.00>
```

### money.rountToCent(mode = 'half-up'): Money

Returns a new Money object rounded to the nearest cent, using the provided rounding mode.

```js
const money = Money.fromAmount('0.985')
money.roundToCent()
// => Money<$0.99>

money.roundToCent('down')
// => Money<$0.98>

money.roundToCent('up')
// => Money<$0.99>

money.roundToCent('half-up')
// => Money<$0.99>

money.roundToCent('half-even')
// => Money<$0.98>
```

### money.plus(other): Money

Returns a new Money object by adding the other value. The argument can be another Money object, a string (cents), a number (cents) or a Big object (cents).

If a Money object of a different currency is provided, a `CurrencyMismatchError` will be thrown.

```js
const money = Money.fromAmount('3.50')
money.plus('200')
// => Money<$5.50>
```

### money.minus(other): Money

Returns a new Money object by subtracting the other value. The argument can be another Money object, a string (cents), a number (cents) or a Big object (cents).

If a Money object of a different currency is provided, a `CurrencyMismatchError` will be thrown.

```js
const money = Money.fromAmount('3.50')
money.minus('200')
// => Money<$1.50>
```

### money.times(other): Money

Returns a new Money object by multiplying the other value. The argument can be another Money object, a string, a number, or a Big.

If a Money object of a different currency is provided, a `CurrencyMismatchError` will be thrown.

```js
const money = Money.fromAmount('3.50')
money.times('2')
// => Money<$7.00>
```

### money.div(other): Money

Returns a new Money object by dividing by the other value. The argument can be another Money object, a string, a number, or a Big.

If a Money object of a different currency is provided, a `CurrencyMismatchError` will be thrown.

```js
const money = Money.fromAmount('3.50')
money.div('2')
// => Money<$1.75>
```

### money.eq(other): boolean

Returns `true` if this Money object is equal to the other, and `false` otherwise. The argument can be another Money object, a string (cents), a number (cents), or a Big (cents).

If a Money object of a different currency is provided, a `CurrencyMismatchError` will be thrown.

```js
const money = Money.fromAmount('3.50')
money.eq('350')
// => true
money.eq(new Money('350'))
// => true
money.eq(175)
// => false
```

### money.gt(other): boolean

Returns `true` if this Money object is greater than the other, and `false` otherwise. The argument can be another Money object, a string (cents), a number (cents), or a Big (cents).

If a Money object of a different currency is provided, a `CurrencyMismatchError` will be thrown.

```js
const money = Money.fromAmount('3.50')
money.gt('175')
// => true
money.gt(new Money('350'))
// => false
money.gt('350')
// => false
```

### money.lt(other): boolean

Returns `true` if this Money object is less than the other, and `false` otherwise. The argument can be another Money object, a string (cents), a number (cents), or a Big (cents).

If a Money object of a different currency is provided, a `CurrencyMismatchError` will be thrown.

```js
const money = Money.fromAmount('3.50')
money.lt('500')
// => true
money.lt(new Money('350'))
// => false
money.lt('350')
// => false
money.lt('175')
// => false
```

## About Vested

<img src="https://vested.co/logo.png" alt="vested." width="200"/>

**@vested/money** is maintained by [Vested](https://vested.co). Vested is a free service helping employees understand, manage, and cash-in on their startup equity positions, regarless of seniority.
