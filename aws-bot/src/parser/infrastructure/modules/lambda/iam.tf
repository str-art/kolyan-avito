resource "aws_iam_role" "this" {
  name                = "${local.lambda_name}_required_permissions"
  assume_role_policy  = data.aws_iam_policy_document.lambda_assume_role_policy.json
  managed_policy_arns = [data.aws_iam_policy.exec_lambda_policy.arn, aws_iam_policy.this.arn]

  tags = local.tags
}

resource "aws_iam_policy" "this" {
  name = "${local.lambda_name}_allow_to_write_to_dynamo"

  policy = jsonencode({
    "Version" : "2012-10-17",
    "Statement" : [
      {
        "Sid" : "AllowWriteToDynamo",
        "Effect" : "Allow",
        "Action" : [
          "dynamo:*"
        ],
        "Resource" : [
          "${var.table_arn}"
        ]
      }
    ]
  })
  tags = local.tags
}