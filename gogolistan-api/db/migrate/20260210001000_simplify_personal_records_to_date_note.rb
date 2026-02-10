class SimplifyPersonalRecordsToDateNote < ActiveRecord::Migration[8.1]
  def up
    add_column :personal_records, :pr_date, :date

    execute <<~SQL
      UPDATE personal_records
      SET pr_date = performed_at
      WHERE pr_date IS NULL
    SQL

    change_column_null :personal_records, :pr_date, false

    remove_column :personal_records, :record_type, :string if column_exists?(:personal_records, :record_type)
    remove_column :personal_records, :value, :float if column_exists?(:personal_records, :value)
    remove_column :personal_records, :unit, :string if column_exists?(:personal_records, :unit)
    remove_column :personal_records, :performed_at, :date if column_exists?(:personal_records, :performed_at)

    change_column_default :personal_records, :note, ""
    execute <<~SQL
      UPDATE personal_records
      SET note = ''
      WHERE note IS NULL
    SQL
    change_column_null :personal_records, :note, false
  end

  def down
    add_column :personal_records, :record_type, :string, null: false, default: "record"
    add_column :personal_records, :value, :float, null: false, default: 0
    add_column :personal_records, :unit, :string, null: false, default: ""
    add_column :personal_records, :performed_at, :date

    execute <<~SQL
      UPDATE personal_records
      SET performed_at = pr_date
    SQL

    remove_column :personal_records, :pr_date, :date
  end
end
