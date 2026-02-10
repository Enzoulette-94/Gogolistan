class PersonalRecord < ApplicationRecord
  CATEGORIES = %w[musculation course poids].freeze

  belongs_to :person
  belongs_to :user, optional: true

  has_many :personal_record_versions

  validates :pr_date, presence: true
  validates :note, presence: true, length: { minimum: 1, maximum: 1000 }
  validates :category, presence: true, inclusion: { in: CATEGORIES }

  after_create :track_create_version
  before_update :store_old_values_for_update
  after_update :track_update_version
  before_destroy :track_destroy_version

  private

  def tracked_attributes
    {
      id: id,
      person_id: person_id,
      user_id: user_id,
      date: pr_date,
      category: category,
      note: note
    }
  end

  def track_create_version
    create_version!(
      action: "create",
      old_values: {},
      new_values: tracked_attributes
    )
  end

  def store_old_values_for_update
    @old_values_for_update = changes_to_save.each_with_object({}) do |(key, values), hash|
      next unless %w[pr_date category note].include?(key)

      output_key = key == "pr_date" ? "date" : key
      hash[output_key] = values.first
    end
  end

  def track_update_version
    return if @old_values_for_update.blank?

    create_version!(
      action: "update",
      old_values: @old_values_for_update,
      new_values: tracked_attributes
    )
  end

  def track_destroy_version
    create_version!(
      action: "destroy",
      old_values: tracked_attributes,
      new_values: {}
    )
  end

  def create_version!(action:, old_values:, new_values:)
    PersonalRecordVersion.create!(
      personal_record_id: id,
      person_id: person_id,
      record_owner_id: user_id,
      author_id: nil,
      action: action,
      old_values: old_values,
      new_values: new_values,
      changed_at: Time.current
    )
  end
end
