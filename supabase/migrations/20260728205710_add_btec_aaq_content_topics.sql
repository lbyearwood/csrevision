with topic_seed (unit_code, slug, topic_name, display_order) as (
  values
    ('1', 'a1-it-systems', 'A1 IT systems', 1),
    ('1', 'a2-peripheral-devices-and-media', 'A2 Peripheral devices and media', 2),
    ('1', 'a3-computer-software-in-an-it-system', 'A3 Computer software in an IT system', 3),
    ('1', 'a4-choosing-it-systems', 'A4 Choosing IT systems', 4),
    ('1', 'a5-emerging-technologies', 'A5 Emerging technologies', 5),
    ('1', 'b1-connectivity', 'B1 Connectivity', 6),
    ('1', 'b2-networks', 'B2 Networks', 7),
    ('1', 'b3-issues-relating-to-transmission-of-data', 'B3 Issues relating to transmission of data', 8),
    ('1', 'c1-online-systems', 'C1 Online systems', 9),
    ('1', 'c2-online-communities', 'C2 Online communities', 10),
    ('1', 'd1-threats-to-data-information-and-systems', 'D1 Threats to data, information and systems', 11),
    ('1', 'd2-protecting-data', 'D2 Protecting data', 12),
    ('2', 'a1-cyber-security-threats', 'A1 Cyber security threats', 1),
    ('2', 'a2-system-vulnerabilities', 'A2 System vulnerabilities', 2),
    ('2', 'a3-legal-responsibilities', 'A3 Legal responsibilities', 3),
    ('2', 'a4-software-and-hardware-security-measures', 'A4 Software and hardware security measures', 4),
    ('2', 'b1-network-types', 'B1 Network types', 5),
    ('2', 'b2-network-components', 'B2 Network components', 6),
    ('2', 'b3-networking-infrastructure-services-and-resources', 'B3 Networking infrastructure services and resources', 7),
    ('2', 'c1-internal-policies', 'C1 Internal policies', 8),
    ('2', 'd1-forensic-collection-of-evidence', 'D1 Forensic collection of evidence', 9),
    ('2', 'd2-systematic-forensic-analysis', 'D2 Systematic forensic analysis of a suspect system', 10),
    ('3', 'a1-purpose-and-principles-of-websites', 'A1 Purpose and principles of websites', 1),
    ('3', 'a2-planning-a-website-in-response-to-a-client-brief', 'A2 Planning a website in response to a client brief', 2),
    ('3', 'b1-website-design', 'B1 Website design', 3),
    ('3', 'b2-asset-management-techniques', 'B2 Asset management techniques', 4),
    ('3', 'c1-common-tools-and-techniques-to-produce-a-website', 'C1 Common tools and techniques to produce a website', 5),
    ('3', 'c2-website-development-processes', 'C2 Website development processes', 6),
    ('3', 'c3-testing', 'C3 Testing', 7),
    ('4', 'a1-relational-database-management-systems', 'A1 Relational database management systems', 1),
    ('4', 'a2-manipulating-data-structures-and-data', 'A2 Manipulating data structures and data in relational databases', 2),
    ('4', 'a3-normalisation', 'A3 Normalisation', 3),
    ('4', 'a4-planning-a-relational-database-solution', 'A4 Planning a relational database solution in response to a client brief', 4),
    ('4', 'b1-relational-database-design-techniques-and-processes', 'B1 Relational database design techniques and processes', 5),
    ('4', 'b2-design-documentation', 'B2 Design documentation', 6),
    ('4', 'b3-reviewing-and-refining-designs', 'B3 Reviewing and refining designs', 7),
    ('4', 'c1-producing-a-database-solution', 'C1 Producing a database solution', 8),
    ('4', 'c2-testing-the-database-solution', 'C2 Testing the database solution', 9),
    ('4', 'c3-reviewing-the-database-solution', 'C3 Reviewing the database solution', 10),
    ('4', 'c4-optimising-the-database-solution', 'C4 Optimising the database solution', 11)
)
insert into public.topics (unit_id, slug, topic_name, description, keywords, status, display_order)
select
  unit.id,
  seed.slug,
  seed.topic_name,
  'Specification content topic for the Pearson BTEC Level 3 National Extended Certificate in IT (AAQ).',
  array[split_part(seed.topic_name, ' ', 1)],
  'active',
  seed.display_order
from topic_seed as seed
join public.units as unit
  on unit.subject_id = '50000000-0000-4000-8000-000000000002'
 and unit.unit_code = seed.unit_code
on conflict (unit_id, slug) do update
set
  topic_name = excluded.topic_name,
  description = excluded.description,
  keywords = excluded.keywords,
  status = excluded.status,
  display_order = excluded.display_order,
  updated_at = now();
