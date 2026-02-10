Rails.application.routes.draw do
  get "up" => "rails/health#show", as: :rails_health_check

  resources :people, param: :slug, only: [] do
    resource :checklist, only: %i[show update]
    resources :personal_records, only: %i[index create]
    get "personal_records/history", to: "personal_records#history"
  end

  resources :personal_records, only: %i[update destroy]
end
