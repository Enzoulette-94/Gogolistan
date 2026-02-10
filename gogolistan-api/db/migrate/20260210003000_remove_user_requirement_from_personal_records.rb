class RemoveUserRequirementFromPersonalRecords < ActiveRecord::Migration[8.1]
  def change
    change_column_null :personal_records, :user_id, true
    change_column_null :personal_record_versions, :record_owner_id, true
  end
end
