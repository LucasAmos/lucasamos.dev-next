---
title: Using git repositories as Terraform module sources
subtitle: "Reuse your terraform modules in multiple repositories"
date: "2022-05-07"
previewImage: images/terraform.png
---

Working on a recent project I had the need to determine when a lambda function has
encountered an execution error. The solution is to create a
[cloudwatch metric alarm](https://docs.aws.amazon.com/lambda/latest/dg/monitoring-metrics.html).
When creating IaC using Terraform I make extensive use of modules to make the code
as DRY as possible, but this created a dilemma; I needed to create metric alarms for
lambda functions in multiple repositories so where should I locate the module?

I saw two possible solutions:

1. Duplicate the module in each repository containing lambda functions that require monitoring. The obvious issue is that this is not DRY and while copy and pasting the code doesn't seem like a big issue this can create extra work later should an upgrade to the AWS provider require the module to be refactored.

2. Create a new repository for the module along with a map of all the function names, iterating over the map to create an alarm for each. This would require manually updating the map every time a new function is created in one of the other repositories, likely resulting in people forgetting to add monitoring to new Lambdas.

After some research it became clear that the solution was to store the module code in a seperate repository which could then be used as the [module source](https://www.terraform.io/language/modules/sources#modules-in-package-sub-directories)

## Creating the module

The module code itself is relatively simple, an **aws_cloudwatch_metric_alarm** resource that takes a function name as its only parameter. This will trigger a cloudwatch alarm if a Lambda execution error occurs within any 60 second period. This alarm could easily be extended to push each alarm to an SNS topic for real time notifications.

```javascript
resource "aws_cloudwatch_metric_alarm" "function_error" {
  alarm_name          = join("-", [var.function_name, "errors"])
  comparison_operator = "GreaterThanOrEqualToThreshold"
  evaluation_periods  = "1"
  metric_name         = "Errors"
  namespace           = "AWS/Lambda"
  period              = "60"
  statistic           = "Maximum"
  alarm_description   = "This metric monitors function errors"
  dimensions = {
    FunctionName = var.function_name
  }
}
```

The module is created in the **cloudwatch-alarm/lambda** module so that it's purpose is entirely clear.

<img src="/images/terraformmodule/terraformmodule.png" alt="Module structure"
style="max-width:350px"/>

## Consuming the module

Once the module code has been pushed to the repository it can be consumed in a similar
way to any other module, the important difference being that the source value must point
to the git location.

The key part of the source location is **?ref=v0.0.1** This is absolutely
essential and references the tag created to point to a specific commit in the
repository's history. Failure to tag your code will result in every
**terraform init** command downloading the latest version of the module. You
can tag your commit with **git tag -a v0.0.1 -m "First version"**

```javascript
module "name" {
  source        = "git@github.com:LucasAmos/terraform-blog.git//cloudwatch-alarm/lambda?ref=v0.0.1"
  function_name = "test-failure"
}`
```

## Get the code

This module is published in a public GitHub repository so no git authentication is
required, if you choose to store the code in a private repository you'll need to
provide your git credentials in the usual way. As always you can access all of the code
[here](https://github.com/LucasAmos/terraform-blog/tree/main/cloudwatch-alarm/lambda)
