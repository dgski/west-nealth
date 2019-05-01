import { Portfolio, Stock } from "./Model";

export class MSG {
    stringify() {
        return JSON.stringify(this)
    }
    static validate(o: object) {
        return true
    }
}

export class NEW_PORTFOLIO_MSG extends MSG {}
export class NEW_PORTFOLIO_MSG_REPLY extends MSG {
    userIntId: number

    constructor(userIntId: number) {
        super()
        this.userIntId = userIntId
    }
    static validate(o: object) {
        return super.validate(o)
            && o.hasOwnProperty('userIntId') && (typeof o['userIntId'] === 'number');
    }
}

export class GET_PORTFOLIO_MSG extends MSG {
    userIntId: number

    constructor(userInitId: number) {
        super()
        this.userIntId = userInitId
    }
    static validate(o: object) {
        return super.validate(o)
            && o.hasOwnProperty('userIntId') && (typeof o['userIntId'] === 'number');
    }
}
export class GET_PORTFOLIO_MSG_REPLY extends MSG {
    portfolio: Portfolio

    constructor(portfolio: Portfolio) {
        super()
        this.portfolio = portfolio;
    }
    static validate(o: object) {
        return super.validate(o)
            && o.hasOwnProperty('portfolio') && Portfolio.validate(o['portfolio']);
    }
}

export class ADD_STOCK_MSG extends MSG {
    userIntId: number
    stock: Stock

    constructor(userIntId: number, stock: Stock) {
        super()
        this.userIntId = userIntId
        this.stock = stock
    }
    static validate(o: object) {
        return super.validate(o)
            && o.hasOwnProperty('userIntId') && (typeof o['userIntId'] === 'number')
            && o.hasOwnProperty('stock') && Stock.validate(o['stock']);
    }
}
export class ADD_STOCK_MSG_REPLY extends MSG {
}

export class REMOVE_STOCK_MSG extends MSG {
    userIntId: number
    symbol: string

    constructor(userIntId: number, symbol: string) {
        super()
        this.userIntId = userIntId;
        this.symbol = symbol;
    }
    static validate(o: object) {
        return super.validate(o)
            && o.hasOwnProperty('userIntId') && (typeof o['userIntId'] === 'number')
            && o.hasOwnProperty('symbol') && (typeof o['symbol'] === 'string');
    }
}
export class REMOVE_STOCK_MSG_REPLY extends MSG {
}

export enum ErrorCode {
    NoError = 0,
    InvalidRequest,
    NoPortfolioFound
}

export const ErrorStrings: string[] = [
    "No Error Exists",
    "Internal Error. Please contact Support.",
    "Problem Accessing Portfolio Data. Please contact Support."
];

export class ERROR_MSG extends MSG {
    errorCode: ErrorCode

    constructor(errorCode: ErrorCode) {
        super()
        this.errorCode = errorCode
    }

    static validate(o: object) {
        return super.validate(o)
            && o.hasOwnProperty('errorCode') && (typeof o['errorCode'] === 'number');
    }

    log() {
        console.log(`<ERROR_MSG code='${this.errorCode} : ${this.errorCode.toString()}' string='${ErrorStrings[this.errorCode]}' >`);
    }
}