---
title: "Why I rewrote my website using Gatsby"
subtitle: "Blazing fast load times, built on react and with image optimization as standard"
date: "2020-05-05"
previewImage: images/terraform.png
---

## What is a static site generator?

A typical website built using React generates pages when they are requested.
Fetching the page's resources and processing the javascript required to create a
webpage written in React takes time and increases the time that your website takes
to load. Gatsby solves this problem by shifting page generation to build time,
generating the HTML and reducing the processing required by the end user's device.

## Speed

Not only does Gatsby increase speed by shifting page generation to build time it
further increases speed by pre-fetching resources, this is done in two main ways.

- When a page finishes loading, Gatsby begins pre-fetching resources for internal
  pages the user may navigate to, this is done at a low priority.

- When a link is hovered over, Gatsby will fetch the resources for that page at a
  higher priority.

This means that when a user navigates to another page on the site resources have
already been loaded and page loads feel instantaneous.

Migrating my website to Gatsby has reduced its load time so much that

[Google pagespeed](https://developers.google.com/speed/pagespeed/insights/) ranks it at 100%!

![google pagespeed](/images/lighthouse.jpg "Google pagespeed")

## Page previews

The main motivating factor for rewriting my site using Gatsby was that when sharing
a blog post on LinkedIn the preview image and description were always derived from
the metadata for the site's index page. Because React only generates a page when it
is requested this causes issues for some web crawlers. Using Gatsby and [react-helmet](https://www.gatsbyjs.org/packages/gatsby-plugin-react-helmet/") I was able to add the necessary metadata to every page on my site and generate
individual previews for each page.

![ ](/images/gatsbyimage1.jpg)

![ ](/images/gatsbyimage2.jpg)

## GraphQL

Gatsby uses GraphQL, an alternative to RESTful APIs. With GraphQL there is only one
endpoint, to which all requests are made with a GraphQL query specifying the data
that should be returned. This allows data such as images to easily be fetched
programmatically and also allows pages to be generated programmatically. Read more
about GraphQL [here](https://www.gatsbyjs.org/docs/glossary/graphql/)

```graphql
const data = useStaticQuery(graphql\`
  query {
    images: allFile(filter: { relativeDirectory: { eq: "" } }) {
      nodes {
        id
        childImageSharp {
          fixed(width: 400) {
            originalName
            ...GatsbyImageSharpFixed
          }
          id
        }
      }
    }
  }
\`);
```

## Gatsby plugins

Gatsby is built with a plugin architecture that allows you to easily use Node.js
packages that implement Gatsby APIs.

My favourite is [gatsby-image](https://www.gatsbyjs.org/packages/gatsby-image/) which
does lots of cool things like lazy loading low resolution images and then fading in
the higher resolution images to speed up page loads, it even reserves space in the
DOM so that the page doesn't jump about once the image has loaded! It also has
functionality to send .webp images to browsers that support the format while falling
back to the default image format for those that don't.

![ ](/images/gatsbyimage.gif)

Read about Gatsby plugins [here](https://www.gatsbyjs.org/docs/plugins/)

Find about more about how GatsbyJS works [here](https://www.gatsbyjs.org/blog/2018-12-04-gatsby-analogy/)
