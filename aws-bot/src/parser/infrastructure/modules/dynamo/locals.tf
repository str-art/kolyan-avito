locals {
  tags = {
    Stage   = var.stage
    Service = "parser"
  }

  table_name = "${var.stage}_parser_table"
}