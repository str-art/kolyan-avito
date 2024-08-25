locals {
    service_name = "parser"

    tags = {
        Environment = var.stage
        Service = "parser"
    }

    environment = {
        TABLE_NAME = var.table_name
    }

    lambda_name = coalesce(var.lambda_name,"${var.stage}_avito_parser")
}