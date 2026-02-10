# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# This file is the source Rails uses to define your schema when running `bin/rails
# db:schema:load`. When creating a new database, `bin/rails db:schema:load` tends to
# be faster and is potentially less error prone than running all of your
# migrations from scratch. Old migrations may fail to apply correctly if those
# migrations use external dependencies or application code.
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema[8.1].define(version: 2026_02_10_003000) do
  # These are extensions that must be enabled in order to support this database
  enable_extension "pg_catalog.plpgsql"

  create_table "people", force: :cascade do |t|
    t.datetime "created_at", null: false
    t.string "name", null: false
    t.string "slug", null: false
    t.datetime "updated_at", null: false
    t.index ["slug"], name: "index_people_on_slug", unique: true
  end

  create_table "personal_record_versions", force: :cascade do |t|
    t.string "action", null: false
    t.bigint "author_id"
    t.datetime "changed_at", null: false
    t.datetime "created_at", null: false
    t.jsonb "new_values", default: {}, null: false
    t.jsonb "old_values", default: {}, null: false
    t.bigint "person_id", null: false
    t.bigint "personal_record_id", null: false
    t.bigint "record_owner_id"
    t.datetime "updated_at", null: false
    t.index ["action"], name: "index_personal_record_versions_on_action"
    t.index ["author_id"], name: "index_personal_record_versions_on_author_id"
    t.index ["person_id"], name: "index_personal_record_versions_on_person_id"
    t.index ["personal_record_id"], name: "index_personal_record_versions_on_personal_record_id"
  end

  create_table "personal_records", force: :cascade do |t|
    t.string "category", default: "poids", null: false
    t.datetime "created_at", null: false
    t.text "note", default: "", null: false
    t.bigint "person_id", null: false
    t.date "pr_date", null: false
    t.datetime "updated_at", null: false
    t.bigint "user_id"
    t.index ["person_id"], name: "index_personal_records_on_person_id"
    t.index ["user_id"], name: "index_personal_records_on_user_id"
  end

  create_table "users", force: :cascade do |t|
    t.datetime "created_at", null: false
    t.string "email", null: false
    t.string "password_digest", null: false
    t.string "role", default: "member", null: false
    t.datetime "updated_at", null: false
    t.index ["email"], name: "index_users_on_email", unique: true
    t.index ["role"], name: "index_users_on_role"
  end

  add_foreign_key "personal_record_versions", "people"
  add_foreign_key "personal_record_versions", "users", column: "author_id"
  add_foreign_key "personal_record_versions", "users", column: "record_owner_id"
  add_foreign_key "personal_records", "people"
  add_foreign_key "personal_records", "users"
end
