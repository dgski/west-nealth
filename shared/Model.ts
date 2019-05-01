export class Stock {

    symbol: string
    buyPrice: number
    quantity: number

    constructor(symbol: string, buyPrice: number, quantity: number) {
        this.symbol = symbol
        this.buyPrice = buyPrice
        this.quantity = quantity
    }

    static validate(o: object) {
        return o.hasOwnProperty('symbol') && (typeof o['symbol'] === 'string')
            && o.hasOwnProperty('buyPrice') && (typeof o['buyPrice'] === 'number')
            && o.hasOwnProperty('quantity') && (typeof o['quantity'] === 'number');
    }
}
export class Portfolio {

    stocks: Array<Stock>

    constructor() {
        this.stocks = new Array
    }

    addStock(stock: Stock) {
        this.stocks.push(stock)
        return true
    }
    removeStock(symbol: string) {
        let toRemove = this.stocks.find(s => s.symbol === symbol)
        this.stocks.splice(this.stocks.indexOf(toRemove), 1)
        return true
    }
    static validate(o: object) {
        return o.hasOwnProperty('stocks')
        && ((o['stocks'].length > 0) ? Stock.validate(o['stocks'][0]) : true)
    }
}