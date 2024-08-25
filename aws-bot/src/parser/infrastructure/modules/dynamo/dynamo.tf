resource "aws_dynamodb_table" "this" {
  name           = local.table_name
  tags           = local.tags
  billing_mode   = "PROVISIONED"
  read_capacity  = 1
  write_capacity = 1

  hash_key  = "PK"
  range_key = "SK"

  attribute {
    name = "PK"
    type = "S"
  }

  attribute {
    name = "SK"
    type = "S"
  }

  attribute {
    name = "price"
    type = "N"
  }

  attribute {
    name = "description"
    type = "S"
  }

  attribute {
    name = "chat_id"
    type = "S"
  }

  attribute {
    name = "title"
    type = "S"
  }

  attribute {
    name = "url"
    type = "S"
  }

  stream_enabled   = true
  stream_view_type = "NEW_IMAGE"
}