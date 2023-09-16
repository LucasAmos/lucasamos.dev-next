resource "aws_dynamodb_table" "rate-limits" {
    name           = "rate-limits"
    billing_mode   = "PAY_PER_REQUEST"
    hash_key       = "ip"
    
    attribute {
        name = "ip"
        type = "S"
    }
}

resource "aws_ses_email_identity" "email" {
  email = var.email
}