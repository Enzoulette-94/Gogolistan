class Person < ApplicationRecord
  has_many :personal_records, dependent: :destroy
  has_many :personal_record_versions

  validates :slug, presence: true, uniqueness: true
  validates :name, presence: true
end
