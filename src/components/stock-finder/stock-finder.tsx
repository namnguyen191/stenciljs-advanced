import { Component, h, State, Event, EventEmitter } from '@stencil/core';
import { API_KEY } from '../../global/global';

@Component({
  tag: 'nn-stock-finder',
  styleUrl: './stock-finder.css',
  shadow: true,
})
export class StockFinder {
  stockNameInput: HTMLInputElement;

  @State() searchResults: { symbol: string; name: string }[] = [];
  @State() loading: boolean = false;

  @Event({ bubbles: true, composed: true }) nnSymbolSelected: EventEmitter<string>;

  onFindStock(e: Event) {
    this.loading = true;
    e.preventDefault();
    const stockName = this.stockNameInput.value;
    fetch(`https://www.alphavantage.co/query?function=SYMBOL_SEARCH&keywords=${stockName}&apikey=${API_KEY}`)
      .then(res => res.json())
      .then(parsedRes => {
        console.log(`Nam data is: `, parsedRes);
        this.searchResults = parsedRes['bestMatches'].map(match => {
          return {
            name: match['2. name'],
            symbol: match['1. symbol'],
          };
        });
        this.loading = false;
      })
      .catch(err => {
        console.log(`Nam data is: `, err);
        this.loading = false;
      });
  }

  onSelectSymbol(symbol: string) {
    this.nnSymbolSelected.emit(symbol);
  }

  render() {
    let content = (
      <ul>
        {this.searchResults.map(result => (
          <li onClick={this.onSelectSymbol.bind(this, result.symbol)}>
            <strong>{result.symbol}</strong> - {result.name}
          </li>
        ))}
      </ul>
    );

    if (this.loading) {
      content = <nn-spinner />;
    }

    return [
      <h1>Stock Finder</h1>,
      <form onSubmit={this.onFindStock.bind(this)}>
        <input id="stock-symbol" ref={el => (this.stockNameInput = el)} />
        <button type="submit">Fetch</button>
      </form>,
      content,
    ];
  }
}
