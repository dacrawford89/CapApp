@watchlists.each do |watchlist|
    # debugger
    json.set! watchlist.id do
        json.partial! 'watchlist', watchlist: watchlist
        json.watchedStocks watchlist.stocks
    end
end