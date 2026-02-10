class ChecklistsController < ApplicationController
  before_action :set_person

  def show
    render json: { items: normalize_items(@person.checklist_items) }, status: :ok
  end

  def update
    permitted_items = params.permit(items: %i[id text done])[:items]
    items = normalize_items(permitted_items)

    if items.empty? && permitted_items.present?
      return render json: { errors: ["Checklist invalide"] }, status: :unprocessable_entity
    end

    @person.update!(checklist_items: items)
    render json: { items: @person.checklist_items }, status: :ok
  end

  private

  def set_person
    @person = Person.find_by!(slug: params[:slug] || params[:person_slug])
  end

  def normalize_items(items)
    Array(items).filter_map do |item|
      next unless item.respond_to?(:to_h)

      raw = item.to_h.stringify_keys
      id = raw["id"].to_s.strip
      text = raw["text"].to_s.strip
      next if id.blank? || text.blank?

      {
        id: id,
        text: text,
        done: ActiveModel::Type::Boolean.new.cast(raw["done"]) || false
      }
    end
  end
end
