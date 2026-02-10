# frozen_string_literal: true

PEOPLE_DATA = [
  { slug: "thomas", name: "Thomas" },
  { slug: "yanice", name: "Yanice" },
  { slug: "xavier", name: "Xavier" },
  { slug: "yannis", name: "Yannis" },
  { slug: "enzo", name: "Enzo" }
].freeze

RECORDS_DATA = {
  "thomas" => [
    { date: Date.new(2026, 1, 10), category: "musculation", note: "Bench valide a la salle principale." },
    { date: Date.new(2026, 1, 20), category: "musculation", note: "Squat propre, amplitude complete." },
    { date: Date.new(2026, 2, 5), category: "musculation", note: "Deadlift solide, progression reguliere." },
    { date: Date.new(2026, 2, 18), category: "musculation", note: "Serie tractions completee sans pause." }
  ],
  "yanice" => [
    { date: Date.new(2026, 1, 12), category: "course", note: "5 km en progression sur parcours plat." },
    { date: Date.new(2026, 1, 26), category: "musculation", note: "Session bench avec bonne technique." },
    { date: Date.new(2026, 2, 3), category: "musculation", note: "Ring MU valides en serie." },
    { date: Date.new(2026, 2, 22), category: "course", note: "10 km termine dans l'objectif fixe." }
  ],
  "xavier" => [
    { date: Date.new(2026, 1, 15), category: "musculation", note: "PR squat valide en seance officielle." },
    { date: Date.new(2026, 1, 30), category: "musculation", note: "Bench lourd reussi avec spotter." },
    { date: Date.new(2026, 2, 12), category: "course", note: "Sub 41 valide sur 10 km." },
    { date: Date.new(2026, 2, 28), category: "course", note: "Semi-marathon passe sous 1h40." }
  ],
  "yannis" => [
    { date: Date.new(2026, 1, 11), category: "musculation", note: "12 muscle-up valides en serie continue." },
    { date: Date.new(2026, 1, 28), category: "musculation", note: "DC a 100 kg valide." },
    { date: Date.new(2026, 2, 16), category: "course", note: "Semi termine a 1h40." },
    { date: Date.new(2026, 2, 25), category: "poids", note: "Poids de forme confirme." }
  ],
  "enzo" => [
    { date: Date.new(2026, 1, 14), category: "course", note: "10 km en sub55 valide." },
    { date: Date.new(2026, 1, 31), category: "course", note: "21 km en sub2h valide." },
    { date: Date.new(2026, 2, 14), category: "musculation", note: "DL a 140+ confirme avec video." },
    { date: Date.new(2026, 2, 27), category: "musculation", note: "Squat a 100+ valide." }
  ]
}.freeze

def upsert_person!(attributes)
  person = Person.find_or_initialize_by(slug: attributes[:slug])
  person.name = attributes[:name]
  person.save! if person.new_record? || person.changed?
  person
end

def upsert_personal_record!(person:, attrs:)
  record = PersonalRecord.find_or_initialize_by(
    person: person,
    pr_date: attrs[:date]
  )
  record.category = attrs[:category] || "poids"
  record.note = attrs[:note]
  record.save! if record.new_record? || record.changed?
  record
end

puts "Seeding people..."
people_by_slug = PEOPLE_DATA.each_with_object({}) do |attrs, hash|
  hash[attrs[:slug]] = upsert_person!(attrs)
end

puts "Seeding personal records..."
records_index = {}

RECORDS_DATA.each do |slug, records|
  person = people_by_slug.fetch(slug)
  records.each do |attrs|
    record = upsert_personal_record!(person: person, attrs: attrs)
    records_index[[slug, attrs[:date]]] = record
  end
end

puts "Simulating history updates..."
history_updates = [
  {
    key: ["thomas", Date.new(2026, 1, 10)],
    new_date: Date.new(2026, 1, 11),
    new_note: "Bench valide apres verification video."
  },
  {
    key: ["xavier", Date.new(2026, 2, 12)],
    new_date: Date.new(2026, 2, 13),
    new_note: "Sub 41 valide sur parcours mesure."
  }
]

history_updates.each do |update_data|
  record = records_index[update_data[:key]]
  next unless record

  Current.set(user: nil) do
    record.update!(
      pr_date: update_data[:new_date],
      note: update_data[:new_note]
    )
  end
end

destroy_target = records_index[["enzo", Date.new(2026, 2, 27)]]

if destroy_target
  destroy_already_tracked =
    if defined?(PersonalRecordVersion)
      PersonalRecordVersion.where(personal_record_id: destroy_target.id, action: "destroy").exists?
    else
      false
    end

  unless destroy_already_tracked
    Current.set(user: nil) { destroy_target.destroy! }
  end
end

puts "Seed complete."
puts "People: #{Person.count} | PersonalRecords: #{PersonalRecord.count}"
