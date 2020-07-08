import React from 'react';
import NewsComponent from '../other/NewsComponent'
import GraphComponent from '../other/graph_component_container'
import _ from 'lodash'


class Dashboard extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            
        }
    }


    render() {
        const { stocks, user, user: {ownedStocks} } = this.props;

        if (!Object.keys(stocks).length || !ownedStocks || !user || !user.portfolioValue) return null;

        const symbols = Object.keys(ownedStocks);
        // this block combines the averages for all of the user's portfolios; 
        // please note that for demo purposes, the data is pulled from a sample chart that does not use up-to-date info

        // structure matching graphcomponent
        let combinedStats = {};
        combinedStats['chart'];
        combinedStats['price'];
        combinedStats['percentageChange'];
        combinedStats['dollarChange'];
        symbols.forEach( (symbol, idx) => {
            if (idx == 0) {
                combinedStats['chart'] = _.cloneDeep(stocks[symbol].chart);
                // debugger
            }
            stocks[symbol].chart.forEach( (dataPoint, chartIdx) => {
                if (idx !== 0){
                    if (combinedStats.chart[chartIdx].average === undefined) combinedStats.chart[chartIdx].average = 0;

                    let value = dataPoint.average;
                    if (value === null){
                        value = stocks[symbol].chart[stocks[symbol].chart.length - 1].average;
                    }
                    combinedStats.chart[chartIdx].average += value * ownedStocks[symbol].num_shares;
                }
            });

        });
        console.log(combinedStats);
        combinedStats['price'] = parseFloat(user.portfolioValue.replace(/\$|,/g, ''));
    
        let combinedChart = combinedStats['chart'];
        let last = combinedChart[combinedChart.length - 1];
        let first = combinedChart[0];
        combinedStats['chart'][combinedStats['chart'].length-1].average = combinedStats['price'];
        combinedStats['percentageChange'] = ((last.average / first.average - 1 ) * 100).toFixed(2);
        combinedStats['dollarChange'] = (last.average - first.average).toFixed(2);

        return (
            <>
                <GraphComponent stock={combinedStats} />
                <NewsComponent />
            </>
        )
    }
}
export default Dashboard;