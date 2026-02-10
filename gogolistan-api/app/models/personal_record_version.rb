class PersonalRecordVersion < ApplicationRecord
  belongs_to :person
  belongs_to :record_owner, class_name: "User", optional: true
  belongs_to :author, class_name: "User", optional: true

  validates :action, inclusion: { in: %w[create update destroy] }
  validates :changed_at, presence: true
end
