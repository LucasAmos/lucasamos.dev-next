resource "aws_cognito_user_pool" "pool" {
  name = "lucasamosdev"

  schema {
    name                = "family_name"
    attribute_data_type = "String"
    mutable             = true
    string_attribute_constraints {
      min_length = 0
      max_length = 2048
    }
  }

  schema {
    name                = "given_name"
    attribute_data_type = "String"
    mutable             = true
    string_attribute_constraints {
      min_length = 0
      max_length = 2048
    }
  }
}

resource "aws_cognito_user_pool_client" "client" {
  name                                 = "lucasamosdev"
  user_pool_id                         = aws_cognito_user_pool.pool.id
  generate_secret                      = true
  allowed_oauth_flows_user_pool_client = true
  allowed_oauth_flows                  = ["code"]
  allowed_oauth_scopes                 = ["email", "openid", "phone"]
  explicit_auth_flows                  = ["ALLOW_USER_PASSWORD_AUTH"]
  prevent_user_existence_errors        = "ENABLED"

  # supported_identity_providers = [""]
  callback_urls = [
    "http://localhost",
    "http://localhost:3000",
    "http://localhost:3000/api/auth/callback/cognito",
    "https://${aws_cognito_user_pool_domain.main.cloudfront_distribution}"
  ]


}

resource "aws_cognito_managed_login_branding" "client" {
  client_id    = aws_cognito_user_pool_client.client.id
  user_pool_id = aws_cognito_user_pool.pool.id

  use_cognito_provided_values = true
}



resource "aws_cognito_user_pool_domain" "main" {
  domain       = "lucasamosdev"
  user_pool_id = aws_cognito_user_pool.pool.id
}
