class User < ApplicationRecord
  has_secure_password

  has_many :personal_records, dependent: :destroy
  has_many :personal_record_versions_authored,
    class_name: "PersonalRecordVersion",
    foreign_key: :author_id,
    dependent: :nullify

  before_validation :normalize_email

  validates :email, presence: true, uniqueness: true
  validates :role, inclusion: { in: %w[member admin] }

  def admin?
    role == "admin"
  end

  private

  def normalize_email
    self.email = email.to_s.downcase.strip
  end
end
