import { Component, OnInit } from '@angular/core';
import { Portfolio, Stock } from '@shared/Model';
import * as comm from '@shared/Comm';

const COMM_ERROR_STRING = "Communication Error. Please contact Support.";

@Component({
  selector: 'app-stock-list',
  templateUrl: './stock-list.component.html',
  styleUrls: ['./stock-list.component.css']
})
export class StockListComponent implements OnInit {
  
  userIntId: number
  portfolio: Portfolio
  newSymbol: String
  newPrice: number
  newQuantity: number

  constructor() {}

  ngOnInit() {
    this.portfolio = new Portfolio()
    let potentialUserIntId = localStorage.getItem("userIntId")

    if(potentialUserIntId) {
      this.userIntId = parseInt(potentialUserIntId)
      this.getPortfolio()
      return
    }
    else {
      this.createPortfolio()
    }
  }

  createPortfolio() {
    let reqMsg = new comm.NEW_PORTFOLIO_MSG()
    fetch('http://localhost:8080/new-portfolio', {
      method: 'post',
      body: reqMsg.stringify(),
      headers: { 'Content-type': 'application/json' }
    })
    .then(r => r.json())
    .catch(_ => { alert(COMM_ERROR_STRING)})
    .then(r => {

      if(comm.ERROR_MSG.validate(r) && r.errorCode) {
        alert(comm.ErrorStrings[r.errorCode])
        return
      }

      if(!comm.NEW_PORTFOLIO_MSG_REPLY.validate(r)) {
        alert(comm.ErrorStrings[comm.ErrorCode.InvalidRequest])
        return
      }

      let resMsg: comm.NEW_PORTFOLIO_MSG_REPLY = r
      this.userIntId = resMsg.userIntId
      localStorage.setItem("userIntId", this.userIntId.toString())
      this.getPortfolio()
    })
  }

  getPortfolio() {
    let reqMsg = new comm.GET_PORTFOLIO_MSG(this.userIntId)
    fetch('http://localhost:8080/get-portfolio', {
      method: 'post',
      body: reqMsg.stringify(),
      headers: { 'Content-type': 'application/json' }
    })
    .then(r => r.json())
    .catch(_ => {alert(COMM_ERROR_STRING)})
    .then(r => {

      if(comm.ERROR_MSG.validate(r) && r.errorCode) {
        if(r.errorCode == comm.ErrorCode.NoPortfolioFound) {
          this.createPortfolio()
        }
        return
      }

      if(!comm.GET_PORTFOLIO_MSG_REPLY.validate(r)) {
        alert(comm.ErrorStrings[comm.ErrorCode.InvalidRequest])
        return
      }
      let resMsg: comm.GET_PORTFOLIO_MSG_REPLY = r
      console.log(resMsg)
      this.portfolio.stocks = resMsg.portfolio.stocks
    })
  }

  addStock() {

    if(this.newSymbol === null || this.newSymbol.length === 0)
      return
    if(this.newPrice === null)
      return
    if(this.newQuantity === null)
      return

    let newStock = new Stock(this.newSymbol.toString(), this.newPrice, this.newQuantity)
    let reqMsg = new comm.ADD_STOCK_MSG(this.userIntId, newStock)

    fetch('http://localhost:8080/add-stock', {
      method: 'post',
      body: reqMsg.stringify(),
      headers: { 'Content-type': 'application/json' }
    })
    .then(r => r.json())
    .catch(_ => { alert(COMM_ERROR_STRING)})
    .then(r => {

      if(comm.ERROR_MSG.validate(r) && r.errorCode) {
        alert(comm.ErrorStrings[r.errorCode])
        return
      }

      if(!comm.ADD_STOCK_MSG_REPLY.validate(r)) {
        alert(comm.ErrorStrings[comm.ErrorCode.InvalidRequest])
        return
      }
      let resMsg: comm.ADD_STOCK_MSG_REPLY = r
      this.portfolio.addStock(newStock)
      this.resetInputs()
    })
  }

  removeStock(stockSymbol: string) {
    let reqMsg = new comm.REMOVE_STOCK_MSG(this.userIntId, stockSymbol)

    fetch('http://localhost:8080/remove-stock', {
      method: 'post',
      body: reqMsg.stringify(),
      headers: { 'Content-type': 'application/json' }
    })
    .then(r => r.json())
    .catch(_ => { alert(COMM_ERROR_STRING)})
    .then(r => {

      if(comm.ERROR_MSG.validate(r) && r.errorCode) {
        alert(comm.ErrorStrings[r.errorCode])
        return
      }

      if(!comm.REMOVE_STOCK_MSG_REPLY.validate(r)) {
        alert(comm.ErrorStrings[comm.ErrorCode.InvalidRequest])
        return
      }
      let resMsg: comm.REMOVE_STOCK_MSG_REPLY = r
      this.portfolio.removeStock(stockSymbol)
    })
  }

  resetInputs() {
    this.newSymbol = ""
    this.newPrice = null
    this.newQuantity = null
  }

  totalValue() : number {
    return this.portfolio.stocks.map((s : Stock) => s.buyPrice * s.quantity).reduce((a,c) => a + c)
  }
}