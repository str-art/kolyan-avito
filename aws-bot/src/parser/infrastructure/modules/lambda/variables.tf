variable "stage" {
  type = string
  description = "Name of stage"
}

variable "image" {
  type = string
  description = "URI of image to deploy"
}

variable "table_name" {
  type = string
  description = "Name of Dynamod table"
}


variable "table_arn" {
  type = string
  description = "ARN of dynamo table. Required for IAM permissions"
}

variable "lambda_name" {
  type = string
  description = "custom name of lambda,optional"
  default = null
}