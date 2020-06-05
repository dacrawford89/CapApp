import React, {Component} from 'react'

class StockShowSidebar extends Component {
    constructor(props) {
        super(props);
        this.state = {
            
        }
    }

    componentDidMount() {
        this.props.fetchStock(this.props.match.params.symbol)
    }

    showBox(e){
        e.stopPropagation();
        // debugger
        e.currentTarget.nextSibling.classList.toggle('show');
    }
    
    render() {
        // debugger
        const { cashAvailable } = this.props;
        return (
            <>
                <ul className="buy-sell">
                    <li className="selected">Buy TSLA</li>
                    <li>Sell TSLA</li>
                </ul>
                <hr />
                <section>
                    <form className="pst-form">
                        <section className="line">
                            {/* <i class="fas fa-arrows-alt-v"></i> */}
                            <label>Invest In</label>
                            <select defaultValue="Shares">
                                <option>Shares</option>
                                <option>Dollars</option>
                            </select>
                        </section>
                        <section className="line">
                            <label>Shares</label>
                            <input type="number" placeholder="0" />
                        </section>
                        <section className="line">
                            <label>Market Price</label>
                            <data className="cost-credit">$12.99</data>
                        </section>
                        <hr />
                        <section className="line cost-credit">
                            <label>Estimated cost</label>
                            <data>$12.99</data>
                        </section>
                        <button>Review Order</button>
                    </form>
                </section>
                <hr />
                <section className="buying-power">
                        <a onClick={this.showBox}>{cashAvailable} available for trading. </a>
                        <div className="info-box" id="sidebar-info-dropdown">
                            <h3>Good luck!</h3>
                            <div className="line">
                                <p>Vestibulum convallis ut nulla non tincidunt.  </p>
                                <p>Praesent congue sed neque in sagittis.  </p>
                            </div>  
                            <div className="line">
                                <p>Praesent in efficitur massa, at feugiat lectus.  </p>
                                <p>Proin imperdiet, felis nec tristique tempor </p>
                            </div>  
                        </div>
                        <i className="fas fa-question-circle"></i>
                </section>
            </>
        )
    }
}

export default StockShowSidebar;