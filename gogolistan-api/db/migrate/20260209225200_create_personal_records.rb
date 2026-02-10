class CreatePersonalRecords < ActiveRecord::Migration[8.1]
  def change
    create_table :personal_records do |t|
      t.references :person, null: false, foreign_key: true
      t.references :user, null: false, foreign_key: true
      t.string :title, null: false
      t.text :proof, null: false
      t.datetime :performed_at

      t.timestamps
    end
  end
end
