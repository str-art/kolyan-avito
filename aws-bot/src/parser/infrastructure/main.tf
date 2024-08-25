module "database" {
  source = "./modules/dynamo"
  stage = var.stage
}

module "parser" {
  source = "./modules/lambda"
  stage = var.stage
  image = var.image
  table_name = module.database.table_name
  table_arn = module.database.table_arn
}

output "table_name" {
  value = module.database.table_name
}

output "table_arn" {
  value = module.database.table_arn
}

output "parser_name" {
  value = module.parser.function_name
}

output "parser_alias_name" {
  value = module.parser.alias_name
}

output "parser_arn" {
  value = module.parser.alias_arn
}