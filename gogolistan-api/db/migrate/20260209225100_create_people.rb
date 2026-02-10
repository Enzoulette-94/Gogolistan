class CreatePeople < ActiveRecord::Migration[8.1]
  def change
    create_table :people do |t|
      t.string :slug, null: false
      t.string :name, null: false

      t.timestamps
    end

    add_index :people, :slug, unique: true
  end
end
