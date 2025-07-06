export const CSV_SAMPLE = `id,name,email,department
1,John Smith,john@example.com,Engineering
2,Sara Johnson,sara@example.com,Marketing
3,Michael Brown,michael@example.com,Finance
4,Emily Davis,emily@example.com,HR
5,John Smith,john@example.com,Engineering
6,Sara Johnson,sara@example.com,Marketing
7,Michael Brown,michael@example.com,Finance
8,Emily Davis,emily@example.com,HR
9,Sara Johnson,sara@example.com,Marketing
10,Michael Brown,michael@example.com,Finance
11,Emily Davis,emily@example.com,HR`;

export const JSON_SAMPLE = `[
  {
    "id": "1",
    "name": "John Smith",
    "email": "john@example.com",
    "department": "Engineering"
  },
  {
    "id": "2",
    "name": "Sara Johnson",
    "email": "sara@example.com",
    "department": "Marketing"
  },
  {
    "id": "3",
    "name": "Michael Brown",
    "email": "michael@example.com",
    "department": "Finance"
  },
  {
    "id": "4",
    "name": "Emily Davis",
    "email": "emily@example.com",
    "department": "HR"
  },
  {
    "id": "5",
    "name": "John Smith",
    "email": "john@example.com",
    "department": "Engineering"
  },
  {
    "id": "6",
    "name": "Sara Johnson",
    "email": "sara@example.com",
    "department": "Marketing"
  },
  {
    "id": "7",
    "name": "Michael Brown",
    "email": "michael@example.com",
    "department": "Finance"
  },
  {
    "id": "8",
    "name": "Emily Davis",
    "email": "emily@example.com",
    "department": "HR"
  },
  {
    "id": "9",
    "name": "Sara Johnson",
    "email": "sara@example.com",
    "department": "Marketing"
  },
  {
    "id": "10",
    "name": "Michael Brown",
    "email": "michael@example.com",
    "department": "Finance"
  },
  {
    "id": "11",
    "name": "Emily Davis",
    "email": "emily@example.com",
    "department": "HR"
  }
]`;

export const useCases = [
  {
    title: 'For Developers',
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
      </svg>
    ),
    points: [
      'API response transformation',
      'Database migration tools',
      'Test data generation',
      'Format conversion APIs',
    ],
  },
  {
    title: 'For Business Analysts',
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    ),
    points: [
      'Excel to database imports',
      'Report data preparation',
      'Cross-system data mapping',
      'Data quality validation',
    ],
  },
  {
    title: 'For Healthcare',
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
      </svg>
    ),
    points: [
      'EDI 837/835 processing',
      'HIPAA compliance checks',
      'Claims data transformation',
      'HL7 to JSON conversion',
    ],
  },
];