class PersonalRecordsController < ApplicationController
  TRACKED_HISTORY_FIELDS = %w[date pr_date category note].freeze

  before_action :set_person_from_slug, only: %i[index history create]
  before_action :require_write_password, only: %i[create update destroy]
  before_action :set_personal_record, only: %i[update destroy]

  def index
    records = @person.personal_records
      .order(pr_date: :desc, created_at: :desc)

    render json: records.map { |record| personal_record_json(record) }, status: :ok
  end

  def history
    versions = @person.personal_record_versions
      .order(changed_at: :desc)

    render json: versions.map { |version| version_json(version) }, status: :ok
  end

  def create
    record = @person.personal_records.new(personal_record_params)
    record.save!

    render json: personal_record_json(record), status: :created
  end

  def update
    @personal_record.update!(personal_record_params)
    render json: personal_record_json(@personal_record), status: :ok
  end

  def destroy
    @personal_record.destroy!
    head :no_content
  end

  private

  def set_person_from_slug
    @person = Person.find_by!(slug: params[:person_slug] || params[:slug])
  end

  def set_personal_record
    @personal_record = PersonalRecord.find(params[:id])
  end

  def personal_record_params
    permitted = params.permit(:date, :category, :note)
    {
      pr_date: permitted[:date],
      category: permitted[:category],
      note: permitted[:note]
    }.compact
  end

  def personal_record_json(record)
    {
      id: record.id,
      date: record.pr_date,
      category: record.category,
      note: record.note,
      created_at: record.created_at,
      updated_at: record.updated_at,
      can_edit: true,
      can_delete: true
    }
  end

  def version_json(version)
    old_values = filter_history_fields(version.old_values)
    new_values = filter_history_fields(version.new_values)
    item_values = new_values.present? ? new_values : old_values

    {
      id: version.id,
      created_at: version.changed_at,
      item: {
        date: item_values["date"] || item_values["pr_date"],
        category: item_values["category"],
        note: item_values["note"]
      },
      changes: build_changes(old_values, new_values)
    }
  end

  def filter_history_fields(values)
    hash = values.is_a?(Hash) ? values : {}
    filtered = hash.slice(*TRACKED_HISTORY_FIELDS)
    if filtered.key?("pr_date")
      filtered["date"] = filtered.delete("pr_date")
    end
    filtered
  end

  def build_changes(old_values, new_values)
    keys = (old_values.keys + new_values.keys).uniq

    keys.each_with_object({}) do |key, hash|
      old_value = old_values[key]
      new_value = new_values[key]
      next if old_value == new_value

      hash[key] = [old_value, new_value]
    end
  end
end
