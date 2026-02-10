class AddChecklistItemsToPeople < ActiveRecord::Migration[8.1]
  def change
    add_column :people, :checklist_items, :jsonb, null: false, default: []
  end
end
