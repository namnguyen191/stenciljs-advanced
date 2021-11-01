import { Component, h, State, Element, Prop, Watch } from '@stencil/core';
import { API_KEY } from '../../global/global';

@Component({
  tag: 'nn-stock-price',
  styleUrl: './stock-price.css',
  shadow: true,
})
export class StockPriceComponent {
  @Element() el: HTMLElement;

  stockInp: HTMLInputElement;
  // initialStockSymbol: string;

  @State() fetchedPrice: number;
  @State() stockUserInput: string;
  @State() stockInputValid = false;
  @State() error: string;

  @Prop({ mutable: true, reflect: true }) stockSymbol: string;

  @Watch('stockSymbol')
  stockSymbolChanged(newValue: string, oldValue: string) {
    if (newValue !== oldValue) {
      this.stockUserInput = newValue;
      this.fetStockPrice(newValue);
    }
  }

  // run before render
  // should not set any state here due inefficiency
  componentWillLoad() {
    console.log(`Nam data is: component will load`, this.stockSymbol);
    if (this.stockSymbol) {
      // this.initialStockSymbol = this.stockSymbol;
      this.stockUserInput = this.stockSymbol;
      this.stockInputValid = true;
      // this.fetStockPrice(this.stockSymbol);
    }
  }

  componentDidLoad() {
    console.log(`Nam data is: component did load`);
    if (this.stockSymbol) {
      // this.initialStockSymbol = this.stockSymbol;
      // this.stockUserInput = this.stockSymbol;
      // this.stockInputValid = true;
      this.fetStockPrice(this.stockSymbol);
    }
  }

  componentWillUpdate() {
    console.log(`Nam data is: component will update`);
  }

  componentDidUpdate() {
    console.log(`Nam data is: component did update`);
    // if (this.stockSymbol != this.initialStockSymbol) {
    //   this.initialStockSymbol = this.stockSymbol;
    //   this.fetStockPrice(this.stockSymbol);
    // }
  }

  // great place for any clean up
  disconnectedCallback() {
    console.log(`Nam data is: component did unload`);
  }

  onUserInput(e: Event) {
    this.stockUserInput = (e.target as HTMLInputElement).value;
    if (this.stockUserInput.trim() !== '') {
      this.stockInputValid = true;
    } else {
      this.stockInputValid = false;
    }
  }

  fetStockPrice(stockSymbol: string) {
    fetch(`https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${stockSymbol}&apikey=${API_KEY}`)
      .then(res => {
        return res.json();
      })
      .then(parsedRes => {
        if (!parsedRes['Global Quote']['05. price']) {
          throw new Error('Invalid symbol');
        }

        this.error = null;
        this.fetchedPrice = +parsedRes['Global Quote']['05. price'];
      })
      .catch(err => {
        this.error = err.message;
      });
  }

  onFetchStockPrice(event: Event) {
    event.preventDefault();
    this.stockSymbol = this.stockInp.value;
    // this.fetStockPrice(stockSymbol);
  }

  render() {
    let dataContent = <p>Please enter a symbol</p>;

    if (this.error) {
      dataContent = <p>{this.error}</p>;
    }

    if (this.fetchedPrice) {
      dataContent = <p>Price: ${this.fetchedPrice}</p>;
    }

    return [
      <form onSubmit={this.onFetchStockPrice.bind(this)}>
        <input id="stock-symbol" ref={el => (this.stockInp = el)} value={this.stockUserInput} onInput={this.onUserInput.bind(this)} />
        <button type="submit" disabled={!this.stockInputValid}>
          Fetch
        </button>
      </form>,
      <div>{dataContent}</div>,
    ];
  }
}
