class ReCreatePortfolios < ActiveRecord::Migration[5.2]
  def change
    create_table :portfolios do |t|
      t.integer :user_id, null: false
      t.string :symbol, null: false
      t.float :num_shares, null: false
    end
    add_index :portfolios, [:user_id, :symbol], unique: true
  end
end
