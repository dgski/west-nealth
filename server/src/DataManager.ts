import {Portfolio} from "../../shared/Model"

export class DataManager {
    portfolios: Map<number,Portfolio>
    nextUserIntId: number

    constructor() {
        this.portfolios = new Map
        this.nextUserIntId = 0
    }

    getPortfolio(userIntId: number) : Portfolio | undefined {
        if(this.portfolios.has(userIntId))
            return this.portfolios.get(userIntId)

        return undefined
    }

    createPortfolio() : number {
        let newUserIntId = this.getNextUserIntId()
        let newPortfolio = new Portfolio()

        this.portfolios.set(newUserIntId, new Portfolio())

        return newUserIntId
    }

    private getNextUserIntId() {
        return this.nextUserIntId++;
    }
}