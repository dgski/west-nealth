import * as express from 'express'
import * as cors from 'cors'
import * as comm from '../../shared/Comm'
import * as model from '../../shared/Model'
import {DataManager} from './DataManager'

const app = express()
app.use(cors())
app.use(express.json());
const port = 8080

let dataManager: DataManager  = new DataManager()

function handleNewPortfolio(req: express.Request, res: express.Response) : void {
    console.log("->")
    console.log(req.body)

    if(!comm.NEW_PORTFOLIO_MSG.validate(req.body)) {
        let errorMsg = new comm.ERROR_MSG(comm.ErrorCode.InvalidRequest)
        errorMsg.log()
        res.status(404).send(errorMsg.stringify())
        return
    }

    let reqBody: comm.NEW_PORTFOLIO_MSG = req.body
    let newUserIntId = dataManager.createPortfolio()
    
    let resBody = new comm.NEW_PORTFOLIO_MSG_REPLY(newUserIntId)
    console.log("<-")
    console.log(resBody)
    res.send(resBody.stringify())
}

function handleGetPortfolio(req: express.Request, res: express.Response) : void {  
    console.log("->")
    console.log(req.body)
    
    if(!comm.GET_PORTFOLIO_MSG.validate(req.body)) {
        let errorMsg = new comm.ERROR_MSG(comm.ErrorCode.InvalidRequest)
        errorMsg.log()
        res.status(404).send(errorMsg.stringify())
        return
    }
    let reqBody: comm.GET_PORTFOLIO_MSG = req.body

    let portfolio : model.Portfolio | undefined = dataManager.getPortfolio(reqBody.userIntId)
    if(!portfolio) {
        let errorMsg = new comm.ERROR_MSG(comm.ErrorCode.NoPortfolioFound)
        errorMsg.log()
        res.status(404).send(errorMsg.stringify())
        return
    }

    let resBody = new comm.GET_PORTFOLIO_MSG_REPLY(portfolio)
    console.log("<-")
    console.log(resBody)
    res.send(resBody.stringify())
}

function handleAddStock(req: express.Request, res: express.Response) : void {
    console.log("->")
    console.log(req.body)

    if(!comm.ADD_STOCK_MSG.validate(req.body)) {
        let errorMsg = new comm.ERROR_MSG(comm.ErrorCode.InvalidRequest)
        errorMsg.log()
        res.status(404).send(errorMsg.stringify())
        return
    }
    let reqBody: comm.ADD_STOCK_MSG  = req.body

    let portfolio : model.Portfolio | undefined = dataManager.getPortfolio(reqBody.userIntId)
    if(!portfolio) {
        let errorMsg = new comm.ERROR_MSG(comm.ErrorCode.NoPortfolioFound)
        errorMsg.log()
        res.status(404).send(errorMsg.stringify())
        return
    }

    portfolio.addStock(reqBody.stock)

    let resBody = new comm.ADD_STOCK_MSG_REPLY()
    console.log("<-")
    console.log(resBody)
    res.send(resBody.stringify())
}

function handleRemoveStock(req: express.Request, res: express.Response) : void {
    console.log("->")
    console.log(req.body)
    
    if(!comm.REMOVE_STOCK_MSG.validate(req.body)) {
        let errorMsg = new comm.ERROR_MSG(comm.ErrorCode.InvalidRequest)
        errorMsg.log()
        res.status(404).send(errorMsg.stringify())
        return
    }
    let reqBody: comm.REMOVE_STOCK_MSG = req.body

    let portfolio : model.Portfolio | undefined = dataManager.getPortfolio(reqBody.userIntId)
    if(!portfolio) {
        let errorMsg = new comm.ERROR_MSG(comm.ErrorCode.NoPortfolioFound)
        errorMsg.log()
        res.status(404).send(errorMsg.stringify())
        return
    }

    portfolio.removeStock(reqBody.symbol)

    let resBody = new comm.ADD_STOCK_MSG_REPLY()
    console.log("<-")
    console.log(resBody)
    res.send(resBody.stringify())
}

function logWrap(handleFunc : any) {
    return function(req: express.Request, res: express.Response) {
        console.log("timestamp[" + Date.now().toString() + "]")
        console.log(handleFunc.name + " {")
        handleFunc(req, res)
        console.log("}")
    }
}

app.post('/new-portfolio', logWrap(handleNewPortfolio))
app.post('/get-portfolio', logWrap(handleGetPortfolio))
app.post('/add-stock', logWrap(handleAddStock))
app.post('/remove-stock', logWrap(handleRemoveStock))

app.listen(8080, () => console.log(`Simple Stock Manager Listening On ${port}!`))