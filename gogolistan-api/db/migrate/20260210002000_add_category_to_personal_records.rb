class AddCategoryToPersonalRecords < ActiveRecord::Migration[8.1]
  def up
    add_column :personal_records, :category, :string, default: "poids", null: false

    execute <<~SQL
      UPDATE personal_records
      SET category = 'poids'
      WHERE category IS NULL OR category = ''
    SQL
  end

  def down
    remove_column :personal_records, :category, :string
  end
end
