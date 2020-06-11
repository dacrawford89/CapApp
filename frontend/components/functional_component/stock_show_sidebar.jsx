import React, {Component} from 'react'

class StockShowSidebar extends Component {
    constructor(props) {
        super(props);
        this.state = {
            num_shares: "",
            symbol: "",
            user_id: 0,
            stock_price: "",
            formType: 'buy',
        }
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    
    componentDidMount() {
        // this.props.fetchStocks()

        // set user_id to currentuser for form submission
        this.setState({user_id: this.props.currentUser, symbol: this.props.match.params.symbol.toUpperCase()})
    }

    componentWillUnmount(){
        this.props.clearMessages();
    }

    componentDidUpdate(prevProps) {
        // if user changes hash locations, update the symbol
        // 2nd part of conditional only updates the state's symbol to the given symbol if it's present in the stock list
        
        if (this.props.match.params.symbol.toUpperCase() !== prevProps.match.params.symbol.toUpperCase() && !!this.props.stocks[this.props.match.params.symbol.toUpperCase()]){
            
            this.setState({
                symbol: this.props.match.params.symbol.toUpperCase(),
                num_shares: "",
                stock_price: "",
                formType: 'buy',
            });
            // this clears the success message when changing to another stock
            this.props.userInfo.newShares = "";
            
        }
        
    }

    handleInput(field){
        return e => (
            this.setState({
                [field]: e.currentTarget.value,
                stock_price: this.props.stock.price,
            })
        )
    }

    handleSubmit(e){
        e.preventDefault();
        // $('.success').css('display','block');
        // $('.success').css('opacity',1.0);
        $('.success').stop(true, true).show().fadeOut(7000);
        $('.errors').stop(true, true).show().fadeOut(7000);
        // if user doenst own the stock, then create it
       
        if (this.props.userInfo.ownedStocks && !this.props.userInfo.ownedStocks[this.state.symbol.toUpperCase()]) {
            this.props.createPortfolio(this.state);
        } else {
            // otherwise, update it
            this.props.updatePortfolio(this.state)
        }
    }

    setFormType(type){
        // set formType when user clicks buy or sell in the sidebar
        // also hide or show cash available or num shares accordingly
        return e => {
            
            e.stopPropagation();

            this.setState({num_shares: ""});

            $('.buy-sell .selected').removeClass('selected');

            // add selected to current 
            e.currentTarget.classList.add('selected');

            // if shares are less than 0, add the color class
            (this.props.stock.dollarChange <= 0) ? e.currentTarget.classList.add('negative-change') : e.currentTarget.classList.add('positive-change');

            this.setState({formType: type});
            if (type === 'sell') {
                $('.buying-power').removeClass('show').addClass('hide');
                $('.num-shares').removeClass('hide').addClass('show')
            } else if (type === 'buy') {
                $('.num-shares').removeClass('show').addClass('hide');
                $('.buying-power').removeClass('hide').addClass('show')
            }
        }
    }

    showBox(e){
        e.stopPropagation();
        
        e.currentTarget.nextSibling.classList.toggle('show');
    }
    
    render() {
        const { userInfo, stock, errors } = this.props;

        const formatter = new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 2
          })
        
        // this requires stock.chart for pricing, so return null if it isnt established yet
        if (!stock || !stock.chart || !userInfo) return null;
        let estimatedPrice = (this.state.num_shares == 0) ? stock.price : Math.round((stock.price * this.state.num_shares + Number.EPSILON) * 100) / 100;
       
        // NUMSHARES check if user owns shares before displaying num_shares
        let numShares = 0;
        
        if (!!userInfo.ownedStocks && !!userInfo.ownedStocks[this.props.match.params.symbol.toUpperCase()]){
            numShares = userInfo.ownedStocks[this.props.match.params.symbol.toUpperCase()]['num_shares'] 
        }
        
        // give selected class to buy and change formType to buy and show buying power box
        if (numShares == 0 && this.state.formType === 'sell'){
            $('#buy').addClass('selected');
            this.setState({formType:'buy'});
            $('.num-shares').removeClass('show').addClass('hide');
            $('.buying-power').removeClass('hide').addClass('show');
        }
   
        const sellClass = () => {
            const change = (stock.dollarChange <= 0) ? "negative-change" : "positive-change";
            const reveal = (numShares > 0) ? "show" : "hide";
            return `${change} ${reveal}`;
        }

        const dollarChange = (stock.dollarChange <= 0) ? "negative-change" : "positive-change";

        return (
            <>
                <ul className="buy-sell">
                    <li onClick={this.setFormType('buy')} id="buy" className={`selected ${dollarChange}`}>Buy {stock.symbol}</li>
                    <li onClick={this.setFormType('sell')} className={sellClass()}>Sell {stock.symbol}</li>
                </ul>
                <hr />
                <section onSubmit={this.handleSubmit}>
                    <form className="pst-form">
                        <section className="line">
                            {/* <i class="fas fa-arrows-alt-v"></i> */}
                            <label>Invest In</label>
                            <select defaultValue="Shares">
                                {/* <option>Dollars</option> */}
                                <option>Shares</option>
                            </select>
                        </section>
                        <section className="line">
                            <label>Shares</label>
                            <input onChange={this.handleInput('num_shares')} value={this.state.num_shares} type="number" placeholder="0" min='.01' max={(this.state.formType === 'sell') ? numShares : ""} step=".01" required />
                        </section>
                        <section className="line">
                            <label>Market Price</label>
                            <data className="cost-credit">{formatter.format(stock.price)}</data>
                        </section>
                        <hr />
                        <section className="line cost-credit">
                            <label>{(this.state.formType === 'buy') ? 'Estimated Cost' : 'Estimated Credit'}</label>
                            <data>{formatter.format(estimatedPrice)} </data>
                        </section>
                        <section className="success">
                            {this.props.userInfo.newShares}
                        </section>
                        <section className="errors">
                            {errors[0]}
                        </section>
                        <button className={dollarChange}>Review Order</button>
                    </form>
                </section>
                <hr />
                <section className={`buying-power bottom show ${dollarChange}`}>
                        <a onClick={this.showBox}>{userInfo.cashAvailable} available for trading. </a>
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
                <section className="num-shares bottom hide">
                    {numShares} shares available for trading.
                </section>
            </>
        )
    }
}

export default StockShowSidebar;