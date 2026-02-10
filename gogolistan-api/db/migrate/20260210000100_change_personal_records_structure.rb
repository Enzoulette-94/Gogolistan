class ChangePersonalRecordsStructure < ActiveRecord::Migration[8.1]
  def up
    add_column :personal_records, :record_type, :string
    add_column :personal_records, :value, :float
    add_column :personal_records, :unit, :string
    add_column :personal_records, :note, :text

    execute <<~SQL
      UPDATE personal_records
      SET record_type = COALESCE(title, 'record'),
          value = 0,
          unit = '',
          note = proof
    SQL

    change_column_null :personal_records, :record_type, false
    change_column_null :personal_records, :value, false
    change_column_null :personal_records, :unit, false
    change_column :personal_records, :performed_at, :date

    remove_column :personal_records, :title, :string
    remove_column :personal_records, :proof, :text
  end

  def down
    add_column :personal_records, :title, :string, null: false, default: "record"
    add_column :personal_records, :proof, :text, null: false, default: ""

    execute <<~SQL
      UPDATE personal_records
      SET title = COALESCE(record_type, 'record'),
          proof = COALESCE(note, '')
    SQL

    change_column :personal_records, :performed_at, :datetime

    remove_column :personal_records, :record_type, :string
    remove_column :personal_records, :value, :float
    remove_column :personal_records, :unit, :string
    remove_column :personal_records, :note, :text
  end
end
