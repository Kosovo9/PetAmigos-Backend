terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
    cloudflare = {
      source  = "cloudflare/cloudflare"
      version = "~> 4.0"
    }
  }
}

provider "aws" {
  region = "us-east-1"
  # profile = "petmatch-prod" # Configurar según credenciales disponibles
}

provider "cloudflare" {
  api_token = var.cloudflare_api_token
}

variable "cloudflare_api_token" {
  type        = string
  sensitive   = true
}

variable "db_username" {
  type      = string
  sensitive = true
}

variable "db_password" {
  type      = string
  sensitive = true
}

# Crear una base de datos RDS para el backend (si se usa AWS RDS)
resource "aws_db_instance" "petmatch_db" {
  allocated_storage    = 20
  storage_type        = "gp3"
  engine              = "postgres"
  engine_version      = "15.3"
  instance_class      = "db.t4g.micro"
  identifier          = "petmatch-db"
  username            = var.db_username
  password            = var.db_password
  skip_final_snapshot = true
  publicly_accessible = true # Solo para dev/tests, restringir en prod
}

# Configuración de Cloudflare para el dominio
resource "cloudflare_zone" "petmatch_zone" {
  account_id = "your-account-id" # Reemplazar con ID real
  zone       = "petmatch-global.com"
}

# Configuración de DNS en Cloudflare
resource "cloudflare_record" "www" {
  zone_id = cloudflare_zone.petmatch_zone.id
  name    = "www"
  value   = "petmatch-frontend.netlify.app" # Apuntando a Netlify
  type    = "CNAME"
  proxied = true
}

# Cloudflare Worker para edge logic
resource "cloudflare_worker_script" "petmatch_edge" {
  account_id = "your-account-id"
  name       = "petmatch-edge"
  content    = file("${path.module}/../../edge/worker.js")
  module     = true
}
