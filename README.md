### www.lucasamos.dev

### Tech stack

- Next.js
- React
- TypeScript
- Tailwind
- Markdown
- AWS (DynamoDB, SES)
- Sentry
- Jest

### Key features

- Blog posts written with markdown
- Code syntax highlighting provided by `remark-prism`
- Contact form powered by NextJS API routes & AWS SES
- Rate limiter implemented on `/email` API route using sliding window algorithm to prevent denial of wallet attack on my AWS account! Implemented using DynamoDB for simplicity. If I needed speed I would use Redis.
- Rate limiter unit tests implemented using `Jest` & `aws-sdk-client-mock`
