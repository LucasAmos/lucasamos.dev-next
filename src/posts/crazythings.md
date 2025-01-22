---
title: "12 crazy things that I have seen in my careers"
subtitle: ""
date: "2025-01-22"
previewImage: TODO
---

####

Obviously I am not naming any companies here, firstly that would be unprofessional career suicide and secondly I am sure that I have done a few crazy things of my own and I would not like anyone to put me on their list.

1. "Whisky on the blockchain". It's exactly how it sounds, noone needed this product but then noone has ever needed a blockchain. When the company started talking about "smart contracts" I knew it was time to move on.

2. Big Bank A created a React meta framework. The app was at its core a CRUD app so there were lots of forms. Simple enough you might think, however you didn't add form features by adding React components you added them by changing JSON objects in the dreaded "Form Handler" component. The job of a few hours quickly became a week's work while you tried to understand the rube goldberg machine posing as a piece of software.

3. The "Whisky on the blockchain" company had created their application using what they thought was a microservice architecture but was actually a distributed monolith. The application would receieve events when something happened in the distillery e.g. a mash was started, there were probably a few hundred events a day per customer between 8am-6pm. If you are thinking that this sounds perfet for a serverless event driven platform you would be correct, but this was in 2017 so the microservices were implemented using Kubernetes. There was no multitenancy so every customer had their own Kubernetes cluster costing about £500 a month which was also how much the customer was charged. It doesn't take a genius to realise that no money was being made.

4. A cloud company made good money by aggregating the billing of customer accounts, buying AWS savings plans and only passing part of the savings on to the customers, the difference being profit but with the risk that the purchased compute capacity would go unused. This billing system had no tests, and I mean zero. Were the customers being billed the correct amount? Who knows?

5. Big Bank A had a monthly release cadence for an app with nearly 100k sloc, to ensure that no regressions were introduced about 40 people hours of manual acceptance tests were required. There were hundreds of test and this was mind numbing scut work so I automated the tests using cypress. About 10% of the tests failed as the application had been broken in some way but the testers were marking them as green every month. Were the testers peforming any of the manual tests? Who knows and who can blame them.

6. Big Bank A had a piece of compliance software that was so important that it had been demoed to the Federal Reserve. This application used Sequelize as an ORM, but the migration functionality wasn't used. Instead migrations were performed using a "runbook" which was an excel spreadsheet with SQL statements all over the place. Every release you just had to pray that the correct SQL statements had been pasted in and that the deploying developer scrolled down to the bottom of the page and checked all the tabs.

7. Cloud company had a flagship piece of software allowing them to securely assume roles in AWS accounts to manage customer resources. When I joined the app had zero tests, I am quickly became an expert in Jest and mocking the AWS SDK, adding many unit tests. The application wasn't too complex and was stable, I don't think it ever broke, except for one time. The Senior Developer liked to work many hours late at night, one night before a customer demo he merged to master (no branch protection rules of course) and broke the most essential part of the application that generated the URL to log in to the customer account. He realised he had broken this 5 minutes before the demo started, cue Slack message, "YOU NEED TO FIX THIS NOW". As a lowly junior dev I was saved by the GitHub "revert commit" button. On my last day at the company I added a unit test to this part of the code as my parting gift.

8. I joined Big Bank B, in my first refinement session the developers assigned 3 story points to changing the text on a button. Yep it was one of those places. Legacy banks are where good developers go to die.

9. Cloud company implemented their flagship product using DynamoDB and every database query was a scan. I created indexes and refactored 7 out of the 8 scans into queries. However, the most important scan matched on 3 column values and could not be refactored. The table had thousands of new entries added every day, you can guess how that worked out.

10. Global distributor spent years paying 100s of Ks a year for a licenses for an enterprise software offering but due to technical immaturity and a lack of expertise they were unable to migrate away from the free community edition that they were running of the same piece of software. A year later they made 5 senior engineers redundant as they needed to save money.

11. Global distributor ran self managed container orchestration platform on EC2, the version of the software was deprecated many years earlier and the platform had zero scaling. When the business wanted to run large tests all developer CI/CD pipelines were frozen and when they were resumed queues of over an hour were common due to the lack of scaling. The EC2 instances sat idle between 5pm and 9am helping to pay for Bezos's second yacht.

12. Big Bank A had a globally distributed team (Glasgow, London, Northampton, Pune). In one daily scrum call with ten people on the call a developer in Glasgow spent 30 minutes pair photoshopping with a developer in Pune trying to correct the aspect ratios of a splash screen image so that a diverse carousel of people could be created.
