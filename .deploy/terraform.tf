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
      version = "~> 6.44.0"
    }
  }
  required_version = ">= 1.5.7"

  # required_version = ">= 1.9.4"
  # required_version = ">= 1.15.2"

}
