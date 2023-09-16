---
title: Eight things I learned managing GitHub infrastructure using Terraform
subtitle: "Use Infrastructure as Code to manage your AWS resources but make sure to watch out for these pitfalls"
date: "2021-12-30"
previewImage: images/terraform.png
---

### Recently I've been using Terraform for managing Infrastructure as Code. It's a great tool but the learning curve can be a little steep at times, here are some of the things I've learned and my tips for creating infrastructure as efficiently as possible.

&NewLine;&NewLine;

### 1. Alias the terraform command

**terraform** is a long word. Alias it to **tf** by adding **alias tf=terraform** to your bash profile and save yourself some typing.

### 2. Set up a remote backend

Avoid deleting your state by configuring an S3 and DynamoDB [remote backend](https://www.terraform.io/language/settings/backends/s3). This will also lock the state ensuring that multiple developers can collaborate safely.

### 3. Use a variable definition file

Easily create infrastructure for different environments b1y using a variable definition file such as **dev.tfvars** and passing it to terraform using the **-var-file** command line argument.

```javascript
terraform plan -var-file="dev.tfvars"
```

<br>

### 4. You'll need to use a GitHub Personal Access token

When creating build pipelines using CodePipeline, AWS recommends that GitHub sources are managed using CodeStar but this option isn't available when using the [Terraform GitHub provider](https://registry.terraform.io/providers/integrations/github/latest/docs) Instead you'll need to create a GitHub [Personal Access token](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/creating-a-personal-access-token) but whatever you do make sure that you store the token in an
[environment variable](https://github.com/LucasAmos/terraform/blob/2955e9aeee541c0218a90e3f81f4d4cc5f4fd5a5/github/provider.tf#L22)
and not in your repository.

```hcl
provider "github" {
  token = var.GITHUB_TOKEN
}
```

<br>

### 5. Configure providers at the top level

Providers must be declared and configured at the [top level](https://github.com/LucasAmos/terraform/blob/2955e9aeee541c0218a90e3f81f4d4cc5f4fd5a5/github/provider.tf#L16-L23)

```hcl
terraform {
  required_version = ">= 1.1.2"
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 3.27"
    }

    github = {
      source  = "integrations/github"
      version = "~> 4.0"
    }
  }
}

provider "aws" {
  profile = var.aws_profile
  region  = var.aws_region
}

provider "github" {
  token = var.GITHUB_TOKEN
}
```

<br>

#### When using modules declare the required providers.

[modules/github-repository/repo.tf](https://github.com/LucasAmos/terraform/blob/2955e9aeee541c0218a90e3f81f4d4cc5f4fd5a5/github/modules/github-repository/repo.tf#L1-L9)

```hcl
terraform {
  required_providers {
    github = {
      source  = "integrations/github"
      version = "~> 4.0"
    }
  }
}
```

<br>

### 6. You can't use count and for_each in the same module

If you want to create multiple similar resources when a condition is met, you will
need to use the **count** and **for_each** Meta-Arguments, but you
cannot use both of these in the same module. Instead create a child module to manage
the resources and use **count** in the module definition.

[modules/github-repository/repo.tf](https://github.com/LucasAmos/terraform/blob/2955e9aeee541c0218a90e3f81f4d4cc5f4fd5a5/github/modules/github-repository/repo.tf#L36-L42)

```hcl
module "github-project" {
  count  = local.has_projects ? 1 : 0
  source = "../github-project"

  repo_name = github_repository.repo.name
  projects  = var.config.projects
}
```

<br>

[modules/github-project/project.tf](https://lucasamos.dev/articles/terraformGithub#:~:text=modules/github%2Dproject/project.tf)

```hcl
resource "github_repository_project" "project" {
  for_each   = var.projects
  name       = each.key
  repository = var.repo_name
  body       = each.value
}
```

<br>

### 7. Use outputs

Aggregate useful information such as repository urls and output it to the console.

```hcl
repo_clone_urls = {
  "repo-one" = "git@github.com:LucasAmos/repo-one.git"
  "repo-two" = "git@github.com:LucasAmos/repo-two.git"
}
```

<br>

[main.tf](https://github.com/LucasAmos/terraform/blob/2955e9aeee541c0218a90e3f81f4d4cc5f4fd5a5/github/main.tf#L11-L13)

```hcl
output "repo_clone_urls" {
  value = { for repo in keys(var.repos) : repo => module.github-repository[repo].repo_url }
}
```

<br>

### 8. Use the lifecycle Meta-Argument to ignore resources that may change

Ordinarily you will want Terraform to track all infrastructure changes but this will
not always be the case. Unless the lifecycle Meta-Argument is used when initialising
the repository with a default **.gitignore** file its content will be
restored to its initial state any time **terraform apply** is executed.
<br>

[main.tf](https://github.com/LucasAmos/terraform/blob/2955e9aeee541c0218a90e3f81f4d4cc5f4fd5a5/github/modules/github-repository/repo.tf#L45-L64)

```hcl
resource "github_repository_file" "pr_template" {
  count          = local.gitignore ? 1 : 0
  repository     = github_repository.repo.name
  branch         = local.default_branch
  file           = ".gitignore"
  content        = "**/*.tfstate"
  commit_message = "Gitignore file"
  commit_author  = "Lucas Amos"
  commit_email   = "lucas@lucasamos.dev"

  depends_on = [
    github_branch.default
  ]

  lifecycle {
    ignore_changes = [
      content
    ]
  }
}
```

### View all of the terraform code [here](https://github.com/LucasAmos/terraform/tree/master/github)
