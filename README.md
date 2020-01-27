# @vested/money

A money wrapper class for node and the browser to make dealing with arbitrarily large amounts of money easy.

## Installation

```
yarn add @vested/money
```

## Usage

```
import { Money } from '@vested/money'

const money = new Money(200, 'USD') // Creates a $2 USD money object

const money2 = Money.fromAmount('75,000', 'EUR') // Creates a $75,000 EUR money object
```
