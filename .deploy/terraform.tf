provider "aws" {
  region = var.region
}

terraform {
  cloud {
    organization = "lucasamos"

    workspaces {
      name = "lucasamosdev-next"
    }
  }

  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.16.2"
    }
  }

  required_version = ">= 0.14.0"
}
