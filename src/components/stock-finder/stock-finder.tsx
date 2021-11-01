import { Component, h } from '@stencil/core';
import { API_KEY } from '../../global/global';

@Component({
  tag: 'nn-stock-finder',
  styleUrl: './stock-finder.css',
  shadow: true,
})
export class StockFinder {
  stockNameInput: HTMLInputElement;

  onFindStock(e: Event) {
    e.preventDefault();
    const stockName = this.stockNameInput.value;
    fetch(`https://www.alphavantage.co/query?function=SYMBOL_SEARCH&keywords=${stockName}&apikey=${API_KEY}`)
      .then(res => res.json())
      .then(paredRes => {
        console.log(`Nam data is: `, paredRes);
      })
      .catch(err => console.log(`Nam data is: `, err));
  }

  render() {
    return [
      <h1>Stock Finder</h1>,
      <form onSubmit={this.onFindStock.bind(this)}>
        <input id="stock-symbol" ref={el => (this.stockNameInput = el)} />
        <button type="submit">Fetch</button>
      </form>,
    ];
  }
}
