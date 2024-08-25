resource "aws_lambda_function" "this" {
  function_name = local.lambda_name

  role = aws_iam_role.this.arn

  package_type = "Image"
  image_uri    = var.image

  publish = true

  memory_size = 512
  timeout     = 70

  environment {
    variables = local.environment
  }

  tags = local.tags
}

resource "aws_lambda_alias" "this" {
  name             = var.stage
  function_name    = aws_lambda_function.this.function_name
  function_version = aws_lambda_function.this.version
}


output "function_name" {
  value = aws_lambda_function.this.function_name
}

output "function_arn" {
  value = aws_lambda_function.this.arn
}

output "alias_arn" {
  value = aws_lambda_alias.this.arn
}

output "alias_name" {
  value = aws_lambda_alias.this.name
}
