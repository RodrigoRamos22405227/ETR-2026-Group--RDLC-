# Requirements v0 — Lab 2 (AMS)

| Item | Requirement | Type | Stakeholder | Priority | Variant? |
|---:|---|---|---|---|---|
| 1 | The system shall provide a structured intake form to collect transition-related information. | FR | Transition Lead | H | No |
| 2 | The system shall validate that all mandatory fields are completed before allowing submission. | FR | Transition Lead | H | No |
| 3 | The system shall flag missing Disaster Recovery (DR) test documentation. | FR | Infrastructure Owner | H | No |
| 4 | The system shall record ownership information for each monitoring dashboard. | FR | Operations Manager | M | No |
| 5 | The system shall store references or links to submitted evidence documents. | FR | Technical Lead | H | No |
| 6 | The system shall enforce collection of only necessary personal data fields during intake. | FR | Privacy Officer | H | Yes |
| 7 | The system shall allow configuration of a retention period for transition-related personal data. | NFR | Privacy Officer | H | Yes |
| 8 | The system shall automatically anonymize personal data after the defined retention period expires. | FR | Privacy Officer | H | Yes |
| 9 | The system shall maintain an audit log recording who modified intake data and when. | FR | Compliance Officer | H | Yes |
| 10 | The system shall reject submission if required evidence is older than 30 days. | FR | Transition Lead | M | No |
| 11 | The system shall provide a status outcome: “Ready to Proceed” or “Need More Data”. | FR | Transition Lead | H | No |
| 12 | The system shall ensure that personal data is encrypted at rest. | NFR | Security Officer | M | Yes |
