class CreatePersonalRecordVersions < ActiveRecord::Migration[8.1]
  def change
    create_table :personal_record_versions do |t|
      t.bigint :personal_record_id, null: false
      t.bigint :person_id, null: false
      t.bigint :record_owner_id, null: false
      t.bigint :author_id
      t.string :action, null: false
      t.jsonb :old_values, null: false, default: {}
      t.jsonb :new_values, null: false, default: {}
      t.datetime :changed_at, null: false

      t.timestamps
    end

    add_index :personal_record_versions, :personal_record_id
    add_index :personal_record_versions, :person_id
    add_index :personal_record_versions, :author_id
    add_index :personal_record_versions, :action
    add_foreign_key :personal_record_versions, :people
    add_foreign_key :personal_record_versions, :users, column: :record_owner_id
    add_foreign_key :personal_record_versions, :users, column: :author_id
  end
end
